// src/features/campaigns/api.js
export async function getCampaignDetail(id) {
  const res = await fetch(`/api/campaigns/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
