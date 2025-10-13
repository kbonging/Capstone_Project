import { useEffect, useRef, useState } from "react";
import { FiPlay, FiPause, FiChevronRight } from "react-icons/fi";

export default function RotatingBanner({
  videos = [],
  className = "",
  children,
}) {
  const [active, setActive] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoaded = () =>
      setDuration(Number.isFinite(v.duration) ? v.duration : 0);
    const onTimeUpdate = () => setCurrentTime(v.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setActive((i) => (i + 1) % videos.length);

    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("timeupdate", onTimeUpdate);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);

    v.currentTime = 0;
    v.play().catch(() => setIsPlaying(false));

    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("timeupdate", onTimeUpdate);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
    };
  }, [active, videos.length]);

  if (!videos.length) return null;

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      try {
        await v.play();
        setIsPlaying(true);
      } catch {}
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const nextVideo = () => setActive((i) => (i + 1) % videos.length);

  const fmt = (sec) => {
    if (!Number.isFinite(sec)) return "--:--";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden group ${className}`}>
      {videos.map((v, idx) => (
        <video
          key={v.src}
          ref={idx === active ? videoRef : null}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            idx === active ? "opacity-100" : "opacity-0"
          }`}
          src={v.src}
          poster={v.poster}
          autoPlay
          muted
          playsInline
          preload="metadata"
        >
          {v.type && <source src={v.src} type={v.type} />}
        </video>
      ))}

      {children && (
        <div className="absolute inset-0 pointer-events-none">{children}</div>
      )}

      {/* 컨트롤바: 우측 하단, 호버 시에만 표시 */}
      <div
        className="
          absolute left-3 bottom-3
          flex items-center gap-3
          px-3 py-2 rounded-full
          bg-black/45 text-white border border-white/20 backdrop-blur
          opacity-0 pointer-events-none
          group-hover:opacity-100 group-hover:pointer-events-auto
          transition
        "
      >
        {/* 재생/일시정지 */}
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center transition"
          aria-label={isPlaying ? "일시정지" : "재생"}
          title={isPlaying ? "일시정지" : "재생"}
        >
          {isPlaying ? (
            <FiPause className="text-base" />
          ) : (
            <FiPlay className="text-base" />
          )}
        </button>

        {/* 다음 */}
        <button
          onClick={nextVideo}
          aria-label="다음 영상"
          title="다음 영상"
          className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center transition"
        >
          <FiChevronRight className="text-base" />
        </button>

        {/* 시간 */}
        <span className="text-sm tabular-nums">
          {fmt(currentTime)} / {fmt(duration)}
        </span>
      </div>
    </div>
  );
}
