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
 * 캠페인 등록 API
 * @param {Object} formData 캠페인 등록 폼 데이터
 * @param {string} token 로그인한 사용자의 JWT
 * @returns {Promise} Axios Promise
 */
export function createCampaign(formData, token) {
  return axios.post(
    "/api/campaigns", // 캠페인 등록 URL
    formData,         // POST body, JSON 자동 변환
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // JWT
      },
    }
  );
}
