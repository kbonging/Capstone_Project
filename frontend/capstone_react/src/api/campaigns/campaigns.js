// src/api/campaigns.js
import { toAbsoluteUrl } from "../../utils/url";

/* ===========================
 * 카테고리 ↔ 코드 매핑
 *  - CAMP001=방문형, CAMP002=포장형, CAMP003=배송형, CAMP004=구매형
 * =========================== */
const CAT_TO_CODE = {
  "배송형": "CAMP003",
  "방문형": "CAMP001",
  "포장형": "CAMP002",
  "구매형": "CAMP004",
};
export function toCampaignTypeCode(label) {
  return CAT_TO_CODE[label] || "";
}

/* ===========================
 * 공통: 쿼리스트링 빌더
 * =========================== */
function toQuery(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    q.set(k, v);
  });
  return q.toString();
}

/* ===========================
 * 목록 API
 *  - 서버 응답 키(campaignList | list | items) 다양성 대응
 *  - 프론트에서는 항상 data.list만 사용하게 통일
 * =========================== */
export async function getCampaigns({
  page = 1,
  recordCount = 12,
  sort = "latest",       // latest | popular | deadline (서버에서 처리)
  campaignType = "",     // CAMP00X
  region = "",
  searchKeyword = "",
  showMyParam = "",
} = {}) {
  const qs = toQuery({
    page,
    recordCount,
    sort,
    campaignType,
    region,
    searchKeyword,
    showMyParam,
  });

  const res = await fetch(`/api/campaigns?${qs}`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`캠페인 목록 호출 실패 (${res.status}) ${text}`);
  }

  const data = await res.json();

  const list = Array.isArray(data.campaignList)
    ? data.campaignList
    : Array.isArray(data.list)
    ? data.list
    : Array.isArray(data.items)
    ? data.items
    : [];

  return {
    ...data,
    list, // ← 프론트는 항상 이걸 씀
  };
}

/* ===========================
 * 날짜/남은일 계산 유틸
 *  - 클라이언트 타임존에 따른 시차 오차를 줄이기 위해
 *    '오늘 자정' 기준으로 비교
 * =========================== */
function parseDateYYYYMMDD(d) {
  if (!d) return null;
  // 문자열(YYYY-MM-DD) → 로컬 타임존 00:00 Date
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
  if (!m) return null;
  const [_, y, mo, da] = m;
  return new Date(Number(y), Number(mo) - 1, Number(da));
}
function daysLeftFromToday(targetDateStr) {
  const target = parseDateYYYYMMDD(targetDateStr);
  if (!target) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 00:00
  const diffMs = target - today;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/* ===========================
 * 단일 아이템 → 카드표준 모델 매핑
 *  - 응답 다양성/필드명 차이 흡수
 *  - 썸네일은 절대 URL로 보정
 *  - ❤️ likes는 bookmarkCount/likeCount 등 다양한 키를 안전하게 수용
 * =========================== */
export function mapCampaignForCard(raw) {
  // 우선순위: applyEndDate(모집 마감) → 없으면 deadlineDate(내부 관리용)
  const daysLeft =
    typeof raw?.daysLeft === "number"
      ? raw.daysLeft
      : (function () {
          const end = raw?.applyEndDate || raw?.deadlineDate;
          const d = daysLeftFromToday(end);
          return Number.isFinite(d) ? d : null;
        })();

  const absoluteThumb =
    raw?.thumbnailUrl ? toAbsoluteUrl(raw.thumbnailUrl) : "/assets/placeholder.webp";

  // 지역 합성 (address + addressDetail)
  const region =
    raw?.addressDetail
      ? `${raw?.address ?? ""} ${raw?.addressDetail ?? ""}`.trim()
      : (raw?.address ?? raw?.region ?? "");

  return {
    // 필수
    campaignIdx: raw?.campaignIdx,
    title: raw?.title ?? "",
    subtitle: raw?.mission ?? raw?.benefitDetail ?? "",
    thumbnailUrl: absoluteThumb,

    // 상태/지표
    applicants: raw?.applicants ?? 0,            // 현재 지원자 수
    applyLimit: raw?.recruitCount ?? null,       // 모집 정원
    likes:
      raw?.bookmarkCount ??                      //  서버에서 하트=북마크
      raw?.likeCount ??
      raw?.favorites ??
      raw?.heartCount ??
      raw?.likes ??
      0,

    // 메타
    channelName: raw?.channelName ?? "",
    campaignTypeName: raw?.campaignTypeName ?? raw?.campaignType ?? "",
    categoryName: raw?.categoryName ?? raw?.categoryCode ?? "",
    region,

    // 일정
    applyStartDate: raw?.applyStartDate ?? null,
    applyEndDate: raw?.applyEndDate ?? null,
    expStartDate: raw?.expStartDate ?? null,
    expEndDate: raw?.expEndDate ?? null,
    announceDate: raw?.announceDate ?? null,
    deadlineDate: raw?.deadlineDate ?? null,

    // 표시용
    isClosed: typeof daysLeft === "number" && daysLeft < 0,
    daysLeft,
    badgeLeft: raw?.badgeLeft ?? [],

    // 원본 보존해두고 싶으면(optional)
    // __raw: raw,
  };
}

/* ===========================
 * 전시관(Section4)용 이미지 목록
 *  - 목록 호출→카드매핑→썸네일만 추출
 *  - mapCampaignForCard에서 이미 절대 URL로 보정했으니
 *    여기선 그대로 사용
 * =========================== */
export async function getGalleryImages({
  limit = 24,
  sort = "popular",          // latest | popular | deadline
  campaignType = "",         // CAMP001~4
  region = "",               // 예: "서울"
} = {}) {
  const { list } = await getCampaigns({
    page: 1,
    recordCount: limit,
    sort,
    campaignType, // 예: toCampaignTypeCode("방문형")
    region,
  });

  const urls = list
    .map(mapCampaignForCard)
    .map((c) => c.thumbnailUrl)        // 이미 절대 URL
    .filter(Boolean);

  // 간단 중복 제거
  return Array.from(new Set(urls));
}
