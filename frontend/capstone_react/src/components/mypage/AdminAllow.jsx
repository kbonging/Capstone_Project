import React, { useState, useEffect, useContext } from "react";
import { getAdminCampaignsList, updateCampaignStatus } from "../../api/campaigns/api";
import { AppContext } from "../../contexts/AppContext";
import CampaignDetailModal from "./CampaignDetailModal";
import Pagination from "../community/Pagination";

export default function AdminAllow() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("전체");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1 });

  const { token } = useContext(AppContext);

  // 캠페인 목록 호출
  const fetchCampaigns = async (page = 1) => {
    if (!token) return;
    setLoading(true);
    try {
      const statusMap = { 전체: "", 대기: "PENDING", 승인: "APPROVED", 반려: "REJECTED" };
      const queryString = new URLSearchParams({
        page,
        status: statusMap[filterStatus] || "",
        keyword: searchTerm || "",
      }).toString();

      const data = await getAdminCampaignsList(token, queryString);
      if (data && Array.isArray(data.campaignList)) {
        setPosts(data.campaignList);
        setPagination(data.paginationInfo || { currentPage: page });
      } else {
        setPosts([]);
        setPagination({ currentPage: page });
      }
    } catch (error) {
      console.error(error);
      setPosts([]);
      setPagination({ currentPage: page });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns(1);
  }, [token]);

  // 상태 변경
  const changeStatus = async (id, newStatus) => {
    try {
      await updateCampaignStatus(id, newStatus, token);
      setPosts((prev) =>
        prev.map((p) =>
          p.campaignIdx === id ? { ...p, campaignStatus: newStatus } : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // 검색 실행 (돋보기, 엔터)
  const onSearch = () => {
    fetchCampaigns(1);
  };
  const handleEnter = (e) => {
    if (e.key === "Enter") onSearch();
  };

  // 페이지 변경
  const handlePageChange = (newPage) => {
    fetchCampaigns(newPage);
  };

  // 모달 열기/닫기
  const showModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  useEffect(() => {
    // posts가 바뀔 때 필터+검색 적용
    const lowerKeyword = searchTerm.toLowerCase();
    const statusMap = { 전체: null, 대기: "PENDING", 승인: "APPROVED", 반려: "REJECTED" };
    const statusToFilter = statusMap[filterStatus];

    setFilteredPosts(
      posts.filter((post) => {
        const matchesStatus = !statusToFilter || post.campaignStatus === statusToFilter;
        const matchesSearch =
          post.title.toLowerCase().includes(lowerKeyword) ||
          post.shopName.toLowerCase().includes(lowerKeyword);
        return matchesStatus && matchesSearch;
      })
    );
  }, [posts, searchTerm, filterStatus]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <span className="text-lg font-medium text-gray-600 animate-pulse">
          로딩 중...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl p-10">
      <h1 className="mb-6 text-3xl font-light tracking-wide text-gray-900">
        체험단 모집글 관리(관리자)
      </h1>

      {/* 필터 + 검색 */}
      <div className="flex flex-wrap justify-end gap-2 mb-4">
        {/* 상태 필터 */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none w-[130px] border px-4 py-2 rounded-lg text-sm bg-white focus:outline-none"
          >
            <option value="전체">전체</option>
            <option value="대기">대기</option>
            <option value="승인">승인</option>
            <option value="반려">반려</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
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

        {/* 검색 */}
        <div className="relative w-80">
          <input
            type="text"
            placeholder="제목 또는 업체명 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleEnter}
            className="border px-3 py-2 pr-10 rounded-lg text-sm w-full focus:outline-none"
          />
          <button
            onClick={onSearch}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-black text-lg"
          >
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      {/* 테이블 + 페이지네이션 */}
      <div className="flex flex-col min-h-[60vh]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-sm font-semibold text-gray-600 uppercase bg-gray-100">
                <th className="px-6 py-3 text-left">제목</th>
                <th className="px-6 py-3 text-left">업체명</th>
                <th className="px-6 py-3 text-center">상태</th>
                <th className="px-6 py-3 text-center">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-gray-500">
                    검색 조건에 맞는 글이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => {
                  const statusData = {
                    PENDING: { text: "대기", color: "bg-yellow-100 text-yellow-800" },
                    APPROVED: { text: "승인", color: "bg-green-100 text-green-800" },
                    REJECTED: { text: "반려", color: "bg-red-100 text-red-800" },
                  };
                  const currentStatus =
                    statusData[post.campaignStatus] || {
                      text: "알 수 없음",
                      color: "bg-gray-200 text-gray-700",
                    };

                  return (
                    <tr key={post.campaignIdx} className="transition-colors border-b border-gray-200">
                      <td className="px-6 py-4">
                        <button
                          className="font-medium text-gray-900 text-left"
                          onClick={() => showModal(post)}
                        >
                          {post.title}
                        </button>
                      </td>
                      <td className="px-6 py-4 max-w-[200px] truncate" title={post.shopName}>
                        {post.shopName}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${currentStatus.color}`}>
                          {currentStatus.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-md shadow-sm hover:bg-green-200"
                            onClick={() => changeStatus(post.campaignIdx, "APPROVED")}
                          >
                            승인
                          </button>
                          <button
                            className="px-3 py-1 text-sm font-medium bg-red-100 text-red-700 rounded-md shadow-sm hover:bg-red-200"
                            onClick={() => changeStatus(post.campaignIdx, "REJECTED")}
                          >
                            반려
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {pagination && (
          <div className="mt-4 flex justify-center">
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </div>
        )}
      </div>

      {/* 모달 */}
      <CampaignDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        post={selectedPost}
        onChangeStatus={changeStatus}
      />
    </div>
  );
}
