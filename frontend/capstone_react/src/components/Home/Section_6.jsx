import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// 이벤트 이미지
import eventPic1 from "../../images/eventPicture/event1.png";
import eventPic2 from "../../images/eventPicture/event2.png";
import eventPic3 from "../../images/eventPicture/event3.png";
import eventPic4 from "../../images/eventPicture/event4.png";
import eventPic5 from "../../images/eventPicture/event5.png";
import eventPic6 from "../../images/eventPicture/event6.gif";
import eventPic7 from "../../images/eventPicture/event7.png";

const events = [
  { id: 1, img: eventPic5, title: "상품 후기 이벤트", date: "2025. 9. 19. ~ 2025. 9. 30.", path: "/community/161" },
  { id: 2, img: eventPic6, title: "리뷰 참여시 커피 증정", date: "2025. 9. 17. ~ 2025. 9. 30.", path: "error" },
  { id: 3, img: eventPic3, title: "후기 쓴 김에 커피까지!", date: "2025. 9. 1. ~ 2025. 11. 21.", path: "error" },
  { id: 4, img: eventPic4, title: "포토리뷰 이벤트", date: "2025. 9. 1. ~ 2025. 11. 21.", path: "error" },
  { id: 5, img: eventPic1, title: "선물 대방출 기간", date: "2025. 10. 1. ~ 2025. 10. 15.", path: "error" },
  { id: 6, img: eventPic2, title: "싹쓰리 썸머 이벤트", date: "2025. 10. 5. ~ 2025. 10. 20.", path: "error" },
  { id: 7, img: eventPic7, title: "SNS 팔로우 이벤트", date: "2025. 11. 1. ~ 2025. 11. 30.", path: "error" },
];

export default function Section_6() {
  const slidesPerView = 4;
  const totalCards = events.length;

  const [range, setRange] = useState({ start: 1, end: slidesPerView });

  return (
    <section className="max-w-7xl mx-auto px-8 py-48 relative">
      {/* 전체 영역 */}
      <h2 className="text-2xl font-bold mb-10">EVENT</h2>

      <Swiper
        modules={[Navigation]}
        spaceBetween={32}
        slidesPerView={slidesPerView}
        slidesOffsetBefore={20}
        slidesOffsetAfter={20}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        onSlideChange={(swiper) => {
          const firstIdx = swiper.realIndex;
          const lastIdx = Math.min(firstIdx + slidesPerView - 1, totalCards - 1);
          setRange({ start: events[firstIdx].id, end: events[lastIdx].id });
        }}
        className="pb-24"
      >
        {events.map((event) => (
          <SwiperSlide key={event.id} className="overflow-visible"> 
            {/* 카드 전체를 Link로 감쌈 */}
            <Link
              to={event.path}
              className="relative block bg-white dark:bg-zinc-800 rounded-2xl 
                         transform transition-all duration-300"
            >
              <div
                className="transition-all duration-300 
                           hover:-translate-y-4 hover:z-20 hover:absolute hover:left-0 hover:right-0"
              >
                <img
                  src={event.img}
                  alt={event.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-base font-semibold mb-3 truncate">{event.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{event.date}</p>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 페이지네이션 영역 */}
      <div className="flex items-center justify-between mt-8 max-w-7xl mx-auto">
        <div className="relative flex-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full">
          <div
            className="absolute top-0 left-0 h-full bg-black dark:bg-white rounded-full transition-all duration-300"
            style={{ width: `${(range.end / totalCards) * 100}%` }}
          ></div>
        </div>

        <div className="ml-6 text-sm font-medium text-gray-800 dark:text-gray-200 min-w-[80px] text-right">
          <span className="font-bold">
            {range.start}–{range.end}
          </span>
          <span className="text-gray-400"> / {totalCards}</span>
        </div>
      </div>

      {/* 이전 버튼 */}
      <button
        className={`custom-prev absolute top-1/2 -left-14 transform -translate-y-1/2 transition ${
          range.start === 1 ? "opacity-30 pointer-events-none" : "hover:scale-110"
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg"
             fill="none"
             viewBox="0 0 24 24"
             strokeWidth={2}
             stroke="currentColor"
             className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* 다음 버튼 */}
      <button
        className={`custom-next absolute top-1/2 -right-14 transform -translate-y-1/2 transition ${
          range.end === totalCards ? "opacity-30 pointer-events-none" : "hover:scale-110"
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg"
             fill="none"
             viewBox="0 0 24 24"
             strokeWidth={2}
             stroke="currentColor"
             className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}
