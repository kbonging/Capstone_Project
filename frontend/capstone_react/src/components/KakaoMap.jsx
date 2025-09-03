// src/components/KakaoMap.jsx
import React, { useEffect, useRef, useState } from "react";

let kakaoSdkPromise = null;

/* ───────────────────────── 카카오 SDK 로더 ───────────────────────── */
function loadKakaoSdk(appKey) {
  if (window.kakao?.maps?.load) {
    return new Promise((resolve) => window.kakao.maps.load(resolve));
  }
  if (!kakaoSdkPromise) {
    kakaoSdkPromise = new Promise((resolve, reject) => {
      const exist = document.querySelector('script[data-kakao="maps"]');
      const onReady = () => {
        if (!window.kakao?.maps?.load) return reject(new Error("Kakao maps loader missing"));
        window.kakao.maps.load(resolve);
      };
      if (exist) {
        if (exist.getAttribute("data-loaded") === "true") return onReady();
        exist.addEventListener("load", () => {
          exist.setAttribute("data-loaded", "true");
          onReady();
        });
        exist.addEventListener("error", reject);
      } else {
        const s = document.createElement("script");
        s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;
        s.async = true;
        s.defer = true;
        s.dataset.kakao = "maps";
        s.addEventListener("load", () => {
          s.setAttribute("data-loaded", "true");
          onReady();
        });
        s.addEventListener("error", reject);
        document.head.appendChild(s);
      }
    });
  }
  return kakaoSdkPromise;
}

/* ───────────────────── 주소 전처리/보조 유틸 ───────────────────── */
const cleanseAddress = (s = "") =>
  s
    .replace(/\s*\d+\s*층.*$/g, "")   // 1층, 2층 …
    .replace(/\s*\d+\s*호.*$/g, "")   // 101호 …
    .replace(/\s*\([^)]+\)/g, "")     // (지번) 등
    .replace(/^\s*대한민국\s*/, "")   // 대한민국 접두 제거
    .trim();

// 테헤란로 1 → 테헤란로 (도로명 뒤 숫자 제거: 2차 시도용)
const stripRoadNumber = (s = "") => s.replace(/\s+\d+(-\d+)?\s*$/, "").trim();

// “테헤란로 1” → “테헤란로 1길” 같은 후보 생성(존재할 때가 있음)
const toRoadGilCandidate = (s = "") =>
  s.replace(/([가-힣]+로)\s+(\d+)\s*$/, "$1 $2길");

// “서울시” → “서울특별시” 후보
const normalizeSeoulCandidate = (s = "") => s.replace(/서울시/g, "서울특별시");

// 시/구 추출 → Places 검색 바이어스 좌표를 얻기 위해
const extractRegion = (addr = "") => {
  const cityMatch = addr.match(/([가-힣]+(?:특별시|광역시|시))/); // 서울특별시/부산광역시/성남시
  const guMatch   = addr.match(/([가-힣]+구)/);                  // 강남구/서초구
  return { city: cityMatch ? cityMatch[1] : "", gu: guMatch ? guMatch[1] : "" };
};

