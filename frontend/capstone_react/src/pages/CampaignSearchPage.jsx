import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRedoAlt } from "react-icons/fa";
import CampaignCardV2 from "../components/campaign/CampaignCardV2";
import Pagination from "../components/community/Pagination";
import { getCampaignsList } from "../api/campaigns/api";

// regions
const regions = [
  { name: "재택", guguns: ["재택"] },
  { name: "서울", guguns: ["강남구","강동구","강북구","강서구","관악구","광진구","구로구","금천구","노원구","도봉구","동대문구","동작구","마포구","서대문구","서초구","성동구","성북구","송파구","양천구","영등포구","용산구","은평구","종로구","중구","중랑구"] },
  { name: "경기", guguns: ["가평군","고양시","과천시","광명시","광주시","구리시","군포시","김포시","남양주시","동두천시","부천시","성남시","수원시","시흥시","안산시","안성시","안양시","양주시","양평군","여주시","연천군","오산시","용인시","의왕시","의정부시","이천시","파주시","평택시","포천시","하남시","화성시"] },
  { name: "인천", guguns: ["강화군","계양구","남구","남동구","동구","미추홀구","부평구","서구","연수구","옹진군","중구"] },
  { name: "강원", guguns: ["강릉시","고성군","동해시","삼척시","속초시","양구군","양양군","영월군","원주시","인제군","정선군","철원군","춘천시","태백시","평창군","홍천군","화천군","횡성군"] },
  { name: "대전", guguns: ["대덕구","동구","서구","유성구","중구"] },
  { name: "세종", guguns: ["세종"] },
  { name: "충남", guguns: ["계룡시","공주시","금산군","논산시","당진시","보령시","부여군","서산시","서천군","아산시","연기군","예산군","천안시","청양군","태안군","홍성군"] },
  { name: "충북", guguns: ["괴산군","단양군","보은군","영동군","옥천군","음성군","제천시","증평군","진천군","청원군","청주시","충주시"] },
  { name: "부산", guguns: ["강서구","금정구","기장군","남구","동구","동래구","부산진구","북구","사상구","사하구","서구","수영구","연제구","영도구","중구","해운대구"] },
  { name: "울산", guguns: ["남구","동구","북구","울주군","중구"] },
  { name: "경남", guguns: ["거제시","거창군","고성군","김해시","남해군","마산시","밀양시","사천시","산청군","양산시","의령군","진주시","진해시","창녕군","창원시","통영시","하동군","함안군","합천군"] },
  { name: "경북", guguns: ["경산시","경주시","고령군","구미시","군위군","김천시","문경시","봉화군","상주시","성주군","안동시","영덕군","영양군","영주시","영천시","예천군","울릉군","울진군","의성군","청도군","청송군","칠곡군","포항시"] },
  { name: "대구", guguns: ["남구","달서구","달성군","동구","북구","서구","수성구","중구"] },
  { name: "광주", guguns: ["광산구","남구","동구","북구","서구"] },
  { name: "전남", guguns: ["강진군","고흥군","곡성군","광양시","구례군","나주시","담양군","목포시","무안군","보성군","순천시","신안군","여수시","영광군","영암군","완도군","장성군","장흥군","진도군","함평군","해남군","화순군"] },
  { name: "전북", guguns: ["고창군","군산시","김제시","남원시","무주군","부안군","순창군","완주군","익산시","임실군","장수군","전주시","정읍시","진안군"] },
  { name: "제주", guguns: ["서귀포시","제주시"] }
];

// 캠페인 유형
const campaignTypes = [
  { value: "", label: "유형" },
  { value: "CAMP001", label: "방문형" },
  { value: "CAMP002", label: "포장형" },
  { value: "CAMP003", label: "배송형" },
  { value: "CAMP004", label: "구매형" },
];

// 카테고리
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

// 채널
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

// 정렬
const sorts = [
  { value: "latest", label: "최신순" },
  { value: "deadline", label: "마감임박순" },
  { value: "popular", label: "인기순" },
];

