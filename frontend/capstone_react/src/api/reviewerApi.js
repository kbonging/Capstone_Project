import axios from "axios";

// 리뷰어 회원가입
export function signUpReviewer(formData) {
    return axios.post("/api/reviewer", formData, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}


// src/api/reviewerApi.js
// http.js 없이, 순수 fetch만 사용

const BASE_URL = import.meta?.env?.VITE_API_BASE_URL || "";
const buildUrl = (path) =>
  `${BASE_URL.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    ""
  );
}

async function handleResponse(res) {
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; }
  catch { data = text; }
  if (!res.ok) {
    const msg = (data && data.message) || data || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

/** 진행중 캠페인 목록 */
export async function fetchRunningCampaigns({ token = getToken(), withCredentials = true } = {}) {
  if (!token) throw new Error("로그인이 필요합니다.");

  const res = await fetch(buildUrl("/api/reviewer/running-campaigns"), {
    method: "GET",
    headers: {
      Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
    },
    credentials: withCredentials ? "include" : "same-origin",
  });
  return handleResponse(res);
}

/** 취소 생성 (multipart/form-data) */
export async function createCancel(
  { type, campaignId, reason, files = [] },
  { token = getToken(), withCredentials = true } = {}
) {
  if (!token) throw new Error("로그인이 필요합니다.");

  const fd = new FormData();
  fd.append("type", type);
  fd.append("campaignId", String(campaignId));
  if (reason) fd.append("reason", reason);
  files.forEach((f) => fd.append("images", f)); // @RequestPart("images")와 일치

  const res = await fetch(buildUrl("/api/reviewer/cancels"), {
    method: "POST",
    headers: {
      Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
      // ⚠️ Content-Type 절대 지정하지 말 것! (boundary 자동)
    },
  // ✅ 진짜 FormData를 그대로 보냄
    body: fd,
    credentials: withCredentials ? "include" : "same-origin",
  });

  return handleResponse(res);
}

