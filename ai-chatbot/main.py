# main.py
import os, re, pymysql
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from fastapi import FastAPI, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from openai import OpenAI
import chromadb

# ─────────────────────────────────────────────────────────
# 환경
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
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────
# Chroma
# ─────────────────────────────────────────────────────────
print("CHROMA_DIR:", CHROMA_DIR)
chroma = chromadb.PersistentClient(path=CHROMA_DIR)
collection = chroma.get_or_create_collection("revory_docs")
try:
    print("collection count:", collection.count())
except Exception as e:
    print("collection count error:", e)

SYSTEM = (
    "당신은 Revory 고객지원/가이드 챗봇입니다. "
    "오직 제공된 컨텍스트에 근거해 한국어로 정확하고 간결하게 답하세요. "
    "컨텍스트에 없으면 모른다고 답하고, 필요한 경우 한두 가지 후속 질문을 제안하세요. "
    "개인정보(전화/이메일/정확주소/회원식별정보)는 절대 노출하지 마세요."
)

class ChatReq(BaseModel):
    message: str
    top_k: int = 6
    user_id: int | None = None
    conversation_id: str | None = None

# ─────────────────────────────────────────────────────────
# 임베딩/쿼리 확장 (RAG)
# ─────────────────────────────────────────────────────────
REGIONS = ["서울","경기","인천","부산","대구","광주","대전","울산","세종","강원","충북","충남","전북","전남","경북","경남","제주"]
SYNONYMS = {
    "어떻게": ["방법","절차","하는 법"],
    "뭐야": ["설명","정의","개요"],
    "언제": ["기간","일정","날짜"],
    "모집중": ["오픈","OPEN","신청 가능"],
    "마감": ["CLOSED","신청 종료"],
    "신청자": ["지원자","신청 수","지원 수"],
    "리뷰 제출": ["후기 제출","리뷰 업로드"],
    "경쟁률": ["경쟁 비율","지원 대비 모집"],
}
AUX_BUCKETS = [
    ["모집중","마감","선정","발표","경쟁률","신청자","북마크","리뷰 제출","리뷰 수"],
    ["방문형","포장형","배송형","구매형"],  # CAM_PROM
    ["블로그","인스타그램","유튜브","클립","릴스","쇼츠","틱톡"],  # CAM_CHANNEL
    REGIONS,
]

def embed_query(q: str) -> List[float]:
    res = client.embeddings.create(model="text-embedding-3-large", input=[q])
    return res.data[0].embedding

def expand_queries(q: str) -> List[str]:
    base = (q or "").strip()
    if not base:
        return []
    qs = {base}
    for k, vs in SYNONYMS.items():
        if k in base:
            for v in vs:
                qs.add(base.replace(k, v))
    for bucket in AUX_BUCKETS:
        for kw in bucket:
            qs.add(f"{base} {kw}")
    qs.update({f"{base} 가이드", f"{base} FAQ", f"{base} 규정 정리"})
    return list(qs)[:16]

