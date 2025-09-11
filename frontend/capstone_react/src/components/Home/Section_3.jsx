// components/home/Section_3.jsx
import React from "react";
import { FiChevronRight, FiPlus } from "react-icons/fi";

/** 가짜 데이터 (API 연동 시 교체) */
const REVORY_NEWS = [
  {
    id: 1,
    badge: "이벤트",
    title: "9월 체험단 통합 모집 오픈",
    desc: "배송형 · 방문형 · 포장형 한눈에!",
    href: "/news/1",
  },
  {
    id: 2,
    badge: "가이드",
    title: "지구를 지키는 리뷰",
    desc: "친환경 포장 가이드 & 체크리스트",
    href: "/news/2",
  },
  {
    id: 3,
    badge: "제휴",
    title: "NH농협카드 × Revory",
    desc: "신규 리워드 혜택 프로모션",
    href: "/news/3",
  },
  {
    id: 4,
    badge: "추천",
    title: "9월 핫한 캠페인",
    desc: "숙박 · 카페 · 뷰티 Top Picks",
    href: "/news/4",
  },
];

export default function Section_3() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ===== 왼쪽 배너 ===== */}
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9] lg:aspect-auto">
        <img
          src="/assets/section3/banner_revory.jpg" // 프로젝트 경로에 맞게 교체
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

      {/* ===== 오른쪽 뉴스 리스트 ===== */}
      <div className="bg-white rounded-2xl ">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-xl font-bold">오늘의 Revory 소식</h2>
          <a
            href="/news"
            className="inline-flex items-center gap-1 text-sm font-semibold  py-1.5 rounded-full hover:bg-gray-50"
            aria-label="더보기"
          >
            <FiPlus className="text-base" />
          
          </a>
        </div>

        {/* 첫번째 강조 알림(회색 배경 캡슐) — 필요 없으면 제거 */}
        <div className="px-5">
          <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2 mb-2">
            <span className="text-xs font-semibold bg-gray-800 text-white px-2 py-0.5 rounded">
              공지
            </span>
            <span className="text-sm text-gray-800 font-medium">
              “9월 한정 추가 리워드! 숙박/카페 캠페인 참여시 포인트 +10%”
            </span>
          </div>
        </div>

        {/* 리스트 (보더 라인) */}
        <ul className="divide-y divide-gray-200">
          {REVORY_NEWS.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                className="group flex items-start justify-between gap-4 px-5 py-4 hover:bg-gray-50"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                      {item.badge}
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
      </div>
    </section>
  );
}
