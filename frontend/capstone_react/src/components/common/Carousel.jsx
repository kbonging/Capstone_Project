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
      className={`relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 ${className}`}
    >
      <div className="relative h-44 md:h-48 lg:h-56">
        {items.map((it, i) => (
          <a
            key={i}
            href={it.href || "#"}
            className={`absolute inset-0 transition-opacity duration-500 ${
              i === idx ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${it.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-label={it.alt || `banner-${i}`}
          />
        ))}
      </div>
      {items.length > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow"
          >
            <FiChevronRight />
          </button>
        </>
      )}
      <div className="pointer-events-none absolute bottom-2 left-0 right-0 flex justify-center gap-2">
        {items.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${
              i === idx ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
