// components/campaign/PremiumSection.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import CampaignCard from "../campaign/CampaignCard";
import { PlusButton } from "../PlusButton";

/* ===== 공용: 가운데 정렬 래퍼 ===== */
function CenterWrap({ max = 880, className = "", children }) {
  return (
    <div className={`mx-auto w-full px-3 sm:px-4`} style={{ maxWidth: `${max}px` }}>
      <div className={className}>{children}</div>
    </div>
  );
}

/* ===== 화면 열 수 (병풍 Row 전용) ===== */
function useColumns() {
  const [cols, setCols] = useState(1);
  useEffect(() => {
    const sm = matchMedia("(min-width:640px)");
    const lg = matchMedia("(min-width:1024px)");
    const xl = matchMedia("(min-width:1280px)");
    const calc = () => {
      if (xl.matches) return setCols(4); // 데스크탑은 4칸
      if (lg.matches) return setCols(3);
      if (sm.matches) return setCols(2);
      setCols(1);
    };
    calc();
    sm.addEventListener("change", calc);
    lg.addEventListener("change", calc);
    xl.addEventListener("change", calc);
    return () => {
      sm.removeEventListener("change", calc);
      lg.removeEventListener("change", calc);
      xl.removeEventListener("change", calc);
    };
  }, []);
  return cols;
}
const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

/* ===== Ribbon Header (Revory + 로고) ===== */
function RibbonHeader({
  title = "Revory",
  subtitle = "체험하고 리뷰 쓰면 혜택이 팡팡!",
  logoUrl = "/assets/revory-logo.png",
}) {
  return (
    <CenterWrap max={880}>
      <div className="flex items-center justify-between px-1 py-1">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-gray-700 dark:text-zinc-100 whitespace-nowrap">
              {title}
            </span>
          </div>
          <span className="text-gray-400 select-none">|</span>
          <p className="text-sm text-gray-600 dark:text-zinc-300 truncate">{subtitle}</p>
        </div>
        <img src={logoUrl} alt="Revory logo" className="h-7 w-auto shrink-0" loading="lazy" />
      </div>
    </CenterWrap>
  );
}

/* ===== 병풍(폭 재분배) Row: 마지막 호버 유지 ===== */
function Row({ items, gapPx = 24 }) {
  const ref = useRef(null);
  const [rowW, setRowW] = useState(0);
  const [activeIdx, setActiveIdx] = useState(null);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setRowW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const n = items.length;
  const gaps = (n - 1) * gapPx;
  const base = Math.max(0, (rowW - gaps) / n);
  const MIN = 200;
  const WANT_EXPAND = 120;
  const maxExpandFromOthers = Math.max(0, (base - MIN) * (n - 1));
  const EXPAND = Math.min(WANT_EXPAND, maxExpandFromOthers);

  return (
    <div ref={ref} className="flex flex-nowrap gap-x-6 w-full">
      {items.map((it, i) => {
        const isActive = activeIdx === i;
        let width = base;
        if (activeIdx !== null) {
          if (isActive) width = base + EXPAND;
          else width = base - EXPAND / Math.max(1, n - 1);
        }
        return (
          <div
            key={it.campaignIdx ?? i}
            onMouseEnter={() => setActiveIdx(i)}
            className="flex-none min-w-0 transition-all duration-300 ease-out"
            style={{ width: `${Math.max(MIN, Math.round(width))}px` }}
          >
            <CampaignCard data={it} isActive={isActive} cropped={activeIdx === null ? true : !isActive} />
          </div>
        );
      })}
    </div>
  );
}

