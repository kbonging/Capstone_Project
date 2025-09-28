# main.py
import os, re, pymysql
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from openai import OpenAI
import chromadb
from difflib import get_close_matches

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
# Chroma (RAG)
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
    ["방문형","포장형","배송형","구매형"],
    ["블로그","인스타그램","유튜브","클립","릴스","쇼츠","틱톡"],
    REGIONS,
]

def embed_query(q: str) -> List[float]:
    res = client.embeddings.create(model="text-embedding-3-large", input=[q])
    return res.data[0].embedding

def expand_queries(q: str) -> List[str]:
    base = (q or "").strip()
    if not base: return []
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
    if not qvars: return {"chunks": [], "plain": ""}

    all_hits: List[Dict[str, Any]] = []
    for qv in qvars:
        emb = embed_query(qv)
        res = collection.query(
            query_embeddings=[emb],
            n_results=max(k*4, 24),
            include=["documents","metadatas","distances"],
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

    seen, deduped = set(), []
    for h in sorted(all_hits, key=lambda x: x["distance"]):
        key = f"{h.get('source','')}|{h.get('source_id','')}|{h['doc'][:120]}"
        if key in seen: continue
        seen.add(key); deduped.append(h)

    final, per_uid = [], {}
    for h in deduped:
        if len(final) >= k: break
        cnt = per_uid.get(h["uid"], 0)
        if cnt >= 3: continue
        body = re.sub(r"^\[source=.*?\]\s*", "", h["doc"], flags=re.M)
        final.append({**h, "doc": body})
        per_uid[h["uid"]] = cnt + 1

    chunks = []
    for i, h in enumerate(final, start=1):
        header = f"[{i}] {h['title']}" if h["title"] else f"[{i}]"
        if h["source"] or h["source_id"]:
            header += f" (source={h['source']}, id={h['source_id']})"
        chunks.append({"rank": i, "header": header, "body": h["doc"], "source": h["source"], "source_id": h["source_id"], "title": h["title"]})
    plain = "\n\n".join(f"{c['header']}\n{c['body']}" for c in chunks)
    return {"chunks": chunks, "plain": plain}

# ─────────────────────────────────────────────────────────
# 응답 후처리 (출처 태그 제거)
# ─────────────────────────────────────────────────────────
_SRC_TAG = re.compile(r"\[출처\s*\d+\]")
_SRC_INLINE = re.compile(r"\[source=.*?\]")
def clean_response_piece(text: str) -> str:
    text = _SRC_TAG.sub("", text)
    text = _SRC_INLINE.sub("", text)
    return text

# ─────────────────────────────────────────────────────────
# DB 연결/유틸
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

# 채널 코드/별칭 맵 (공통코드: CAMC001~CAMC008)
CHANNEL_MAP = {
    "블로그":       ["블로그", "blog", "naver blog", "CAMC001"],
    "인스타그램":   ["인스타그램", "인스타", "instagram", "ig", "CAMC002"],
    "블로그+클립":  ["블로그+클립", "블로그 + 클립", "블클", "CAMC003"],
    "클립":         ["클립", "clip", "CAMC004"],
    "릴스":         ["릴스", "reels", "CAMC005"],
    "유튜브":       ["유튜브", "youtube", "yt", "CAMC006"],
    "쇼츠":         ["쇼츠", "shorts", "CAMC007"],
    "틱톡":         ["틱톡", "tiktok", "CAMC008"],
}
CHANNEL_CODES_BY_NAME = {
    "블로그": ["CAMC001","CAMC003"],
    "인스타그램": ["CAMC002"],
    "블로그+클립": ["CAMC003"],
    "클립": ["CAMC004","CAMC003"],
    "릴스": ["CAMC005"],
    "유튜브": ["CAMC006","CAMC007"],
    "쇼츠": ["CAMC007"],
    "틱톡": ["CAMC008"],
}

# 조사/불용어
JOSA = ("에서","으로","로","에게","에","의","은","는","이","가","을","를","와","과","도","만","까지","부터","이나","나","랑","하고")
STOPWORDS = {
    "캠페인","리뷰","리뷰어","신청","지원","검색","목록","추천",
    "있어","있나요","있니","있음","어디","어떤","혹시","인가","인거","거","거야","꺼",
    "방법","제출","알려줘","업로드","절차",
    "추천해줘","추천좀","추천해","추천해볼까","추천해주라","추천주라",
    "찾아줘","보여줘","골라줘","말해줘","가르쳐줘","부탁","요청",
}
PREFIX_STOP = ("모집","모집중","마감")
def strip_josa(word: str) -> str:
    for j in JOSA:
        if word.endswith(j) and len(word) > len(j):
            return word[:-len(j)]
    return word

# 자연어 정규화/의도
NORMALIZE_MAP = {
    "켐페인":"캠페인","모집 중":"모집중","오픈":"OPEN",
    "열었어":"모집중","받나요":"모집중","받아?":"모집중",
    "있어?":"모집중","있나요":"모집중","있나":"모집중","있음?":"모집중",
    "열렸어":"모집중","열렸냐":"모집중","구함":"모집중",
    "인스타":"인스타그램","유툽":"유튜브","쇼챠":"쇼츠",
}
LIST_INTENT_WORDS = ("찾아","뭐 있어","목록","추천","있어","있나요","있나","보여줘","골라줘","검색","할만한","괜찮은","어떤 게","궁금")
DETAIL_INTENT_WORDS = ("경쟁률","리뷰","마감","체험 기간","발표","모집 인원","혜택","키워드","미션")

def normalize_text(s: str) -> str:
    s2 = s
    for k, v in NORMALIZE_MAP.items():
        s2 = s2.replace(k, v)
    return s2

def fuzzy_pick(token: str, vocab: list[str], cutoff=0.8) -> Optional[str]:
    cand = get_close_matches(token, vocab, n=1, cutoff=cutoff)
    return cand[0] if cand else None

def detect_intent(text: str) -> str:
    s = (text or "").strip()
    if re.search(r"(방법|절차|어떻게|가이드|FAQ|리뷰\s*제출|후기\s*제출|업로드)", s):
        return "qa"
    if any(w in s for w in DETAIL_INTENT_WORDS):
        return "detail"
    if any(w in s for w in LIST_INTENT_WORDS) or re.search(r"(있어\??|있나요|찾아줘|보여줘|추천해줘|뭐가|어떤게)", s):
        return "list"
    return "qa"

def parse_filters(text: str):
    raw = (text or "").strip()
    if not raw:
        return {"region": None, "prom": None, "channel": None, "status": None, "q": None}
    s = normalize_text(raw)

    # 지역
    region = None
    for r in REGIONS:
        if re.search(rf"{r}(에|에서|쪽|근처|지역|으로|로)?", s):
            region = r; break
    if not region:
        for t in re.findall(r"[가-힣A-Za-z0-9]{2,}", s):
            pick = fuzzy_pick(t, REGIONS, cutoff=0.84)
            if pick: region = pick; break

    # 상태
    tl = s.lower()
    status = None
    if ("모집중" in s) or ("open" in tl):
        status = "모집중"
    elif ("마감" in s) or ("closed" in tl):
        status = "마감"
    elif re.search(r"(있어\??|있나요|있나|받나요|받아\??|열렸어|열렸냐|구함)", s):
        status = "모집중"

    # 유형/채널
    prom = next((p for p in PROM_MAP.keys() if p in s), None)
    if not prom:
        for t in re.findall(r"[가-힣A-Za-z0-9]{2,}", s):
            pick = fuzzy_pick(t, list(PROM_MAP.keys()), cutoff=0.84)
            if pick: prom = pick; break

    channel = next((c for c in CHANNEL_WORDS if c in s), None)
    if not channel:
        for t in re.findall(r"[가-힣A-Za-z0-9]{2,}", s):
            pick = fuzzy_pick(t, CHANNEL_WORDS, cutoff=0.8)
            if pick: channel = pick; break
    if not channel:
        low = s.lower()
        for name, aliases in CHANNEL_MAP.items():
            if name in s or any(a.lower() in low for a in aliases):
                channel = name
                break

    # 키워드
    exclude = {region, prom, channel, "모집중", "마감", None}
    if region:
        for j in JOSA: exclude.add(region + j)
    REQUEST_SUFFIXES = ("해줘","해","해주세요","해줄래","주세요","해볼까","주라","주라요","좀")
    REQUEST_WORDS = {"추천","추천해줘","알려줘","찾아줘","보여줘","골라줘","말해줘","가르쳐줘","부탁","요청"}

    kw = None
    for tok in re.findall(r"[가-힣A-Za-z0-9]{2,}", s):
        base = strip_josa(tok)
        if base in REQUEST_WORDS or base.endswith(REQUEST_SUFFIXES):
            continue
        if base in exclude: continue
        if base in REGIONS or base in PROM_MAP or base in CHANNEL_WORDS: continue
        if base in STOPWORDS: continue
        if "캠페인" in base: continue
        if base.startswith(PREFIX_STOP) or (base.endswith("인") and base[:-1] in PREFIX_STOP): continue
        if region and (base == region or region in base): continue
        kw = base; break

    return {"region": region, "prom": prom, "channel": channel, "status": status, "q": kw}

# ─────────────────────────────────────────────────────────
# 마크다운 출력 헬퍼
# ─────────────────────────────────────────────────────────
def _mk_header_text(filt: dict) -> str:
    parts = []
    if filt.get("region"):  parts.append(f"지역={filt['region']}")
    if filt.get("prom"):    parts.append(f"유형={filt['prom']}")
    if filt.get("channel"): parts.append(f"채널={filt['channel']}")
    if filt.get("status"):  parts.append(f"상태={filt['status']}")
    if filt.get("q"):       parts.append(f"키워드={filt['q']}")
    return ", ".join(parts) if parts else "모든 캠페인"

def _rows_to_markdown_table(rows: list[dict]) -> str:
    """검색 결과를 마크다운 표로 변환 (프론트 ReactMarkdown+GFM로 예쁘게 렌더됨)"""
    if not rows:
        return ""
    header = (
        "| # | 제목 | 지역 | 상태 | 신청 | 당첨 | 리뷰 | 북마크 | 모집기간 | 체험기간 |\n"
        "|---:|---|---|---|---:|---:|---:|---:|---|---|\n"
    )
    lines = []
    for i, r in enumerate(rows, 1):
        status = "모집중" if r["RECRUIT_STATUS"] == "OPEN" else "마감"
        lines.append(
            f"| {i} | {r['TITLE']} | {r['region']} | {status}"
            f" | {r['total_app']} | {r['approved_cnt']} | {r['review_cnt']} | {r['bookmark_cnt']}"
            f" | {r['APPLY_START_DATE']}~{r['APPLY_END_DATE']}"
            f" | {r['EXP_START_DATE']}~{r['EXP_END_DATE']} |"
        )
    return header + "\n".join(lines)

# ─────────────────────────────────────────────────────────
# DB 검색 (리뷰어용 목록/통계)
# ─────────────────────────────────────────────────────────
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
          CAMPAIGN_IDX,
          COUNT(*) AS total_app,
          SUM(CASE WHEN APPLY_STATUS_CODE='CAMAPP_APPROVED' THEN 1 ELSE 0 END) AS approved_cnt
        FROM tb_campaign_application
        WHERE IFNULL(DEL_YN,'N')='N'
        GROUP BY CAMPAIGN_IDX
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
    args: list[Any] = []

    # 지난 모집기간 제외(상시 NULL 허용)
    if params.get("status") == "마감":
        sql += " AND c.RECRUIT_STATUS='CLOSED'"
    else:
        sql += " AND (c.APPLY_END_DATE IS NULL OR DATE(c.APPLY_END_DATE) >= CURDATE())"

    # 키워드/지역/유형
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

    # 채널(안전 조립 + 별칭 중복 제거)
    if params.get("channel"):
        ch_name = params["channel"]
        cand_codes = CHANNEL_CODES_BY_NAME.get(ch_name, [])
        aliases = CHANNEL_MAP.get(ch_name, [ch_name])

        uniq_aliases = []
        seen = set()
        for a in [ch_name] + aliases:
            low = a.lower()
            if low not in seen:
                uniq_aliases.append(a)
                seen.add(low)

        conds = []
        vals: list[Any] = []

        if cand_codes:
            placeholders = ",".join(["%s"] * len(cand_codes))
            conds.append(f"c.CHANNEL_CODE IN ({placeholders})")
            vals.extend(cand_codes)

        for alias in uniq_aliases:
            conds.append(
                "EXISTS (SELECT 1 FROM tb_common_code cc "
                "WHERE cc.code_id = c.CHANNEL_CODE "
                "AND cc.code_nm LIKE %s)"
            )
            vals.append(f"%{alias}%")

        for alias in uniq_aliases:
            conds.append("c.CHANNEL_CODE LIKE %s")
            vals.append(f"%{alias}%")

        sql += " AND (" + " OR ".join(conds) + ")"
        args += vals

    # 상태: 모집중
    if params.get("status") == "모집중":
        sql += " AND c.RECRUIT_STATUS='OPEN'"

    # 정렬 + LIMIT
    sql += (
        " ORDER BY (c.RECRUIT_STATUS='OPEN') DESC, "
        "bm.bookmark_cnt DESC, s.total_app DESC, c.REG_DATE DESC LIMIT %s"
    )
    args.append(limit)

    with sql_conn() as conn, conn.cursor() as cur:
        cur.execute(sql, args)
        return cur.fetchall()

# ─────────────────────────────────────────────────────────
# 소상공인(OWNER) / 리뷰어(REVIEWER)
# ─────────────────────────────────────────────────────────
def db_owner_stats(owner_id: int, limit=5):
    sql = """
      SELECT c.CAMPAIGN_IDX, c.TITLE,
             c.RECRUIT_STATUS,
             DATE_FORMAT(c.APPLY_START_DATE,'%%Y-%%m-%%d') AS APPLY_START_DATE,
             DATE_FORMAT(c.APPLY_END_DATE,'%%Y-%%m-%%d')   AS APPLY_END_DATE,
             DATE_FORMAT(c.ANNOUNCE_DATE,'%%Y-%%m-%%d')    AS ANNOUNCE_DATE,
             DATE_FORMAT(c.DEADLINE_DATE,'%%Y-%%m-%%d')    AS DEADLINE_DATE,
             COALESCE(s.total_app,0) AS total_app,
             COALESCE(s.approved_cnt,0) AS approved_cnt,
             COALESCE(rv.review_cnt,0) AS review_cnt,
             COALESCE(bm.bookmark_cnt,0) AS bookmark_cnt
      FROM tb_campaign c
      LEFT JOIN (
        SELECT
          CAMPAIGN_IDX,
          COUNT(*) AS total_app,
          SUM(CASE WHEN APPLY_STATUS_CODE='CAMAPP_APPROVED' THEN 1 ELSE 0 END) AS approved_cnt
        FROM tb_campaign_application
        WHERE IFNULL(DEL_YN,'N')='N'
        GROUP BY CAMPAIGN_IDX
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
        AND c.OWNER_ID = %s
      ORDER BY c.REG_DATE DESC
      LIMIT %s
    """
    with sql_conn() as conn, conn.cursor() as cur:
        cur.execute(sql, (owner_id, limit))
        return cur.fetchall()

# ─────────────────────────────────────────────────────────
# 경쟁률 계산 (제목 키워드 기반)
# ─────────────────────────────────────────────────────────
def db_campaign_competition(title_kw: str, region: Optional[str] = None):
    sql = """
      SELECT
        c.CAMPAIGN_IDX,
        c.TITLE,
        COALESCE(rm.region,'온라인/전국') AS region,
        c.RECRUIT_STATUS,
        c.RECRUIT_COUNT AS recruit_slots,
        COALESCE(a.total_app,0)   AS total_app,
        COALESCE(a.approved_cnt,0) AS approved_cnt,
        DATE_FORMAT(c.APPLY_START_DATE,'%%Y-%%m-%%d') AS APPLY_START_DATE,
        DATE_FORMAT(c.APPLY_END_DATE,'%%Y-%%m-%%d')   AS APPLY_END_DATE
      FROM tb_campaign c
      LEFT JOIN (
        SELECT CAMPAIGN_IDX,
               COUNT(*) AS total_app,
               SUM(CASE WHEN APPLY_STATUS_CODE='CAMAPP_APPROVED' THEN 1 ELSE 0 END) AS approved_cnt
        FROM tb_campaign_application
        WHERE IFNULL(DEL_YN,'N')='N'
        GROUP BY CAMPAIGN_IDX
      ) a ON a.CAMPAIGN_IDX = c.CAMPAIGN_IDX
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
      ) rm ON rm.CAMPAIGN_IDX = c.CAMPAIGN_IDX
      WHERE IFNULL(c.DEL_YN,'N')='N'
        AND c.TITLE LIKE %s
      {region_filter}
      ORDER BY c.REG_DATE DESC
      LIMIT 1
    """.format(region_filter=" AND COALESCE(rm.region,'온라인/전국')=%s" if region else "")
    args = [f"%{title_kw}%"] + ([region] if region else [])

    with sql_conn() as conn, conn.cursor() as cur:
        cur.execute(sql, args)
        row = cur.fetchone()

    if not row:
        return None

    slots = int(row["recruit_slots"] or 0)
    apps  = int(row["total_app"] or 0)
    comp_ratio = round(apps / slots, 2) if slots > 0 else None
    comp_pct   = round(apps / slots * 100, 1) if slots > 0 else None

    row["competition_ratio"] = comp_ratio
    row["competition_pct"]   = comp_pct
    return row

def extract_title_keyword_for_detail(msg: str) -> Optional[str]:
    s = (msg or "").strip()
    # 따옴표 안 텍스트 우선
    m = re.search(r"[\"'“”‘’](.+?)[\"'“”‘’]", s)
    if m:
        kw = m.group(1).strip()
        return kw if kw else None
    # 잡단어 제거 후 첫 유효 토큰
    s = s.replace("캠페인", " ").replace("경쟁률", " ")
    toks = [t for t in re.findall(r"[가-힣A-Za-z0-9]+", s) if len(t) >= 2]
    bad = {
        "캠페인","경쟁률","리뷰","모집","모집중","마감","알려줘","좀",
        "제목","키워드","방법","제출","업로드","절차","추천","찾아줘",
        "보여줘","골라줘","해주세요","해줘","해", "언제","어디","기간"
    }
    toks = [t for t in toks if t not in bad]
    return toks[0] if toks else None

REVIEWER_TRIGGERS = {
    "apps": ("내 신청", "내가 신청", "신청 현황", "지원 현황"),
    "bookmarks": ("내 북마크", "저장한 캠페인", "찜한 캠페인"),
    "reviews": ("내 리뷰", "작성한 리뷰", "리뷰 제출 현황"),
    "deadlines": ("리뷰 마감", "마감일", "리뷰 제출 기한"),
}
def detect_reviewer_intent(text: str) -> Optional[str]:
    s = (text or "").strip()
    for intent, kws in REVIEWER_TRIGGERS.items():
        if any(k in s for k in kws):
            return intent
    return None

def db_my_applications(user_id: int):
    sql = """
      SELECT c.TITLE, c.RECRUIT_STATUS,
             DATE_FORMAT(c.APPLY_START_DATE,'%%Y-%%m-%%d') AS APPLY_START_DATE,
             DATE_FORMAT(c.APPLY_END_DATE,'%%Y-%%m-%%d')   AS APPLY_END_DATE,
             DATE_FORMAT(c.DEADLINE_DATE,'%%Y-%%m-%%d')    AS DEADLINE_DATE,
             a.APPLY_STATUS_CODE
      FROM tb_campaign_application a
      JOIN tb_campaign c ON c.CAMPAIGN_IDX=a.CAMPAIGN_IDX
      WHERE a.USER_ID=%s AND IFNULL(a.DEL_YN,'N')='N'
      ORDER BY a.APPLY_DATE DESC LIMIT 5
    """
    with sql_conn() as conn, conn.cursor() as cur:
        cur.execute(sql, (user_id,))
        return cur.fetchall()

def db_my_bookmarks(user_id: int):
    sql = """
      SELECT c.TITLE, c.RECRUIT_STATUS,
             DATE_FORMAT(c.APPLY_END_DATE,'%%Y-%%m-%%d') AS APPLY_END_DATE
      FROM tb_bookmark b
      JOIN tb_campaign c ON c.CAMPAIGN_IDX=b.CAMPAIGN_IDX
      WHERE b.USER_ID=%s
      ORDER BY b.REG_DATE DESC LIMIT 5
    """
    with sql_conn() as conn, conn.cursor() as cur:
        cur.execute(sql, (user_id,))
        return cur.fetchall()

def db_my_reviews(user_id: int):
    sql = """
      SELECT c.TITLE,
             DATE_FORMAT(c.DEADLINE_DATE,'%%Y-%%m-%%d') AS DEADLINE_DATE,
             r.REVIEW_IDX
      FROM tb_review r
      JOIN tb_campaign_application a ON a.APPLICATION_IDX=r.APPLICATION_IDX
      JOIN tb_campaign c ON c.CAMPAIGN_IDX=a.CAMPAIGN_IDX
      WHERE a.USER_ID=%s
      ORDER BY r.REG_DATE DESC LIMIT 5
    """
    with sql_conn() as conn, conn.cursor() as cur:
        cur.execute(sql, (user_id,))
        return cur.fetchall()

# ─────────────────────────────────────────────────────────
# RAG
# ─────────────────────────────────────────────────────────
def _respond_rag(req: ChatReq):
    ctx_obj = retrieve_context(req.message, req.top_k)
    ctx_plain = (ctx_obj.get("plain") or "").strip()
    if not ctx_plain:
        retry_msg = f"{req.message} 가이드 FAQ 정책 도움말 모집중 지역 채널 유형 경쟁률 신청자 리뷰 제출 북마크"
        ctx_obj = retrieve_context(retry_msg, max(req.top_k, 10))
        ctx_plain = (ctx_obj.get("plain") or "").strip()
    if not ctx_plain:
        def noctx_gen():
            yield "data: 아직 내부 문서에서 답을 못 찾았어요. 예) '서울에 블로그 가능한 거 있어?' 처럼 자연어로 편하게 물어보셔도 돼요.\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(noctx_gen(), media_type="text/event-stream",
                                 headers={"Cache-Control":"no-cache","X-Accel-Buffering":"no"})
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
    return StreamingResponse(gen_rag(), media_type="text/event-stream",
                             headers={"Cache-Control":"no-cache","X-Accel-Buffering":"no"})

