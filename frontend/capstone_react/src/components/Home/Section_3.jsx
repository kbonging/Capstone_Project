// components/home/Section_3.jsx
import React, { useEffect, useState } from "react";
import { FiChevronRight, FiPlus } from "react-icons/fi";
import { getCommunities, mapCommunityForNews } from "../../api/maincommunity";

export default function Section_3() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        //  1) 서버 필터: 공지 카테고리만 요청 (COMMU004)
        const res = await getCommunities({
          page: 1,
          recordCount: 6, // 최대 6개만
          categoryId: "COMMU004", // 공지
          showMycommunitiesParam: "", // 공개
        });

        //  2) 안전망: 혹시 서버가 무시해도 프론트에서 한 번 더 필터
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
    <section className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 왼쪽 배너 */}
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9] lg:aspect-auto">
        <img
          src="../../images/MainLogo.png"
          alt="Revory 구독 배너"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white text-center">
          <h3 className="text-xl font-bold mb-1">리뷰어 전용 뉴스레터</h3>
          <h2 className="text-3xl font-extrabold mb-4">Revory Weekly</h2>
          <button className="px-5 py-2 rounded-full font-semibold bg-emerald-500 hover:bg-emerald-600 shadow">
            지금 구독하고 꿀혜택 받기
          </button>
        </div>
      </div>

      {/* 오른쪽 뉴스 리스트 */}
      <div className="bg-white rounded-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-xl font-bold">오늘의 Revory 소식</h2>
          <a
            href="/community?categoryId=COMMU004"
            className="inline-flex items-center gap-1 text-sm font-semibold py-1.5 rounded-full hover:bg-gray-50"
            aria-label="더보기"
          >
            <FiPlus className="text-base" />
          </a>
        </div>

        {/* 리스트 */}
        {loading ? (
          <div className="px-5 py-10 text-center text-gray-500">
            불러오는 중…
          </div>
        ) : err ? (
          <div className="px-5 py-10 text-center text-rose-500">
            에러: {err}
          </div>
        ) : items.length === 0 ? (
          <div className="px-5 py-10 text-center text-gray-500">
            공지 글이 아직 없어요.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="group flex items-start justify-between gap-4 px-5 py-4 hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-center">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-50 text-red-800">
                        {item.badge /* "공지" 표기 */}
                      </span>
                      <span className="text-sm font-semibold text-sky-700 group-hover:underline truncate">
                        {item.title}
                      </span>
                      <span className="text-sm text-gray-600 truncate">
                        {item.desc}
                      </span>
                    </div>
                  </div>
                  <FiChevronRight className="mt-1 shrink-0 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
