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
# 소스 정의 (민감정보 제외)
#   - 전화/이메일/정확 주소/회원식별정보 등 PII는 색인하지 않음
#   - 지역은 주소에서 시/도만 추론하여 텍스트화
# ─────────────────────────────────────────────────────────
SOURCES = [
    # 1) 캠페인 기본
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
              CONCAT('[모집 인원] ', IFNULL(c.RECRUIT_COUNT, 0)),
              CONCAT('[모집 기간] ',
                     IFNULL(DATE_FORMAT(c.APPLY_START_DATE, '%Y-%m-%d'), ''), ' ~ ',
                     IFNULL(DATE_FORMAT(c.APPLY_END_DATE,   '%Y-%m-%d'), '')),
              CONCAT('[발표일] ', IFNULL(DATE_FORMAT(c.ANNOUNCE_DATE, '%Y-%m-%d'), '')),
              CONCAT('[체험 기간] ',
                     IFNULL(DATE_FORMAT(c.EXP_START_DATE, '%Y-%m-%d'), ''), ' ~ ',
                     IFNULL(DATE_FORMAT(c.EXP_END_DATE,   '%Y-%m-%d'), '')),
              CONCAT('[리뷰 마감일] ', IFNULL(DATE_FORMAT(c.DEADLINE_DATE, '%Y-%m-%d'), '')),
              CONCAT('[상태] ', IFNULL(c.CAMPAIGN_STATUS, ''), ' / 모집상태: ', IFNULL(c.RECRUIT_STATUS, ''))
            ) AS content
          FROM tb_campaign c
          WHERE IFNULL(c.DEL_YN, 'N') = 'N'
        """,
    },

    # 2) 방문 안내 (정확한 주소 제외)
    {
        "name": "campaign_visit",
        "sql": """
          SELECT
            v.CAMPAIGN_IDX           AS id,
            CONCAT('[방문 안내] ', IFNULL(c.TITLE,'')) AS title,
            CONCAT_WS('\\n',
              CONCAT('방문 가능 요일/일: ', IFNULL(v.EXP_DAY, '')),
              CONCAT('시간대: ', IFNULL(v.START_TIME, ''), ' ~ ', IFNULL(v.END_TIME, '')),
              '',
              '[예약/유의사항]',
              IFNULL(v.RESERVATION_NOTICE, '')
            ) AS content
          FROM tb_campaign_visit v
          LEFT JOIN tb_campaign c ON c.CAMPAIGN_IDX = v.CAMPAIGN_IDX
          WHERE v.CAMPAIGN_IDX IS NOT NULL
        """,
    },

    # 3) 배송/구매 안내 (외부 URL만)
    {
        "name": "campaign_delivery",
        "sql": """
          SELECT
            d.CAMPAIGN_IDX           AS id,
            CONCAT('[배송/구매 안내] ', IFNULL(c.TITLE,'')) AS title,
            CONCAT_WS('\\n',
              '구매/확인용 URL:',
              IFNULL(d.PURCHASE_URL, '')
            ) AS content
          FROM tb_campaign_delivery d
          LEFT JOIN tb_campaign c ON c.CAMPAIGN_IDX = d.CAMPAIGN_IDX
          WHERE d.CAMPAIGN_IDX IS NOT NULL
        """,
    },

    # 4) 공지
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
            ) AS content
          FROM tb_notification n
          WHERE IFNULL(n.DEL_YN, 'N') = 'N'
        """,
    },

    # 5) 코드(약어 해석)
    {
        "name": "common_code",
        "sql": """
          SELECT
            CONCAT(cc.GROUP_CODE, ':', cc.CODE_ID) AS id,
            CONCAT('[코드] ', cc.GROUP_CODE, ' / ', cc.CODE_ID, ' - ', IFNULL(cc.CODE_NM,'')) AS title,
            CONCAT_WS('\\n',
              IFNULL(cc.CODE_DC, ''),
              CONCAT('정렬순서: ', IFNULL(cc.SORT,0)),
              CONCAT('그룹정렬: ', IFNULL(cc.GROUP_SORT,0))
            ) AS content
          FROM tb_common_code cc
          WHERE IFNULL(cc.DEL_YN,'N') = 'N'
        """,
    },

    # 6) 캠페인 통계(지원/선정/리뷰/경쟁률/북마크)
    {
        "name": "campaign_stats",
        "sql": """
          SELECT
            c.CAMPAIGN_IDX AS id,
            CONCAT('[캠페인 통계] ', c.TITLE) AS title,
            CONCAT_WS('\\n',
              CONCAT('모집 인원: ', IFNULL(c.RECRUIT_COUNT, 0)),
              CONCAT('신청 수(전체): ', IFNULL(a.total_app, 0)),
              CONCAT('상태별: ', IFNULL(a.status_breakdown, '없음')),
              CONCAT('선정(당첨) 수: ', IFNULL(a.approved_cnt, 0)),
              CONCAT('리뷰 제출 수: ', IFNULL(r.review_cnt, 0)),
              CONCAT('북마크 수: ', IFNULL(bm.bookmark_cnt, 0)),
              CONCAT('경쟁률(신청/모집): ',
                     IFNULL(a.total_app, 0), ' / ', IFNULL(NULLIF(c.RECRUIT_COUNT,0), 0))
            ) AS content
          FROM tb_campaign c
          LEFT JOIN (
            SELECT
              t.CAMPAIGN_IDX,
              SUM(cnt) AS total_app,
              GROUP_CONCAT(CONCAT(t.APPLY_STATUS_CODE, ':', t.cnt) ORDER BY t.cnt DESC SEPARATOR ',') AS status_breakdown,
              SUM(CASE WHEN t.APPLY_STATUS_CODE='CAMAPP_APPROVED' AND t.DEL_YN='N' THEN t.cnt ELSE 0 END) AS approved_cnt
            FROM (
              SELECT CAMPAIGN_IDX, APPLY_STATUS_CODE, DEL_YN, COUNT(*) AS cnt
              FROM tb_campaign_application
              GROUP BY CAMPAIGN_IDX, APPLY_STATUS_CODE, DEL_YN
            ) t
            GROUP BY t.CAMPAIGN_IDX
          ) a ON a.CAMPAIGN_IDX = c.CAMPAIGN_IDX
          LEFT JOIN (
            SELECT ca.CAMPAIGN_IDX, COUNT(r.REVIEW_IDX) AS review_cnt
            FROM tb_review r
            JOIN tb_campaign_application ca ON ca.APPLICATION_IDX = r.APPLICATION_IDX
            GROUP BY ca.CAMPAIGN_IDX
          ) r ON r.CAMPAIGN_IDX = c.CAMPAIGN_IDX
          LEFT JOIN (
            SELECT CAMPAIGN_IDX, COUNT(*) AS bookmark_cnt
            FROM tb_bookmark
            GROUP BY CAMPAIGN_IDX
          ) bm ON bm.CAMPAIGN_IDX = c.CAMPAIGN_IDX
          WHERE IFNULL(c.DEL_YN, 'N')='N'
        """,
    },

    # 7) 지역 추론 + 요약 (주소 → 시/도)
    {
        "name": "campaign_by_region",
        "sql": """
          SELECT
            c.CAMPAIGN_IDX AS id,
            CONCAT('[지역별 캠페인] ', c.TITLE) AS title,
            CONCAT_WS('\\n',
              CONCAT('지역: ',
                CASE
                  WHEN v.ADDRESS LIKE '%서울%' THEN '서울'
                  WHEN v.ADDRESS LIKE '%경기%' THEN '경기'
                  WHEN v.ADDRESS LIKE '%인천%' THEN '인천'
                  WHEN v.ADDRESS LIKE '%부산%' THEN '부산'
                  WHEN v.ADDRESS LIKE '%대구%' THEN '대구'
                  WHEN v.ADDRESS LIKE '%광주%' THEN '광주'
                  WHEN v.ADDRESS LIKE '%대전%' THEN '대전'
                  WHEN v.ADDRESS LIKE '%울산%' THEN '울산'
                  WHEN v.ADDRESS LIKE '%세종%' THEN '세종'
                  WHEN v.ADDRESS LIKE '%강원%' THEN '강원'
                  WHEN v.ADDRESS LIKE '%충북%' THEN '충북'
                  WHEN v.ADDRESS LIKE '%충남%' THEN '충남'
                  WHEN v.ADDRESS LIKE '%전북%' THEN '전북'
                  WHEN v.ADDRESS LIKE '%전남%' THEN '전남'
                  WHEN v.ADDRESS LIKE '%경북%' THEN '경북'
                  WHEN v.ADDRESS LIKE '%경남%' THEN '경남'
                  WHEN v.ADDRESS LIKE '%제주%' THEN '제주'
                  ELSE '온라인/전국'
                END
              ),
              CONCAT('캠페인 유형: ', IFNULL(c.CAMPAIGN_TYPE,'')),
              CONCAT('카테고리: ', IFNULL(c.CAM_CATE_CODE,'')),
              CONCAT('채널: ', IFNULL(c.CHANNEL_CODE,'')),
              CONCAT('모집 기간: ',
                     DATE_FORMAT(c.APPLY_START_DATE,'%Y-%m-%d'), ' ~ ',
                     DATE_FORMAT(c.APPLY_END_DATE,'%Y-%m-%d')),
              CONCAT('모집 상태: ', c.RECRUIT_STATUS)
            ) AS content
          FROM tb_campaign c
          LEFT JOIN tb_campaign_visit v ON v.CAMPAIGN_IDX=c.CAMPAIGN_IDX
          WHERE IFNULL(c.DEL_YN,'N')='N'
        """,
    },

    # 8) 사람 친화 라벨 (코드명 → 한글명)
    {
        "name": "campaign_human_labels",
        "sql": """
          SELECT
            c.CAMPAIGN_IDX AS id,
            CONCAT('[라벨] ', c.TITLE) AS title,
            CONCAT_WS('\\n',
              CONCAT('유형: ', (SELECT code_nm FROM tb_common_code WHERE code_id=c.CAMPAIGN_TYPE LIMIT 1)),
              CONCAT('카테고리: ', (SELECT code_nm FROM tb_common_code WHERE code_id=c.CAM_CATE_CODE LIMIT 1)),
              CONCAT('채널: ', (SELECT code_nm FROM tb_common_code WHERE code_id=c.CHANNEL_CODE LIMIT 1))
            ) AS content
          FROM tb_campaign c
          WHERE IFNULL(c.DEL_YN,'N')='N'
        """,
    },

    # 9) 통합 개요 (상태/기간 파생 + 통계 + 키워드)
  {
    "name": "campaign_overview_stats",
    "sql": """
          SELECT
            c.CAMPAIGN_IDX AS id,
            CONCAT('[캠페인 요약] ', c.TITLE) AS title,
            CONCAT_WS('\\n',
              CONCAT('모집 상태: ', c.RECRUIT_STATUS),
              CONCAT('모집 인원: ', IFNULL(c.RECRUIT_COUNT,0)),
              CONCAT('모집 기간: ',
                     DATE_FORMAT(c.APPLY_START_DATE,'%Y-%m-%d'), ' ~ ',
                     DATE_FORMAT(c.APPLY_END_DATE,'%Y-%m-%d')),
              CONCAT('체험 기간: ',
                     DATE_FORMAT(c.EXP_START_DATE,'%Y-%m-%d'), ' ~ ',
                     DATE_FORMAT(c.EXP_END_DATE,'%Y-%m-%d')),
              CONCAT('리뷰 마감: ', DATE_FORMAT(c.DEADLINE_DATE,'%Y-%m-%d')),
              CONCAT('신청 수: ', IFNULL(a.total_app,0),
                     ' (대기 ', IFNULL(a.pending_cnt,0),
                     ', 당첨 ', IFNULL(a.approved_cnt,0),
                     ', 탈락 ', IFNULL(a.rejected_cnt,0),
                     ', 취소 ', IFNULL(a.cancel_cnt,0), ')'),
              CONCAT('리뷰 제출 수: ', IFNULL(rv.review_cnt,0)),
              CONCAT('북마크 수: ', IFNULL(bm.bookmark_cnt,0)),
              CONCAT('키워드: ', TRIM(CONCAT_WS(', ',
                   NULLIF(c.KEYWORD_1,''), NULLIF(c.KEYWORD_2,''), NULLIF(c.KEYWORD_3,''))))
            ) AS content
          FROM tb_campaign c
          LEFT JOIN (
            SELECT
              t.CAMPAIGN_IDX,
              SUM(cnt) AS total_app,
              SUM(CASE WHEN t.APPLY_STATUS_CODE='CAMAPP_PENDING'  AND t.DEL_YN='N' THEN t.cnt ELSE 0 END) AS pending_cnt,
              SUM(CASE WHEN t.APPLY_STATUS_CODE='CAMAPP_APPROVED' AND t.DEL_YN='N' THEN t.cnt ELSE 0 END) AS approved_cnt,
              SUM(CASE WHEN t.APPLY_STATUS_CODE='CAMAPP_REJECTED' AND t.DEL_YN='N' THEN t.cnt ELSE 0 END) AS rejected_cnt,
              SUM(CASE WHEN t.APPLY_STATUS_CODE='CAMAPP_CANCEL'   AND t.DEL_YN='N' THEN t.cnt ELSE 0 END) AS cancel_cnt
            FROM (
              SELECT CAMPAIGN_IDX, APPLY_STATUS_CODE, DEL_YN, COUNT(*) AS cnt
              FROM tb_campaign_application
              GROUP BY CAMPAIGN_IDX, APPLY_STATUS_CODE, DEL_YN
            ) t
            GROUP BY t.CAMPAIGN_IDX
          ) a ON a.CAMPAIGN_IDX = c.CAMPAIGN_IDX
          LEFT JOIN (
            SELECT ca.CAMPAIGN_IDX, COUNT(r.REVIEW_IDX) AS review_cnt
            FROM tb_review r
            JOIN tb_campaign_application ca ON ca.APPLICATION_IDX = r.APPLICATION_IDX
            GROUP BY ca.CAMPAIGN_IDX
          ) rv ON rv.CAMPAIGN_IDX = c.CAMPAIGN_IDX
          LEFT JOIN (
            SELECT CAMPAIGN_IDX, COUNT(*) AS bookmark_cnt
            FROM tb_bookmark
            GROUP BY CAMPAIGN_IDX
          ) bm ON bm.CAMPAIGN_IDX = c.CAMPAIGN_IDX
          WHERE IFNULL(c.DEL_YN,'N')='N'
        """,
  },

  # 10) 이용 가이드(정적 문서)
    {
        "name": "guides",
        "sql": """
          SELECT
            1 AS id,
            'Revory 이용 가이드' AS title,
            CONCAT_WS('\\n',
              '1) 회원가입/로그인 (개인정보는 색인/노출하지 않습니다)',
              '2) 리뷰어 프로필/채널 등록: 활동지역/주제, 채널 URL 등록',
              '3) 캠페인 선택: 모집 인원/기간/미션/혜택/키워드 확인',
              '4) 신청: 신청 사유 작성 → 기간 내 지원',
              '5) 발표 확인: ANNOUNCE_DATE에 결과 확인(신청 상태 코드 참고)',
              '6) 체험/리뷰: EXP 기간 동안 미션 수행 → DEADLINE_DATE까지 리뷰 URL 제출',
              '',
              '- 지역/유형/채널/상태별 검색이 가능합니다.',
              '- 경쟁률/신청자/선정/리뷰/북마크는 통계 문서에 집계됩니다.'
            ) AS content
        """,
    },
]

