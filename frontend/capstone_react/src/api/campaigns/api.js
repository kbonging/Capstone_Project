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
 * 모든 캠페인 목록을 가져옵니다.
 * @param {string} token - 인증 토큰
 * @returns {Promise<Array<Object>>} 캠페인 목록
 */
/**
 * 모든 캠페인 목록을 가져옵니다.
 * @param {string} token - 인증 토큰
 * @returns {Promise<Array<Object>>} 캠페인 목록
 */
export async function getCampaignsList(token) {
    try {
        const response = await axios.get(`/api/campaigns`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("API 호출 오류:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || '캠페인 목록을 가져오는 데 실패했습니다.');
    }
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

/**
 * 특정 캠페인의 상태를 변경합니다.
 * @param {number} campaignIdx - 캠페인 ID
 * @param {string} status - 변경할 상태 ('APPROVED' 또는 'REJECTED')
 * @param {string} token - 인증 토큰
 * @returns {Promise<Object>} API 응답 데이터
 */
export async function updateCampaignStatus(campaignIdx, status, token) {
    try {
        const response = await axios.patch(`/api/campaigns/status`,
            { campaignIdx, status },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("상태 업데이트 중 오류 발생:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || '상태 변경에 실패했습니다.');
    }
}


// 캠페인 신청 페이지 정보 조회 (fetch + 토큰)
export async function getApplyPage(campaignId, token) {
  const _token = token ?? localStorage.getItem("accessToken"); // ★ 자동 보완
  const res = await fetch(`/api/campaigns/${campaignId}/apply-page`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(_token ? { Authorization: `Bearer ${_token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// 캠페인 신청 (지원하는)
export async function createApplication(campaignId, body, token) {
  const res = await fetch(`/api/campaigns/${campaignId}/applications`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}