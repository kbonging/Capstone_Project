import React from "react";
import { FiHeart } from "react-icons/fi";
import Badge from "../common/Badge";
import { toAbsoluteUrl } from "../../utils/url";

export default function CampaignCardV2({ campaign }) {
  const getShortAddress = (addr) => {
    if (!addr) return "온라인";
    const parts = addr.split(" ");
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : addr;
  };

  const locationLabel = getShortAddress(campaign.address);

  const getRemainingDaysLabel = (applyEndDate) => {
    if (!applyEndDate) return "";
    const today = new Date();
    const diffDays = Math.ceil(
      (new Date(applyEndDate) - today) / (1000 * 60 * 60 * 24)
    );

    if (diffDays > 0) return `${diffDays}일 남음`;
    if (diffDays == 0) return "오늘 신청 마감";
    return "마감";
  };

  return (
    <a
      href={`/campaign/${campaign.campaignIdx}`}
      className={[
        "relative block rounded-xl border",
        "border-stone-200 dark:border-zinc-700",
        "bg-white dark:bg-zinc-700",
        "shadow-sm hover:shadow-lg",
        "overflow-hidden",
        "h-full flex flex-col",
        "transition-transform duration-300 ease-out origin-left",
        "hover:scale-[1.02]",
      ].join(" ")}
    >
      {/* 썸네일 */}
      <div className="relative w-full h-48 md:h-56 overflow-hidden">
        <img
          src={toAbsoluteUrl(campaign.thumbnailUrl)}
          alt={campaign.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 ease-out hover:scale-[1.03]"
        />
      </div>

      {/* 본문 */}
      <div className="p-3 flex-1 flex flex-col gap-2">
        {/* 상태 요약 */}
        <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-zinc-400">
          <div className="flex items-center gap-2 flex-wrap">
            {campaign.applyEndDate && (
              <span className="text-emerald-600 font-medium">
                {getRemainingDaysLabel(campaign.applyEndDate)}
              </span>
            )}
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">
              신청{" "}
              <b className="text-stone-800 dark:text-zinc-200">
                {campaign.applicants}
              </b>{" "}
              / {campaign.recruitCount ?? "-"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sky-600">
            <FiHeart />
            {campaign.bookmarkCount ?? 0}
          </div>
        </div>

        {/* 제목 + 시/구 */}
        <h1 className="line-clamp-1 text-base font-semibold text-stone-900 dark:text-zinc-100">
          [{locationLabel}] {campaign.title}
        </h1>

        {/* 캠페인 타입 + 채널 + 카테고리 */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-stone-600 dark:text-zinc-400">
          {campaign.campaignTypeName && <Badge tone="slate">{campaign.campaignTypeName}</Badge>}
          {campaign.channelName && <Badge tone="slate">{campaign.channelName}</Badge>}
          {campaign.categoryName && <Badge tone="slate">{campaign.categoryName}</Badge>}
        </div>

        {/* 리워드 */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-[14px] text-stone-600 dark:text-zinc-400 truncate">
            {campaign.benefitDetail}
          </span>
        </div>
      </div>
    </a>
  );
}