// 두 좌표 간 대략 거리(m) : 가까운 후보 선정을 위해
function distance(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ─────────────────────────── 메인 컴포넌트 ─────────────────────────── */
export default function KakaoMap({
  address,
  title = "",
  height = "240px",
  level = 3,
  // 지오코딩 실패 시 fallback 좌표(서울시청)
  fallback = { lat: 37.5662952, lng: 126.9779451 },
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const centerRef = useRef(null);
  const [status, setStatus] = useState("init");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setStatus("loading");
      setError("");

      const appKey = import.meta.env.VITE_KAKAO_APP_KEY;
      if (!appKey) {
        setError("VITE_KAKAO_APP_KEY 누락 (.env 확인)");
        setStatus("error");
        return;
      }
      if (!address?.trim()) {
        setError("주소가 없습니다.");
        setStatus("error");
        return;
      }

      try {
        await loadKakaoSdk(appKey);
        const { kakao } = window;
        if (containerRef.current) containerRef.current.innerHTML = "";

        const geocoder = new kakao.maps.services.Geocoder();
        const places   = new kakao.maps.services.Places();

        // 0) 원본 주소(행정명/도로명은 그대로), 층/호/괄호만 제거
        const raw = String(address || "").trim(); // 예: "서울시 강남구 테헤란로 1"
        const base = cleanseAddress(raw);

        // 1) 지오코딩 후보 세트(우선순위 순)
        const candidates = [
          base,
          normalizeSeoulCandidate(base), // 서울시 → 서울특별시
          toRoadGilCandidate(base),      // 테헤란로 1 → 테헤란로 1길
          stripRoadNumber(base),         // 테헤란로
        ]
          .filter(Boolean)
          .filter((s, i, arr) => arr.indexOf(s) === i); // 중복 제거

        // 2) 시/구 추출(바이어스 좌표 얻기 위함)
        const { city, gu } = extractRegion(base);
        const regionQuery = [city, gu].filter(Boolean).join(" "); // "서울특별시 강남구" 등

        // ────────── 지오코딩 후보를 순차로 시도
        geocodeCandidates(candidates, async () => {
          // 후보 지오코딩이 전부 실패 → Places(상호명) 시도
          if (!title?.trim()) return missAndFallback();

          // (A) 지역 중심 좌표를 먼저 구해서 근처에서 상호명 검색(정확도↑)
          if (regionQuery) {
            geocoder.addressSearch(regionQuery, (rres, rst) => {
              if (rst === kakao.maps.services.Status.OK && rres?.length) {
                const { x: rx, y: ry } = rres[0];
                const regionCenter = new kakao.maps.LatLng(Number(ry), Number(rx));
                places.keywordSearch(
                  title.trim(),
                  (prs, pstatus) => {
                    if (pstatus === kakao.maps.services.Status.OK && prs?.length) {
                      const nearest = prs
                        .map((p) => ({
                          ...p,
                          dist: distance(Number(ry), Number(rx), Number(p.y), Number(p.x)),
                        }))
                        .sort((a, b) => a.dist - b.dist)[0];
                      drawMap(new kakao.maps.LatLng(Number(nearest.y), Number(nearest.x)));
                      setStatus("ok");
                    } else {
                      // (B) 바이어스 실패 → 전국 검색(덜 정확)
                      places.keywordSearch(title.trim(), (prs2, p2status) => {
                        if (p2status === kakao.maps.services.Status.OK && prs2?.length) {
                          const { x, y } = prs2[0];
                          drawMap(new kakao.maps.LatLng(Number(y), Number(x)));
                          setStatus("ok");
                        } else {
                          missAndFallback();
                        }
                      });
                    }
                  },
                  { location: regionCenter, radius: 5000 } // 5km 반경
                );
              } else {
                // 지역 중심 좌표 자체를 못 구함 → 전국 상호 검색
                places.keywordSearch(title.trim(), (prs2, p2status) => {
                  if (p2status === kakao.maps.services.Status.OK && prs2?.length) {
                    const { x, y } = prs2[0];
                    drawMap(new kakao.maps.LatLng(Number(y), Number(x)));
                    setStatus("ok");
                  } else {
                    missAndFallback();
                  }
                });
              }
            });
          } else {
            // city/gu 추출 실패 → 전국 상호 검색
            places.keywordSearch(title.trim(), (prs2, p2status) => {
              if (p2status === kakao.maps.services.Status.OK && prs2?.length) {
                const { x, y } = prs2[0];
                drawMap(new kakao.maps.LatLng(Number(y), Number(x)));
                setStatus("ok");
              } else {
                missAndFallback();
              }
            });
          }
        });

        // ────────── 후보 지오코딩 재귀
        function geocodeCandidates(list, onAllFail) {
          if (!list.length) return onAllFail?.();
          const q = list[0];
          geocoder.addressSearch(q, (res, st) => {
            if (st === kakao.maps.services.Status.OK && res?.length) {
              const { x, y, address_name } = res[0];
              console.debug("[KakaoMap] matched:", address_name);
              drawMap(new kakao.maps.LatLng(Number(y), Number(x)));
              setStatus("ok");
            } else {
              geocodeCandidates(list.slice(1), onAllFail);
            }
          });
        }

        function missAndFallback() {
          console.warn("[KakaoMap] address/keyword search failed");
          setError("주소/키워드로 장소를 찾지 못했습니다. (임시 좌표 표시)");
          drawMap(new kakao.maps.LatLng(fallback.lat, fallback.lng));
          setStatus("ok");
        }

        // ────────── 지도 렌더
        function drawMap(coords) {
          centerRef.current = coords;
          const map = new kakao.maps.Map(containerRef.current, { center: coords, level });
          mapRef.current = map;
          const marker = new kakao.maps.Marker({ position: coords, map });
          if (title) {
            new kakao.maps.InfoWindow({
              content: `<div style="padding:6px 10px;font-size:12px;white-space:nowrap;">${title}</div>`,
            }).open(map, marker);
          }
          setTimeout(() => {
            kakao.maps.event.trigger(map, "resize");
            map.setCenter(coords);
          }, 80);
        }
      } catch (e) {
        console.error("[KakaoMap] SDK load error:", e);
        setError("카카오 SDK 로드 실패 (도메인/키 확인)");
        setStatus("error");
      }
    })();
  }, [address, level, title, fallback.lat, fallback.lng]);

  // 부모 영역 표시 변화에 대응
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => {
      const map = mapRef.current;
      if (!map || !window.kakao) return;
      window.kakao.maps.event.trigger(map, "resize");
      if (centerRef.current) map.setCenter(centerRef.current);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div>
      <div
        ref={containerRef}
        style={{ width: "100%", height }}
        className="rounded-lg border border-stone-200 dark:border-zinc-700"
      />
      {(error || status !== "ok") && (
        <p className="mt-2 text-xs">
          <span className={error ? "text-rose-600" : "text-stone-500"}>
            {error || `상태: ${status}`}
          </span>
          <br />
          <span className="text-stone-400">
            host: {location.origin} / addr: “{String(address || "").trim()}”
          </span>
        </p>
      )}
    </div>
  );
}
