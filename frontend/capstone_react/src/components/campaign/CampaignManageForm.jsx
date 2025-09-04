// src/pages/CampaignManageForm.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext";
import { getOwnerCampaignsList } from "../../api/campaigns/api";
import Pagination  from "../community/Pagination";

export default function CampaignManageForm() {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 검색 조건 상태
  const [params, setParams] = useState({
    recruitStatus: searchParams.get("recruitStatus") || "",
    searchKeyword: searchParams.get("searchKeyword") || "",
    page: parseInt(searchParams.get("page")) || 1,
  });

  // 🔁 검색 input 변경
  const onChangeSearchInput = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔍 검색 실행
  const onSearch = (customParams = params, pageReset = true) => {
    const updateParams = {
      ...customParams,
      page: pageReset ? 1 : customParams.page,
    };
    setSearchParams(updateParams);
  };

  // ⌨️ Enter 검색
  const onKeyDown = (e) => {
    if (e.keyCode === 13) onSearch();
  };

  // 📃 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    const updatedParams = {
      ...params,
      page: newPage,
    };
    setParams(updatedParams);
    onSearch(updatedParams, false); // URL 쿼리 갱신(page 유지)
  };

  // ✅ searchParams 변경 → API 호출
  useEffect(() => {
    const queryString = new URLSearchParams(searchParams).toString();
    setError(null);
    setLoading(true);
    getOwnerCampaignsList(token, queryString)
      .then((data) => {
        setCampaigns(data.campaignList);
        setPagination(data.paginationInfo);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchParams, token]);

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {loading ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-blue-200 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* 검색/필터 영역 */}
          <div className="flex justify-end items-center mb-2 flex-wrap gap-2">
            <div className="relative">
              {/* 모집상태 셀렉트 */}
              <select
                name="recruitStatus"
                value={params.recruitStatus}
                onChange={onChangeSearchInput}
                className="appearance-none w-[130px] border px-4 py-2 rounded-lg text-sm transition bg-white focus:outline-none"
              >
                <option value="">전체</option>
                <option value="OPEN">모집중</option>
                <option value="CLOSED">모집 종료</option>
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

            {/* 검색 input */}
            <div className="relative w-80">
              <input
                type="text"
                value={params.searchKeyword}
                name="searchKeyword"
                placeholder="캠페인명을 입력해주세요."
                onChange={onChangeSearchInput}
                onKeyDown={onKeyDown}
                className="border px-3 py-2 pr-10 rounded-lg text-sm w-full focus:outline-none transition"
              />
              <button
                onClick={() => onSearch()}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-black text-lg"
              >
                <i className="fa fa-search" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          {/* 테이블 */}
          <table className="w-full text-sm table-auto border-t">
            <thead className="text-left border-b-2 border-t-2">
              <tr className="text-gray-500 h-[50px]">
                <th className="pl-4">캠페인명</th>
                <th className="text-center">모집기간</th>
                <th className="text-center">지원</th>
                <th className="text-center">선정</th>
                <th className="text-center">취소</th>
                <th className="text-center">모집상태</th>
                <th className="text-center w-[180px]">관리</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-gray-500"
                  >
                    등록된 체험단이 없습니다.
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr
                    key={c.campaignIdx}
                    className="hover:bg-gray-50 border-b h-[60px] text-[15px]"
                  >
                    <td className="pl-4">{c.title}</td>
                    <td className="text-center">
                      {c.applyStart} ~ {c.applyEnd}
                    </td>
                    <td className="text-center">{c.applicantsCount}</td>
                    <td className="text-center">{c.selectedCount || 0}</td>
                    <td className="text-center">{c.cancelCount || 0}</td>
                    <td className="text-center">
                      {c.recruitStatus === "OPEN" ? (
                        <span className="text-green-600 font-semibold">
                          모집중
                        </span>
                      ) : (
                        <span className="text-gray-500">모집 종료</span>
                      )}
                    </td>
                    <td className="text-center space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/campaign/edit/${c.campaignIdx}`)
                        }
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md text-sm"
                      >
                        수정
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/campaign/delete/${c.campaignIdx}`)
                        }
                        className="px-3 py-1 bg-red-100 text-red-600 rounded-md text-sm"
                      >
                        삭제
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/campaign/${c.campaignIdx}/applicants`)
                        }
                        className="px-3 py-1 bg-gray-100 rounded-md text-sm"
                      >
                        &gt;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {pagination && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </div>
  );
}