def retrieve_context(query: str, k: int) -> dict:
    k = max(2, min(k, 12))
    qvars = expand_queries(query)
    if not qvars:
        return {"chunks": [], "plain": ""}

    all_hits: List[Dict[str, Any]] = []
    for qv in qvars:
        emb = embed_query(qv)
        res = collection.query(
            query_embeddings=[emb],
            n_results=max(k*4, 24),
            include=["documents", "metadatas", "distances"],
        )
        docs = res.get("documents", [[]])[0]
        metas = res.get("metadatas", [[]])[0]
        dists = res.get("distances", [[]])[0]
        for d, m, dist in zip(docs, metas, dists):
            doc = d or ""
            bonus = 0.0
            for token in set(re.split(r"\s+", query)):
                tok = token.strip()
                if tok and tok in doc:
                    bonus -= 0.02
            all_hits.append({
                "doc": doc,
                "meta": m or {},
                "distance": float(dist) + bonus,
                "title": (m or {}).get("title") or "",
                "source": (m or {}).get("source") or "",
                "source_id": (m or {}).get("source_id") or "",
                "uid": f"{(m or {}).get('source','')}:{(m or {}).get('source_id','')}",
            })

    seen = set()
    deduped = []
    for h in sorted(all_hits, key=lambda x: x["distance"]):
        key = f"{h.get('source','')}|{h.get('source_id','')}|{h['doc'][:120]}"
        if key in seen:
            continue
        seen.add(key)
        deduped.append(h)

    final, per_uid = [], {}
    for h in deduped:
        if len(final) >= k:
            break
        cnt = per_uid.get(h["uid"], 0)
        if cnt >= 3:
            continue
        body = re.sub(r"^\[source=.*?\]\s*", "", h["doc"], flags=re.M)
        final.append({**h, "doc": body})
        per_uid[h["uid"]] = cnt + 1

    chunks = []
    for i, h in enumerate(final, start=1):
        header = f"[{i}] {h['title']}" if h["title"] else f"[{i}]"
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

    plain = "\n\n".join([f"{c['header']}\n{c['body']}" for c in chunks])
    return {"chunks": chunks, "plain": plain}

# ─────────────────────────────────────────────────────────
# 응답 후처리
# ─────────────────────────────────────────────────────────
_SRC_TAG = re.compile(r"\[출처\s*\d+\]")
_SRC_INLINE = re.compile(r"\[source=.*?\]")
def clean_response_piece(text: str) -> str:
    text = _SRC_TAG.sub("", text)
    text = _SRC_INLINE.sub("", text)
    return text

# ─────────────────────────────────────────────────────────
# DB 직조회(검색 API & 내부 호출 공용)
# ─────────────────────────────────────────────────────────
def sql_conn():
    return pymysql.connect(
        host=os.getenv("MYSQL_HOST"),
        port=int(os.getenv("MYSQL_PORT","3306")),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DB"),
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
    )

PROM_MAP = {"방문형":"CAMP001","포장형":"CAMP002","배송형":"CAMP003","구매형":"CAMP004"}
CHANNEL_WORDS = ["블로그","인스타그램","유튜브","클립","릴스","쇼츠","틱톡"]

# ── 조사/불용어 처리 유틸
JOSA = ("에서","으로","로","에게","에","의","은","는","이","가","을","를",
        "와","과","도","만","까지","부터","이나","나","랑","하고")

STOPWORDS = {
    "캠페인","리뷰","리뷰어","신청","지원","검색","목록","추천",
    "있어","있나요","있니","있음","어디","어떤","혹시","인가","인거","거","거야","꺼"
}
PREFIX_STOP = ("모집", "모집중", "마감")  # '모집중인' 등 변형 포함 차단

def strip_josa(word: str) -> str:
    for j in JOSA:
        if word.endswith(j) and len(word) > len(j):
            return word[: -len(j)]
    return word

def parse_filters(text: str):
    """자연어에서 간단히 필터 추출 (조사 제거 + 불용어/접두어 필터)"""
    text = (text or "").strip()

    # 1) 1차 필터 탐지
    region  = next((r for r in REGIONS if r in text), None)
    prom    = next((p for p in PROM_MAP.keys() if p in text), None)
    channel = next((c for c in CHANNEL_WORDS if c in text), None)
    tl = text.lower()
    status = "모집중" if ("모집중" in text or "신청 가능" in text or "open" in tl) else (
             "마감"   if ("마감" in text or "closed" in tl) else None)

    # 2) 키워드 추출
    exclude = {region, prom, channel, "모집중", "마감", None}
    if region:
        for j in JOSA:
            exclude.add(region + j)

    kw = None
    for tok in re.findall(r"[가-힣A-Za-z0-9]{2,}", text):
        base = strip_josa(tok)

        # (a) 이미 사용한 필터/지역/채널/유형 배제
        if base in exclude:
            continue
        if base in REGIONS or base in PROM_MAP or base in CHANNEL_WORDS:
            continue

        # (b) 불용어 배제
        if base in STOPWORDS:
            continue

        # (c) '캠페인*' 류, '모집/모집중/마감' 접두어 배제
        if "캠페인" in base:
            continue
        if base.startswith(PREFIX_STOP):
            continue
        if base.endswith("인") and base[:-1] in PREFIX_STOP:  # 모집중+인
            continue

        # (d) 지역 변형 방어 (서울에/서울쪽 등)
        if region and (base == region or region in base):
            continue

        kw = base
        break

    return {"region": region, "prom": prom, "channel": channel, "status": status, "q": kw}

