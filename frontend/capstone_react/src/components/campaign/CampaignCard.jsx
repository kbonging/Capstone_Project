import React from "react";
import { FiMapPin, FiHeart } from "react-icons/fi";
import Badge from "../common/Badge";

export default function CampaignCard({
  data,
  isActive = false,
  cropped = true,
}) {
  return (
    <a
      href={`/campaign/${data.campaignIdx}`}
      className={[
        "relative block rounded-xl border",
        "border-stone-200 dark:border-zinc-700",
        "bg-white dark:bg-zinc-700",
        "shadow-sm hover:shadow-lg",
        "overflow-hidden",
        "h-full flex flex-col",
        // 한쪽(왼쪽) 고정 확대 → 오른쪽으로만 커지는 느낌
        "transition-transform duration-300 ease-out origin-left",
        isActive ? "scale-[1.02]" : "",
      ].join(" ")}
    >
      {/* 비활성 카드 오른쪽 페이드(살짝 잘린 느낌) */}
      {cropped && (
        <span className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white/95 to-transparent dark:from-zinc-700/95" />
      )}

      {/* 썸네일: 고정 높이로 카드 높이 통일 */}
      <div className="relative w-full h-48 md:h-56 overflow-hidden">
        <img
          src={data.thumbnailUrl}
          alt={data.title}
          loading="lazy"
          className={[
            "h-full w-full object-cover",
            "transition-transform duration-300 ease-out origin-left",
            isActive ? "scale-[1.03]" : "",
          ].join(" ")}
        />
        <div className="absolute left-2 top-2 flex gap-2">
          {data.badgeLeft?.map((b, i) => (
            <Badge key={i} tone={b.tone}>
              {b.text}
            </Badge>
          ))}
        </div>
      </div>

      {/* 본문 */}
      <div className="p-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-medium">
              {data.daysLeft}일 남음
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">
              신청{" "}
              <b className="text-stone-800 dark:text-zinc-200">
                {data.applicants}
              </b>{" "}
              / {data.applyLimit ?? "-"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sky-600">
            <FiHeart />
            {data.likes ?? 0}
          </div>
        </div>

        <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-stone-900 dark:text-zinc-100">
          {data.title}
        </h3>

        <p className="mt-1 line-clamp-2 text-xs text-stone-600 dark:text-zinc-400">
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
            <span className="rounded-md border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-800/40 px-2 py-0.5 text-[11px] font-semibold text-sky-700 dark:text-sky-300">
              {data.rewardPoint.toLocaleString()} P
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
