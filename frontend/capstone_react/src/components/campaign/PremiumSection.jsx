import React from "react";
import CampaignCard from "./CampaignCard";

export default function PremiumSection({
  title = "프리미엄 체험단",
  items = [],
  onMore,
}) {
  return (
    <section className="mx-auto mt-8">
      <div className="mb-3 flex items-center justify-between">
        {/* 제목 */}
        <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
          {title}
        </h2>

        {/* 더보기 버튼 */}
        <button
          onClick={onMore}
          className="text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
        >
          더보기
        </button>
      </div>

      {/* 카드 그리드 */}
      <div className=" mx-28 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((it) => (
          <CampaignCard key={it.campaignIdx} data={it} />
        ))}
      </div>
    </section>
  );
}
