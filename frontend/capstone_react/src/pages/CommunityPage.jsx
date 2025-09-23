// src/pages/CommunityPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import { fetchCommunityPosts } from "../api/communityApi";
import CommuCateBtns from "../components/CommuCateBtns";
import Pagination from "../components/community/Pagination";

const categoryColorMap = {
  COMMU001: "#FDD835",
  COMMU002: "#4DB6AC",
  COMMU003: "#7986CB",
  COMMU004: "#dc2626",
};

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState(null);
  const { token } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // 검색 조건 상태
  const [params, setParams] = useState({
    categoryId: searchParams.get("categoryId") || "",
    searchKeyword: searchParams.get("searchKeyword") || "",
    searchCondition: searchParams.get("searchCondition") || "",
    showMycommunitiesParam: searchParams.get("showMycommunitiesParam") || "",
    page: parseInt(searchParams.get("page")) || 1,
  });

  // 🔁 검색창 입력 변경 핸들러 (URL에 영향 없음)
  const onChangeSearchInput = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔍 검색 버튼 클릭 시 → URL 쿼리 반영
  const onSearch = (customParams = params, pageReset = true) => {
    const updateParams = {
      ...customParams,
      page: pageReset ? 1 : customParams.page,
    };
    setSearchParams(updateParams); // URL만 갱신됨
  };

  // ⌨️ Enter 키로 검색
  const onKeyDown = (e) => {
    if (e.keyCode === 13) onSearch();
  };

  // 🔁 카테고리 변경 핸들러
  const onCategoryChange = (categoryCode) => {
    const updatedParams = {
      ...params,
      categoryId: categoryCode,
    };
    setParams(updatedParams);
    onSearch(updatedParams);
  };

  // 📃 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    const updatedParams = { ...params, page: newPage };
    setParams(updatedParams);
    onSearch(updatedParams, false); // page 유지
  };

  // 내글 체크박스 핸들러
  const handleMycommunities = (e) => {
    const checked = e.target.checked;
    const updatedParams = {
      ...params,
      showMycommunitiesParam: checked ? "true" : "",
    };
    setParams(updatedParams);
    onSearch(updatedParams);
  };

  // searchParams 변경 시 API 호출
  useEffect(() => {
    const queryString = new URLSearchParams(searchParams).toString();
    setError(null);
    fetchCommunityPosts(token, queryString)
      .then((data) => {
        setPosts(data.communityList);
        setPagination(data.paginationInfo);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchParams, token]);

  if (error)
    return (
      <p className="text-center py-8 text-red-500 dark:text-red-400">
        에러: {error}
      </p>
    );

  return (
    <div className="min-h-screen bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-100">
      {loading ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-blue-200 dark:border-blue-800 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              <div className="relative two">
                <h1 className="relative text-[40px] font-light font-[Raleway] text-[#080808] dark:text-gray-100 transition-all duration-400 ease-in-out capitalize">
                  커뮤니티
                  <span className="block text-[13px] font-medium uppercase tracking-[4px] leading-[3em] pl-1 text-black/40 dark:text-white/40 pb-[10px]">
                    사람들과 함께 나누는 이야기
                  </span>
                </h1>
              </div>
            </h1>
            <Link to="/community/write">
              <button className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 px-4 py-2 rounded-lg font-semibold">
                글 작성
              </button>
            </Link>
          </div>

          {/* 검색창 */}
          <div className="flex justify-between items-center mb-2 flex-wrap gap-3">
            {/* 왼쪽: 카테고리 버튼 */}
            <div className="flex items-center gap-2">
              <CommuCateBtns
                selectedCategory={params.categoryId}
                onCategoryChange={onCategoryChange}
              />
            </div>

            {/* 오른쪽: 구분 + 검색 */}
            <div className="flex items-center gap-2">
              {/* 내글 체크박스 */}
              <label className="flex items-center gap-2 mr-2 text-gray-500 dark:text-gray-300 text-sm">
                <input
                  type="checkbox"
                  checked={params.showMycommunitiesParam === "true"}
                  onChange={handleMycommunities}
                  className="h-4 w-4 accent-blue-600 dark:accent-blue-500"
                />
                <span className="text-gray-400 dark:text-gray-300">내글</span>
              </label>

              {/* 구분 셀렉트 */}
              <div className="relative">
                <select
                  name="searchCondition"
                  value={params.searchCondition}
                  onChange={onChangeSearchInput}
                  className="appearance-none border border-gray-200 dark:border-gray-700 px-4 py-3 pr-10 rounded-lg text-sm transition w-[100px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 dark:focus:ring-blue-600/50"
                >
                  <option value="">전체</option>
                  <option value="TITLE">제목</option>
                  <option value="CONTENT">내용</option>
                </select>

                {/* 커스텀 화살표 아이콘 */}
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* 검색 인풋 */}
              <div className="relative w-80">
                <input
                  type="text"
                  value={params.searchKeyword}
                  name="searchKeyword"
                  placeholder="검색어를 입력해주세요."
                  onChange={onChangeSearchInput}
                  onKeyDown={onKeyDown}
                  className="border border-gray-200 dark:border-gray-700 px-3 py-3 pr-10 rounded-lg text-sm w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-xs placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 dark:focus:ring-blue-600/50"
                />
                <button
                  onClick={() => onSearch()}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white text-lg"
                >
                  <i className="fa fa-search" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>

          {/* 테이블 */}
          <table className="w-full text-sm table-auto border-t border-gray-200 dark:border-gray-800">
            <thead className="text-left border-b-2 border-t-2 border-gray-200 dark:border-gray-800">
              <tr className="text-gray-500 dark:text-gray-400 h-[50px]">
                <th className="py-2 w-[50px] text-center">카테고리</th>
                <th className="w-[50%] pl-8">제목</th>
                <th className="w-[80px]">작성자</th>
                <th className="w-[80px] text-center">작성일</th>
                <th className="w-[50px] text-center">조회</th>
                <th className="w-[50px] text-center">좋아요</th>
              </tr>
            </thead>
            <tbody>
              {/* 고정 공지 */}
              <tr className="bg-red-50 dark:bg-red-900/20 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 h-[70px] text-[15px]">
                <td className="py-2 font-bold text-center">
                  <span className="font-semibold text-red-600 dark:text-red-400 bg-red-200 dark:bg-red-900/40 px-2 py-1 rounded">
                    필독
                  </span>
                </td>
                <td className="pl-8 cursor-pointer">
                  1:1 문의 방법 & 자주 묻는 질문
                  <span className="text-red-500 dark:text-red-400 ml-1">[10]</span>
                </td>
                <td></td><td></td><td></td><td></td>
              </tr>

              {posts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-gray-500 dark:text-gray-400"
                  >
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                posts.map((post) => {
                  const categoryColor = categoryColorMap[post.categoryId];
                  return (
                    <tr
                      key={post.communityIdx}
                      onClick={() => navigate(`/community/${post.communityIdx}`)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 h-[70px] text-[15px] cursor-pointer"
                    >
                      <td className="py-2 font-bold text-center">
                        <span
                          className="px-2 py-1 rounded-full"
                          style={{ color: categoryColor }}
                        >
                          {post.codeNm}
                        </span>
                      </td>
                      <td className="pl-8">
                        {post.title}
                        {post.commentCount > 0 && (
                          <span className="text-red-500 dark:text-red-400 ml-1">
                            [{post.commentCount}]
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="text-gray-800 dark:text-gray-200">
                          {post.writerName}
                        </span>
                        {post.auth === "ROLE_OWNER" && (
                          <span className="ml-2 text-[11px] font-semibold text-white bg-cyan-400 dark:text-gray-900 px-[2px] rounded">
                            소
                          </span>
                        )}
                        {post.auth === "ROLE_USER" && (
                          <span className="ml-2 text-[11px] font-semibold text-white bg-lime-500 dark:text-gray-900 px-[2px] rounded">
                            리
                          </span>
                        )}
                        {post.auth === "ROLE_ADMIN" && (
                          <span className="ml-2 text-[11px] font-semibold text-white bg-red-600 dark:text-gray-100 px-[2px] rounded">
                            관
                          </span>
                        )}
                      </td>
                      <td className="text-center">
                        {new Date(post.regDate).toLocaleDateString()}
                      </td>
                      <td className="text-center">{post.viewCount}</td>
                      <td className="text-center">{post.likeCount}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {pagination && (
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          )}
        </div>
      )}
    </div>
  );
}
