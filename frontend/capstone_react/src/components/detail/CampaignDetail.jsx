// src/features/campaigns/components/CampaignDetail.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiHeart,
  FiShare2,
  FiExternalLink,
  FiLock,
  FiTag,
  FiCalendar,
  FiMapPin,
  FiTruck,
  FiImage,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import CampaignCalendar from "./CampaignCalendar";
import MissionIconsGrid from "./MissionIconsGrid";
import { norm as normChannel, CHANNEL_SPECS } from "../../config/channelSpecs";
import { fmtDate } from "../../utils/date";
import { getCampaignDetail } from "../../api/campaigns/api";
import KakaoMap from "../../components/KakaoMap";

/* 날짜 유틸: "YYYY-MM-DD" → 로컬 정오(Date)로 안전 변환 */
function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0);
}
const toDate = (s) => parseLocalDate(s);

// end를 다음날 정오(+1일)로 맞춰 배타 범위에도 채워지게
const addDays = (date, n) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + n, 12, 0, 0);
const oneDayRange = (dt) => (dt ? { start: dt, end: addDays(dt, 1) } : null);
const dayRange = (start, end) => {
  if (!start || !end) return null;
  if (end < start) return null;
  return { start, end: addDays(end, 1) };
};

/* 주소 정제 유틸: 지오코딩 성공률 향상을 위해 층/호/괄호/특별시/광역시 접미 제거 */
const cleanseAddress = (s = "") =>
  s
    .replace(/\s*\d+\s*층.*$/g, "")  // "1층" 등 제거
    .replace(/\s*\d+\s*호.*$/g, "")  // "101호" 등 제거
    .replace(/\s*\([^)]+\)/g, "")    // "(지번)" 등 괄호 제거
    .replace(/^\s*대한민국\s*/, "")   // "대한민국" 접두 제거
    .trim();