# ─────────────────────────────────────────────────────────
# 임베딩 & 청킹
# ─────────────────────────────────────────────────────────
def embed(texts: list[str]) -> list[list[float]]:
    res = client.embeddings.create(model="text-embedding-3-large", input=texts)
    return [d.embedding for d in res.data]

def chunk(text: str, size=1200, overlap=350):
    """문장 경계 기반 + 넉넉한 오버랩으로 문맥 보존"""
    text = (text or "").strip()
    if not text:
        return []
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
        prev = out[i - 1] if i > 0 else ""
        merged = (prev[-overlap:] + "\n" if prev else "") + out[i]
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
                title = (r.get("title") or "").strip()
                content = (r.get("content") or "").strip()
                chunks = chunk(content)

                for idx, c in enumerate(chunks):
                    # 본문에 출처 표기 넣지 않음(잡음 방지)
                    doc_text = f"### {title}\n\n{c}" if title else c
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
    try:
        print("collection count =", col.count())
    except Exception as e:
        print("collection count error:", e)

def _flush(docs, metas, ids):
    embs = embed(docs)
    col.upsert(documents=docs, metadatas=metas, ids=ids, embeddings=embs)
    print(f"  - batch upsert: {len(ids)}")

# ─────────────────────────────────────────────────────────
# (선택) 소개 1건 씨드
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
    doc = f"### {title}\n\n{content}"
    emb = embed([doc])[0]
    col.upsert(
        documents=[doc],
        metadatas=[{"source": "site", "source_id": about_id, "title": title}],
        ids=[about_id],
        embeddings=[emb],
    )
    print("Upserted about page.")

if __name__ == "__main__":
    # 포맷/메타 구조 바꾸면 CHROMA_DIR 삭제 후 재색인
    upsert_sources()
    upsert_about_revory()
