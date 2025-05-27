// src/api/communityApi.js
// 나중에 실제 서버 URL로 바꿔 주세요
const BASE_URL = 'http://localhost:4000';

export async function fetchCommunityPosts() {
  const res = await fetch(`${BASE_URL}/community/posts`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || '게시판 데이터를 불러오는 데 실패했습니다.');
  }
  return res.json(); // [{ id, category, title, comments, author, authorBadge, date, views, likes }, …]
}
