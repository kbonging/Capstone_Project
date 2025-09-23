// components/campaign/PremiumSection.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import mainLogo from "../../images/main_logo.png";
import CampaignCard from "../campaign/CampaignCard";
import { PlusButton } from "../PlusButton";
import {
  getCampaigns,
  mapCampaignForCard,
  toCampaignTypeCode,
} from "../../api/campaigns/campaigns";
import { toAbsoluteUrl } from "../../utils/url";

/* ===== 공용: 가운데 정렬 래퍼 ===== */
function CenterWrap({ max = 880, className = "", children }) {
  return (
    <div className="mx-auto w-full px-3 sm:px-4" style={{ maxWidth: `${max}px` }}>
      <div className={className}>{children}</div>
    </div>
  );
}

/* ===== 화면 열 수 ( Row 전용) ===== */
function useColumns() {
  const [cols, setCols] = useState(1);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      setCols(1);
      return;
    }
    const sm = matchMedia("(min-width:640px)");
    const lg = matchMedia("(min-width:1024px)");
    const xl = matchMedia("(min-width:1280px)");

    const calc = () => {
      if (xl.matches) return setCols(4);
      if (lg.matches) return setCols(3);
      if (sm.matches) return setCols(2);
      setCols(1);
    };

    calc();

    const onSM = () => calc();
    const onLG = () => calc();
    const onXL = () => calc();

    sm.addEventListener?.("change", onSM);
    lg.addEventListener?.("change", onLG);
    xl.addEventListener?.("change", onXL);

    return () => {
      sm.removeEventListener?.("change", onSM);
      lg.removeEventListener?.("change", onLG);
      xl.removeEventListener?.("change", onXL);
    };
  }, []);

  return cols;
}

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

/* ===== Ribbon Header ===== */
function RibbonHeader({
  title = "",
  subtitle = "체험하고 리뷰 쓰면 혜택이 팡팡!",
  logoUrl = mainLogo,
}) {
  return (
    <CenterWrap max={1150}>
      <div className="flex items-center justify-between px-1 py-1">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-gray-700 dark:text-zinc-100 whitespace-nowrap">
              <img src={logoUrl} alt="Revory logo" className="h-8" loading="lazy" />
            </span>
            {/* {title && (
              <span className="text-xl font-bold text-gray-800 dark:text-zinc-100 hidden sm:inline">
                {title}
              </span>
            )} */}
          </div>
          <span className="text-gray-400 dark:text-zinc-600 select-none">|</span>
          <p className="text-sm text-gray-600 dark:text-zinc-300 truncate">{subtitle}</p>
        </div>

        {/* 예시: 우측 더보기 아이콘(필요 없으면 제거) */}
        <button
          onClick={() => (window.location.href = "/campaigns")}
          type="button"
          className="hidden sm:inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-sm text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 transition"
          aria-label="더보기"
        >
          <FiMoreHorizontal />
          더보기
        </button>
      </div>
    </CenterWrap>
  );
}

