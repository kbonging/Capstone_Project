import React from "react";
import { FiStar, FiEdit3 } from "react-icons/fi";

export default function RibbonHeader({
  title = "리뷰콕콕",
  subtitle = "체험하고 리뷰쓰면 혜택이 팡팡!",
  logoUrl,
}) {
  return (
    <div className="mx-auto max-w-[1180px] px-4">
      <div
        className="
          flex items-center justify-between
          rounded-xl bg-gradient-to-r from-pink-500 to-orange-400
          px-5 py-3 shadow-md
        "
      >
        {/* 왼쪽: 타이틀 + 서브타이틀 */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <FiStar className="text-white text-2xl" />
            <span className="text-2xl font-extrabold tracking-tight text-white whitespace-nowrap">
              {title}
            </span>
          </div>
          <span className="text-white/60 select-none">|</span>
          <p className="text-sm text-white/90 truncate">{subtitle}</p>
        </div>

        {/* 오른쪽: 로고나 아이콘 */}
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="logo"
            className="h-7 w-auto shrink-0"
            loading="lazy"
          />
        ) : (
          <FiEdit3 className="text-white text-2xl shrink-0" />
        )}
      </div>
    </div>
  );
}
