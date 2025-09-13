// src/features/campaigns/api.js
import axios from "axios";

export async function getCampaignDetail(id) {
  const token = localStorage.getItem("token"); // 토큰 가져오기

  // fetch 옵션에 Authorization 헤더 추가
  const res = await fetch(`/api/campaigns/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, // JWT 토큰을 헤더에 포함
      "Content-Type": "application/json",
    },
    // credentials: "include" 옵션은 제거
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * 캠페인 목록을 가져옵니다. (일반 사용자용)
 * - 검색, 필터, 페이지네이션 지원
 *
 * @param {string} token - 인증 토큰
 * @param {string} [queryString] - 검색/필터/페이지네이션 쿼리스트링
 * @returns {Promise<Array<Object>>} 캠페인 목록
 */
export async function getCampaignsList(token, queryString = "") {
  try {
    const response = await axios.get(
      `/api/campaigns${queryString ? `?${queryString}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("API 호출 오류:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message ||
        "캠페인 목록을 가져오는 데 실패했습니다."
    );
  }
}

/**
 * 소상공인 캠페인 목록을 가져옵니다. (OWNER 전용)
 * - 본인이 등록한 캠페인만 조회 가능
 * - 검색, 필터, 페이지네이션 지원
 *
 * @param {string} token - 인증 토큰 (OWNER 권한 필요)
 * @param {string} [queryString] - 검색/필터/페이지네이션 쿼리스트링
 * @returns {Promise<Array<Object>>} 소상공인 캠페인 목록
 */
export async function getOwnerCampaignsList(token, queryString = "") {
  try {
    const response = await axios.get(
      `/api/campaigns/owner${queryString ? `?${queryString}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("API 호출 오류:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message ||
        "[소상공인] 캠페인 목록을 가져오는 데 실패했습니다."
    );
  }
}

/**
 * 관리자 캠페인 목록을 가져옵니다. (ADMIN 전용)
 * - 승인 대기/승인/반려 상태를 포함한 캠페인 전체 조회 가능
 * - 검색, 필터, 페이지네이션 지원
 *
 * @param {string} token - 인증 토큰 (ADMIN 권한 필요)
 * @param {string} [queryString] - 검색/필터/페이지네이션 쿼리스트링
 * @returns {Promise<Array<Object>>} 관리자용 캠페인 목록
 */
export async function getAdminCampaignsList(token, queryString = "") {
  try {
    const response = await axios.get(
      `/api/campaigns/admin${queryString ? `?${queryString}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("API 호출 오류:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message ||
        "[관리자] 캠페인 목록을 가져오는 데 실패했습니다."
    );
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
 * 캠페인 수정 API (파일 업로드 포함)
 * @param {number|string} campaignIdx 수정할 캠페인 ID
 * @param {Object} formData 캠페인 수정 폼 데이터 (JSON)
 * @param {string} token 로그인한 사용자의 JWT
 * @returns {Promise} Axios Promise
 */
export function updateCampaign(campaignIdx, formData, token) {
  const data = new FormData();

  // JSON 데이터를 Blob 형태로 추가
  data.append(
    "request",
    new Blob([JSON.stringify(formData)], { type: "application/json" })
  );

  // 파일이 새로 업로드된 경우만 추가
  if (formData.thumbnailFile) {
    data.append("thumbnail", formData.thumbnailFile);
  }

  return axios.put(`/api/campaigns/${campaignIdx}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * 캠페인 삭제 API
 * @param {number|string} campaignIdx 삭제할 캠페인 ID
 * @param {string} token 로그인한 사용자의 JWT
 * @returns {Promise} Axios Promise
 */
export function deleteCampaign(campaignIdx, token) {
  return axios.delete(`/api/campaigns/${campaignIdx}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}



/**
 * 관리자가 캠페인의 상태(대기, 승인, 반려)를 변경합니다.
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


export class HttpError extends Error {
  constructor(status, message, body) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.body = body;
  }
}

// 공용 처리(이 모듈 내부 전용)
async function call(url, options = {}) {
  const res = await fetch(url, options);
  const ct = res.headers.get("content-type") || "";

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    let body = null;
    try {
      if (ct.includes("application/json")) {
        body = await res.json();
        message = body?.message || body?.error || message;
      } else {
        const t = await res.text();
        if (t) message = t.slice(0, 200);
      }
    } catch {
      /* ignore */
    }
    throw new HttpError(res.status, message, body);
  }

  return ct.includes("application/json") ? res.json() : res.text();
}

const BASE = "/api/campaigns";

export function getApplyPage(id, token) {
  return call(`${BASE}/${id}/apply-page`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export function createApplication(id, payload, token) {
  return call(`${BASE}/${id}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
}
// ------------------- 캠페인 신청자 목록, 상태 ---------------------

/**
 * 캠페인 신청자 목록 조회
 * @param {string} token - 인증 토큰
 * @param {number} campaignIdx - 캠페인 고유번호
 * @param {object} params - { page, searchCondition, searchKeyword, applyStatus }
 * @returns {Promise<{ applicantList: Array, paginationInfo: Object }>}
 */
export const getApplicantsByCampaign = (token, campaignIdx, params) => {
  return axios
    .get(`/api/campaigns/applicants/${campaignIdx}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params, // query string으로 자동 변환
    })
    .then((res) => res.data);
};

/**
 * 신청자 상태 변경
 * @param {number} applicationIdx - 신청자 고유번호
 * @param {string} newStatus - CAMAPP_APPROVED | CAMAPP_REJECTED
 * @param {string} token - 인증 토큰
 * @returns {Promise<void>}
 */
export const updateApplicantsStatus = (applicationIdx, newStatus, token) => {
  return axios.put(
    `/api/campaigns/applicants/${applicationIdx}`,
    { status: newStatus },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

// ------------------------- 찜(북마크) ---------------------------

/**
 * 찜했는지 상태 확인
 * @param {number} campaignIdx
 * @param {string} token
 * @returns {Promise<{bookmarked: boolean}>}
 */
export async function getBookmarkStatus(campaignIdx, token) {
  try {
    const response = await axios.get(`/api/campaigns/bookmarks/${campaignIdx}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("찜 상태 확인 실패:", error.response?.data || error.message);
    throw error;
  }
}

/**
 * 북마크 추가
 * @param {number} campaignIdx
 * @param {string} token
 */

export async function addBookmark(campaignIdx, token) {
  if (!token) throw new Error("로그인이 필요합니다.");

  try {
    const response = await axios.post(
      `/api/campaigns/bookmarks/${campaignIdx}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("찜 추가 실패:", error.response?.data || error.message);
    throw error;
  }
}

/**
 * 북마크 취소
 * @param {number} campaignIdx
 * @param {string} token
 */
export async function removeBookmark(campaignIdx, token) {
  try {
    const response = await axios.delete(`/api/campaigns/bookmarks/${campaignIdx}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("찜 취소 실패:", error.response?.data || error.message);
    throw error;
  }
}

// ------------------- 내 체험단 목록, 신청 취소 ---------------------
export async function getMyCampaigns({ token, channel, status, q, page = 1 }) {
  const res = await axios.get(`/api/mypage/my-campaigns`, {
    params: { channel, status, q, page },
    headers: { Authorization: `Bearer ${token}` },
  });

  const ct = res.headers?.["content-type"] || "";
  if (ct.includes("text/html")) {
    throw new Error("API가 아닌 HTML이 반환되었습니다. API 경로/프록시 설정을 확인하세요.");
  }

  const data = res.data ?? {};
  const content = data.content ?? data.list ?? data.campaignList ?? [];
  const pi = data.paginationInfo ?? data.pageInfo ?? null;
  const totalPages = data.totalPages ?? pi?.totalPage ?? 1;
  const totalElements = data.totalElements ?? pi?.totalRecord ?? content.length;
  const number = (data.number != null) ? data.number + 1 : (pi?.currentPage ?? 1);
  return { content, totalPages, totalElements, number };
}

export async function cancelMyApplication({ token, applicationIdx }) {
  const res = await axios.post(
    `/api/mypage/my-campaigns/${applicationIdx}/cancel`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}
//---------------------------------------------------//




// ------------------- 리뷰 작성 권한 확인 ---------------------
export async function getReviewAccess(campaignId, token) {
  const res = await fetch(`/api/campaigns/${campaignId}/reviews/access`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new HttpError(res.status, body?.message || "권한 확인 실패", body);
  }
  return body; // { allowed: true, status: "CAMAPP_APPROVED" }
}