// src/pages/CommunityPage.jsx
import React, { useState, useEffect,useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import { fetchCommunityPosts } from "../api/communityApi";

const categoryColorMap = {
  COMMU001: "#FDD835",
  COMMU002: "#4DB6AC",
  COMMU003: "#7986CB",
  COMMU004: "#FF8A65"
};

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AppContext);

  const params = { // 이거 나중에 수정
    searchKeyword: '',
    searchCondition: '',
    start: 0,
    end: 10,
  };

  const queryString = new URLSearchParams(params).toString();
  
    useEffect(() => {
      setLoading(true);
      fetchCommunityPosts(token, queryString)
        .then(data => setPosts(data))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }, [token, queryString]);

  if (loading) return <p className="text-center py-8">로딩 중…</p>;
  if (error)
    return <p className="text-center py-8 text-red-500">에러: {error}</p>;

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
            {posts.map((post) => {
              const categoryColor = categoryColorMap[post.categoryId]; // 기본색 회색

              return (
                <tr
                  key={post.communityIdx}
                  className="hover:bg-gray-50 border-b-2 h-[70px] text-[15px]"
                >
                  <td className="py-2 font-bold">
                    <span
                      className="px-2 py-1 rounded-full text-white text-xs"
                      style={{ color: categoryColor }}
                    >
                      {post.codeNm}
                    </span>
                  </td>
                  <td>
                    {post.title}
                    {/* <span className="text-red-500 ml-1">[10]</span> */}
                  </td>
                  <td>
                    <span className="text-gray-800">{post.writerName}</span>
                    {post.auth === 'ROLE_OWNER' && (
                      <span className="ml-2 text-xs font-semibold text-white bg-cyan-400 px-1 rounded">
                        소
                      </span>
                    )}
                    {post.auth === 'ROLE_USER' && (
                      <span className="ml-2 text-xs font-semibold text-white bg-lime-500 px-1 rounded">
                        리
                      </span>
                    )}
                  </td>
                  <td>{new Date(post.regDate).toLocaleDateString()}</td>
                  <td>{post.viewCount}</td>
                  <td>0</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
