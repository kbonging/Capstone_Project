// src/pages/CommunityPage.jsx
import React, { useState, useEffect } from "react";
// import { fetchCommunityPosts } from "../api/communityApi";     //이부분도 서버 전송할떄 주석 풀고 진행하세요

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null); //이부분도 마찬가지로 서버 통신 할때 주석 푸세여~

  // 더미 데이터 정의 -> 임시데이터니 서버연동하면 지우세요
  const samplePosts = [
    {
      id: 1,
      category: "필독",
      categoryColor: "text-red-500",
      title: "1:1문의 방법 & 자주 묻는 질문",
      comments: 6,
      author: "리뷰노트",
      authorBadge: "관",
      date: "2025-05-21(수)",
      views: 406,
      likes: 0,
    },
    {
      id: 2,
      category: "질문하기",
      categoryColor: "text-blue-500",
      title: "[추가수정] 블로거 패널티 부여 방법이 있었으면 좋겠습니다",
      comments: 12,
      author: "바로여기 체험단",
      authorBadge: "광",
      date: "2024-12-19(목)",
      views: 843,
      likes: 55,
    },
    {
      id: 3,
      category: "노하우",
      categoryColor: "text-yellow-500",
      title: "체험단 선정 팁을 공유합니다",
      comments: 6,
      author: "얼탑탐사사진관",
      authorBadge: "팁",
      date: "2024-09-20(금)",
      views: 1140,
      likes: 31,
    },
    {
      id: 4,
      category: "공지",
      categoryColor: "text-purple-500",
      title: "리뷰노트 사용 가이드 업데이트 안내",
      comments: 154,
      author: "리뷰노트",
      authorBadge: "관",
      date: "2024-01-26(금)",
      views: 16115,
      likes: 28,
    },
  ];

  //  이부분은 서버 연동 할때 주석 풀고 하세용 위에있는 더미데이터 지우고
  //   useEffect(() => {
  //     setLoading(true);
  //     fetchCommunityPosts()
  //       .then(data => setPosts(data))
  //       .catch(err => setError(err.message))
  //       .finally(() => setLoading(false));
  //   }, []);

  useEffect(() => {
    // 0.5초 뒤에 더미 데이터 로드
    setTimeout(() => {
      setPosts(samplePosts);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <p className="text-center py-8">로딩 중…</p>;
//   if (error)
//     return <p className="text-center py-8 text-red-500">에러: {error}</p>;

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">커뮤니티</h1>
          <div className="space-x-2">
            <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
              BEST
            </button>
            <button className="text-gray-600 hover:text-black text-sm">
              노하우
            </button>
            <button className="text-gray-600 hover:text-black text-sm">
              일상
            </button>
            <button className="text-gray-600 hover:text-black text-sm">
              질문하기
            </button>
            <button className="text-gray-600 hover:text-black text-sm">
              공지
            </button>
          </div>
          <button className="bg-blue-100 text-blue-600 px-4 py-1 rounded text-sm font-semibold">
            글 작성
          </button>
        </div>

        {/* 검색창 */}
        <div className="flex justify-between items-center mb-4">
          <select className="border px-3 py-1 rounded text-sm">
            <option>구분</option>
          </select>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="검색어를 입력해주세요."
              className="border px-3 py-1 rounded text-sm w-64"
            />
            <button className="text-gray-500 hover:text-black text-lg">
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        {/* 테이블 */}
        <table className="w-full text-sm table-auto border-t">
          <thead className="text-left border-b">
            <tr className="text-gray-500">
              <th className="py-2">카테고리</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회</th>
              <th>좋아요</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr
                key={post.id}
                className="hover:bg-gray-50 border-b-2 h-[70px] text-[15px]"
              >
                <td className={`py-2 font-bold ${post.categoryColor}`}>
                  {post.category}
                </td>
                <td>
                  {post.title}
                  <span className="text-red-500 ml-1">[{post.comments}]</span>
                </td>
                <td>
                  <span className="text-gray-800">{post.author}</span>
                  <span className="text-xs bg-red-500 text-white px-1 rounded ml-1">
                    {post.authorBadge}
                  </span>
                </td>
                <td>{post.date}</td>
                <td>{post.views.toLocaleString()}</td>
                <td>{post.likes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
