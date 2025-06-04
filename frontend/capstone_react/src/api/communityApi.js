// src/api/communityApi.js
import axios from "axios";

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
