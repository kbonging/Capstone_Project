import React, { useEffect, useState } from "react";
import CampaignCardV2 from "../components/campaign/CampaignCardV2";
import Pagination from "../components/community/Pagination";
import { getCampaignsList } from "../api/campaigns/api";

const regions = ["온라인", "서울", "경기", "인천", "강원", "대전", "세종", "충남", "충북", "부산", "울산", "경남", "경북", "대구", "광주", "전남", "전북", "제주"];
const campaignTypes = [
  { value: "", label: "유형" },
  { value: "CAMP001", label: "방문형" },
  { value: "CAMP002", label: "포장형" },
  { value: "CAMP003", label: "배송형" },
  { value: "CAMP004", label: "구매형" },
];
const categories = [
  { value: "", label: "카테고리" },
  { value: "CAMT001", label: "맛집" },
  { value: "CAMT002", label: "식품" },
  { value: "CAMT003", label: "뷰티" },
  { value: "CAMT004", label: "여행" },
  { value: "CAMT005", label: "디지털" },
  { value: "CAMT006", label: "반려동물" },
  { value: "CAMT007", label: "기타" },
];
const channels = [
  { value: "", label: "채널" },
  { value: "CAMC001", label: "블로그" },
  { value: "CAMC002", label: "인스타그램" },
  { value: "CAMC003", label: "블로그+클립" },
  { value: "CAMC004", label: "클립" },
  { value: "CAMC005", label: "릴스" },
  { value: "CAMC006", label: "유튜브" },
  { value: "CAMC007", label: "쇼츠" },
  { value: "CAMC008", label: "틱톡" },
];
const sorts = [
  { value: "latest", label: "최신순" },
  { value: "deadline", label: "마감임박순" },
  { value: "popular", label: "인기순" },
];

export default function CampaignSearchPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  //  상태를 객체 하나로 통합
  const [params, setParams] = useState({
    region: "",
    campaignType: "",
    categoryCode: "",
    channelCode: "",
    sort: "latest",
    page: 1,
  });

  //  params 업데이트 함수
  const updateParams = (updates) => {
    setParams((prev) => ({ ...prev, ...updates }));
  };

  //  캠페인 목록 가져오기
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const queryString = new URLSearchParams(params).toString();
        const data = await getCampaignsList("", queryString);
        setCampaigns(data.campaignList || []);

        if (data.paginationInfo) {
          setPagination({
            currentPage: data.paginationInfo.currentPage,
            totalPage: Math.ceil(
              data.paginationInfo.totalRecord /
                data.paginationInfo.recordCountPerPage
            ),
            firstPage: Math.max(1, data.paginationInfo.currentPage - 5),
            lastPage: Math.min(
              Math.ceil(
                data.paginationInfo.totalRecord /
                  data.paginationInfo.recordCountPerPage
              ),
              data.paginationInfo.currentPage + 4
            ),
          });
        } else {
          setPagination(null);
        }
      } catch (err) {
        console.error("캠페인 불러오기 실패:", err);
        setCampaigns([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [params]);

  return (
    <div className="w-full flex justify-center mb-48">
      <div className="w-full max-w-screen-xl px-4 flex flex-col gap-6">
        {/* 지역 */}
        <div className="flex mt-4 gap-4 w-full">
          <h1 className="pl-2 mt-4 text-2xl font-semibold">지역</h1>
          <div className="flex-1 border p-4 grid grid-cols-9 gap-2">
            {regions.map((r) => (
              <button
                key={r}
                onClick={() =>
                  updateParams({
                    region: params.region === r ? "" : r,
                    page: 1,
                  })
                }
                className={`px-3 py-2 rounded-lg border text-sm font-semibold ${
                  params.region === r
                    ? "bg-sky-500 text-white border-sky-500"
                    : "bg-white dark:bg-zinc-700 text-stone-600 dark:text-zinc-300 border-stone-300 dark:border-zinc-600"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* 셀렉트 박스 */}
        <div className="flex justify-end flex-wrap gap-4 items-center">
          <select
            value={params.campaignType}
            onChange={(e) =>
              updateParams({ campaignType: e.target.value, page: 1 })
            }
            className="border rounded-full px-2 py-1 text-sm pr-6"
          >
            {campaignTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <select
            value={params.categoryCode}
            onChange={(e) =>
              updateParams({ categoryCode: e.target.value, page: 1 })
            }
            className="border rounded-full px-2 py-1 text-sm pr-6"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            value={params.channelCode}
            onChange={(e) =>
              updateParams({ channelCode: e.target.value, page: 1 })
            }
            className="border rounded-full px-2 py-1 text-sm pr-6"
          >
            {channels.map((ch) => (
              <option key={ch.value} value={ch.value}>
                {ch.label}
              </option>
            ))}
          </select>

          <select
            value={params.sort}
            onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
            className="border rounded-full px-2 py-1 text-sm pr-6"
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* 캠페인 카드 */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-60 bg-stone-200 dark:bg-zinc-700 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-4 text-center text-stone-500">
            캠페인이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {campaigns.map((c) => (
              <CampaignCardV2 key={c.campaignIdx} campaign={c} />
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        <Pagination
          pagination={pagination}
          onPageChange={(newPage) => updateParams({ page: newPage })}
        />
      </div>
    </div>
  );
}
