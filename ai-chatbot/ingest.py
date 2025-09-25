# ai-chatbot/ingest.py
import os, re, pymysql
from dotenv import load_dotenv
from openai import OpenAI
import chromadb

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
chroma = chromadb.PersistentClient(path=os.getenv("CHROMA_DIR", "./chroma_index"))
col = chroma.get_or_create_collection("revory_docs")

# ─────────────────────────────────────────────────────────
# 소스 정의 (실제 테이블/컬럼 반영)
# ─────────────────────────────────────────────────────────
SOURCES = [
    {
        "name": "campaigns",
        "sql": """
          SELECT
            c.CAMPAIGN_IDX           AS id,
            c.TITLE                  AS title,
            CONCAT_WS('\\n',
              CONCAT('캠페인 유형: ', IFNULL(c.CAMPAIGN_TYPE, '')),
              CONCAT('카테고리: ', IFNULL(c.CAM_CATE_CODE, '')),
              CONCAT('채널 코드: ', IFNULL(c.CHANNEL_CODE, '')),
              '',
              CONCAT('[미션]\\n', IFNULL(c.MISSION, '')),
              '',
              CONCAT('[혜택 상세]\\n', IFNULL(c.BENEFIT_DETAIL, '')),
              '',
              CONCAT('[키워드]\\n',
                TRIM(CONCAT_WS(', ',
                  NULLIF(c.KEYWORD_1, ''),
                  NULLIF(c.KEYWORD_2, ''),
                  NULLIF(c.KEYWORD_3, '')
                ))
              ),
              '',
              CONCAT('[모집 인원] ', IFNULL(c.RECRUIT_COUNT, '')),
              CONCAT('[모집 기간] ', IFNULL(DATE_FORMAT(c.APPLY_START_DATE, '%Y-%m-%d'), ''), ' ~ ',
                                   IFNULL(DATE_FORMAT(c.APPLY_END_DATE,   '%Y-%m-%d'), '')),
              CONCAT('[발표일] ', IFNULL(DATE_FORMAT(c.ANNOUNCE_DATE, '%Y-%m-%d'), '')),
              CONCAT('[체험 기간] ', IFNULL(DATE_FORMAT(c.EXP_START_DATE, '%Y-%m-%d'), ''), ' ~ ',
                                   IFNULL(DATE_FORMAT(c.EXP_END_DATE,   '%Y-%m-%d'), '')),
              CONCAT('[마감일] ', IFNULL(DATE_FORMAT(c.DEADLINE_DATE, '%Y-%m-%d'), '')),
              CONCAT('[상태] ', IFNULL(c.CAMPAIGN_STATUS, ''), ' / 모집상태: ', IFNULL(c.RECRUIT_STATUS, ''))
            )                        AS content
          FROM tb_campaign c
          WHERE IFNULL(c.DEL_YN, 'N') = 'N'
        """,
    },
    {
        "name": "campaign_visit",
        "sql": """
          SELECT
            v.CAMPAIGN_IDX           AS id,
            CONCAT('[방문 안내] ', IFNULL(c.TITLE,'')) AS title,
            CONCAT_WS('\\n',
              CONCAT('주소: ', IFNULL(v.ADDRESS, ''), ' ', IFNULL(v.ADDRESS_DETAIL, '')),
              CONCAT('방문 가능 요일/일: ', IFNULL(v.EXP_DAY, '')),
              CONCAT('시간대: ', IFNULL(v.START_TIME, ''), ' ~ ', IFNULL(v.END_TIME, '')),
              '',
              '[예약/유의사항]',
              IFNULL(v.RESERVATION_NOTICE, '')
            )                        AS content
          FROM tb_campaign_visit v
          LEFT JOIN tb_campaign c ON c.CAMPAIGN_IDX = v.CAMPAIGN_IDX
          WHERE v.CAMPAIGN_IDX IS NOT NULL
        """,
    },
    {
        "name": "campaign_delivery",
        "sql": """
          SELECT
            d.CAMPAIGN_IDX           AS id,
            CONCAT('[배송/구매 안내] ', IFNULL(c.TITLE,'')) AS title,
            CONCAT_WS('\\n',
              '구매/확인용 URL:',
              IFNULL(d.PURCHASE_URL, '')
            )                        AS content
          FROM tb_campaign_delivery d
          LEFT JOIN tb_campaign c ON c.CAMPAIGN_IDX = d.CAMPAIGN_IDX
          WHERE d.CAMPAIGN_IDX IS NOT NULL
        """,
    },
    {
        "name": "notification",
        "sql": """
          SELECT
            n.NOTIFICATION_IDX       AS id,
            IFNULL(n.NOTI_TITLE,'공지') AS title,
            CONCAT_WS('\\n',
              '[공지/알림]',
              IFNULL(n.NOTI_MESSAGE, ''),
              IFNULL(n.NOTI_LINK_URL, '')
            )                        AS content
          FROM tb_notification n
          WHERE IFNULL(n.DEL_YN, 'N') = 'N'
        """,
    },
    {
        "name": "common_code",
        "sql": """
          SELECT
            CONCAT(cc.GROUP_CODE, ':', cc.CODE_ID) AS id,
            CONCAT('[코드] ', cc.GROUP_CODE, ' / ', cc.CODE_ID, ' - ', IFNULL(cc.CODE_NM,'')) AS title,
            CONCAT_WS('\\n',
              IFNULL(cc.CODE_DC, ''),
              CONCAT('정렬순서: ', IFNULL(cc.SORT,'')),
              CONCAT('그룹정렬: ', IFNULL(cc.GROUP_SORT,''))
            ) AS content
          FROM tb_common_code cc
          WHERE IFNULL(cc.DEL_YN,'N') = 'N'
        """,
    },
]