def db_search(params, limit=10):
    sql = """
      SELECT c.CAMPAIGN_IDX, c.TITLE,
             COALESCE(r.region,'온라인/전국') AS region,
             c.CAMPAIGN_TYPE, c.CAM_CATE_CODE, c.CHANNEL_CODE,
             c.RECRUIT_STATUS,
             DATE_FORMAT(c.APPLY_START_DATE,'%%Y-%%m-%%d') AS APPLY_START_DATE,
             DATE_FORMAT(c.APPLY_END_DATE,'%%Y-%%m-%%d')   AS APPLY_END_DATE,
             DATE_FORMAT(c.EXP_START_DATE,'%%Y-%%m-%%d')   AS EXP_START_DATE,
             DATE_FORMAT(c.EXP_END_DATE,'%%Y-%%m-%%d')     AS EXP_END_DATE,
             DATE_FORMAT(c.DEADLINE_DATE,'%%Y-%%m-%%d')    AS DEADLINE_DATE,
             COALESCE(s.total_app,0) AS total_app,
             COALESCE(s.approved_cnt,0) AS approved_cnt,
             COALESCE(rv.review_cnt,0) AS review_cnt,
             COALESCE(bm.bookmark_cnt,0) AS bookmark_cnt
      FROM tb_campaign c
      LEFT JOIN (
        SELECT CAMPAIGN_IDX,
          CASE
            WHEN ADDRESS LIKE '%%서울%%' THEN '서울'
            WHEN ADDRESS LIKE '%%경기%%' THEN '경기'
            WHEN ADDRESS LIKE '%%인천%%' THEN '인천'
            WHEN ADDRESS LIKE '%%부산%%' THEN '부산'
            WHEN ADDRESS LIKE '%%대구%%' THEN '대구'
            WHEN ADDRESS LIKE '%%광주%%' THEN '광주'
            WHEN ADDRESS LIKE '%%대전%%' THEN '대전'
            WHEN ADDRESS LIKE '%%울산%%' THEN '울산'
            WHEN ADDRESS LIKE '%%세종%%' THEN '세종'
            WHEN ADDRESS LIKE '%%강원%%' THEN '강원'
            WHEN ADDRESS LIKE '%%충북%%' THEN '충북'
            WHEN ADDRESS LIKE '%%충남%%' THEN '충남'
            WHEN ADDRESS LIKE '%%전북%%' THEN '전북'
            WHEN ADDRESS LIKE '%%전남%%' THEN '전남'
            WHEN ADDRESS LIKE '%%경북%%' THEN '경북'
            WHEN ADDRESS LIKE '%%경남%%' THEN '경남'
            WHEN ADDRESS LIKE '%%제주%%' THEN '제주'
            ELSE '온라인/전국'
          END AS region
        FROM tb_campaign_visit
        GROUP BY CAMPAIGN_IDX, region
      ) r ON r.CAMPAIGN_IDX=c.CAMPAIGN_IDX
      LEFT JOIN (
        SELECT
          t.CAMPAIGN_IDX,
          SUM(cnt) AS total_app,
          SUM(CASE WHEN t.APPLY_STATUS_CODE='CAMAPP_APPROVED' AND t.DEL_YN='N' THEN t.cnt ELSE 0 END) AS approved_cnt
        FROM (
          SELECT CAMPAIGN_IDX, APPLY_STATUS_CODE, DEL_YN, COUNT(*) AS cnt
          FROM tb_campaign_application
          GROUP BY CAMPAIGN_IDX, APPLY_STATUS_CODE, DEL_YN
        ) t
        GROUP BY t.CAMPAIGN_IDX
      ) s ON s.CAMPAIGN_IDX=c.CAMPAIGN_IDX
      LEFT JOIN (
        SELECT ca.CAMPAIGN_IDX, COUNT(r.REVIEW_IDX) AS review_cnt
        FROM tb_review r
        JOIN tb_campaign_application ca ON ca.APPLICATION_IDX=r.APPLICATION_IDX
        GROUP BY ca.CAMPAIGN_IDX
      ) rv ON rv.CAMPAIGN_IDX=c.CAMPAIGN_IDX
      LEFT JOIN (
        SELECT CAMPAIGN_IDX, COUNT(*) AS bookmark_cnt
        FROM tb_bookmark
        GROUP BY CAMPAIGN_IDX
      ) bm ON bm.CAMPAIGN_IDX=c.CAMPAIGN_IDX
      WHERE IFNULL(c.DEL_YN,'N')='N'
    """
    args = []
    if params.get("q"):
        sql += " AND (c.TITLE LIKE %s OR c.MISSION LIKE %s OR c.KEYWORD_1 LIKE %s OR c.KEYWORD_2 LIKE %s OR c.KEYWORD_3 LIKE %s)"
        args += [f"%{params['q']}%"]*5
    if params.get("region"):
        sql += " AND COALESCE(r.region,'온라인/전국') = %s"
        args.append(params["region"])
    if params.get("prom"):
        code = PROM_MAP.get(params["prom"], params["prom"])
        sql += " AND c.CAMPAIGN_TYPE = %s"
        args.append(code)
    if params.get("channel"):
        sql += " AND (c.CHANNEL_CODE = %s OR EXISTS (SELECT 1 FROM tb_common_code cc WHERE cc.code_id=c.CHANNEL_CODE AND cc.code_nm=%s))"
        args += [params["channel"], params["channel"]]
    if params.get("status"):
        if params["status"] == "모집중":
            sql += " AND c.RECRUIT_STATUS='OPEN'"
        elif params["status"] == "마감":
            sql += " AND c.RECRUIT_STATUS='CLOSED'"

    sql += " ORDER BY (c.RECRUIT_STATUS='OPEN') DESC, bm.bookmark_cnt DESC, s.total_app DESC, c.REG_DATE DESC LIMIT %s"
    args.append(limit)

    with sql_conn() as conn, conn.cursor() as cur:
        cur.execute(sql, args)
        return cur.fetchall()

