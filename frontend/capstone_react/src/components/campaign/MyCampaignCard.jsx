import React from "react";
import { useNavigate } from "react-router-dom";
import { toAbsoluteUrl } from "./../../utils/url";

function toRemainDays(item) {
  if (typeof item?.remainDays === "number") return item.remainDays;
  const d = item?.applyEndDate || item?.endDate;
  if (!d) return null;
  const end = new Date(d);
  const today = new Date();
  end.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.ceil((end - today) / (1000 * 60 * 60 * 24));
}

function StatusBadge({ code, name }) {
  const map = {
    CAMAPP_APPROVED: { bg: "bg-emerald-100", text: "text-emerald-700", label: "당첨" },
    CAMAPP_REJECTED: { bg: "bg-rose-100",    text: "text-rose-700",    label: "탈락" },
    CAMAPP_PENDING:  { bg: "bg-zinc-100",    text: "text-zinc-700",    label: "대기" },
    CAMAPP_CANCELLED:{ bg: "bg-zinc-200",    text: "text-zinc-700",    label: "취소" },
  };
  const style = map[code] ?? { bg: "bg-zinc-100", text: "text-zinc-700", label: name || "상태" };
  const label = style.label || name;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[12px] font-semibold ${style.bg} ${style.text}`}>
      {label}
    </span>
  );
}

function formatRemain(remain) {
  if (remain === null || remain === undefined) return null;
  if (remain > 0) return `${remain} 일 남음`;
  if (remain === 0) return "오늘 마감";
  return "마감";
}

/**
 * props
 * - item
 * - onCancel(applicationIdx)
 * - isNew
 * - onOpen(applicationIdx)
 */
export default function MyCampaignCard({ item, onCancel, isNew, onOpen }) {
  const navigate = useNavigate();

  const remain           = toRemainDays(item);
  const applicationIdx   = item.applicationIdx;
  const campaignIdx      = item.campaignIdx;
  const title            = item.title;
  const thumbnailUrl     = item.thumbnailUrl;
  const appliedCount     = item.appliedCount ?? 0;
  const recruitCount     = item.recruitCount ?? 0;
  const benefitText      = item.benefitText;
  const channelName      = item.channelName;
  const campaignTypeName = item.campaignTypeName;
  const categoryName     = item.categoryName;
  const rewardPoint      = item.rewardPoint;

  // 발표일 전 마스킹된 상태 사용
  const displayStatusCode = item.displayStatusCode ?? item.applyStatusCode;
  const displayStatusName = item.displayStatusName ?? item.applyStatusName;

  // 백엔드 계산값을 신뢰
  const showCancel = !!item.cancelable;

  // 절대경로 보완 (이미 http/https면 그대로)
  const imgSrc = /^https?:\/\//i.test(thumbnailUrl || "") ? thumbnailUrl : toAbsoluteUrl(thumbnailUrl);

  //  이미지 클릭 시 리뷰등록 페이지로 이동
  const goReviewSubmit = (e) => {
    e.stopPropagation(); // 카드의 onClick(onOpen)과 충돌 방지
    if (!campaignIdx) return;
    navigate(`/campaigns/${campaignIdx}/reviews/submit`, {
      state: { applicationIdx }, // 필요 시 리뷰 등록 페이지에서 활용
    });
  };

  return (
    // flex 레이아웃에서 폭 줄어듦 방지
    <div className="w-[220px] shrink-0">
      {/* 카드 전체 클릭: 기존처럼 읽음 처리 등 */}
      <div
        className="relative w-full h-[160px] overflow-hidden rounded-md border bg-white cursor-pointer"
        onClick={() => onOpen?.(applicationIdx)}
        title={title}
      >
        {/* 썸네일 클릭 → 리뷰등록으로 이동 */}
        {thumbnailUrl ? (
          <img
            src={imgSrc}
            alt={title}
            onClick={goReviewSubmit}
            role="button"
            aria-label="리뷰 등록으로 이동"
            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition"
          />
        ) : (
          <div
            onClick={goReviewSubmit}
            role="button"
            aria-label="리뷰 등록으로 이동"
            className="w-full h-full grid place-items-center text-sm text-zinc-400 hover:opacity-90 transition"
          >
            no image
          </div>
        )}

        {/* 좌상단: #캠페인ID */}
        <div className="absolute top-1.5 left-2 text-[11px] text-zinc-100/90 bg-black/40 rounded px-1.5 py-0.5">
          #{campaignIdx}
        </div>

        {/* 우상단: 상태 배지 */}
        <div className="absolute top-1.5 right-2">
          <StatusBadge code={displayStatusCode} name={displayStatusName} />
        </div>

        {/* 우하단: 취소 (백엔드에서 OK면 노출) */}
        {showCancel && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel?.(applicationIdx);
            }}
            className="absolute bottom-2 right-2 text-xs rounded-md px-2 py-1 bg-white/85 hover:bg-rose-50 border border-rose-200 text-rose-700"
            title="신청 취소"
          >
            취소
          </button>
        )}
      </div>

      {/* 이미지 아래: 남은일수 / 신청현황 */}
      <div className="flex items-center justify-between text-[13px] mt-1.5 px-0.5">
        {formatRemain(remain) ? (
          <div className="font-semibold">
            <span className={remain > 0 ? "text-emerald-600" : remain === 0 ? "text-amber-600" : "text-zinc-500"}>
              {formatRemain(remain)}
            </span>
          </div>
        ) : <span />}
        <div className="text-zinc-600">
          신청 <span className="text-emerald-600 font-semibold">{appliedCount}</span> / {recruitCount}
        </div>
      </div>

      {/* 제목 */}
      <div className="mt-2">
        <h3 className="text-[17px] font-semibold leading-snug line-clamp-1">{title}</h3>
      </div>

      {/* 혜택 설명 */}
      {benefitText && (
        <p className="mt-2 text-[13px] text-zinc-600 leading-relaxed">{benefitText}</p>
      )}

      {/* 채널/유형/카테고리 + New 뱃지 */}
      <div className="mt-2 flex items-center flex-wrap gap-x-1.5 gap-y-1 text-[13px]">
        {channelName && <span className="text-zinc-600">{channelName}</span>}
        {campaignTypeName && <span className="text-zinc-500">| {campaignTypeName}</span>}
        {categoryName && (
          <span className="text-zinc-500 inline-flex items-center gap-2">
            | {categoryName}
            {isNew && (
              <span className="inline-flex h-5 px-1.5 items-center justify-center rounded-md 
                               bg-rose-100 text-rose-400 text-[11px] font-bold border border-rose-200">
                N
              </span>
            )}
          </span>
        )}
      </div>

      {/* 포인트 배지 */}
      {typeof rewardPoint === "number" && (
        <div className="mt-2">
          <span className="inline-block rounded-md bg-sky-100 text-sky-700 text-[13px] font-semibold px-3 py-1">
            {rewardPoint.toLocaleString()} P
          </span>
        </div>
      )}
    </div>
  );
}