# ─────────────────────────────────────────────────────────
# 임베딩 & 청킹
# ─────────────────────────────────────────────────────────
def embed(texts: list[str]) -> list[list[float]]:
    res = client.embeddings.create(model="text-embedding-3-large", input=texts)
    return [d.embedding for d in res.data]

def chunk(text: str, size=1200, overlap=200):
    """문장 경계 기반 + 한 청크 겹침"""
    text = (text or "").strip()
    sents = re.split(r'(?<=[.!?…\n])\s+', text)
    out, cur = [], ""
    for s in sents:
        if len(cur) + len(s) <= size:
            cur += (("" if not cur else " ") + s)
        else:
            if cur:
                out.append(cur)
            cur = s
    if cur:
        out.append(cur)

    stepped = []
    for i in range(len(out)):
        start = max(0, i - 1)  # 이전 청크 1개 겹침
        merged = " ".join(out[start:i + 1])
        stepped.append(merged[:size])
    return stepped

# ─────────────────────────────────────────────────────────
# DB 연결
# ─────────────────────────────────────────────────────────
def get_conn():
    return pymysql.connect(
        host=os.getenv("MYSQL_HOST"),
        port=int(os.getenv("MYSQL_PORT", "3306")),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DB"),
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
    )

def make_id(source: str, row_id, chunk_idx: int) -> str:
    return f"{source}:{row_id}:{chunk_idx}"

# ─────────────────────────────────────────────────────────
# 업서트
# ─────────────────────────────────────────────────────────
def upsert_sources(batch_size=64):
    total = 0
    conn = get_conn()
    with conn, conn.cursor() as cur:
        for src in SOURCES:
            cur.execute(src["sql"])
            rows = cur.fetchall()
            print(f"[{src['name']}] rows={len(rows)}")

            docs, metas, ids = [], [], []
            for r in rows:
                title = r.get("title") or ""
                content = r.get("content") or ""
                chunks = chunk(content)

                for idx, c in enumerate(chunks):
                    # 제목/출처를 본문 앞에 포함 (검색 랭킹↑, 출처 추적 용이)
                    doc_text = f"### {title}\n[source={src['name']}, id={r['id']}]\n\n{c}"
                    docs.append(doc_text)
                    metas.append({"source": src["name"], "source_id": str(r["id"]), "title": title})
                    ids.append(make_id(src["name"], r["id"], idx))

                    if len(docs) >= batch_size:
                        _flush(docs, metas, ids)
                        total += len(ids)
                        docs, metas, ids = [], [], []

            if docs:
                _flush(docs, metas, ids)
                total += len(ids)

    print(f"Upserted total {total} chunks.")

def _flush(docs, metas, ids):
    embs = embed(docs)
    col.upsert(documents=docs, metadatas=metas, ids=ids, embeddings=embs)
    print(f"  - batch upsert: {len(ids)}")

# ─────────────────────────────────────────────────────────
# (선택) 사이트 소개 1건 씨드
# ─────────────────────────────────────────────────────────
def upsert_about_revory():
    about_id = "about:revory"
    title = "Revory 서비스 소개"
    content = (
        "Revory는 체험단/리뷰 매칭 플랫폼입니다. "
        "사장님은 캠페인을 등록하여 리뷰어를 모집하고, "
        "리뷰어는 선정 후 미션을 수행하고 리뷰를 제출합니다. "
        "주요 기능: 캠페인 목록/상세, 신청/선정, 방문/배송 안내, 리뷰 제출, 공지/알림 등."
    )
    doc = f"### {title}\n[source=site, id={about_id}]\n\n{content}"
    emb = embed([doc])[0]
    col.upsert(
        documents=[doc],
        metadatas=[{"source": "site", "source_id": about_id, "title": title}],
        ids=[about_id],
        embeddings=[emb],
    )
    print("Upserted about page.")

if __name__ == "__main__":
    # ⚠️ 인덱스 포맷을 바꿨다면 CHROMA_DIR 폴더를 지우고 다시 실행하세요.
    upsert_sources()
    upsert_about_revory()