def _should_list(msg: str, filt: dict, intent: str) -> bool:
    if re.search(r"(방법|절차|어떻게|가이드|FAQ|리뷰\s*제출|후기\s*제출|업로드)", msg):
        return False
    has_strict_filter = any([filt.get("region"), filt.get("prom"), filt.get("channel"), filt.get("status")])
    return has_strict_filter or intent == "list"

# ─────────────────────────────────────────────────────────
# 스트리밍 챗
# ─────────────────────────────────────────────────────────
OWNER_TRIGGERS = ("내 캠페인", "내가 올린", "우리 가게", "내가 등록", "내 캠페인들")
def is_owner_query(text: str) -> bool:
    s = (text or "").strip()
    return any(t in s for t in OWNER_TRIGGERS)

@app.post("/chat/stream")
def chat_stream(req: ChatReq, request: Request):
    intent = detect_intent(req.message)
    filt = parse_filters(req.message)

    # 리뷰어
    rev_intent = detect_reviewer_intent(req.message)
    if rev_intent:
        user_id = req.user_id
        def gen_reviewer():
            if not user_id:
                yield "data: ⚠️ 로그인 후 이용 가능합니다. (user_id 필요)\n\n"
                yield "data: [DONE]\n\n"; return
            if rev_intent == "apps":
                rows = db_my_applications(user_id)
                if not rows: yield "data: 📌 신청한 캠페인이 없습니다.\n\n"
                else:
                    yield "data: 📌 최근 신청 현황:\n\n"
                    for r in rows:
                        yield f"data: - {r['TITLE']} · 상태:{'모집중' if r['RECRUIT_STATUS']=='OPEN' else '마감'} (신청:{r['APPLY_START_DATE']}~{r['APPLY_END_DATE']}) · 리뷰마감:{r['DEADLINE_DATE']}\n\n"
            elif rev_intent == "bookmarks":
                rows = db_my_bookmarks(user_id)
                if not rows: yield "data: 📌 저장한 캠페인이 없습니다.\n\n"
                else:
                    yield "data: 📌 내 북마크 목록:\n\n"
                    for r in rows:
                        yield f"data: - {r['TITLE']} · 상태:{'모집중' if r['RECRUIT_STATUS']=='OPEN' else '마감'} (마감:{r['APPLY_END_DATE']})\n\n"
            elif rev_intent == "reviews":
                rows = db_my_reviews(user_id)
                if not rows: yield "data: 📌 제출한 리뷰가 없습니다.\n\n"
                else:
                    yield "data: 📌 내 리뷰 제출 현황:\n\n"
                    for r in rows:
                        yield f"data: - {r['TITLE']} · 리뷰ID:{r['REVIEW_IDX']} (리뷰마감:{r['DEADLINE_DATE']})\n\n"
            elif rev_intent == "deadlines":
                rows = db_my_applications(user_id)
                if not rows: yield "data: 📌 리뷰 마감일 관련 캠페인이 없습니다.\n\n"
                else:
                    yield "data: 📌 내가 참여한 캠페인 리뷰 마감일:\n\n"
                    for r in rows:
                        yield f"data: - {r['TITLE']} · 리뷰마감:{r['DEADLINE_DATE']}\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(gen_reviewer(), media_type="text/event-stream",
                                 headers={"Cache-Control":"no-cache","X-Accel-Buffering":"no"})

    # 오너
    if is_owner_query(req.message):
        owner_id = req.user_id
        def gen_owner():
            if not owner_id:
                yield "data: ⚠️ 로그인 후 이용 가능합니다. (user_id 필요)\n\n"
                yield "data: [DONE]\n\n"; return
            rows = db_owner_stats(owner_id, limit=5)
            if not rows:
                yield "data: 📊 현재 등록한 캠페인이 없습니다.\n\n"
                yield "data: [DONE]\n\n"; return
            yield f"data: 📊 내 캠페인 현황 (최근 {len(rows)}건)\n\n"
            for i, r in enumerate(rows, 1):
                line = (
                    f"{i}. {r['TITLE']} · 상태:{'모집중' if r['RECRUIT_STATUS']=='OPEN' else '마감'} "
                    f"(신청:{r['total_app']}, 당첨:{r['approved_cnt']}, 리뷰:{r['review_cnt']}, 북마크:{r['bookmark_cnt']}) "
                    f"모집:{r['APPLY_START_DATE']}~{r['APPLY_END_DATE']} | 발표:{r['ANNOUNCE_DATE']} | 리뷰마감:{r['DEADLINE_DATE']}"
                )
                yield f"data: {line}\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(gen_owner(), media_type="text/event-stream",
                                 headers={"Cache-Control":"no-cache","X-Accel-Buffering":"no"})

    # 경쟁률
    if "경쟁률" in req.message:
        title_kw = filt.get("q") or extract_title_keyword_for_detail(req.message)
        def gen_comp():
            if not title_kw:
                yield "data: 경쟁률을 알려면 캠페인 제목의 핵심 단어가 필요해요. 예: \"인생맥주 경쟁률\"\n\n"
                yield "data: [DONE]\n\n"; return
            row = db_campaign_competition(title_kw, region=filt.get("region"))
            if not row:
                yield f"data: '{title_kw}'로 찾은 캠페인이 없어요. 제목의 다른 키워드로 다시 시도해 보세요.\n\n"
                yield "data: [DONE]\n\n"; return

            status = "모집중" if row["RECRUIT_STATUS"] == "OPEN" else "마감"
            slots  = int(row["recruit_slots"] or 0)
            apps   = int(row["total_app"] or 0)
            ratio  = row["competition_ratio"]; pct = row["competition_pct"]

            yield f"data: ### 🔎 {row['TITLE']} · {row['region']} · 상태:{status}\n\n"
            yield f"data: - 모집기간: **{row['APPLY_START_DATE']} ~ {row['APPLY_END_DATE']}**\n\n"
            yield f"data: - 신청 **{apps}명** / 모집 **{slots}명**\n\n"
            if ratio is not None:
                yield f"data: - 경쟁률: **약 {ratio}배 (≈ {pct}%)**\n\n"
            else:
                yield "data: - 경쟁률: 모집정원 정보를 찾지 못해 배수를 계산할 수 없어요.\n\n"
            if row.get("approved_cnt") is not None:
                yield f"data: - 당첨(선정) 수: **{row['approved_cnt']}명**\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(gen_comp(), media_type="text/event-stream",
                                 headers={"Cache-Control":"no-cache","X-Accel-Buffering":"no"})

    # 카운트
    if re.search(r"(몇\s*개|몇\s*건|몇\s*명|총\s*몇)", req.message):
        filt_for_count = {**filt, "q": None}
        rows = db_search(filt_for_count, limit=9999)
        def gen_count():
            cnt = len(rows)
            hdr_text = _mk_header_text(filt_for_count)
            yield f"data: ### 📊 현재 (**{hdr_text}**) 조건의 캠페인 수\n\n"
            yield f"data: - **총 {cnt}건**\n\n"
            if cnt > 0:
                yield "data: - 상위 몇 개를 표로 보고 싶으면 **“상위 5개 보여줘”** 처럼 말해 보세요.\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(gen_count(), media_type="text/event-stream",
                                 headers={"Cache-Control": "no-cache","X-Accel-Buffering":"no"})

    # QA
    if intent == "qa":
        return _respond_rag(req)

    # 목록/탐색 (0건이면 0건 고지, 채널 완화 폴백 없음)
    if _should_list(req.message, filt, intent):
        rows = db_search(filt, limit=10)
        def gen_list():
            hdr_text = _mk_header_text(filt)
            if not rows:
                yield f"data: ### 🔎 검색결과 (**{hdr_text}**)\n\n"
                yield f"data: - **총 0건**입니다.\n\n"
                yield "data: - 조건을 조금 넓혀 보시겠어요? (예: 채널/키워드 제거)\n\n"
                yield "data: [DONE]\n\n"
                return
            yield f"data: ### 🔎 검색결과 (**{hdr_text}**) 상위 {len(rows)}건\n\n"
            table_md = _rows_to_markdown_table(rows)
            for chunk in table_md.splitlines(True):
                yield f"data: {chunk}"
            yield "data: \n\n"
            yield "data: - 특정 캠페인 상세가 궁금하면 **제목 핵심 단어**로 물어보세요. (예: `OOO 경쟁률/리뷰 마감?`)\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(gen_list(), media_type="text/event-stream",
                                 headers={"Cache-Control":"no-cache","X-Accel-Buffering":"no"})

    # 나머지: RAG
    return _respond_rag(req)

def await_disconnected(request: Request) -> bool:
    return False
