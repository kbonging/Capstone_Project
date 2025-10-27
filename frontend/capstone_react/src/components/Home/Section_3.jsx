// components/home/Section_3.jsx
import React, { useEffect, useState } from "react";
import { FiChevronRight, FiPlus } from "react-icons/fi";
import { getCommunities, mapCommunityForNews } from "../../api/maincommunity";
// 배너 이미지: vite/CRA 번들 환경을 고려해 import 권장
import RotatingBanner from "../../components/media/RotatingBanner";

export default function Section_3() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        // 1) 서버에서 공지 카테고리만 요청
        const res = await getCommunities({
          page: 1,
          recordCount: 6, // 최대 8개
          categoryId: "COMMU004", // 공지
          showMycommunitiesParam: "", // 공개
        });

        // 2) 안전망: 혹시 서버가 무시하면 프론트에서 한 번 더 필터
        const onlyNotices = (res.list || []).filter(
          (x) => x?.categoryId === "COMMU004" || x?.codeNm === "공지"
        );

        // 최대 6개 보장
        const top6 = onlyNotices.slice(0, 6).map(mapCommunityForNews);
        setItems(top6);
      } catch (e) {
        setErr(e?.message || "불러오기에 실패했습니다.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="max-w-5xl mx-auto px-4 py-32 grid grid-cols-1 lg:grid-cols-2 gap-28">
      {/* 왼쪽 배너: 순환 비디오 컴포넌트 사용 */}
      <RotatingBanner
        className="aspect-[16/9] lg:aspect-auto"
        videos={[
          {
            src: "/videos/Revory5team_introduceself.mp4",
            type: "video/mp4",
            poster: "/images/section3/poster1.jpg",
          },
          {
            src: "/videos/video1.mp4",
            type: "video/mp4",
            poster: "/images/section3/poster1.jpg",
          },
          {
            src: "/videos/video2.mp4",
            type: "video/mp4",
            poster: "/images/section3/poster2.jpg",
          },
          {
            src: "/videos/video3.mp4",
            type: "video/mp4",
            poster: "/images/section3/poster3.jpg",
          },
        ]}
      >
        {/* 오버레이(자유롭게 커스텀) */}
        <div className="bg-white/25 dark:bg-black/40 w-full h-full flex flex-col pt-5 justify-start items-center text-white text-center">
          {/* 필요하면 텍스트/버튼 활성화 */}
          {/* <h3 className="text-xl font-bold mb-1 drop-shadow text-black/70 dark:text-white">리뷰어 전용 뉴스레터</h3>
          <h2 className="text-3xl font-extrabold mb-4 drop-shadow text-black/70 dark:text-white">Revory Weekly</h2>
          <button
            className="pointer-events-auto px-5 py-2 rounded-full font-semibold bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400 shadow"
            onClick={() => (window.location.href = "/newsletter")}
          >
            지금 구독하고 꿀혜택 받기
          </button> */}
        </div>
      </RotatingBanner>

      {/* 오른쪽 뉴스 리스트 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl  border-gray-100 dark:border-zinc-800">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100">
            오늘의 Revory 소식
          </h2>
          <a
            href="/community?categoryId=COMMU004"
            className="inline-flex items-center gap-1 text-sm font-semibold px-2 py-1.5 rounded-full text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
            aria-label="더보기"
            title="공지 더보기"
          >
            <FiPlus className="text-base" />
          </a>
        </div>

        {/* 리스트 */}
        {loading ? (
          <div className="px-5 py-10 text-center text-gray-500 dark:text-zinc-400">
            불러오는 중…
          </div>
        ) : err ? (
          <div className="px-5 py-10 text-center text-rose-500">
            에러: {err}
          </div>
        ) : items.length === 0 ? (
          <div className="px-5 py-10 text-center text-gray-500 dark:text-zinc-400">
            공지 글이 아직 없어요.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="group flex items-start justify-between gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* 뱃지: 라이트/다크 대비 */}
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                        {item.badge /* '공지' */}
                      </span>
                      <span className="flex-1 min-w-0 text-sm font-semibold text-sky-700 dark:text-sky-400 group-hover:underline truncate">
                        {item.title}
                      </span>
                      {/* <span className="text-sm text-gray-600 dark:text-zinc-400 truncate">
                        {item.desc}
                      </span> */}
                    </div>
                  </div>
                  <FiChevronRight className="mt-1 shrink-0 text-gray-400 dark:text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