/* ===== 상단 탭 바 (리본과 동일 폭) ===== */
function TopTabBar({ tabs, active, onChange, layout = "spread" }) {
  const alignCls =
    layout === "left" ? "justify-start" : layout === "center" ? "justify-center" : "justify-center";

  return (
    <CenterWrap max={1080}>
      <div className={`flex ${alignCls} w-full border-t-2 border-b-2`}>
        <div
          className={
            layout === "spread"
              ? "flex w-full"
              : `flex ${layout === "left" ? "justify-start" : "justify-center"} gap-4`
          }
        >
          {tabs.map((t, i) => {
            const isActive = active === i;
            return (
              <button
                key={t.key}
                onClick={() => onChange(i)}
                className={[
                  layout === "spread" ? "flex-1" : "flex-none",
                  "relative px-3 py-2.5 text-sm font-semibold text-center transition-colors",
                  isActive
                    ? "text-black dark:text-zinc-100"
                    : "text-stone-500 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-100",
                ].join(" ")}
              >
                <span className="inline-block">{t.label}</span>
                <span
                  className={[
                    "pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 h-10 rounded-full transition-all duration-200",
                    isActive ? "w-full bg-gray-200 dark:bg-zinc-100 opacity-60" : "w-0 bg-transparent",
                  ].join(" ")}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 text-sm text-stone-600 dark:text-zinc-400">
        <FiMoreHorizontal className="text-stone-400" />
        <p className="text-center">리뷰 쓰고 혜택 받는 체험단을 만나보세요.</p>
      </div>
    </CenterWrap>
  );
}

/* ===== 줌인/줌아웃 카드 ===== */
function ZoomCard({ data }) {
  return (
    <a
      href={`/campaign/${data.campaignIdx}`}
      className="group block rounded-xl overflow-hidden bg-white dark:bg-zinc-700 border border-stone-200 dark:border-zinc-700 shadow-sm hover:shadow-lg transition"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={data.thumbnailUrl}
          alt={data.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-110"
        />
      </div>
      <div className="p-3">
        <h3 className="line-clamp-1 font-semibold text-stone-900 dark:text-zinc-100">{data.title}</h3>
        {data.region && <p className="mt-1 text-sm text-stone-600 dark:text-zinc-400">{data.region}</p>}
      </div>
    </a>
  );
}

/* ===== 4칸 그리드(줌카드용) ===== */
function ZoomCardGrid({ items }) {
  if (!items?.length) {
    return <div className="py-10 text-center text-stone-500">조건에 맞는 결과가 없어요.</div>;
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((it) => (
        <ZoomCard key={it.campaignIdx} data={it} />
      ))}
    </div>
  );
}

/* ===== 탭2 전용 칩 ===== */
function CategoryChips({ value, onChange }) {
  const cats = ["전체", "배송형", "방문형", "포장형", "구매형"];
  return (
    <CenterWrap max={880} className="mt-2">
      <div className="flex flex-wrap justify-center items-center gap-2">
        {cats.map((c) => {
          const active = value === c;
          return (
            <button
              key={c}
              onClick={() => onChange(c)}
              className={[
                "px-3 py-1.5 rounded-full text-sm border transition-colors",
                active
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700",
              ].join(" ")}
            >
              {c}
            </button>
          );
        })}
      </div>
    </CenterWrap>
  );
}

/* ===== 카테고리 매칭 ===== */
function matchCategory(item, cat) {
  if (!cat || cat === "전체") return true;
  const src = (
    item.serviceType ||
    item.campaignTypeName ||
    item.categoryName ||
    item.channelName ||
    (Array.isArray(item.tags) ? item.tags.join(" ") : "") ||
    ""
  )
    .toString()
    .toLowerCase();
  const hasAny = (words) => words.some((w) => src.includes(w));
  if (cat === "배송형") return hasAny(["배송", "택배", "delivery", "ship"]);
  if (cat === "방문형") return hasAny(["방문", "오프라인", "매장", "visit", "in-store"]);
  if (cat === "포장형") return hasAny(["포장", "테이크아웃", "takeout", "to-go"]);
  if (cat === "구매형") return hasAny(["구매", "구입", "쇼핑", "purchase", "buy"]);
  return true;
}

/* ===== 마감 임박 계산 ===== */
function getDaysLeft(item) {
  if (typeof item?.daysLeft === "number") return item.daysLeft;
  if (item?.endDate) {
    const d = Math.ceil((new Date(item.endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return isNaN(d) ? null : d;
  }
  return null;
}

/* ===== 메인 섹션 ===== */
export default function Section_2({ items = [], onMore }) {
  const MAX_ROWS = 3;
  const COLS_DESKTOP = 4;
  const LIMIT = MAX_ROWS * COLS_DESKTOP; // 12개

  const cols = useColumns();
  const rows = useMemo(() => chunk(items, cols), [items, cols]);

  const [tab, setTab] = useState(0);
  const tabs = [
    { key: "ai", label: "최신" },
    { key: "hot", label: "인기" },
    { key: "planner", label: "마감임박" },
  ];

  const [cat, setCat] = useState("전체");
  const filteredForZoom = useMemo(
    () => (tab === 1 ? items.filter((it) => matchCategory(it, cat)) : items),
    [items, tab, cat]
  );

  const DEADLINE_DAYS = 7;
  const urgentItems = useMemo(() => {
    return items
      .map((x) => ({ ...x, _days: getDaysLeft(x) }))
      .filter((x) => typeof x._days === "number" && x._days >= 0 && x._days <= DEADLINE_DAYS)
      .sort((a, b) => a._days - b._days);
  }, [items]);

  useEffect(() => {
    if (onMore) onMore(tab);
  }, [tab]); // eslint-disable-line

  // ====== 탭별 표시/더보기 로직 ======
  let content = null;
  let showMore = false;

  if (tab === 1) {
    // 인기: 줌카드 + 4칸 × 3줄 제한
    const total = filteredForZoom.length;
    const visible = filteredForZoom.slice(0, LIMIT);
    showMore = total > LIMIT;

    content = (
      <>
        <CategoryChips value={cat} onChange={setCat} />
        <div className="mx-auto w-full px-3 sm:px-4 mt-4" style={{ maxWidth: "1180px" }}>
          <ZoomCardGrid items={visible} />
          {showMore && (
            <div className="mt-4 flex justify-end">
              <PlusButton  onClick={() => onMore && onMore(tab)} />
            </div>
          )}
        </div>
      </>
    );
  } else if (tab === 2) {
    // 마감임박: 줌카드 + 4칸 × 3줄 제한
    const total = urgentItems.length;
    const visible = urgentItems.slice(0, LIMIT);
    showMore = total > LIMIT;

    content = (
      <div className="mx-auto w-full px-3 sm:px-4 mt-4" style={{ maxWidth: "1180px" }}>
        <ZoomCardGrid items={visible} />
        {showMore && (
          <div className="mt-4 flex justify-end">
            <PlusButton  onClick={() => onMore && onMore(tab)} />
          </div>
        )}
      </div>
    );
  } else {
    // 최신: 병풍(Row) 3줄만 노출
    const visibleRows = rows.slice(0, MAX_ROWS);
    showMore = rows.length > MAX_ROWS;

    content = (
      <div className="mx-auto w-full px-3 sm:px-4 mt-4" style={{ maxWidth: "1180px" }}>
        <div className="space-y-6">
          {visibleRows.map((r, i) => (
            <Row key={i} items={r} />
          ))}
        </div>
        {showMore && (
          <div className="mt-4 flex justify-end">
             <PlusButton  onClick={() => onMore && onMore(tab)} />
            
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="mt-8 space-y-3">
      <RibbonHeader title="Revory" logoUrl="/assets/revory-logo.png" />
      <TopTabBar tabs={tabs} active={tab} onChange={setTab} layout="spread" />
      {content}
    </section>
  );
}
