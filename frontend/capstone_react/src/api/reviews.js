// src/api/reviews.js
export async function postReviewProof({ token, campaignId, reviewUrl, file }) {
  const form = new FormData();
  form.append("reviewUrl", reviewUrl);
  form.append("file", file); // 서버에서 @RequestParam("file") MultipartFile file

  const res = await fetch(`/api/campaigns/${campaignId}/reviews`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "업로드 실패");
  }
  return res.json().catch(() => ({}));
}
