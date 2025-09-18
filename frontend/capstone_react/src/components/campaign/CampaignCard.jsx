import React from "react";
import { FiMapPin, FiHeart } from "react-icons/fi";
import Badge from "../common/Badge";
import { toAbsoluteUrl } from "../../utils/url";

export default function CampaignCard({
  data,
  isActive = false,
  cropped = true,
}) {
  const isClosed = !!data?.isClosed || (typeof data?.daysLeft === "number" && data.daysLeft < 0);

  return (
    <a
      href={isClosed ? undefined : `/campaign/${data.campaignIdx}`}
      onClick={(e) => {
        if (isClosed) e.preventDefault(); // 종료 시 클릭 막기(원하면 제거)
      }}
      className={[
        "relative block rounded-xl border",
        "border-stone-200 dark:border-zinc-700",
        "bg-white dark:bg-zinc-700",
        "shadow-sm hover:shadow-lg",
        "overflow-hidden",
        "h-full flex flex-col",
        "transition-transform duration-300 ease-out origin-left",
        // 종료된 카드면 확대/호버 효과 제거
        isClosed ? "pointer-events-auto" : "",
        // 종료된 카드 전체 톤 다운
        isClosed ? "opacity-90" : "",
      ].join(" ")}
      aria-disabled={isClosed}
    >
      {/* 비활성 카드 오른쪽 페이드(살짝 잘린 느낌) */}
      {cropped && (
        <span className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white/95 to-transparent dark:from-zinc-700/95" />
      )}

      {/* 썸네일 */}
      <div className="relative w-full h-48 md:h-56 overflow-hidden">
        <img
          src={toAbsoluteUrl(data.thumbnailUrl)}
          alt={data.title}
          loading="lazy"
          className={[
            "h-full w-full object-cover",
            "transition-transform duration-300 ease-out origin-left",
            // 종료면 스케일/호버 제거 + 흑백/어둡게
            isClosed ? "grayscale brightness-75" : isActive ? "scale-[1.03]" : "",
          ].join(" ")}
        />

        {/* 좌상단 배지 (기존 + 종료 배지 추가) */}
        <div className="absolute left-2 top-2 flex gap-2">
          {data.badgeLeft?.map((b, i) => (
            <Badge key={i} tone={b.tone}>
              {b.text}
            </Badge>
          ))}
          {isClosed && (
            <Badge tone="rose">종료</Badge>
          )}
        </div>

        {/* 종료 오버레이 */}
        {isClosed && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
            <span className="text-white text-sm sm:text-base font-semibold tracking-wide">
              종료된 체험단
            </span>
          </div>
        )}
      </div>

      {/* 본문 */}
      <div className="p-3 flex-1 flex flex-col">
        <div
          className={[
            "flex items-center justify-between text-[11px]",
            "text-stone-500 dark:text-zinc-400",
          ].join(" ")}
        >
          <div className="flex items-center gap-2">
            <span className={["font-medium", isClosed ? "text-stone-400" : "text-emerald-600"].join(" ")}>
              {typeof data.daysLeft === "number"
                ? (data.daysLeft < 0 ? "마감" : `${data.daysLeft}일 남음`)
                : "기간 정보 없음"}
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">
              신청{" "}
              <b className="text-stone-800 dark:text-zinc-200">
                {data.applicants ?? 0}
              </b>{" "}
              / {data.applyLimit ?? "-"}
            </span>
          </div>
          <div className={["flex items-center gap-1", isClosed ? "text-stone-400" : "text-sky-600"].join(" ")}>
            <FiHeart />
            {data.likes ?? 0}
          </div>
        </div>

        <h3
          className={[
            "mt-1 line-clamp-1 text-sm font-semibold",
            "text-stone-900 dark:text-zinc-100",
            isClosed ? "opacity-80" : "",
          ].join(" ")}
          title={data.title}
        >
          {data.title}
        </h3>

        <p
          className={[
            "mt-1 line-clamp-2 text-xs",
            "text-stone-600 dark:text-zinc-400",
            isClosed ? "opacity-75" : "",
          ].join(" ")}
        >
          {data.subtitle}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-1 text-[10px] text-stone-600 dark:text-zinc-400">
          <Badge tone="slate">{data.channelName}</Badge>
          <Badge tone="slate">{data.campaignTypeName}</Badge>
          <Badge tone="slate">{data.categoryName}</Badge>
          {data.region && (
            <span className="ml-1 inline-flex items-center gap-1">
              <FiMapPin />
              {data.region}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-[11px] text-stone-600 dark:text-zinc-400">
            {data.rewardLabel}
          </span>
          {data.rewardPoint && (
            <span className={[
              "rounded-md border px-2 py-0.5 text-[11px] font-semibold",
              "border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-800/40",
              isClosed ? "opacity-70" : "text-sky-700 dark:text-sky-300",
            ].join(" ")}>
              {Number(data.rewardPoint).toLocaleString()} P
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
