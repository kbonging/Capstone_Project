// src/features/campaigns/components/OwnerReviewPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createPortal } from "react-dom";
import {
  FiShare2, FiExternalLink, FiLock, FiTag, FiCalendar,
  FiMapPin, FiTruck, FiImage, FiChevronDown, FiChevronUp, FiX,
} from "react-icons/fi";
import CampaignCalendar from "../components/detail/CampaignCalendar";
import MissionIconsGrid from "../components/detail/MissionIconsGrid";
import { norm as normChannel, CHANNEL_SPECS } from "../config/channelSpecs";
import { fmtDate } from "../utils/date";
import { getCampaignDetail /*, getOwnerReviewList*/ } from "../api/campaigns/api";
import { toAbsoluteUrl } from "../utils/url";
import KakaoMap from "../components/KakaoMap";

/* ===== 공통 유틸 ===== */
function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0);
}
const toDate = (s) => parseLocalDate(s);
const addDays = (date, n) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + n, 12, 0, 0);
const oneDayRange = (dt) => (dt ? { start: dt, end: addDays(dt, 1) } : null);
const dayRange = (start, end) => {
  if (!start || !end) return null;
  if (end < start) return null;
  return { start, end: addDays(end, 1) };
};

const cleanseAddress = (s = "") =>
  s
    .replace(/\s*\d+\s*층.*$/g, "")
    .replace(/\s*\d+\s*호.*$/g, "")
    .replace(/\s*\([^)]+\)/g, "")
    .replace(/^\s*대한민국\s*/, "")
    .trim();

