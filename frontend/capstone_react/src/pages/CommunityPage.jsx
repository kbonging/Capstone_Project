// src/pages/CommunityPage.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import { fetchCommunityPosts } from "../api/communityApi";
import CommuCateBtns from "../components/CommuCateBtns";
import { Link } from "react-router-dom"; //링크 연결위해(라우터) 추가했습니다

const categoryColorMap = {
  COMMU001: "#FDD835",
  COMMU002: "#4DB6AC",
  COMMU003: "#7986CB",
  COMMU004: "#dc2626",
};

export default function CommunityPage() {
  const [error, setError] = useState(null);
  const { token } = useContext(AppContext);

  const [posts, setPosts] = useState([]); // 게시글 목록
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ 무한 스크롤 상태
  const pageRef = useRef(1); // 현재 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 더 불러올 게시글 있는지 여부
  const [loading, setLoading] = useState(false); // 로딩 중 여부

  // ✅ 검색 조건 상태
  const [params, setParams] = useState({
    categoryId: searchParams.get("categoryId") || "",
    searchKeyword: searchParams.get("searchKeyword") || "",
    searchCondition: searchParams.get("searchCondition") || "",
  });

  // 🔁 입력 변경 핸들러 (URL에 영향 없음)
  const onChangeSearchInput = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔁 카테고리 변경 핸들러
  const onCategoryChange = (categoryCode) => {
    const updatedParams = {
      ...params,
      categoryId: categoryCode,
    };
    setParams(updatedParams); // 상태 갱신
    onSearch(updatedParams); // 최신 값으로 검색 실행
  };

  // 🔍 검색 버튼 클릭 시 → URL 쿼리 반영
  const onSearch = (customParams = params) => {
    setSearchParams(customParams); // 검색 조건이 바뀔 때 URL 쿼리 갱신
  };

  // ⌨️ Enter 키로 검색
  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      onSearch();
    }
  };

  // ✅ 스크롤 이벤트로 하단 도달 감지 → 다음 페이지 로딩
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ 게시글 로딩 함수 (page 단위로 불러오기)
  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const query = new URLSearchParams({
        ...params,
        page: pageRef.current,
        size: 10,
      }).toString();

      const newPosts = await fetchCommunityPosts(token, query);
      setPosts((prev) => [...prev, ...newPosts]);

      pageRef.current += 1; // pageRef로 직접 증가
      setHasMore(newPosts.length > 0);
    } catch (err) {
      setError(err.message || "게시글 불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    const sentinel = document.getElementById("scroll-sentinel");
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, []); // 빈 배열로 의존성 제거

  // ✅ 검색 조건이 변경되면 상태 초기화 후 다시 1페이지부터 로딩
  useEffect(() => {
    setPosts([]);
    pageRef.current = 1; // ref 초기화
    setHasMore(true);
    loadMore();
  }, [searchParams, token]);

  // if (loading) return <p className="text-center py-8">로딩 중…</p>;
  if (error)
    return <p className="text-center py-8 text-red-500">에러: {error}</p>;

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">커뮤니티</h1>
          <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-semibold">
            글 작성
          </button>
        </div>

        {/* 검색창 */}
        <div className="flex justify-between items-center mb-2 flex-wrap">
          {/* 왼쪽: 카테고리 버튼 */}
          <div className="flex items-center gap-2">
            <CommuCateBtns
              selectedCategory={params.categoryId}
              onCategoryChange={onCategoryChange}
            />
          </div>

          {/* 오른쪽: 구분 + 검색 */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                name="searchCondition"
                value={params.searchCondition}
                onChange={onChangeSearchInput}
                className="appearance-none border px-4 py-3 pr-10 rounded-lg text-sm transition w-[100px] bg-white focus:outline-none"
              >
                <option value="">전체</option>
                <option value="TITLE">제목</option>
                <option value="CONTENT">내용</option>
              </select>

              {/* 커스텀 화살표 아이콘 */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <div className="relative w-80">
              <input
                type="text"
                value={params.searchKeyword}
                name="searchKeyword"
                placeholder="검색어를 입력해주세요."
                onChange={onChangeSearchInput}
                onKeyDown={onKeyDown}
                className="border px-3 py-3 pr-10 rounded-lg text-sm w-full focus:outline-none transition placeholder:text-xs"
              />
              <button
                onClick={onSearch}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-black text-lg"
              >
                <i className="fa fa-search" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>

        {/* 테이블 */}
        <table className="w-full text-sm table-auto border-t">
          <thead className="text-left border-b-2 border-t-2">
            <tr className="text-gray-500 h-[50px]">
              <th className="py-2 w-[50px] text-center">카테고리</th>
              <th className="w-[50%] pl-8">제목</th>
              <th className="w-[80px] ">작성자</th>
              <th className="w-[80px] text-center">작성일</th>
              <th className="w-[50px] text-center">조회</th>
              <th className="w-[50px] text-center">좋아요</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-red-50 hover:bg-gray-50 border-b h-[70px] text-[15px]">
              <td className="py-2 font-bold  text-center">
                <span className="font-semibold text-red-600 bg-red-200 px-2 py-1 rounded">
                  필독
                </span>
              </td>
              <td className="pl-8">
                1:1 문의 방법 & 자주 묻는 질문
                <span className="text-red-500 ml-1">[10]</span>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              posts.map((post) => {
                const categoryColor = categoryColorMap[post.categoryId];

                return (
                  <tr
                    key={post.communityIdx}
                    className="hover:bg-gray-50 border-b h-[70px] text-[15px]"
                  >
                    <td className="py-2 font-bold  text-center">
                      <span
                        className="px-2 py-1 rounded-full text-white "
                        style={{
                          color: categoryColor,
                        }}
                      >
                        {post.codeNm}
                      </span>
                    </td>
                    <td className="pl-8">
                      <Link
                        to={`/community/${post.communityIdx}`}
                        className="hover:underline text-blue-600"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td>
                      <span className="text-gray-800">{post.writerName}</span>
                      {post.auth === "ROLE_OWNER" && (
                        <span className="ml-2 text-xs font-semibold text-white bg-cyan-400 px-[2px] rounded">
                          소
                        </span>
                      )}
                      {post.auth === "ROLE_USER" && (
                        <span className="ml-2 text-xs font-semibold text-white bg-lime-500 px-[2px] rounded">
                          리
                        </span>
                      )}
                      {post.auth === "ROLE_ADMIN" && (
                        <span className="ml-2 text-xs font-semibold text-white bg-red-600 px-[2px] rounded">
                          관
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      {new Date(post.regDate).toLocaleDateString()}
                    </td>
                    <td className="text-center">{post.viewCount}</td>
                    <td className="text-center">0</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
