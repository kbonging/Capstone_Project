// src/pages/CampaignManageForm.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext";
import { getOwnerCampaignsList, deleteCampaign } from "../../api/campaigns/api";
import Pagination from "../community/Pagination";
import OwnerCampaignApply from "./OwnerCampaignApply";
import { toAbsoluteUrl } from "../../utils/url";

export default function CampaignManageForm() {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal 상태 -> 열기
  const openApplicantsModal = (campaign) => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      modalCampaign: campaign.campaignIdx,
    });
  };

  // Modal 상태 -> 닫기
  const closeApplicantsModal = () => {
    const paramsObj = Object.fromEntries(searchParams.entries());
    delete paramsObj.modalCampaign;
    setSearchParams(paramsObj);
  };

  // 검색 조건 상태
  const [params, setParams] = useState({
    recruitStatus: searchParams.get("recruitStatus") || "",
    searchKeyword: searchParams.get("searchKeyword") || "",
    page: parseInt(searchParams.get("page")) || 1,
  });

  // 🔁 검색 input 변경
  const onChangeSearchInput = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
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

  // 📃 페이지 변경
  const handlePageChange = (newPage) => {
    const updatedParams = { ...params, page: newPage };
    setParams(updatedParams);
    onSearch(updatedParams, false);
  };

  //  searchParams 변경 → API 호출
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

  const modalCampaignIdx = searchParams.get("modalCampaign");
  const modalCampaign = campaigns.find(
    (c) => c.campaignIdx.toString() === modalCampaignIdx
  );

  // 삭제
  const handleDeleteCampaign = async (campaignIdx) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteCampaign(campaignIdx, token);
      alert("삭제되었습니다.");
      const queryString = new URLSearchParams(searchParams).toString();
      const data = await getOwnerCampaignsList(token, queryString);
      setCampaigns(data.campaignList);
      setPagination(data.paginationInfo);
    } catch (err) {
      console.error("[DELETE] 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-100">
      {loading ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-blue-200 dark:border-blue-800 border-t-transparent rounded-full animate-spin" />
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
                className="appearance-none w-[130px] border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg text-sm transition bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 dark:focus:ring-blue-600/50"
              >
                <option value="">전체</option>
                <option value="OPEN">모집중</option>
                <option value="CLOSED">모집 종료</option>
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
                className="border border-gray-200 dark:border-gray-700 px-3 py-2 pr-10 rounded-lg text-sm w-full focus:outline-none transition bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400/50 dark:focus:ring-blue-600/50"
              />
              <button
                onClick={() => onSearch()}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white text-lg"
              >
                <i className="fa fa-search" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          {/* 테이블 */}
          <table className="w-full text-sm table-auto border-t border-gray-200 dark:border-gray-800">
            <thead className="text-left border-b-2 border-t-2 border-gray-200 dark:border-gray-800">
              <tr className="text-gray-500 dark:text-gray-400 h-[50px]">
                <th className="pl-4 w-[45%]">캠페인 정보</th>
                <th className="text-center">지원</th>
                <th className="text-center">선정</th>
                <th className="text-center w-[15%]">모집상태</th>
                <th className="text-center w-[150px]">관리</th>
              </tr>
            </thead>

            <tbody>
              {campaigns.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-gray-500 dark:text-gray-400"
                  >
                    등록된 체험단이 없습니다.
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr
                    key={c.campaignIdx}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 h-[110px] text-[15px] cursor-pointer"
                    onClick={() =>
                      navigate(`/owner/campaigns/${c.campaignIdx}/reviews`)
                    }
                  >
                    {/* 캠페인 정보 열 */}
                    <td className="pl-4 py-3">
                      <div className="flex gap-4 items-center">
                        {/* 썸네일 */}
                        <div className="w-[80px] h-[80px] flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden flex items-center justify-center">
                          {c.thumbnailUrl ? (
                            <img
                              src={toAbsoluteUrl(c.thumbnailUrl)}
                              alt="썸네일"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-gray-400 dark:text-gray-300 text-xs">
                              No Image
                            </div>
                          )}
                        </div>

                        {/* 캠페인 상세 */}
                        <div className="flex flex-col gap-2">
                          <div className="font-semibold text-base">
                            {c.title}
                          </div>

                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-200">
                              {c.channelName}
                            </span>
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-200">
                              {c.campaignTypeName}
                            </span>
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-200">
                              {c.categoryName}
                            </span>
                          </div>

                          <div className="text-sm text-gray-500 dark:text-gray-400 leading-5">
                            모집기간: {c.applyStartDate} ~ {c.applyEndDate}{" "}
                            <br />
                            신청 마감: {c.applyEndDate}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 지원자/선정 */}
                    <td className="text-center py-3">
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {c.applicants}
                      </span>
                      &nbsp;/&nbsp;
                      <span>{c.recruitCount}</span>
                    </td>

                    {/* 선정 */}
                    <td className="text-center py-3">{c.approCount || 0}</td>

                    {/* 모집 상태 */}
                    <td className="text-center py-3">
                      {c.recruitStatus === "OPEN" ? (
                        <span className="text-green-600 dark:text-green-400 font-semibold">
                          모집중
                        </span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">
                          모집 종료
                        </span>
                      )}
                    </td>

                    {/* 관리 버튼 */}
                    <td
                      className="text-center py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              navigate(`/campaign/edit/${c.campaignIdx}`)
                            }
                            className="px-3 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 rounded-md text-sm"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(c.campaignIdx)}
                            className="px-3 py-1 bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200 rounded-md text-sm"
                          >
                            삭제
                          </button>
                        </div>
                        <button
                          onClick={() => openApplicantsModal(c)}
                          className="px-5 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-gray-800 dark:text-gray-100"
                        >
                          신청자 관리
                        </button>
                      </div>
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

      {modalCampaign && (
        <OwnerCampaignApply
          campaignIdx={modalCampaign.campaignIdx}
          recruitCount={modalCampaign.recruitCount}
          onClose={closeApplicantsModal}
        />
      )}
    </div>
  );
}
