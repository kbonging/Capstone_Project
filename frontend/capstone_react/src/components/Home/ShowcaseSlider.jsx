import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

 const SLIDES = [
  {
    id: 101,
    tag: "Revory 체험단 × 배송형",
    title: ["한입 가득 신선함", "제철 과일 선물세트"],
    cta: { label: "자세히 보기", href: "/campaign/101" },
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1600&auto=format&fit=crop",
    bgLeft: "#FFF6E5",
  },
  {
    id: 102,
    tag: "Revory 체험단 × 방문형",
    title: ["수제 버거 맛집", "신메뉴 ‘더블치즈’ 런칭"],
    cta: { label: "코스 보기", href: "/campaign/102" },
    image: "https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=1600&auto=format&fit=crop",
    bgLeft: "#F7E57A",
  },
  {
    id: 103,
    tag: "Revory 체험단 × 콘텐츠형",
    title: ["홈트 브랜드 협업", "운동 루틴 영상 리뷰"],
    cta: { label: "지도 열기", href: "/campaign/103" },
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop",
    bgLeft: "#E8F8FF",
  },
];

const DURATION = 7000; // ms
const EASE = [0.22, 1, 0.36, 1];
const PEEK_PX = 34;
const GAP_PX = 12;

export default function ShowcaseHero() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const total = SLIDES.length;
  const current = SLIDES[index];
  const next = SLIDES[(index + 1) % total];

  // 프리뷰 위치/크기 동기화
  const cardAnchorRef = useRef(null);
  const [previewBox, setPreviewBox] = useState({ top: 0, height: 0 });

  // 진행바 DOM & 시간 관리 (리렌더 없이 width만 조절)
  const barRef = useRef(null);
  const rafRef = useRef(null);
  const startedAtRef = useRef(0);

  const pageText = useMemo(() => String(index + 1).padStart(2, "0"), [index]);

  const go = (dir) => {
    setIndex((i) => (i + dir + total) % total);
    // 다음 슬라이드로 전환하면 진행바 타이머도 즉시 리셋
    startedAtRef.current = performance.now();
    if (barRef.current) barRef.current.style.width = "0%";
  };

  // rAF 루프: 호버 무시, playing=false에서만 멈춤
  useEffect(() => {
    let last = performance.now();
    startedAtRef.current = last; // 새 인덱스에서 타이머 리셋

    const tick = (t) => {
      const elapsed = t - startedAtRef.current;

      if (playing) {
        // 리렌더 없이 width만 업데이트 → 끊김 최소화
        const p = Math.min(1, elapsed / DURATION);
        if (barRef.current) {
          // transition 없이 직접 너비만 세팅 (GPU-friendly)
          barRef.current.style.width = (p * 100).toFixed(4) + "%";
        }
        if (p >= 1) {
          // 호버 여부와 상관없이 전환
          go(1);
          // go(1)에서 startedAtRef 갱신됨
        }
      } else {
        // 일시정지 시 시작 기준점을 밀어, 멈춘 지점 유지
        startedAtRef.current += t - last;
      }

      last = t;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [index, playing]);

  // 프리뷰 스트립 위치/높이 동기화 (ResizeObserver + rAF 스로틀)
  useEffect(() => {
    const el = cardAnchorRef.current;
    if (!el) return;

    let pending = false;
    const updateBox = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        const rect = el.getBoundingClientRect();
        const top = Math.round(rect.top);
        const height = Math.round(rect.height);
        setPreviewBox((prev) =>
          prev.top !== top || prev.height !== height ? { top, height } : prev
        );
      });
    };

    updateBox();

    const ro = new ResizeObserver(updateBox);
    ro.observe(el);
    window.addEventListener("scroll", updateBox, { passive: true });
    window.addEventListener("resize", updateBox);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", updateBox);
      window.removeEventListener("resize", updateBox);
    };
  }, []);

  return (
    <section className="w-full relative overflow-visible bg-transparent" aria-label="쇼케이스">
      {/* 왼쪽 컬러 배경 */}
      <div
        className="absolute inset-y-0 left-0 w-full md:w-7/12 -z-10"
        style={{ backgroundColor: current.bgLeft }}
      />

      <div className="mx-auto px-36 h-screen">
        <div className="relative rounded-3xl ring-black/5 overflow-visible bg-white">
          <div className="grid grid-cols-12 gap-0 items-stretch">
            {/* LEFT */}
            <div className="col-span-12 md:col-span-6 p-8 md:p-14 flex flex-col justify-between bg-white">
              <div className="overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`txt-${current.id}`}
                    initial={{ x: 0, opacity: 1 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{
                      x: -240,
                      opacity: 0,
                      scale: 0.96,
                      transition: { duration: 0.6, ease: EASE },
                    }}
                  >
                    <span className="inline-block text-xs md:text-sm px-3 py-2 rounded-full bg-black text-white">
                      {current.tag}
                    </span>
                    <h2 className="mt-6 text-4xl md:text-6xl font-semibold leading-tight text-zinc-900">
                      {current.title.map((t, i) => (
                        <span key={i} className="block">
                          {t}
                        </span>
                      ))}
                    </h2>
                    <a
                      href={current.cta.href}
                      className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white transition"
                    >
                      {current.cta.label}
                      <svg width="16" height="16" viewBox="0 0 24 24" className="-mr-1">
                        <path
                          d="M7 17L17 7M17 7H9M17 7v8"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </a>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 하단 컨트롤 */}
              <div className="mt-10 w-full">
                <div className="w-[420px] max-w-full">
                  <div
                    className="relative h-1.5 bg-black/10 rounded-full overflow-hidden"
                    aria-hidden
                  >
                    <div
                      ref={barRef}
                      className="absolute inset-y-0 left-0 bg-black rounded-full"
                      style={{
                        width: "0%",
                        // transition 제거: JS로 직접 width를 매 프레임 갱신하므로 부드러움 ↑
                      }}
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm text-zinc-800 select-none">
                    <span className="tabular-nums">{pageText}</span>
                    <span className="opacity-60">/ {String(total).padStart(2, "0")}</span>
                    <button
                      onClick={() => {
                        setPlaying(false); // 수동 탐색 시 자동재생 잠깐 멈춤(원하면 유지해도 됨)
                        go(-1);
                      }}
                      className="ml-4 p-2 hover:bg-black/5 rounded-full"
                      aria-label="이전"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path
                          d="M15 18l-6-6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setPlaying((p) => !p)}
                      className="p-2 hover:bg-black/5 rounded-full"
                      aria-label="재생/일시정지"
                    >
                      {playing ? (
                        <svg width="18" height="18" viewBox="0 0 24 24">
                          <path d="M10 6v12M14 6v12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" fill="currentColor" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setPlaying(false);
                        go(1);
                      }}
                      className="p-2 hover:bg-black/5 rounded-full"
                      aria-label="다음"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path
                          d="M9 6l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-span-12 md:col-span-6 relative overflow-visible">
              {/* 측정 앵커 */}
              <div
                ref={cardAnchorRef}
                className="absolute inset-x-0 top-0 bottom-0 translate-y-6 md:translate-y-8 z-10"
              >
                <div className="relative h-full rounded-2xl overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.22)] bg-white">
                  <AnimatePresence mode="wait" initial={false}>
                    {/* NEXT: 오른쪽에서 확장 */}
                    <motion.img
                      key={`next-full-${next.id}-${index}`}
                      src={next.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover z-0"
                      initial={{ clipPath: `inset(0 0 0 ${PEEK_PX}px)` }}
                      animate={{
                        clipPath: `inset(0 0 0 0)`,
                        transition: { duration: 0.6, ease: EASE },
                      }}
                      exit={{ opacity: 1 }}
                    />
                    {/* CURRENT: 왼쪽으로 사라짐 */}
                    <motion.img
                      key={`cur-${current.id}`}
                      src={current.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover z-10"
                      initial={{ x: 0, opacity: 1 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{
                        x: "-100%",
                        opacity: 0,
                        transition: { duration: 0.6, ease: EASE },
                      }}
                    />
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-14 md:h-16" />
      </div>

      {/* 뷰포트 오른쪽 고정 프리뷰 스트립 */}
      <div
        className="pointer-events-none fixed z-40 rounded-l-2xl overflow-hidden"
        style={{
          top: `${previewBox.top}px`,
          height: `${previewBox.height}px`,
          right: 0,
          width: `${PEEK_PX}px`,
        }}
        aria-hidden
      >
        {/* 카드와의 얇은 갭 */}
        <div
          className="absolute inset-y-0 bg-white/80"
          style={{ left: `-${GAP_PX}px`, width: `${GAP_PX}px` }}
        />
        {/* 다음 이미지 미리보기 */}
        <img
          src={next.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
        />
      </div>
    </section>
  );
}
