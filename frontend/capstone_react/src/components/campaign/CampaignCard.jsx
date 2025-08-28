import React from "react";
import { FiMapPin, FiHeart } from "react-icons/fi";
import Badge from "../common/Badge";

export default function CampaignCard({ data }) {
  return (
    <a
      href={`/campaign/${data.campaignIdx}`}
      className="block rounded-xl border border-stone-200 bg-white  hover:shadow-md transition"
    >
      <div className="relative h-44 w-full overflow-hidden rounded-t-xl">
        <img
          src={data.thumbnailUrl}
          alt={data.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute left-2 top-2 flex gap-2">
          {data.badgeLeft?.map((b, i) => (
            <Badge key={i} tone={b.tone}>
              {b.text}
            </Badge>
          ))}
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between text-[11px] text-stone-500">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-medium">
              {data.daysLeft}일 남음
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">
              신청 <b className="text-stone-800">{data.applicants}</b> /{" "}
              {data.applyLimit ?? "-"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sky-600">
            <FiHeart />
            {data.likes ?? 0}
          </div>
        </div>
        <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-stone-900">
          {data.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-stone-600">
          {data.subtitle}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-1 text-[10px] text-stone-600">
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
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] text-stone-600">{data.rewardLabel}</span>
          {data.rewardPoint && (
            <span className="rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
              {data.rewardPoint.toLocaleString()} P
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
