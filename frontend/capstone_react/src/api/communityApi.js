// src/api/communityApi.js
import axios from "axios";

// 게시판 전체 목록
export async function fetchCommunityPosts(token, queryString) {
  const res = await fetch(`/api/community?${queryString}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "게시판 데이터를 불러오는 데 실패했습니다.");
  }

  return res.json();
}

/**
 * 공통 댓글 조회 함수
 * @param {string} type     - "COMMT001" (커뮤니티 댓글) 또는 "COMMT002" (캠페인 댓글)
 * @param {number|string} idx - 해당 글의 고유번호
 * @param {string} token    - 로그인 시 발급받은 Bearer 토큰
 * @returns {Promise}       - 댓글 데이터 배열이 담긴 axios Response
 */
export function getCommentsByCommunity(type, communityIdx, token) {
  return axios.get(`/api/comments/${type}/${communityIdx}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
}

// 댓글 등록
export function postComment(data, token) {
  return axios.post("/api/comments", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// 댓글 삭제
export async function deleteComment(commentIdx, token) {
  return fetch(`/api/comments/${commentIdx}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

//댓글 수정
export async function updateComment(commentIdx, body, token) {
  return fetch(`/api/comments/${commentIdx}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}


// 게시글 상세 조회
export function getCommunityDetail(communityIdx, token) {
  return axios.get(`/api/community/${communityIdx}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// 게시글 등록
export function createPost(formData, token) {
  return axios.post(
    "/api/community", // URL
    formData,         // POST body (자동으로 JSON.stringify 됨)
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

// 게시글 수정
export function updatePost(communityIdx, formData, token){
  return axios.put(
    `/api/community/${communityIdx}`, // URL
    formData,         
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

// 좋아요 추가
export function addLike(communityIdx, token) {
  return axios.post(`/api/community/like/${communityIdx}`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// 좋아요 취소
export function deleteLike(communityIdx, token) {
  return axios.delete(`/api/community/like/${communityIdx}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}