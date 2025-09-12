import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext";
import { getApplicantsByCampaign, updateApplicantsStatus } from "../../api/campaigns/api";
import Pagination from "../community/Pagination";

export default function OwnerCampaignApply({ campaignIdx, recruitCount, onClose }) {
  const { token } = useContext(AppContext);

  const navigate = useNavigate();
  
  const [applicants, setApplicants] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState(null);

  // 검색/필터 상태
  const [searchKeyword, setSearchKeyword] = useState("");
  const [applyStatus, setApplyStatus] = useState("");
  const [page, setPage] = useState(1);

  // API 호출 함수
  const fetchApplicants = (currentPage = 1) => {
    if (!campaignIdx) return;

    getApplicantsByCampaign(token, campaignIdx, {
      page: currentPage,
      searchCondition: "nickname", // 항상 닉네임 기준
      searchKeyword,
      applyStatus,
    })
      .then((data) => {
        setApplicants(data.applicantList || []);
        setPaginationInfo(data.paginationInfo || null);
        setPage(currentPage); // 페이지 상태 업데이트
      })
      .catch((err) => console.error(err));
  };

  //  당첨자 수 계산
  const approvedCount = applicants.filter(
    (app) => app.applyStatusCode === "CAMAPP_APPROVED"
  ).length;

  // 상태 변경 함수
  const handleStatusChange = (applicationIdx, newStatus) => {
    if (newStatus === "CAMAPP_APPROVED") {
      const approvedCount = applicants.filter(
        (app) => app.applyStatusCode === "CAMAPP_APPROVED"
      ).length;

      if (approvedCount >= recruitCount) {
        alert(`이 캠페인은 최대 ${recruitCount}명까지만 당첨 가능합니다.`);
        return;
      }
    }

    updateApplicantsStatus(applicationIdx, newStatus, token)
      .then(() => {
        setApplicants((prev) =>
          prev.map((app) =>
            app.applicationIdx === applicationIdx
              ? {
                  ...app,
                  applyStatusCode: newStatus,
                  applyStatusName:
                    newStatus === "CAMAPP_APPROVED" ? "당첨" : "탈락",
                }
              : app
          )
        );
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (campaignIdx) {
      fetchApplicants(1);
    }
  }, [campaignIdx]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // 검색 버튼/엔터
  const handleSearch = () => {
    fetchApplicants(1); // 검색 시 1페이지부터 조회
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 페이지네이션 클릭
  const handlePageChange = (newPage) => {
    fetchApplicants(newPage);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      {/*  모달 가로폭 800px로 변경 */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[1000px] max-h-[85vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">신청자 관리</h2>

        {/* 모집 인원 표시 */}
        <div className="mb-4 text-sm text-gray-600">
          현재 당첨자:{" "}
          <span className="font-semibold text-blue-600">{approvedCount}</span>/
          {recruitCount}
        </div>

        {/* 상태 필터 + 검색 */}
        <div className="flex gap-2 mb-4 items-center">
          <select
            className="border rounded px-2 py-1"
            value={applyStatus}
            onChange={(e) => setApplyStatus(e.target.value)}
          >
            <option value="">전체</option>
            <option value="CAMAPP_PENDING">대기</option>
            <option value="CAMAPP_APPROVED">당첨</option>
            <option value="CAMAPP_REJECTED">탈락</option>
          </select>
          <input
            type="text"
            placeholder="닉네임 검색"
            className="border rounded px-2 py-1 flex-1"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded"
            onClick={handleSearch}
          >
            검색
          </button>
        </div>

        {/* 신청자 테이블 */}
        <table className="w-full text-sm border-collapse table-fixed">
          <thead className="bg-blue-50">
            <tr className="text-center text-gray-600 uppercase text-xs tracking-wide">
              <th className="py-3 border-b w-[120px]">닉네임</th>
              <th className="py-3 border-b w-[400px]">신청 한마디</th>
              <th className="py-3 border-b w-[100px]">상태</th>
              <th className="py-3 border-b w-[160px]">관리</th>
            </tr>
          </thead>
          <tbody>
            {applicants.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-400">
                  신청자가 없습니다.
                </td>
              </tr>
            ) : (
              applicants.map((app) => (
                <tr
                  key={app.applicationIdx}
                  className="text-center border-b hover:bg-blue-50 transition"
                >
                  {/* 닉네임 */}
                  <td
                    className="py-2 px-2 font-semibold truncate hover:underline-offset-0 hover:text-black cursor-pointer"
                    title={app.nickname}
                    onClick={() => navigate(`/mypage/${app.memberIdx}`)} // 클릭 시 이동
                  >
                    {app.nickname}
                  </td>

                  {/* 신청 한마디 → 여러 줄 허용 */}
                  <td className="py-2 px-2 text-left break-words whitespace-pre-wrap">
                    {app.applyReason}
                  </td>

                  {/* 상태 */}
                  <td className="py-2 font-medium truncate" title={app.applyStatusName}>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        app.applyStatusName === "대기"
                          ? "bg-gray-100 text-gray-600"
                          : app.applyStatusName === "당첨"
                          ? "bg-blue-100 text-blue-600"
                          : app.applyStatusName === "탈락"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {app.applyStatusName}
                    </span>
                  </td>

                  {/* 관리 버튼 */}
                  <td className="py-2 px-2">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() =>
                          handleStatusChange(app.applicationIdx, "CAMAPP_APPROVED")
                        }
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md text-xs hover:bg-blue-200 transition"
                      >
                        당첨
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(app.applicationIdx, "CAMAPP_REJECTED")
                        }
                        className="px-3 py-1 bg-red-100 text-red-600 rounded-md text-xs hover:bg-red-200 transition"
                      >
                        탈락
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        {paginationInfo && (
          <Pagination pagination={paginationInfo} onPageChange={handlePageChange} />
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
