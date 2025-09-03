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
export async function getCampaignsList(token) {
  try {
    const response = await fetch(`/campaigns`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      // HTTP 상태 코드가 200번대가 아닐 경우 에러 처리
      const errorData = await response.json();
      throw new Error(errorData.message || '캠페인 목록을 가져오는 데 실패했습니다.');
    }

    // 서버 응답에서 JSON 데이터를 올바르게 파싱
    const data = await response.json();
    return data;

  } catch (error) {
    console.error("API 호출 오류:", error);
    throw error;
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
 * @returns {Promise<Object>} API 응답 데이터
 */
export async function updateCampaignStatus(campaignIdx, status, token) {
    try {
        const response = await fetch(`/campaigns/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ${token}',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ campaignIdx, status }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '상태 변경에 실패했습니다.');
        }

        return await response.json();
    } catch (error) {
        console.error("상태 업데이트 중 오류 발생:", error);
        throw error;
    }
}