// src/api/community.js

function toQuery(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    q.set(k, v);
  });
  return q.toString();
}

function stripHtml(html = "") {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || "").trim();
}

function summarize(text = "", max = 60) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : t.slice(0, max) + "…";
}

export async function getCommunities({
  page = 1,
  recordCount = 10,
  categoryId = "",
  searchKeyword = "",
  searchCondition = "",
  showMycommunitiesParam = "",
  sort = "",
} = {}) {
  const qs = toQuery({
    page,
    recordCount,
    categoryId,
    searchKeyword,
    searchCondition,
    showMycommunitiesParam,
    sort,
  });

  const res = await fetch(`/api/community?${qs}`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`커뮤니티 목록 호출 실패 (${res.status}) ${text}`);
  }

  const data = await res.json();
  const list = Array.isArray(data.communityList)
    ? data.communityList
    : Array.isArray(data.list)
    ? data.list
    : Array.isArray(data.items)
    ? data.items
    : [];

  return { ...data, list };
}

export function mapCommunityForNews(raw) {
  const id = raw?.communityIdx;
  const title = raw?.title ?? "";
  const desc = summarize(stripHtml(raw?.content ?? ""), 60);

  // ✅ 서버가 내려주는 사람이 읽는 이름(codeNm)이 있으면 그걸 우선 배지로 사용
  const badge = raw?.codeNm || raw?.categoryId || "소식";

  return {
    id,
    badge,          // "공지"가 바로 표시됨
    title,
    desc,
    href: `/community/${id}`,
  };
}
