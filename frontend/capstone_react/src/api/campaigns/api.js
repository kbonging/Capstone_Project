// src/features/campaigns/api.js
import axios from "axios";

export async function getCampaignDetail(id) {
  const res = await fetch(`/api/campaigns/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * 캠페인 등록 API (파일 업로드 포함)
 * @param {Object} formData 캠페인 등록 폼 데이터 (JSON)
 * @param {File} thumbnailFile 업로드할 파일
 * @param {string} token 로그인한 사용자의 JWT
 * @returns {Promise} Axios Promise
 */
export function createCampaign(formData, token) {
  const data = new FormData();

  // JSON 데이터를 Blob 형태로 추가
  data.append(
    "request",
    new Blob([JSON.stringify(formData)], { type: "application/json" })
  );

  // 파일 추가
  if (formData.thumbnailFile) {
    data.append("thumbnail", formData.thumbnailFile);
  }

  return axios.post("/api/campaigns", data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
}
