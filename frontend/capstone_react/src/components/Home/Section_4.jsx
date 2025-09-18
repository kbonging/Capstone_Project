// Section_4.jsx
import React from "react";

export default function Section4({
  height = 600,
  images = Array.from({ length: 10 }).map(
    (_, i) => `https://picsum.photos/300/200?random=${i + 1}`
  ),
  radius = -520, // 살짝 더 깊게 해서 왜곡 완화
  item = { w: 240, h: 135, gap: 24 },
  speedSec = 18,
  reverse = false,
}) {
  const step = 360 / images.length;

  return (
    <section
      className="relative mx-auto grid place-items-center overflow-hidden"
      style={{
        height,
        perspective: "1500px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      {/* ===== 문구 영역 ===== */}
      <div className="absolute top-28 w-full text-center z-10">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          리뷰가 모여 가치를 만들다
        </h2>
        <p className="mt-2 text-gray-500">
          Revory에서 경험이 연결되고, 이야기가 새로운 기회로 확장됩니다
        </p>
      </div>

      {/* ===== 회전 링 ===== */}
      <div
        className="absolute left-1/2 top-1/2 [transform-style:preserve-3d] will-change-transform"
        style={{
          transform: "translate(-50%, -50%)",
          animation: `rotater ${speedSec}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
          transformOrigin: "50% 50%",
        }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 [backface-visibility:hidden]"
            style={{
              transform: `translate(-50%, -50%) rotateY(${
                i * step
              }deg) translateZ(${radius}px)`,
              transformOrigin: "50% 50%",
            }}
          >
            <div
              className="transition-transform duration-500 hover:scale-110"
              style={{ width: item.w, height: item.h, marginBottom: item.gap }}
            >
              <img
                src={src}
                alt={`section4-${i + 1}`}
                className="w-full h-full object-cover opacity-60 hover:opacity-100 rounded-lg"
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ===== keyframes ===== */}
      <style>{`
        @keyframes rotater {
          0%   { transform: translate(-50%, -50%) rotateY(0deg); }
          100% { transform: translate(-50%, -50%) rotateY(360deg); }
        }
      `}</style>
    </section>
  );
}
