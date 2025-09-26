import { useState } from "react";

export default function ErrorPage() {
  const [hue, setHue] = useState(198); // 초기 Hue 값 (색조)

  // HSL → HEX 변환
  const hslToHex = (h, s, l) => {
    s /= 100;
    l /= 100;

    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      Math.round(
        255 *
          (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))
      )
        .toString(16)
        .padStart(2, "0");

    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const hexColor = hslToHex(hue, 100, 50);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      {/* 메인 메시지 */}
      <h1 className="text-3xl md:text-4xl font-bold mb-3">
        Whoops, that page is gone.
      </h1>
      <p className="text-gray-600 mb-10">
        Drag the slider to change the color of the giant 404!
      </p>

      {/* === 풀스크린 404 === */}
      <div
        className="font-extrabold leading-none mb-12"
        style={{
          fontSize: "clamp(8rem, 25vw, 30rem)", // 화면 크기에 맞춰 자동 확장
          color: `hsl(${hue}, 100%, 50%)`,
          filter: "drop-shadow(0 0 20px rgba(0,0,0,0.2))",
          lineHeight: 1,
          position:"relative",
          zIndex: 0
        }}
      >
        404
      </div>

      {/* === 슬라이더 === */}
      <input
        type="range"
        min="0"
        max="360"
        value={hue}
        onChange={(e) => setHue(Number(e.target.value))}
        className="w-64 accent-pink-500 mb-4 relative z-10"
      />

      {/* 현재 색상 코드 표시 */}
      <p className="text-lg font-mono">
        Hue: {hue}° &nbsp;|&nbsp; HEX: <span style={{ color: hexColor }}>{hexColor}</span>
      </p>

      {/* 홈으로 돌아가기 버튼 (옵션) */}
      <a
        href="/"
        className="mt-8 inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition"
      >
        홈으로 이동
      </a>
    </div>
  );
}
