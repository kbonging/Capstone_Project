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

export function getCommentsByCommunity(communityIdx, token) {
  return axios.get(`/api/community/${communityIdx}/comments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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