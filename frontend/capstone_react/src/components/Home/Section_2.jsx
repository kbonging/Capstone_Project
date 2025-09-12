// components/campaign/PremiumSection.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
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
      if (xl.matches) return setCols(4);
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

/* ===== Ribbon Header ===== */
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
        <img
          src={logoUrl}
          alt="Revory logo"
          className="h-7 w-auto shrink-0"
          loading="lazy"
        />
      </div>
    </CenterWrap>
  );
}

/* ===== 병풍 Row ===== */
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
            <CampaignCard
              data={it}
              isActive={isActive}
              cropped={activeIdx === null ? true : !isActive}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ===== 탭 바 ===== */
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
                    "pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 h-10 rounded-md transition-all duration-200",
                    isActive ? "w-full bg-blue-100 dark:bg-zinc-100 opacity-60" : "w-0 bg-transparent",
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

/* ===== 줌 카드 & 그리드 ===== */
function ZoomCard({ data }) {
  return (
    <a
      href={`/campaign/${data.campaignIdx}`}
      className="group block rounded-xl overflow-hidden bg-white dark:bg-zinc-700 border border-stone-200 dark:border-zinc-700 shadow-sm hover:shadow-lg transition"
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
        <h3 className="line-clamp-1 font-semibold text-stone-900 dark:text-zinc-100">{data.title}</h3>
        {data.region && (
          <p className="mt-1 text-sm text-stone-600 dark:text-zinc-400">{data.region}</p>
        )}
      </div>
    </a>
  );
}
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

/* ===== 메인 섹션 ===== */
export default function Section_2() {
  // 탭 정의
  const tabs = [
    { key: "latest", label: "최신", sort: "latest" },
    { key: "popular", label: "인기", sort: "popular" },
    { key: "deadline", label: "마감임박", sort: "deadline" },
  ];

  // 탭 상태
  const [tab, setTab] = useState(0);
  const activeTab = tabs[tab];

  // 칩(인기 탭 전용)
  const [cat, setCat] = useState("전체");

  // 레이아웃 계산
  const cols = useColumns();

  // 탭별 데이터 캐시
  const [store, setStore] = useState({
    latest:   { page: 1, items: [], totalPage: 1, loading: false, error: null },
    popular:  { page: 1, items: [], totalPage: 1, loading: false, error: null, cat: "전체" },
    deadline: { page: 1, items: [], totalPage: 1, loading: false, error: null },
  });

  // 공통 fetcher
  const fetchTab = async ({ which, append = false, override = {} } = {}) => {
    const key = which ?? activeTab.key;
    const snap = store[key];
    const page = override.page ?? snap.page ?? 1;
    const sort = tabs.find((t) => t.key === key)?.sort ?? "latest";

    // 인기 탭에서는 campaignType 필터 적용
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

      // 공통 매핑
      let mapped = list.map(mapCampaignForCard);

      // ====== 탭별 후처리 ======
      if (key === "deadline") {
        // 0~7일 남은 항목만, 남은 기간 오름차순
        const THRESHOLD = 7;
        const openWithin = mapped
          .filter(
            (it) =>
              typeof it.daysLeft === "number" &&
              it.daysLeft >= 0 &&
              it.daysLeft <= THRESHOLD
          )
          .sort((a, b) => (a.daysLeft ?? Infinity) - (b.daysLeft ?? Infinity));

        // 혹시 응답에 종료 항목이 섞여 온 경우를 대비해 뒤로 밀기
        const closed = mapped.filter(
          (it) => typeof it.daysLeft === "number" && it.daysLeft < 0
        );

        mapped = [...openWithin, ...closed];
      } else {
        // 공통 규칙: 종료 캠페인은 항상 맨 뒤로
        mapped.sort((a, b) => {
          const aClosed = typeof a.daysLeft === "number" && a.daysLeft < 0;
          const bClosed = typeof b.daysLeft === "number" && b.daysLeft < 0;
          if (aClosed === bClosed) return 0; // 원래 정렬 유지
          return aClosed ? 1 : -1; // 종료는 뒤로
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

  // 탭 바뀔 때 최초 로딩
  useEffect(() => {
    const key = activeTab.key;
    if (!store[key].items?.length) {
      fetchTab({ which: key, append: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // 인기 탭에서 카테고리 변경 시 재조회
  useEffect(() => {
    if (activeTab.key !== "popular") return;
    fetchTab({ which: "popular", append: false, override: { page: 1 } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat]);

  // ========= 표시 구성 =========
  const MAX_ROWS = 3;
  const COLS_DESKTOP = 4;
  const LIMIT = MAX_ROWS * COLS_DESKTOP; // 12개

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

  // ========= 렌더 =========
  let content = null;

  if (state.loading && !items.length) {
    content = <div className="py-16 text-center text-stone-500">불러오는 중…</div>;
  } else if (state.error && !items.length) {
    content = <div className="py-16 text-center text-rose-500">에러: {state.error}</div>;
  } else if (key === "popular") {
    // 인기: 줌카드 + 칩 + 4칸 그리드
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
    // 마감임박: 0~7일 필터 + 종료는 뒤로
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
    // 최신: 병풍(Row) 3줄
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
      <RibbonHeader title="Revory" logoUrl="/assets/revory-logo.png" />
      <TopTabBar tabs={tabs} active={tab} onChange={setTab} layout="spread" />
      {content}
    </section>
  );
}
