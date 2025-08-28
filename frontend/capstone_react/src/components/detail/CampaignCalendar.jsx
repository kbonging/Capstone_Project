import React, { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

/**
 * props
 * - initialMonth: Date
 * - ranges: [{ start:Date, end:Date, label:string, tone:'muted'|'green'|'amber'|'cyan'|'violet'|'blue'|'rose' }]
 *    · 모든 tone을 “숫자 아래 얇은 바(연결형)”로 표시
 * - bottomLabel?: string
 */
export default function CampaignCalendar({ initialMonth, ranges = [], bottomLabel = "체험준비" }) {
  const [monthDate, setMonthDate] = useState(
    new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1)
  );

  const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const last  = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

  // 달력 주 배열
  const weeks = useMemo(() => {
    const startOffset = first.getDay();
    const total = startOffset + last.getDate();
    const rows = Math.ceil(total / 7);
    return Array.from({ length: rows }, (_, r) =>
      Array.from({ length: 7 }, (_, c) => {
        const d = r * 7 + c - startOffset + 1;
        if (d < 1 || d > last.getDate()) return null;
        return new Date(monthDate.getFullYear(), monthDate.getMonth(), d);
      })
    );
  }, [monthDate, first, last]);

  // 유틸
  const isInRange = (r, d) => r.start <= d && d <= r.end;
//   const inRanges  = (d) => ranges.filter((r) => isInRange(r, d));

  // 톤별 바 스타일(색 + 레인 인덱스)
  const toneBar = {
    muted:  { cls: "bg-stone-300",    lane: 1, text: "text-stone-700"  }, // 모집
    green:  { cls: "bg-emerald-300",  lane: 1, text: "text-emerald-800"}, // 체험기간
    amber:  { cls: "bg-rose-300",     lane: 1, text: "text-rose-800"   }, // 발표
    cyan:   { cls: "bg-sky-300",      lane: 1, text: "text-sky-800"    }, // 체험종료
    violet: { cls: "bg-violet-300",   lane: 1, text: "text-violet-800" }, // 리뷰마감
    blue:   { cls: "bg-sky-200",      lane: 1, text: "text-sky-900"    },
    rose:   { cls: "bg-rose-200",     lane: 1, text: "text-rose-900"   },
  };

  // ── “숫자 밑” 위치 조정값 ──────────────────────────────────
  // 셀 높이: h-10 = 2.5rem(40px)로 약간 키워 숫자/바 간격 확보
  const CELL_CLASS   = "h-10";         // 날짜 셀 높이
  const NUM_TOP_PAD  = 2;              // 숫자 상단 여백(px)
  const TOP_BASE     = 16;             //  숫자 바로 아래 시작 y 좌표(px) — 필요시 14~18로 미세조정
  const LANE_HEIGHT  = 12;             // 바 두께(px)
  const LANE_GAP     = 2;              // 바 사이 간격(px)
  const laneTop      = (lane) => TOP_BASE + lane * (LANE_HEIGHT + LANE_GAP);

  // 특정 tone에 대해 한 주(row)에서 연결 바 세그먼트 계산
  const calcSegmentsForTone = (row, tone) => {
    const rels = ranges.filter((r) => (r.tone || "muted") === tone);
    if (rels.length === 0) return [];

    const activeAt = (d) => rels.some((r) => isInRange(r, d));

    const segs = [];
    let s = -1;
    row.forEach((d, ci) => {
      const active = d ? activeAt(d) : false;
      if (active && s === -1) s = ci;
      if ((!active || ci === 6) && s !== -1) {
        const e = active && ci === 6 ? 6 : ci - 1;
        segs.push([s, e]);
        s = -1;
      }
    });
    return segs;
  };

  // 월 이동
  const prev = () => setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1));
  const next = () => setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1));

  // 그릴 tone 순서(위로 갈수록 위 레인)
  const drawTones = ["muted", "green", "amber", "cyan", "violet"];

  return (
    <div className="rounded-xl border border-stone-200">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b px-3 py-2">
        <div className="text-sm font-semibold">
          {monthDate.getFullYear()}년 {monthDate.getMonth() + 1}월
        </div>
        <div className="flex gap-2">
          <button onClick={prev} className="rounded-md border px-2 py-1 hover:bg-stone-50"><FiChevronLeft /></button>
          <button onClick={next} className="rounded-md border px-2 py-1 hover:bg-stone-50"><FiChevronRight /></button>
        </div>
      </div>

      {/* 요일 */}
      <div className="grid grid-cols-7 text-center text-[11px] text-stone-500">
        {["일","월","화","수","목","금","토"].map((w)=>(
          <div key={w} className="py-2">{w}</div>
        ))}
      </div>

      {/* 본문 */}
      <div className="px-2 pb-2">
        {weeks.map((row, ri) => (
          <div key={ri} className="relative mb-1">
            {/* 1) 숫자/셀 레이어 (맨 위) */}
            <div className="relative grid grid-cols-7 gap-1">
              {row.map((d, ci) => (
                <div key={ci} className={`relative ${CELL_CLASS}`}>
                  <div className="z-10 flex h-full items-start justify-center pt-[2px] text-[11px] text-stone-800">
                    {d ? d.getDate() : ""}
                  </div>
                </div>
              ))}
            </div>

            {/* 2) 숫자 밑 바 레이어 (row 절대배치, 연결형) */}
            {drawTones.map((tone) => {
              const style = toneBar[tone];
              if (!style) return null;
              const segs = calcSegmentsForTone(row, tone);
              return segs.map(([s, e], idx) => {
                const leftPct  = (s / 7) * 100;
                const widthPct = ((e - s + 1) / 7) * 100;
                return (
                  <div
                    key={`${tone}-${idx}`}
                    className={`absolute z-0 rounded-full ${style.cls}`}
                    style={{
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      height: `${LANE_HEIGHT}px`,
                      top: `${laneTop(style.lane)}px`,   // ⬅️ “숫자 바로 아래” 시작 y 위치
                    }}
                  />
                );
              });
            })}

            {/* 3) (옵션) 바 중앙 텍스트 라벨 */}
            {drawTones.map((tone) => {
              const style = toneBar[tone];
              if (!style) return null;
              const segs = calcSegmentsForTone(row, tone);

              const labelForSeg = (sIdx, eIdx) => {
                const startDate = row[sIdx];
                const endDate   = row[eIdx];
                const r = ranges.find((rr) =>
                  (rr.tone || "muted") === tone &&
                  rr.start <= endDate && rr.end >= startDate
                );
                return r?.label || "";
              };

              return segs.map(([s, e], idx) => {
                const centerPct = ((s + e + 1) / 2 / 7) * 100;
                const label = labelForSeg(s, e);
                if (!label) return null;
                return (
                  <div
                    key={`label-${tone}-${idx}`}
                    className={`pointer-events-none absolute translate-x-[-50%] text-[10px] font-medium ${style.text}`}
                    style={{
                      left: `${centerPct}%`,
                      top: `${laneTop(style.lane) + LANE_HEIGHT / 2.5 - 6}px`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </div>
                );
              });
            })}
          </div>
        ))}
      </div>

      {/* 하단 상태바(옵션) */}
      <div className="border-t bg-sky-50 px-3 py-1.5 text-center text-[11px] text-sky-700">
        {bottomLabel}
      </div>
    </div>
  );
}
