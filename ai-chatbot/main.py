# main.py
import os
from typing import List, Dict, Any
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from openai import OpenAI
import chromadb
import re

# ─────────────────────────────────────────────────────────
# 환경 로드
# ─────────────────────────────────────────────────────────
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
CHROMA_DIR = os.getenv("CHROMA_DIR", "./chroma_index")

client = OpenAI(api_key=OPENAI_API_KEY)

# ─────────────────────────────────────────────────────────
# FastAPI & CORS
# ─────────────────────────────────────────────────────────
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────
# Chroma (ingest.py로 색인된 컬렉션)
# ─────────────────────────────────────────────────────────
chroma = chromadb.PersistentClient(path=CHROMA_DIR)
collection = chroma.get_or_create_collection("revory_docs")

# 사용자에겐 출처를 보이지 않게 할 거라서, 모델에게 굳이 [출처 n]을 쓰라고 요구하지 않음
SYSTEM = (
    "당신은 Revory 고객지원/가이드 챗봇입니다. "
    "오직 제공된 컨텍스트에 근거해 한국어로 정확하고 간결하게 답하세요. "
    "컨텍스트에 없으면 모른다고 답하고, 필요한 경우 한두 가지 후속 질문을 제안하세요."
)

class ChatReq(BaseModel):
    message: str
    top_k: int = 6
    user_id: int | None = None
    conversation_id: str | None = None

# ─────────────────────────────────────────────────────────
# 임베딩/쿼리 확장
# ─────────────────────────────────────────────────────────
def embed_query(q: str) -> List[float]:
    res = client.embeddings.create(
        model="text-embedding-3-large",
        input=[q]
    )
    return res.data[0].embedding

def expand_queries(q: str) -> List[str]:
    qs = [
        q,
        q.replace("어떻게", "방법").replace("뭐야", "설명"),
        q + " 규정 가이드 요약",
    ]
    seen, out = set(), []
    for s in qs:
        s2 = s.strip()
        if s2 and s2 not in seen:
            seen.add(s2)
            out.append(s2)
    return out

# ─────────────────────────────────────────────────────────
# 컨텍스트 검색 (멀티쿼리 → 머지 → 디듀프 → 상위 n)
# ─────────────────────────────────────────────────────────
def retrieve_context(query: str, k: int) -> dict:
    k = max(2, min(k, 12))
    qvars = expand_queries(query)

    all_hits: List[Dict[str, Any]] = []
    for qv in qvars:
        emb = embed_query(qv)
        res = collection.query(
            query_embeddings=[emb],
            n_results=max(k, 8),
            include=["documents", "metadatas", "distances"],
        )
        docs = res.get("documents", [[]])[0]
        metas = res.get("metadatas", [[]])[0]
        dists = res.get("distances", [[]])[0]

        for d, m, dist in zip(docs, metas, dists):
            m = m or {}
            all_hits.append({
                "doc": d or "",
                "meta": m,
                "distance": float(dist),
                "title": m.get("title") or "",
                "source": m.get("source") or "",
                "source_id": m.get("source_id") or "",
                "uid": f"{m.get('source','')}:{m.get('source_id','')}",
            })

    # 디듀프 (메타 id가 없으므로 안전키 사용)
    seen = set()
    deduped = []
    for h in sorted(all_hits, key=lambda x: x["distance"]):
        key = f"{h.get('source','')}|{h.get('source_id','')}|{h['doc'][:80]}"
        if key in seen:
            continue
        seen.add(key)
        deduped.append(h)

    # 동일 문서 과집중 방지(같은 uid는 최대 2청크)
    final, per_uid = [], {}
    for h in deduped:
        if len(final) >= k:
            break
        cnt = per_uid.get(h["uid"], 0)
        if cnt >= 2:
            continue
        final.append(h)
        per_uid[h["uid"]] = cnt + 1

    # 컨텍스트 문자열 구성 (번호/출처는 "컨텍스트"에만 남김: 모델은 근거로 인지하지만 사용자에겐 숨김)
    chunks = []
    for i, h in enumerate(final, start=1):
        header = f"[{i}] {h['title']}".strip() if h["title"] else f"[{i}]"
        if h["source"] or h["source_id"]:
            header += f" (source={h['source']}, id={h['source_id']})"
        chunks.append({
            "rank": i,
            "header": header,
            "body": h["doc"],
            "source": h["source"],
            "source_id": h["source_id"],
            "title": h["title"],
        })

    parts = [f"{c['header']}\n{c['body']}" for c in chunks]
    plain = "\n\n".join(parts)

    return {"chunks": chunks, "plain": plain}

# ─────────────────────────────────────────────────────────
# 응답 후처리: 사용자 출력에서 [출처 n] 제거
# ─────────────────────────────────────────────────────────
_SRC_TAG = re.compile(r"\[출처\s*\d+\]")
def clean_response_piece(text: str) -> str:
    # 스트리밍 조각에도 적용 가능하도록 가벼운 패턴만 제거
    return _SRC_TAG.sub("", text)

# ─────────────────────────────────────────────────────────
# 헬스체크
# ─────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"ok": True}

# ─────────────────────────────────────────────────────────
# 스트리밍 응답(SSE)
# ─────────────────────────────────────────────────────────
@app.post("/chat/stream")
def chat_stream(req: ChatReq, request: Request):
    ctx_obj = retrieve_context(req.message, req.top_k)
    ctx_plain = ctx_obj.get("plain", "").strip()

    # 컨텍스트 없음 대응
    if not ctx_plain:
        def noctx_gen():
            yield "data: 아직 관련 정보를 찾지 못했어요. '캠페인', '리뷰 작성', '방문 안내'처럼 구체 키워드로 다시 물어봐 주세요.\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(
            noctx_gen(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no",
            },
        )

    messages = [
        {"role": "system", "content": SYSTEM},
        # 모델에게는 번호/출처가 포함된 "컨텍스트"를 제공 (사용자 출력에는 노출 안 함)
        {"role": "system", "content": f"컨텍스트(번호와 출처 포함):\n{ctx_plain}"},
        {"role": "user", "content": req.message},
    ]

    def gen():
        try:
            stream = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.2,
                stream=True,
            )
            for chunk in stream:
                delta = chunk.choices[0].delta.content or ""
                if delta:
                    delta = clean_response_piece(delta)  # 사용자 출력에서 [출처 n] 제거
                    if delta:
                        yield f"data: {delta}\n\n"
        except Exception as e:
            yield f"data: [ERROR] {str(e)}\n\n"

        yield "data: [DONE]\n\n"

    return StreamingResponse(
        gen(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )

# ─────────────────────────────────────────────────────────
# (옵션) 연결 종료 감지 스텁
# ─────────────────────────────────────────────────────────
def await_disconnected(request: Request) -> bool:
    # 필요 시 비동기 구현으로 교체
    return False
