// src/api/campaigns.js


import { toAbsoluteUrl } from "../../utils/url";

/**
 * 전시관(Section4)용 이미지 목록 추출
 * - 백엔드 응답의 thumbnailUrl을 카드 매핑 후 뽑아낸다
 * - 필요하면 campaignType/region/sort로 필터링
 */
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

  // 카드 표준화 후 썸네일만 추출 + 절대 URL 보정 + 중복 제거 + 빈값 제거
  const urls = list
    .map(mapCampaignForCard)
    .map((c) => toAbsoluteUrl(c.thumbnailUrl))
    .filter(Boolean);

  // 간단 중복 제거
  const uniq = Array.from(new Set(urls));
  return uniq;
}


// 백엔드 코드 기준 매핑 (예시 응답 참조)
// CAMP001=방문형, CAMP002=포장형, CAMP003=배송형, CAMP004=구매형(있다면)
const CAT_TO_CODE = {
  "배송형": "CAMP003",
  "방문형": "CAMP001",
  "포장형": "CAMP002",
  "구매형": "CAMP004",
};

export function toCampaignTypeCode(label) {
  return CAT_TO_CODE[label] || "";
}

function toQuery(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    q.set(k, v);
  });
  return q.toString();
}

export async function getCampaigns({
  page = 1,
  recordCount = 12,
  sort = "latest",       // latest | popular | deadline (서버가 처리)
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

  // ✅ 서버 응답 호환: campaignList | list | items
  const list = Array.isArray(data.campaignList)
    ? data.campaignList
    : Array.isArray(data.list)
    ? data.list
    : Array.isArray(data.items)
    ? data.items
    : [];

  return {
    ...data,
    list, // 프론트는 항상 data.list만 참조하게 통일
  };
}

export function mapCampaignForCard(raw) {
  const daysLeft = (() => {
    if (typeof raw?.daysLeft === "number") return raw.daysLeft;
    const end = raw?.applyEndDate || raw?.deadlineDate;
    if (!end) return null;
    const d = Math.ceil((new Date(end) - new Date()) / (1000 * 60 * 60 * 24));
    return isNaN(d) ? null : d;
  })();

  return {
    campaignIdx: raw?.campaignIdx,
    title: raw?.title ?? "",
    subtitle: raw?.mission ?? raw?.benefitDetail ?? "",
    thumbnailUrl: raw?.thumbnailUrl ?? "/assets/placeholder.webp",

    applicants: raw?.applicants ?? 0,
    applyLimit: raw?.recruitCount ?? null,
    likes: raw?.likes ?? 0,

    channelName: raw?.channelName ?? "",
    campaignTypeName: raw?.campaignTypeName ?? raw?.campaignType ?? "",
    categoryName: raw?.categoryName ?? raw?.categoryCode ?? "",
    region: raw?.address ?? raw?.region ?? "",

    rewardLabel: raw?.rewardLabel ?? "",
    rewardPoint: raw?.rewardPoint ?? null,
    isClosed: typeof daysLeft === "number" && daysLeft < 0,
    daysLeft,
    badgeLeft: raw?.badgeLeft ?? [],
  };
}