/* ===== Row ===== */
function Row({ items, gapPx = 24 }) {
  const ref = useRef(null);
  const [rowW, setRowW] = useState(0);
  const [activeIdx, setActiveIdx] = useState(null);
  const cols = useColumns();

  useEffect(() => {
    if (!ref.current || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setRowW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  // 항상 cols 기준으로 셀 폭 고정
  const cellWidth = Math.floor(
    (rowW - Math.max(0, (cols - 1) * gapPx)) / Math.max(1, cols)
  );
  const MIN = 200;
  const BASE = Math.max(MIN, cellWidth);

  // slots: 실제 아이템 + placeholder = 항상 cols개
  const placeholders = Math.max(0, cols - items.length);
  const slots = [...items, ...Array(placeholders).fill(null)];

  const others = Math.max(0, cols - 1);
  const WANT_EXPAND = 120;
  const maxExpandFromOthers = others > 0 ? Math.max(0, (BASE - MIN) * others) : 0;
  const EXPAND = others > 0 ? Math.min(WANT_EXPAND, maxExpandFromOthers) : 0;

  return (
    <div
      ref={ref}
      className="flex flex-nowrap gap-x-6 w-full overflow-x-hidden"
      onMouseLeave={() => setActiveIdx(null)}
      onTouchEnd={() => setActiveIdx(null)}
    >
      {slots.map((maybeItem, i) => {
        const isPlaceholder = maybeItem == null;
        const isActive = !isPlaceholder && activeIdx === i;
        let w = BASE;

        if (activeIdx !== null && others > 0) {
          if (isActive) {
            w = BASE + EXPAND; // 활성 카드 확장
          } else {
            w = BASE - Math.floor(EXPAND / others); // 나머지 카드 축소
          }
        }

        return (
          <div
            key={isPlaceholder ? `ph-${i}` : (maybeItem.campaignIdx ?? i)}
            onMouseEnter={() => {
              if (!isPlaceholder) setActiveIdx(i);
            }}
            onFocus={() => {
              if (!isPlaceholder) setActiveIdx(i);
            }}
            onBlur={() => setActiveIdx(null)}
            className={[
              "flex-none min-w-0 transition-all duration-300 ease-out h-[360px] overflow-hidden",
              isPlaceholder ? "opacity-0 pointer-events-none" : "",
            ].join(" ")}
            style={{ width: `${Math.round(w)}px` }}
            aria-hidden={isPlaceholder ? true : undefined}
          >
            {!isPlaceholder && (
              <CampaignCard
                data={maybeItem}
                isActive={isActive}
                cropped={activeIdx === null ? true : !isActive}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ===== 줌 카드 & 그리드 ===== */
function ZoomCard({ data }) {
  return (
    <a
      href={`/campaign/${data.campaignIdx}`}
      className="group block rounded-xl overflow-hidden bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 shadow-sm hover:shadow-lg transition"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={toAbsoluteUrl(data.thumbnailUrl)}
          alt={data.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-110"
        />
        {data.isClosed && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">종료된 체험단</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-1 font-semibold text-stone-900 dark:text-zinc-100">
          {data.title}
        </h3>
        {data.region && (
          <p className="mt-1 text-sm text-stone-600 dark:text-zinc-400">
            {data.region}
          </p>
        )}
      </div>
    </a>
  );
}

function ZoomCardGrid({ items }) {
  if (!items?.length) {
    return (
      <div className="py-10 text-center text-stone-500 dark:text-zinc-400">
        조건에 맞는 결과가 없어요.
      </div>
    );
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
                  ? "bg-stone-900 text-white border-stone-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                  : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-700",
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

/* ===== 탭 바 ===== */
function TopTabBar({ tabs, active, onChange, layout = "spread" }) {
  const alignCls =
    layout === "left"
      ? "justify-start"
      : layout === "center"
      ? "justify-center"
      : "justify-center";

  return (
    <CenterWrap max={1150}>
      <div className="flex w-full">
        <div
          className={[
            "w-full border-y",
            "border-stone-200 dark:border-zinc-800",
          ].join(" ")}
        >
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
                      ? "text-blue-600 dark:text-zinc-100"
                      : "text-stone-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-zinc-100",
                  ].join(" ")}
                >
                  <span className="inline-block">{t.label}</span>
                  <span
                    className={[
                      "pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 h-[2px] rounded-md transition-all duration-200",
                      isActive
                        ? "w-full bg-blue-600 dark:bg-zinc-100"
                        : "w-0 bg-transparent",
                    ].join(" ")}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </CenterWrap>
  );
}

/* ===== 메인 섹션 ===== */
export default function Section_2() {
  const tabs = [
    { key: "latest", label: "최신", sort: "latest" },
    { key: "popular", label: "인기", sort: "popular" },
    { key: "deadline", label: "마감임박", sort: "deadline" },
  ];

  const [tab, setTab] = useState(0);
  const activeTab = tabs[tab];
  const [cat, setCat] = useState("전체");
  const cols = useColumns();

  const [store, setStore] = useState({
    latest: { page: 1, items: [], totalPage: 1, loading: false, error: null },
    popular: {
      page: 1,
      items: [],
      totalPage: 1,
      loading: false,
      error: null,
      cat: "전체",
    },
    deadline: { page: 1, items: [], totalPage: 1, loading: false, error: null },
  });

  const fetchTab = async ({ which, append = false, override = {} } = {}) => {
    const key = which ?? activeTab.key;
    const snap = store[key];
    const page = override.page ?? snap.page ?? 1;
    const sort = tabs.find((t) => t.key === key)?.sort ?? "latest";
    const campaignType =
      key === "popular" && cat !== "전체" ? toCampaignTypeCode(cat) : "";

    setStore((s) => ({
      ...s,
      [key]: { ...s[key], loading: true, error: null },
    }));

    try {
      const res = await getCampaigns({
        page,
        recordCount: 12,
        sort,
        campaignType,
      });

      const list = Array.isArray(res.list)
        ? res.list
        : Array.isArray(res.campaignList)
        ? res.campaignList
        : Array.isArray(res.items)
        ? res.items
        : [];

      let mapped = list.map(mapCampaignForCard);

      if (key === "deadline") {
        const THRESHOLD = 7;
        const openWithin = mapped
          .filter(
            (it) =>
              typeof it.daysLeft === "number" &&
              it.daysLeft >= 0 &&
              it.daysLeft <= THRESHOLD
          )
          .sort((a, b) => (a.daysLeft ?? Infinity) - (b.daysLeft ?? Infinity));

        const closed = mapped.filter(
          (it) => typeof it.daysLeft === "number" && it.daysLeft < 0
        );

        mapped = [...openWithin, ...closed];
      } else {
        mapped.sort((a, b) => {
          const aClosed = typeof a.daysLeft === "number" && a.daysLeft < 0;
          const bClosed = typeof b.daysLeft === "number" && b.daysLeft < 0;
          if (aClosed === bClosed) return 0;
          return aClosed ? 1 : -1;
        });
      }

      const totalPage =
        res?.paginationInfo?.totalPage ??
        res?.paginationInfo?.totalPages ??
        res?.totalPages ??
        1;

      setStore((s) => ({
        ...s,
        [key]: {
          ...s[key],
          page,
          totalPage,
          items: append ? [...(s[key].items || []), ...mapped] : mapped,
          loading: false,
          error: null,
        },
      }));
    } catch (e) {
      setStore((s) => ({
        ...s,
        [key]: {
          ...s[key],
          loading: false,
          error: e?.message || "불러오기 실패",
        },
      }));
    }
  };

  useEffect(() => {
    const key = activeTab.key;
    if (!store[key].items?.length) {
      fetchTab({ which: key, append: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    if (activeTab.key !== "popular") return;
    fetchTab({ which: "popular", append: false, override: { page: 1 } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat]);

  const MAX_ROWS = 3;
  const COLS_DESKTOP = 4;
  const LIMIT = MAX_ROWS * COLS_DESKTOP;

  const key = activeTab.key;
  const state = store[key];
  const items = state.items ?? [];

  const rows = useMemo(() => {
    if (key !== "latest") return [];
    const colsNow = cols || 1;
    return chunk(items, colsNow);
  }, [items, cols, key]);

  const canMore = state.page < state.totalPage;
  const handleMore = () => {
    if (!canMore || state.loading) return;
    fetchTab({ which: key, append: true, override: { page: state.page + 1 } });
  };

  let content = null;
  if (state.loading && !items.length) {
    content = (
      <div className="py-16 text-center text-stone-500 dark:text-zinc-400">
        불러오는 중…
      </div>
    );
  } else if (state.error && !items.length) {
    content = (
      <div className="py-16 text-center text-rose-500">에러: {state.error}</div>
    );
  } else if (key === "popular") {
    content = (
      <>
        <CategoryChips value={cat} onChange={setCat} />
        <div className="mx-auto w-full px-3 sm:px-4 mt-4" style={{ maxWidth: "1180px" }}>
          <ZoomCardGrid items={items.slice(0, LIMIT)} />
          {canMore && (
            <div className="mt-4 flex justify-end">
              <PlusButton onClick={handleMore} />
            </div>
          )}
        </div>
      </>
    );
  } else if (key === "deadline") {
    content = (
      <div className="mx-auto w-full px-3 sm:px-4 mt-4" style={{ maxWidth: "1180px" }}>
        <ZoomCardGrid items={items.slice(0, LIMIT)} />
        {canMore && (
          <div className="mt-4 flex justify-end">
            <PlusButton onClick={handleMore} />
          </div>
        )}
      </div>
    );
  } else {
    const visibleRows = rows.slice(0, MAX_ROWS);
    content = (
      <div className="mx-auto w-full px-3 sm:px-4 mt-4" style={{ maxWidth: "1180px" }}>
        <div className="space-y-6">
          {visibleRows.map((r, i) => (
            <Row key={i} items={r} />
          ))}
        </div>
        {canMore && (
          <div className="mt-4 flex justify-end">
            <PlusButton onClick={handleMore} />
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="mt-8 space-y-3">
      <RibbonHeader title="Revory" />
      <TopTabBar tabs={tabs} active={tab} onChange={setTab} layout="spread" />
      {content}
    </section>
  );
}