# ─────────────────────────────────────────────────────────
# 검색 API (프론트에서 직접 호출용) — 선택사항
# ─────────────────────────────────────────────────────────
@app.get("/api/campaigns/search")
def campaigns_search(
    q: Optional[str] = Query(None, description="키워드(제목/키워드/미션)"),
    region: Optional[str] = Query(None, description="서울/부산/..."),
    prom: Optional[str] = Query(None, description="방문형/포장형/배송형/구매형 또는 코드"),
    channel: Optional[str] = Query(None, description="블로그/인스타그램/유튜브/… 또는 코드"),
    status: Optional[str] = Query(None, description="모집중/마감"),
    limit: int = 20,
    offset: int = 0,
):
    params = {"q": q, "region": region, "prom": prom, "channel": channel, "status": status}
    rows = db_search(params, limit=limit)
    return rows

# ─────────────────────────────────────────────────────────
# 헬스/디버그
# ─────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"ok": True}

@app.get("/debug/search")
def debug_search(q: str, k: int = 6):
    ctx = retrieve_context(q, k)
    return JSONResponse({"chunks": ctx["chunks"]})

# ─────────────────────────────────────────────────────────
# 스트리밍 챗
# ─────────────────────────────────────────────────────────
@app.post("/chat/stream")
def chat_stream(req: ChatReq, request: Request):
    # 1) 필터성 의도 판별
    filt = parse_filters(req.message)
    is_filter_like = any([filt["region"], filt["prom"], filt["channel"], filt["status"]]) \
        or ("찾아" in req.message or "뭐 있어" in req.message or "목록" in req.message or "추천" in req.message)

    if is_filter_like:
        rows = db_search(filt, limit=10)

        def gen_list():
            hdr = []
            if filt.get("region"): hdr.append(f"지역={filt['region']}")
            if filt.get("prom"): hdr.append(f"유형={filt['prom']}")
            if filt.get("channel"): hdr.append(f"채널={filt['channel']}")
            if filt.get("status"): hdr.append(f"상태={filt['status']}")
            if filt.get("q"): hdr.append(f"키워드={filt['q']}")
            hdr_text = ", ".join(hdr) if hdr else "모든 캠페인"

            if not rows:
                yield f"data: 🔎 검색결과 ({hdr_text})가 없습니다. 지역/유형/채널/상태를 바꿔보세요.\n\n"
                yield "data: [DONE]\n\n"
                return

            yield f"data: 🔎 검색결과 ({hdr_text}) 상위 {len(rows)}건:\n\n"
            for i, r in enumerate(rows, 1):
                line = (
                    f"{i}. {r['TITLE']} · {r['region']} · 상태:{'모집중' if r['RECRUIT_STATUS']=='OPEN' else '마감'} "
                    f"(신청:{r['total_app']}, 당첨:{r['approved_cnt']}, 리뷰:{r['review_cnt']}, 북마크:{r['bookmark_cnt']}) "
                    f"모집:{r['APPLY_START_DATE']}~{r['APPLY_END_DATE']} | 체험:{r['EXP_START_DATE']}~{r['EXP_END_DATE']}"
                )
                yield f"data: {line}\n\n"

            yield "data: \n\n"
            yield "data: • 특정 캠페인 상세가 궁금하면 제목 키워드로 물어보세요 (예: \"OOO 캠페인 경쟁률? 리뷰 마감?\")\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(
            gen_list(),
            media_type="text/event-stream",
            headers={"Cache-Control":"no-cache","X-Accel-Buffering":"no"},
        )

    # 2) 설명/가이드/정책 등은 RAG
    ctx_obj = retrieve_context(req.message, req.top_k)
    ctx_plain = (ctx_obj.get("plain") or "").strip()

    if not ctx_plain:
        retry_msg = f"{req.message} 가이드 FAQ 정책 도움말 모집중 지역 채널 유형 경쟁률 신청자 리뷰 제출 북마크"
        ctx_obj = retrieve_context(retry_msg, max(req.top_k, 10))
        ctx_plain = (ctx_obj.get("plain") or "").strip()

    if not ctx_plain:
        def noctx_gen():
            yield "data: 아직 내부 문서에서 답을 못 찾았어요. 예: '서울 방문형 모집중', '이 캠페인 경쟁률', '배송형 신청 방법'처럼 구체적으로 물어봐 주세요.\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(noctx_gen(), media_type="text/event-stream",
                                 headers={"Cache-Control": "no-cache","X-Accel-Buffering":"no"})

    messages = [
        {"role": "system", "content": SYSTEM},
        {"role": "system", "content": f"컨텍스트(번호와 출처 포함):\n{ctx_plain}"},
        {"role": "user", "content": req.message},
    ]

    def gen_rag():
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
                    delta = clean_response_piece(delta)
                    if delta:
                        yield f"data: {delta}\n\n"
        except Exception as e:
            yield f"data: [ERROR] {str(e)}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        gen_rag(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache","X-Accel-Buffering":"no"},
    )

# (옵션) 연결 종료 감지 스텁
def await_disconnected(request: Request) -> bool:
    return False