/* ===== 작은 컴포넌트 ===== */
const Badge = ({ children, tone = "green" }) => {
  const tones =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700"
      : tone === "blue"
      ? "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700"
      : "bg-stone-50 text-stone-700 border-stone-200 dark:bg-zinc-800/60 dark:text-zinc-300 dark:border-zinc-700";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones}`}>
      {children}
    </span>
  );
};

function Toast({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-x-0 top-3 z-[60] flex justify-center px-4">
      <div
        role="status"
        className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 shadow-lg
                   dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      >
        {children}
        <button aria-label="닫기" onClick={onClose} className="rounded-md p-1 hover:bg-stone-100 dark:hover:bg-zinc-800">
          <FiX />
        </button>
      </div>
    </div>
  );
}

/* ===== 리뷰 이미지 갤러리 ===== */
function Gallery({ images = [] }) {
  const [idx, setIdx] = useState(0);
  if (!images.length) {
    return (
      <div className="aspect-video w-full rounded-xl border border-stone-200 bg-stone-50 dark:border-zinc-800 dark:bg-zinc-800/40
                      flex items-center justify-center text-sm text-stone-400">
        이미지 없음
      </div>
    );
  }
  const cur = toAbsoluteUrl(images[Math.min(idx, images.length - 1)]);
  return (
    <div className="relative">
      <img
        src={cur}
        alt={`review-${idx}`}
        className="aspect-video w-full rounded-xl object-cover border border-stone-200 dark:border-zinc-800"
        loading="lazy"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border bg-white/80 px-3 py-1 text-sm backdrop-blur
                       hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/70 dark:hover:bg-zinc-900"
            aria-label="prev"
          >
            ‹
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border bg-white/80 px-3 py-1 text-sm backdrop-blur
                       hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/70 dark:hover:bg-zinc-900"
            aria-label="next"
          >
            ›
          </button>
          <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-2 py-0.5 text-[11px] text-white">
            {idx + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

/* ===== 메인: 리뷰 제출만 표시 ===== */
export default function OwnerReviewPage() {
  const { id } = useParams(); // campaignId

  const [data, setData] = useState(null);
  const [openScheduleInfo, setOpenScheduleInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 제출된 리뷰 목록
  const [rows, setRows] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  // 토스트
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // 프리뷰 모달
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const openPreview = (row) => { setPreviewItem(row); setPreviewOpen(true); };
  const closePreview = () => { setPreviewOpen(false); setPreviewItem(null); };

  /* 상세 로드 */
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
    return () => { ignore = true; };
  }, [id]);

  /* 리뷰 제출 목록 로드 (API 연결 지점) */
  useEffect(() => {
    if (!data) return;
    let ignore = false;
    (async () => {
      try {
        setListLoading(true);
        // const token = localStorage.getItem("token");
        // const res = await getOwnerReviewList(data.campaignIdx, token);
        // if (!ignore) setRows(res.list);

        // --- 데모용 Mock: 실제 API 연동 시 제거 ---
        const mock = [
          {
            id: 1,
            reviewerName: "리뷰어A",
            channel: "인스타그램",
            status: "제출",
            reviewUrl: "https://insta.example/review/xxx",
            submittedAt: "2025-09-10 14:22",
            title: "샐러드가 신선하고 소스가 최고!",
            excerpt: "야채가 아삭하고 신선했어요. 상큼한 드레싱과의 조합이 좋았고...",
            images: ["/uploads/reviews/101-1.jpg", "/uploads/reviews/101-2.jpg"],
            rating: 4.5,
            likes: 123,
            views: 2043,
          },
          {
            id: 2,
            reviewerName: "리뷰어B",
            channel: "블로그",
            status: "제출",
            reviewUrl: "https://blog.example.com/abcd",
            submittedAt: "2025-09-11 09:12",
            title: "자세한 후기 정리",
            excerpt: "구성품/배송/사용기/총평 순서로 정리했습니다...",
            images: [],
            rating: 4.0,
            likes: 45,
            views: 711,
          },
        ];
        if (!ignore) setRows(mock);
      } catch (e) {
        if (!ignore) {
          setRows([]);
          setToastMsg("리뷰 목록을 불러오지 못했습니다.");
          setToastOpen(true);
          setTimeout(() => setToastOpen(false), 2500);
        }
      } finally {
        if (!ignore) setListLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [data]);

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

  /* 표시용 매핑 */
  const channelCode = normChannel(data.channelCode ?? data.channelName);
  const missionSpec = CHANNEL_SPECS[channelCode] ?? CHANNEL_SPECS.CAMC001;

  const productUrl = data.purchaseUrl || data.productUrl || null;

  const dates = {
    applyStartDate: data.applyStartDate,
    applyEndDate: data.applyEndDate,
    announceDate: data.announceDate,
    expStartDate: data.expStartDate,
    expEndDate: data.expEndDate,
    deadlineDate: data.deadlineDate,
  };
  const applyStartDate = toDate(dates.applyStartDate);
  const applyEndDate = toDate(dates.applyEndDate);
  const expStartDate = toDate(dates.expStartDate);
  const expEndDate = toDate(dates.expEndDate);
  const announceDate = toDate(dates.announceDate);
  const deadlineDate = toDate(dates.deadlineDate);
  const initialMonth = applyEndDate ?? announceDate ?? deadlineDate ?? new Date();

  const calendarRanges = [
    dayRange(applyStartDate, applyEndDate) && {
      ...dayRange(applyStartDate, applyEndDate),
      label: "모집",
      tone: "muted",
    },
    dayRange(expStartDate, expEndDate) && {
      ...dayRange(expStartDate, expEndDate),
      label: "체험기간",
      tone: "green",
    },
    oneDayRange(announceDate) && {
      ...oneDayRange(announceDate),
      label: "발표",
      tone: "amber",
    },
    oneDayRange(deadlineDate) && {
      ...oneDayRange(deadlineDate),
      label: "리뷰마감",
      tone: "violet",
    },
  ].filter(Boolean);

  const hasVisitInfo =
    data.address || data.addressDetail || data.expDay || data.startTime || data.endTime || data.reservationNotice || data.mapUrl;
  const addressForMap = cleanseAddress(data.address || "");
  const titleForMap = data.shopName || data.title || "";

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: data.title,
          text: data.shopName,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setToastMsg("링크가 복사되었습니다!");
        setToastOpen(true);
        setTimeout(() => setToastOpen(false), 2500);
      }
    } catch {
      setToastMsg("공유에 실패했어요. 다시 시도해 주세요.");
      setToastOpen(true);
      setTimeout(() => setToastOpen(false), 2500);
    }
  };

  return (
    <>
      <Toast open={toastOpen} onClose={() => setToastOpen(false)}>
        {toastMsg}
      </Toast>

      <div className="mx-auto w-full max-w-6xl p-4 md:p-6">
        {/* 헤더 */}
        <div className="flex flex-col-reverse gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge tone="blue">{data.channelName ?? channelCode}</Badge>
              <Badge>{data.campaignType === "CAMP003" ? "배송형(온라인)" : "방문형"}</Badge>
              <Badge tone="stone">{data.categoryName ?? data.categoryCode}</Badge>
            </div>
            <h1 className="text-xl font-bold text-stone-900 dark:text-zinc-100 md:text-2xl">
              {data.title}
            </h1>
            <div className="mt-2 flex items-center gap-3 text-sm text-stone-500 dark:text-zinc-400">
              <span>주최자</span>
              <span className="font-medium text-stone-800 dark:text-zinc-200">{data.shopName}</span>
              <span className="inline-flex items-center gap-1">
                <FiLock /> OP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-start">
            <button
              className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-50
                         dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              onClick={handleShare}
              aria-label="공유"
            >
              <FiShare2 className="mr-1 inline-block" /> 공유
            </button>
          </div>
        </div>

        {/* 본문 2컬럼 */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* 좌측 카드: 상세 */}
          <div className="rounded-2xl border border-stone-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            {/* 상단 요약 */}
            <div className="border-b border-stone-200 px-5 pb-3 pt-5 dark:border-zinc-800">
              <div className="flex flex-wrap items-center gap-12">
                <div className="text-sm font-semibold text-stone-800 dark:text-zinc-200">제공상품/물품</div>
                <div className="mt-1 text-[15px] font-medium text-stone-900 dark:text-zinc-100 md:text-base">
                  {data.benefitDetail}
                </div>
              </div>
            </div>

            {/* 항목 리스트 */}
            <div className="px-5 py-2">
              {/* 방문형 안내 */}
              {data.campaignType === "CAMP001" && hasVisitInfo && (
                <div className="grid grid-cols-[120px_1fr] gap-4 border-b border-stone-200 py-6 dark:border-zinc-800">
                  <div className="flex items-center gap-2 text-[15px] font-semibold text-stone-800 dark:text-zinc-200">
                    <FiMapPin className="translate-y-[-1px]" />
                    <span>방문 및 예약 안내</span>
                  </div>
                  <div className="text-[15px] text-stone-800 dark:text-zinc-200">
                    <div>
                      {data.address}
                      {data.addressDetail ? ` ${data.addressDetail}` : ""}
                    </div>

                    {(data.expDay || data.startTime || data.endTime) && (
                      <div className="mt-1 text-xs text-stone-500 dark:text-zinc-400">
                        체험 가능 요일: {data.expDay ?? "-"}
                        <br />
                        체험 가능 시간 : {data.startTime ?? "--"}~{data.endTime ?? "--"}
                      </div>
                    )}
                    {data.reservationNotice && (
                      <p className="mt-2 text-xs leading-5 text-stone-500 dark:text-zinc-400">
                        {data.reservationNotice}
                      </p>
                    )}

                    {data.address && (
                      <div className="mt-3">
                        <div className="overflow-hidden rounded-xl border border-stone-200 dark:border-zinc-800">
                          <KakaoMap address={addressForMap} title={titleForMap} height="220px" level={3} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 주최자 */}
              <div className="grid grid-cols-[120px_1fr] gap-4 border-b border-stone-200 py-10 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-[15px] font-semibold text-stone-800 dark:text-zinc-200">
                  <FiLock className="translate-y-[-1px]" />
                  <span>주최자</span>
                </div>
                <div className="pr-2 text-[15px] text-stone-900 dark:text-zinc-100">{data.shopName}</div>
              </div>

              {/* 배송/구매 안내 */}
              <div className="grid grid-cols-[150px_1fr] border-b border-stone-200 py-10 dark:border-zinc-800">
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
              <div className="grid grid-cols-[120px_1fr] gap-4 border-b border-stone-200 py-10 dark:border-zinc-800">
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
                <div className="grid grid-cols-[120px_1fr] gap-4 border-b border-stone-200 py-10 dark:border-zinc-800">
                  <div className="flex items-center gap-2 text-[15px] font-semibold text-stone-800 dark:text-zinc-200">
                    <FiExternalLink className="translate-y-[-1px]" />
                    <span>상품정보 URL</span>
                  </div>
                  <div className="text-[15px]">
                    <a
                      href={productUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-sky-600 underline underline-offset-2 hover:text-sky-700 dark:text-sky-300 dark:hover:text-sky-200"
                    >
                      {productUrl}
                    </a>
                  </div>
                </div>
              )}

              {/* 체험단 미션 */}
              <div className="grid grid-cols-[120px_1fr] gap-4 border-b border-stone-200 py-10 dark:border-zinc-800">
                <div className="flex items-start gap-2 text-[15px] font-semibold text-stone-800 dark:text-zinc-200">
                  <FiImage className="translate-y-[3px]" />
                  <span>체험단 미션</span>
                </div>
                <MissionIconsGrid spec={missionSpec} missionRaw={data.mission} />
              </div>

              {/* 일정 요약 */}
              <div className="grid grid-cols-[120px_1fr] gap-4 py-3">
                <div className="flex items-center gap-2 text-[15px] font-semibold text-stone-800 dark:text-zinc-200">
                  <FiCalendar className="translate-y-[-1px]" />
                  <span>일정 요약</span>
                </div>
                <div className="space-y-1 text-[15px] text-stone-800 dark:text-zinc-200">
                  <div>신청기간: {fmtDate(dates.applyStartDate)} ~ {fmtDate(dates.applyEndDate)}</div>
                  <div>발표: {fmtDate(dates.announceDate)}</div>
                  <div>체험기간: {fmtDate(dates.expStartDate)} ~ {fmtDate(dates.expEndDate)}</div>
                  <div>리뷰 마감: {fmtDate(dates.deadlineDate)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 우측 사이드: sticky 카드 */}
          <aside className="space-y-4">
            <div className="lg:sticky lg:top-6 self-start">
              <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <img
                  src={toAbsoluteUrl(data.thumbnailUrl)}
                  alt="thumbnail"
                  className="h-64 w-full object-cover"
                  loading="lazy"
                />
                <div className="space-y-3 p-4">
                  {/* 일정 토글 */}
                  <div className="flex items-center justify-between border-b border-stone-200 dark:border-zinc-800">
                    <div className="text-sm font-semibold text-stone-900 dark:text-zinc-100">체험단 일정</div>
                    <button
                      type="button"
                      onClick={() => setOpenScheduleInfo((v) => !v)}
                      className="mb-1 rounded-md border border-stone-200 px-2 py-1 text-xs text-stone-600 transition hover:bg-stone-50
                                 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      aria-expanded={openScheduleInfo}
                      aria-controls="schedule-panel"
                    >
                      {openScheduleInfo ? <FiChevronUp className="inline" /> : <FiChevronDown className="inline" />}
                    </button>
                  </div>

                  {openScheduleInfo && (
                    <div id="schedule-panel" className="space-y-2 text-sm text-stone-800 dark:text-zinc-200">
                      <div className="flex items-center gap-3">
                        <span className="w-28 shrink-0 text-stone-500 dark:text-zinc-400">체험단 신청기간</span>
                        <span>{fmtDate(dates.applyStartDate)} ~ {fmtDate(dates.applyEndDate)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-28 shrink-0 text-stone-500 dark:text-zinc-400">리뷰어 발표</span>
                        <span>{fmtDate(dates.announceDate)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-28 shrink-0 text-stone-500 dark:text-zinc-400">체험기간</span>
                        <span>{fmtDate(dates.expStartDate)} ~ {fmtDate(dates.expEndDate)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-28 shrink-0 text-stone-500 dark:text-zinc-400">리뷰 마감</span>
                        <span>{fmtDate(dates.deadlineDate)}</span>
                      </div>
                    </div>
                  )}

                  {/* 달력 */}
                  <CampaignCalendar initialMonth={initialMonth} ranges={calendarRanges} />
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ===== 제출된 리뷰 목록 (단일 표) ===== */}
        <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-3 text-sm font-semibold text-stone-900 dark:text-zinc-100">
            제출된 리뷰 ({rows.length})
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full table-auto text-sm">
              <thead className="border-b border-stone-200 text-stone-500 dark:border-zinc-800">
                <tr className="h-10">
                  <th className="text-left px-3">리뷰어</th>
                  <th className="text-left px-3">채널</th>
                  <th className="text-left px-3">상태</th>
                  <th className="text-left px-3">리뷰 URL</th>
                  <th className="text-left px-3">리뷰 프리뷰</th>
                  <th className="text-left px-3">제출일</th>
                </tr>
              </thead>
              <tbody>
                {listLoading ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-stone-500 dark:text-zinc-400">
                      불러오는 중…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-stone-500 dark:text-zinc-400">
                      제출된 리뷰가 없습니다.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-stone-100 hover:bg-stone-50 dark:border-zinc-800 dark:hover:bg-zinc-800/40"
                    >
                      <td className="px-3 py-3">{r.reviewerName}</td>
                      <td className="px-3 py-3">{r.channel}</td>
                      <td className="px-3 py-3">{r.status || "제출"}</td>
                      <td className="px-3 py-3">
                        {r.reviewUrl ? (
                          <a
                            href={r.reviewUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-600 underline underline-offset-2"
                          >
                            {r.reviewUrl}
                          </a>
                        ) : (
                          <span className="text-stone-400">-</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        {r.excerpt || r.title || (r.images && r.images.length) ? (
                          <div className="flex items-start gap-3">
                            {r.images && r.images.length > 0 ? (
                              <img
                                src={toAbsoluteUrl(r.images[0])}
                                alt="preview"
                                className="w-16 h-16 rounded-md object-cover border border-stone-200 dark:border-zinc-700"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-md bg-stone-100 dark:bg-zinc-800 flex items-center justify-center text-xs text-stone-400">
                                N/A
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="truncate font-medium text-stone-900 dark:text-zinc-100">
                                {r.title || "제목 없음"}
                              </div>
                              <div className="line-clamp-2 text-xs text-stone-600 dark:text-zinc-400">
                                {r.excerpt || "요약 없음"}
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-[11px] text-stone-500 dark:text-zinc-400">
                                {typeof r.rating === "number" && <span>평점 {r.rating.toFixed(1)} / 5</span>}
                                {typeof r.likes === "number" && <span>좋아요 {r.likes}</span>}
                                {typeof r.views === "number" && <span>조회수 {r.views}</span>}
                              </div>
                              <button
                                onClick={() => openPreview(r)}
                                className="mt-1 inline-flex items-center rounded-md border border-stone-200 px-2 py-1 text-xs text-stone-700 hover:bg-stone-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                              >
                                자세히 보기
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-stone-400">미리보기 없음</span>
                        )}
                      </td>
                      <td className="px-3 py-3">{r.submittedAt || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* 리뷰 프리뷰 모달 */}
      {previewOpen && previewItem && createPortal(
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/50" onClick={closePreview} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl rounded-2xl border border-stone-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between border-b border-stone-200 p-4 dark:border-zinc-800">
                <div className="text-sm font-semibold text-stone-900 dark:text-zinc-100">리뷰 미리보기</div>
                <button
                  onClick={closePreview}
                  className="rounded-md p-2 text-stone-500 hover:bg-stone-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  aria-label="닫기"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 grid grid-cols-1 gap-4 md:grid-cols-[1.1fr_0.9fr]">
                <Gallery images={previewItem.images || []} />

                <div className="min-w-0">
                  <div className="truncate text-base font-semibold text-stone-900 dark:text-zinc-100">
                    {previewItem.title || "제목 없음"}
                  </div>
                  <div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-700 dark:text-zinc-300">
                    {previewItem.excerpt || "요약 정보가 없습니다."}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-zinc-400">
                    <span>리뷰어: <b className="text-stone-700 dark:text-zinc-200">{previewItem.reviewerName}</b></span>
                    <span>채널: {previewItem.channel}</span>
                    {typeof previewItem.rating === "number" && <span>평점 {previewItem.rating.toFixed(1)} / 5</span>}
                    {typeof previewItem.likes === "number" && <span>좋아요 {previewItem.likes}</span>}
                    {typeof previewItem.views === "number" && <span>조회수 {previewItem.views}</span>}
                    {previewItem.submittedAt && <span>제출일 {previewItem.submittedAt}</span>}
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    {previewItem.reviewUrl && (
                      <a
                        href={previewItem.reviewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-lg border border-sky-300 bg-sky-50 px-3 py-2 text-sm text-sky-700 hover:bg-sky-100 dark:border-sky-700 dark:bg-sky-950/40 dark:text-sky-300"
                      >
                        원문 열기
                      </a>
                    )}
                    <button
                      onClick={() => navigator.clipboard?.writeText(previewItem.reviewUrl || "")}
                      className="inline-flex items-center rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                      링크 복사
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
