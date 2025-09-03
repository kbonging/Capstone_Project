// src/pages/CampaignManageForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

export default function CampaignManageForm() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchCondition, setSearchCondition] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showMyCampaigns, setShowMyCampaigns] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: API 호출 후 setCampaigns
    setLoading(false);
  }, []);

  const handleSearch = () => {
    // TODO: 필터+검색 API 호출
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen p-6">
      {/* 필터 & 검색 */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {/* 모집상태 셀렉트 */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="appearance-none border px-4 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">전체 모집상태</option>
          <option value="RECRUITING">모집중</option>
          <option value="ENDED">모집 종료</option>
        </select>


        {/* 검색조건 select */}
        {/* <div className="relative">
          <select
            value={searchCondition}
            onChange={(e) => setSearchCondition(e.target.value)}
            className="appearance-none border px-4 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-[100px] bg-white"
          >
            <option value="">전체</option>
            <option value="TITLE">캠페인명</option>
            <option value="CONTENT">내용</option>
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
        </div> */}

        {/* 검색 input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="검색어를 입력해주세요."
            className="border px-3 py-2 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-black"
          >
            🔍
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm table-auto border-t">
          <thead className="bg-gray-50 border-b-2">
            <tr className="text-gray-500 h-[50px]">
              <th className="py-2 px-4 text-left">캠페인명</th>
              <th className="py-2 px-4 text-left">모집기간</th>
              <th className="py-2 px-4 text-center">지원</th>
              <th className="py-2 px-4 text-center">선정</th>
              <th className="py-2 px-4 text-center">취소</th>
              <th className="py-2 px-4 text-center">모집상태</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-10 text-center">
                  <div className="w-10 h-10 border-2 border-blue-200 border-t-transparent rounded-full animate-spin mx-auto" />
                </td>
              </tr>
            ) : campaigns.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-400">
                  등록된 캠페인이 없습니다.
                </td>
              </tr>
            ) : (
              campaigns.map((c) => (
                <tr key={c.campaignIdx} className="hover:bg-gray-50 border-b">
                  <td className="py-3 px-4 cursor-pointer">{c.title}</td>
                  <td className="py-3 px-4">{c.applyStart} ~ {c.applyEnd}</td>
                  <td className="py-3 px-4 text-center">{c.applicantsCount}</td>
                  <td className="py-3 px-4 text-center">{c.selectedCount}</td>
                  <td className="py-3 px-4 text-center">{c.cancelCount}</td>
                  <td className="py-3 px-4 text-center">{c.recruitStatus}</td>
                  <td className="py-3 px-4 flex justify-center gap-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => navigate(`/campaign/edit/${c.campaignIdx}`)}
                    >
                      수정
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => {}}
                    >
                      삭제
                    </button>
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() =>
                        navigate(`/campaign/${c.campaignIdx}/applicants`)
                      }
                    >
                      <FaUser size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