/* 배지(이 파일 전용 간단 버전 — 공용 Badge를 쓴다면 교체 가능) */
const Badge = ({ children, tone = "green" }) => {
  const tones =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700"
      : tone === "blue"
      ? "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700"
      : tone === "stone"
      ? "bg-stone-50 text-stone-700 border-stone-200 dark:bg-zinc-800/60 dark:text-zinc-300 dark:border-zinc-700"
      : "bg-stone-50 text-stone-700 border-stone-200 dark:bg-zinc-800/60 dark:text-zinc-300 dark:border-zinc-700";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones}`}
    >
      {children}
    </span>
  );
};

/** 상세 페이지 (서버 연동) */
export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openScheduleInfo, setOpenScheduleInfo] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 서버에서 가져오기
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const detail = await getCampaignDetail(id);
        if (!ignore) setData(detail);
      } catch (e) {
        if (!ignore) setError(e?.message || "상세 조회 실패");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl p-4 md:p-6">
        <div className="h-40 animate-pulse rounded-2xl bg-stone-100 dark:bg-zinc-800" />
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="mx-auto w-full max-w-6xl p-6 text-sm text-red-600 dark:text-rose-400">
        {error || "데이터가 없습니다."}
      </div>
    );
  }

  // 서버 DTO 계약
  const isRecruitOpen = data.recruitStatus === "OPEN";
  const channelCode = normChannel(data.channelCode ?? data.channelName);
  const missionSpec = CHANNEL_SPECS[channelCode] ?? CHANNEL_SPECS.CAMC001;

  // 상품 URL: purchaseUrl 우선, 없으면 productUrl
  const productUrl = data.purchaseUrl || data.productUrl || null;

  // 날짜 필드 래핑
  const dates = {
    applyStart: data.applyStart,
    applyEnd: data.applyEnd,
    announce: data.announce,
    expStart: data.expStart,
    expEnd: data.expEnd,
    deadline: data.deadline,
  };

  // Date 객체
  const applyStart = toDate(dates.applyStart);
  const applyEnd = toDate(dates.applyEnd);
  const expStart = toDate(dates.expStart);
  const expEnd = toDate(dates.expEnd);
  const announce = toDate(dates.announce);
  const deadline = toDate(dates.deadline);
  const initialMonth = applyEnd ?? announce ?? deadline ?? new Date();

  const calendarRanges = [
    dayRange(applyStart, applyEnd) && {
      ...dayRange(applyStart, applyEnd),
      label: "모집",
      tone: "muted",
    },
    dayRange(expStart, expEnd) && {
      ...dayRange(expStart, expEnd),
      label: "체험기간",
      tone: "green",
    },
    oneDayRange(announce) && {
      ...oneDayRange(announce),
      label: "발표",
      tone: "amber",
    },
    oneDayRange(deadline) && {
      ...oneDayRange(deadline),
      label: "리뷰마감",
      tone: "violet",
    },
  ].filter(Boolean);

  // 방문형 정보 표시 여부
  const hasVisitInfo =
    data.address ||
    data.addressDetail ||
    data.expDay ||
    data.startTime ||
    data.endTime ||
    data.reservationNotice ||
    data.mapUrl;

  // 지도용 가공 데이터 (⚠️ 지도에는 주소만!)
  const addressForMap = cleanseAddress(data.address || ""); // 예: "서울시 강남구 테헤란로 1" → "서울 강남구 테헤란로 1"
  const titleForMap = data.shopName || data.title || "";

  return (
    <div className="mx-auto w-full max-w-6xl p-4 md:p-6">
      {/* 헤더 */}
      <div className="flex flex-col-reverse gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge tone="blue">{data.channelName ?? channelCode}</Badge>
            <Badge>
              {data.campaignType === "CAMP003" ? "배송형(온라인)" : "방문형"}
            </Badge>
            <Badge tone="stone">{data.categoryName ?? data.categoryCode}</Badge>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-stone-900 dark:text-zinc-100">
            {data.title}
          </h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-stone-500 dark:text-zinc-400">
            <span>주최자</span>
            <span className="font-medium text-stone-800 dark:text-zinc-200">
              {data.shopName}
            </span>
            <span className="inline-flex items-center gap-1">
              <FiLock /> OP
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-start">
          {/* 공유 */}
          <button
            className="rounded-xl border px-3 py-2 text-sm border-stone-200 bg-white hover:bg-stone-50 text-stone-700
                       dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200 transition"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: data.title,
                  text: data.shopName,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("링크가 복사되었습니다!");
              }
            }}
          >
            <FiShare2 className="mr-1 inline-block" /> 공유
          </button>
          {/* 찜 */}
          <button
            className="rounded-xl border px-3 py-2 text-sm border-stone-200 bg-white hover:bg-stone-50 text-stone-700
                       dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200 transition"
          >
            <FiHeart className="mr-1 inline-block" /> 찜
          </button>
        </div>
      </div>

      {/* 본문 2컬럼 */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* 좌측 카드 */}
        <div className="rounded-2xl border border-stone-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          {/* 상단 요약 */}
          <div className="border-b border-stone-200 dark:border-zinc-800 px-5 pb-3 pt-5">
            <div className="flex flex-wrap items-center gap-12">
              <div className="text-sm font-semibold text-stone-800 dark:text-zinc-200">
                제공상품/물품
              </div>
              <div className="mt-1 text-[15px] font-medium text-stone-900 dark:text-zinc-100 md:text-base">
                {data.benefitDetail}
              </div>
            </div>
          </div>

          {/* 항목 리스트 */}
          <div className="px-5 py-2">
            {/* 방문형 안내 */}
            {data.campaignType === "CAMP001" && hasVisitInfo && (
              <div className="grid grid-cols-[120px_1fr] gap-4 border-b border-stone-200 dark:border-zinc-800 py-6">
                <div className="flex items-center gap-2 text-[15px] font-semibold text-stone-800 dark:text-zinc-200">
                  <FiMapPin className="translate-y-[-1px]" />
                  <span>방문 및 예약 안내</span>
                </div>
                <div className="text-[15px] text-stone-800 dark:text-zinc-200">
                  {/* 표시용은 상세 포함 */}
                  <div>
                    {data.address}
                    {data.addressDetail ? ` ${data.addressDetail}` : ""}
                  </div>

                  {(data.expDay || data.startTime || data.endTime) && (
                    <div className="mt-1 text-xs text-stone-500 dark:text-zinc-400">
                      체험 가능 요일: {data.expDay ?? "-"}
                      <br />
                      체험 가능 시간 : {data.startTime ?? "--"}~
                      {data.endTime ?? "--"}
                    </div>
                  )}
                  {data.reservationNotice && (
                    <p className="mt-2 text-xs leading-5 text-stone-500 dark:text-zinc-400">
                      {data.reservationNotice}
                    </p>
                  )}

                  {/* 카카오 지도 표시 (⚠️ 지도에는 주소만 전달) */}
                  {data.address && (
                    <div className="mt-3">
                      <KakaoMap
                        address={addressForMap}              // ✅ 정제된 순수 주소만
                        title={titleForMap}                   // ✅ 상호/제목
                        height="220px"
                        level={3}
                      />
                      {/* 길찾기/큰지도 열기 링크 */}
                      <div className="mt-2 text-xs">
                        <a
                          href={`https://map.kakao.com/?q=${encodeURIComponent(
                            addressForMap
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-600 underline underline-offset-2 hover:text-sky-700
                   dark:text-sky-300 dark:hover:text-sky-200"
                        >
                          카카오맵에서 크게 보기 / 길찾기
                        </a>
                      </div>
                    </div>
                  )}

                  {data.mapUrl && (
                    <a
                      href={data.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-xs text-sky-600 underline underline-offset-2 hover:text-sky-700
                                 dark:text-sky-300 dark:hover:text-sky-200"
                    >
                      지도 열기
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* 주최자 */}
            <div className="grid grid-cols-[120px_1fr] gap-4 border-b border-stone-200 dark:border-zinc-800 py-10">
              <div className="flex items-center gap-2 text-[15px] font-semibold text-stone-800 dark:text-zinc-200">
                <FiLock className="translate-y-[-1px]" />
                <span>주최자</span>
              </div>
              <div className="text-[15px] pr-2 text-stone-900 dark:text-zinc-100">
                {data.shopName}
              </div>
            </div>

            {/* 배송/구매 안내 */}
            <div className="grid grid-cols-[150px_1fr] border-b border-stone-200 dark:border-zinc-800 py-10">
              <div className="flex items-center gap-2 text-[15px] font-semibold text-stone-800 dark:text-zinc-200">
                <FiTruck className="translate-y-[-1px]" />
                <span>배송 및 구매 안내</span>
              </div>
              <div className="text-[15px] text-stone-800 dark:text-zinc-200">
                <ul className="list-none space-y-1 pl-5 leading-6">
                  <li>선정되면 등록된 프로필 배송지로 제품 발송</li>
                  <li>제품 하자 외 단순변심 취소 시 왕복배송비 청구</li>
                </ul>
              </div>
            </div>

            {/* 키워드 */}
            <div className="grid grid-cols-[120px_1fr] gap-4 border-b border-stone-200 dark:border-zinc-800 py-10">
              <div className="flex items-center gap-2 text-[15px] font-semibold text-stone-800 dark:text-zinc-200">
                <FiTag className="translate-y-[-1px]" />
                <span>키워드 정보</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[data.keyword1, data.keyword2, data.keyword3]
                  .filter(Boolean)
                  .map((k, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-md border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-700
                                 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300"
                    >
                      {k}
                    </span>
                  ))}
              </div>
            </div>

            {/* 상품 URL */}
            {productUrl && (
              <div className="grid grid-cols-[120px_1fr] gap-4 border-b border-stone-200 dark:border-zinc-800 py-10">
                <div className="flex items-center gap-2 text-[15px] font-semibold text-stone-800 dark:text-zinc-200">
                  <FiExternalLink className="translate-y-[-1px]" />
                  <span>상품정보 URL</span>
                </div>
                <div className="text-[15px]">
                  <a
                    href={productUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-sky-600 underline underline-offset-2 hover:text-sky-700
                               dark:text-sky-300 dark:hover:text-sky-200"
                  >
                    {productUrl}
                  </a>
                </div>
              </div>
            )}

            {/* 체험단 미션 */}
            <div className="grid grid-cols-[120px_1fr] gap-4 border-b border-stone-200 dark:border-zinc-800 py-10">
              <div className="flex items-start gap-2 text-[15px] font-semibold text-stone-800 dark:text-zinc-200">
                <FiImage className="translate-y-[3px]" />
                <span>체험단 미션</span>
              </div>
              <MissionIconsGrid spec={missionSpec} missionHtml={data.mission} />
            </div>

            {/* 일정 요약 */}
            <div className="grid grid-cols-[120px_1fr] gap-4 py-3">
              <div className="flex items-center gap-2 text-[15px] font-semibold text-stone-800 dark:text-zinc-200">
                <FiCalendar className="translate-y-[-1px]" />
                <span>일정 요약</span>
              </div>
              <div className="space-y-1 text-[15px] text-stone-800 dark:text-zinc-200">
                <div>
                  신청기간: {fmtDate(dates.applyStart)} ~{" "}
                  {fmtDate(dates.applyEnd)}
                </div>
                <div>발표: {fmtDate(dates.announce)}</div>
                <div>
                  체험기간: {fmtDate(dates.expStart)} ~ {fmtDate(dates.expEnd)}
                </div>
                <div>리뷰 마감: {fmtDate(dates.deadline)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 우측 사이드 */}
        <aside className="space-y-4">
          <div
            className="overflow-hidden rounded-2xl border border-stone-200 bg-white
                          dark:border-zinc-800 dark:bg-zinc-900"
          >
            <img
              src={data.thumbnailUrl}
              alt="thumbnail"
              className="h-64 w-full object-cover"
              loading="lazy"
            />
            <div className="space-y-3 p-4">
              {/* 일정 텍스트 토글 */}
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-zinc-800">
                <div className="text-sm font-semibold text-stone-900 dark:text-zinc-100">
                  체험단 일정
                </div>
                <button
                  type="button"
                  onClick={() => setOpenScheduleInfo((v) => !v)}
                  className="mb-1 rounded-md border border-stone-200 px-2 py-1 text-xs text-stone-600 hover:bg-stone-50
                             dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition"
                >
                  {openScheduleInfo ? (
                    <FiChevronUp className="inline" />
                  ) : (
                    <FiChevronDown className="inline" />
                  )}
                </button>
              </div>

              {openScheduleInfo && (
                <div className="space-y-2 text-sm text-stone-800 dark:text-zinc-200">
                  <div className="flex items-center gap-3">
                    <span className="w-28 shrink-0 text-stone-500 dark:text-zinc-400">
                      체험단 신청기간
                    </span>
                    <span>
                      {fmtDate(dates.applyStart)} ~ {fmtDate(dates.applyEnd)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-28 shrink-0 text-stone-500 dark:text-zinc-400">
                      리뷰어 발표
                    </span>
                    <span>{fmtDate(dates.announce)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-28 shrink-0 text-stone-500 dark:text-zinc-400">
                      체험기간
                    </span>
                    <span>
                      {fmtDate(dates.expStart)} ~ {fmtDate(dates.expEnd)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-28 shrink-0 text-stone-500 dark:text-zinc-400">
                      리뷰 마감
                    </span>
                    <span>{fmtDate(dates.deadline)}</span>
                  </div>
                  <div className="mt-2 border-t border-stone-200 dark:border-zinc-800 pt-2 text-xs text-stone-600 dark:text-zinc-400">
                    실시간 지원 현황{" "}
                    <span className="font-semibold text-sky-600 dark:text-sky-300">
                      지원 {Number(data.applicants ?? 0).toLocaleString()}
                    </span>
                    / 모집 {data.recruitCount ?? "-"}
                  </div>
                </div>
              )}

              {/* 달력 */}
              <CampaignCalendar
                initialMonth={initialMonth}
                ranges={calendarRanges}
                bottomLabel={`${data.keyword3 ?? ""}${data.keyword2 ?? ""}`}
              />

              <button
                onClick={() => navigate(`/campaigns/${data.campaignIdx}/apply`)}
                className={`mt-2 w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isRecruitOpen
                    ? "bg-sky-600 text-white hover:bg-sky-700"
                    : "cursor-not-allowed bg-stone-200 text-stone-500 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
                disabled={!isRecruitOpen}
              >
                신청하기
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
