// src/features/reviews/ReviewSubmitPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiUpload, FiX, FiLock, FiCalendar, FiImage, FiTag, FiExternalLink } from "react-icons/fi";
import { postReviewProof } from "../api/reviews";
import { getCampaignDetail } from "../api/campaigns/api";
import { toAbsoluteUrl } from "../utils/url";
import { fmtDate } from "../utils/date";
import MissionIconsGrid from "../components/detail/MissionIconsGrid";
import { norm as normChannel, CHANNEL_SPECS } from "../config/channelSpecs";

/* 미니 배지 */
const Badge = ({ children, tone = "stone" }) => {
  const tones =
    tone === "blue"
      ? "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700"
      : tone === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700"
      : "bg-stone-50 text-stone-700 border-stone-200 dark:bg-zinc-800/60 dark:text-zinc-300 dark:border-zinc-700";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones}`}>
      {children}
    </span>
  );
};

export default function ReviewSubmitPage() {
  // 라우트는 /campaigns/:id/reviews/submit 이므로 id가 올 가능성이 큼
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 여러 경로를 통해 들어온 캠페인ID를 튼튼하게 복원
  const cidRaw =
    params.campaignId ??
    params.id ??
    location.state?.campaignId ??
    new URLSearchParams(location.search).get("campaignId");

  // 문자열로 통일 (숫자/문자 혼용 방지)
  const campaignId = cidRaw ? String(cidRaw) : null;

  // 상세
  const [data, setData] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [detailError, setDetailError] = useState(null);

  // 폼
  const token = useMemo(() => localStorage.getItem("token") || "", []);
  const [reviewUrl, setReviewUrl] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const valid = reviewUrl.trim().length > 0 && !!file && !submitting;

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!campaignId) { // 캠페인 ID 없으면 호출 금지
        setLoadingDetail(false);
        setDetailError("캠페인 ID가 없어 상세를 불러올 수 없습니다.");
        return;
      }
      try {
        setLoadingDetail(true);
        const d = await getCampaignDetail(campaignId);
        if (!ignore) setData(d);
      } catch (e) {
        if (!ignore) setDetailError(e?.message || "상세 정보를 불러올 수 없습니다.");
      } finally {
        if (!ignore) setLoadingDetail(false);
      }
    })();
    return () => { ignore = true; };
  }, [campaignId]);

  // 폼 핸들러
  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
  };
  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!valid || !campaignId) return;
    try {
      setSubmitting(true);
      await postReviewProof({ token, campaignId, reviewUrl: reviewUrl.trim(), file });
      alert("리뷰 인증이 등록되었습니다.");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert(err?.message || "등록에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  // 요약용
  const channelCode = data ? normChannel(data.channelCode ?? data.channelName) : null;
  const missionSpec = channelCode ? (CHANNEL_SPECS[channelCode] ?? CHANNEL_SPECS.CAMC001) : null;
  // const productUrl = data?.purchaseUrl || data?.productUrl || null;
  // const dates = data
  //   ? {
  //       applyStartDate: data.applyStartDate,
  //       applyEndDate: data.applyEndDate,
  //       announceDate: data.announceDate,
  //       expStartDate: data.expStartDate,
  //       expEndDate: data.expEndDate,
  //       deadlineDate: data.deadlineDate,
  //     }
  //   : {};

  return (
    <div className="mx-auto w-full max-w-6xl p-4 md:p-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* 좌측: 디테일 요약 */}
        <div className="rounded-2xl border border-stone-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          {loadingDetail ? (
            <div className="h-40 animate-pulse rounded-2xl bg-stone-100 dark:bg-zinc-800" />
          ) : detailError ? (
            <div className="p-6 text-sm text-rose-500">{detailError}</div>
          ) : (
            <>
              <div className="border-b border-stone-200 px-5 pb-4 pt-5 dark:border-zinc-800">
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

              <div className="px-5 py-4">
                <div className="flex flex-wrap items-center gap-12">
                  <div className="text-sm font-semibold text-stone-800 dark:text-zinc-200">제공상품/물품</div>
                  <div className="mt-1 text-[15px] font-medium text-stone-900 dark:text-zinc-100 md:text-base">
                    {data.benefitDetail}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-4 border-t border-stone-200 px-5 py-6 dark:border-zinc-800">
                <div className="flex items-start gap-2 text-[15px] font-semibold text-stone-800 dark:text-zinc-200">
                  <FiImage className="translate-y-[3px]" />
                  <span>체험단 미션</span>
                </div>
                <div>
                  <MissionIconsGrid spec={missionSpec} missionRaw={data.mission} />
                </div>
              </div>

              {(data.keyword1 || data.keyword2 || data.keyword3) && (
                <div className="grid grid-cols-[120px_1fr] gap-4 border-t border-stone-200 px-5 py-6 dark:border-zinc-800">
                  <div className="flex items-center gap-2 text-[15px] font-semibold text-stone-800 dark:text-zinc-200">
                    <FiTag className="translate-y-[-1px]" />
                    <span>키워드 정보</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[data.keyword1, data.keyword2, data.keyword3].filter(Boolean).map((k, i) => (
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
              )}

              <div className="grid grid-cols-[120px_1fr] gap-4 border-t border-stone-200 px-5 py-6 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-[15px] font-semibold text-stone-800 dark:text-zinc-200">
                  <FiCalendar className="translate-y-[-1px]" />
                  <span>일정 요약</span>
                </div>
                <div className="space-y-1 text-[15px] text-stone-800 dark:text-zinc-200">
                  <div>신청기간: {fmtDate(data.applyStartDate)} ~ {fmtDate(data.applyEndDate)}</div>
                  <div>발표: {fmtDate(data.announceDate)}</div>
                  <div>체험기간: {fmtDate(data.expStartDate)} ~ {fmtDate(data.expEndDate)}</div>
                  <div>리뷰 마감: {fmtDate(data.deadlineDate)}</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 우측: 썸네일 + 리뷰 등록 폼 */}
        <aside>
          <div className="sticky top-6 space-y-4">
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              {loadingDetail ? (
                <div className="h-64 w-full animate-pulse bg-stone-100 dark:bg-zinc-800" />
              ) : (
                <>
                  <img
                    src={toAbsoluteUrl(data?.thumbnailUrl)}
                    alt="thumbnail"
                    className="h-64 w-full object-cover"
                    loading="lazy"
                  />
                  {data && (data.purchaseUrl || data.productUrl) && (
                    <div className="border-t border-stone-200 p-4 text-[15px] dark:border-zinc-800">
                      <div className="mb-1 flex items-center gap-2 text-[15px] font-semibold text-stone-800 dark:text-zinc-200">
                        <FiExternalLink className="translate-y-[-1px]" />
                        <span>상품정보 URL</span>
                      </div>
                      <a
                        href={data.purchaseUrl || data.productUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="break-all text-sky-600 underline underline-offset-2 hover:text-sky-700 dark:text-sky-300 dark:hover:text-sky-200"
                      >
                        {data.purchaseUrl || data.productUrl}
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>

            <form onSubmit={onSubmit} className="rounded-2xl border border-zinc-200 bg-white p-6  dark:border-zinc-700 dark:bg-zinc-900">
              <h2 className="mb-5 text-center text-lg font-bold text-zinc-900 dark:text-zinc-100">리뷰 등록</h2>

              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">블로그 리뷰 URL</label>
              <input
                value={reviewUrl}
                onChange={(e) => setReviewUrl(e.target.value)}
                type="url"
                required
                placeholder="등록하신 리뷰의 URL을 입력해 주세요."
                className="mb-4 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-sky-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />

              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">파일 등록 (1개)</label>
                {file && (
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                  >
                    <FiX /> 제거
                  </button>
                )}
              </div>

              <div
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                className="mb-4 grid place-items-center rounded-md border border-dashed border-zinc-300 p-3 text-sm text-zinc-500 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
              >
                {file ? (
                  <div className="w-full truncate text-center">{file.name}</div>
                ) : (
                  <>
                    <div className="pointer-events-none mb-1">
                      <FiUpload className="inline" /> 파일을 드래그하거나 클릭해 업로드
                    </div>
                    <div className="text-xs text-zinc-400">스마트스토어 또는 영수증 리뷰 캡처본 1개 업로드</div>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.png,.jpg,.jpeg,.webp,.pdf"
                  onChange={onPickFile}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 rounded-md border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  파일 선택
                </button>
              </div>

              <input
                disabled
                value="스마트스토어 or 영수증 리뷰 캡처본을 업로드 해주세요."
                className="mb-5 w-full cursor-not-allowed rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800"
                readOnly
              />

              <button
                type="submit"
                disabled={!valid || !campaignId}
                className={`w-full rounded-md px-4 py-2.5 text-sm font-semibold ${
                  valid && campaignId ? "bg-sky-500 text-white hover:bg-sky-600" : "bg-sky-200 text-white"
                }`}
              >
                {submitting ? "등록 중…" : "등록하기"}
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