export default function CampaignSearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const initialBenefitSearch = query.get("benefitSearch") || "";

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [params, setParams] = useState({
    region: "",
    campaignType: "",
    categoryCode: "",
    channelCode: "",
    sort: "latest",
    page: 1,
    benefitSearch: initialBenefitSearch,
  });

  const [selectedRegion, setSelectedRegion] = useState(null);

  const updateParams = (updates) => {
    setParams((prev) => ({ ...prev, ...updates }));
  };

  // 🔹 URL query와 params 동기화 (검색 등)
  useEffect(() => {
    const keyword = query.get("benefitSearch") || "";
    setParams((prev) => ({ ...prev, benefitSearch: keyword, page: 1 }));
  }, [location.search]);

  // 🔹 캠페인 리스트 fetch
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
              data.paginationInfo.totalRecord / data.paginationInfo.recordCountPerPage
            ),
            firstPage: Math.max(1, data.paginationInfo.currentPage - 5),
            lastPage: Math.min(
              Math.ceil(
                data.paginationInfo.totalRecord / data.paginationInfo.recordCountPerPage
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

  // 🔹 초기화 버튼 클릭 시 모든 필터 + 검색어 + URL 초기화
  const handleReset = () => {
    setSelectedRegion(null);
    setParams({
      region: "",
      campaignType: "",
      categoryCode: "",
      channelCode: "",
      sort: "latest",
      page: 1,
      benefitSearch: "",
    });
    navigate("/campaigns", { replace: true }); // URL 초기화
  };

  return (
    <div className="w-full flex justify-center mb-48">
      <div className="w-full max-w-screen-xl px-4 flex flex-col gap-6">

        {/* 지역 */}
        <div className="flex mt-4 gap-4 w-full">
          <div>
            <h1 className="pl-2 mt-4 text-2xl font-semibold">지역</h1>
            <button
              onClick={handleReset}
              className="mt-2 ml-3 px-3 py-1.5 text-sm font-medium rounded-full bg-red-500 text-white hover:bg-red-600 transition"
            >
              <FaRedoAlt className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 border p-4">
            <div className="grid grid-cols-9 gap-2">
              {regions.map((region) => (
                <button
                  key={region.name}
                  onClick={() => {
                    if (selectedRegion === region) {
                      setSelectedRegion(null);
                      updateParams({ region: "", page: 1 });
                    } else {
                      setSelectedRegion(region);
                      updateParams({ region: region.name, page: 1 });
                    }
                  }}
                  className={`flex items-center justify-center py-1.5 px-2.5 text-xs rounded-lg cursor-pointer font-semibold ${
                    selectedRegion === region
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-zinc-300 border border-gray-300 dark:border-zinc-600"
                  }`}
                >
                  {region.name}
                </button>
              ))}
            </div>

            {selectedRegion && selectedRegion.name !== "재택" && (
              <div className="mt-3 border-t pt-2 grid grid-cols-6 gap-2">
                {selectedRegion.guguns.map((gugun) => {
                  const fullRegion = `${selectedRegion.name} ${gugun}`;
                  return (
                    <button
                      key={gugun}
                      onClick={() => updateParams({ region: fullRegion, page: 1 })}
                      className={`flex items-center justify-center py-1.5 px-2 text-xs rounded-lg cursor-pointer font-medium ${
                        params.region === fullRegion
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-zinc-300 border border-gray-300 dark:border-zinc-600"
                      }`}
                    >
                      {gugun}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 셀렉트박스 */}
        <div className="flex justify-end flex-wrap gap-4 items-center">
          <select value={params.campaignType} onChange={(e) => updateParams({ campaignType: e.target.value, page: 1 })} className="border rounded-full px-2 py-1 text-sm pr-6">
            {campaignTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>

          <select value={params.categoryCode} onChange={(e) => updateParams({ categoryCode: e.target.value, page: 1 })} className="border rounded-full px-2 py-1 text-sm pr-6">
            {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>

          <select value={params.channelCode} onChange={(e) => updateParams({ channelCode: e.target.value, page: 1 })} className="border rounded-full px-2 py-1 text-sm pr-6">
            {channels.map((ch) => <option key={ch.value} value={ch.value}>{ch.label}</option>)}
          </select>

          <select value={params.sort} onChange={(e) => updateParams({ sort: e.target.value, page: 1 })} className="border rounded-full px-2 py-1 text-sm pr-6">
            {sorts.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* 캠페인 카드 */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-60 bg-stone-200 dark:bg-zinc-700 animate-pulse rounded-xl" />)}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-4 text-center text-stone-500">캠페인이 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {campaigns.map((c) => <CampaignCardV2 key={c.campaignIdx} campaign={c} />)}
          </div>
        )}

        {/* 페이지네이션 */}
        <Pagination pagination={pagination} onPageChange={(newPage) => updateParams({ page: newPage })} />
      </div>
    </div>
  );
}