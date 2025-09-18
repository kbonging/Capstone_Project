import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Carousel({
  items = [],
  auto = true,
  interval = 4000,
  className = "",
}) {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (!auto || items.length <= 1) return;
    timer.current = setInterval(
      () => setIdx((p) => (p + 1) % items.length),
      interval
    );
    return () => clearInterval(timer.current);
  }, [auto, interval, items.length]);

  const go = (dir) => setIdx((p) => (p + dir + items.length) % items.length);

  return (
    <div
      className={[
        // 컨테이너: 라이트/다크 반투명 + 블러 + 보더
        "relative overflow-hidden rounded-2xl border",
        "bg-white/70 dark:bg-zinc-800/70 backdrop-blur",
        "border-stone-200 dark:border-zinc-700",
        // 높이는 부모에서 className으로 제어 가능하지만 기본값도 넣어둠
        "h-44 md:h-48 lg:h-64",
        className,
      ].join(" ")}
    >
      {/* 슬라이드 영역 */}
      <div className="relative h-full">
        {items.map((it, i) => (
          <a
            key={i}
            href={it.href || "#"}
            className={[
              "absolute inset-0 transition-opacity duration-500",
              i === idx ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
            ].join(" ")}
            style={{
              backgroundImage: `url(${it.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-label={it.alt || `banner-${i}`}
          >
            {/* 가독성 보정용 상단/하단 그라디언트 (텍스트가 올라갈 수 있을 때 대비) */}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent dark:from-black/35"
            />
          </a>
        ))}
      </div>

      {/* 좌우 화살표 */}
      {items.length > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            className={[
              "absolute left-2 top-1/2 -translate-y-1/2",
              "rounded-full p-2 shadow",
              // 라이트/다크 버튼 배경
              "bg-white/85 hover:bg-white",
              "dark:bg-zinc-900/60 dark:hover:bg-zinc-900/75",
              "text-zinc-800 dark:text-zinc-100",
              "focus:outline-none focus:ring-2 focus:ring-sky-400",
            ].join(" ")}
            aria-label="이전 배너"
            type="button"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => go(1)}
            className={[
              "absolute right-2 top-1/2 -translate-y-1/2",
              "rounded-full p-2 shadow",
              "bg-white/85 hover:bg-white",
              "dark:bg-zinc-900/60 dark:hover:bg-zinc-900/75",
              "text-zinc-800 dark:text-zinc-100",
              "focus:outline-none focus:ring-2 focus:ring-sky-400",
            ].join(" ")}
            aria-label="다음 배너"
            type="button"
          >
            <FiChevronRight />
          </button>
        </>
      )}

      {/* 인디케이터 */}
      <div className="pointer-events-none absolute bottom-2 left-0 right-0 flex justify-center gap-2">
        {items.map((_, i) => (
          <div
            key={i}
            className={[
              "h-1.5 w-1.5 rounded-full",
              i === idx
                ? "bg-white dark:bg-zinc-100"
                : "bg-white/40 dark:bg-zinc-200/30",
              "ring-0",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
