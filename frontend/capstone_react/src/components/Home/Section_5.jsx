import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";

// 배너 이미지
import ban1 from "../../images/banner/ban1.png";
import ban2 from "../../images/banner/ban2.png";
import ban3 from "../../images/banner/ban3.png";
import ban4 from "../../images/banner/ban4.png";
import ban5 from "../../images/banner/ban5.png";
import ban6 from "../../images/banner/ban6.png";


export default function Section5() {
  const swiperRef = useRef(null);
  const navigate = useNavigate();

  // const toggleAutoplay = () => {
  //   if (!swiperRef.current) return;
  //   if (isPlaying) {
  //     swiperRef.current.autoplay.stop();
  //     setIsPlaying(false);
  //   } else {
  //     swiperRef.current.autoplay.start();
  //     setIsPlaying(true);
  //   }
  // };

  return (
    <section className="w-full section5-container ">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="w-full h-[150px]"
      >
        {/* 1번 슬라이드 */}
        <SwiperSlide>
          <div
            className="w-full h-full bg-center bg-cover"
            style={{ backgroundImage: `url(${ban4})` }}
          >
            {/* 필요시 배너 위에 텍스트/버튼 추가 */}
            <div className="flex items-center justify-center h-full">
              <h2 className="text-white text-3xl font-bold"></h2>
            </div>
          </div>
        </SwiperSlide>

        {/* 2번 슬라이드 */}
        <SwiperSlide>
          <div
            className="w-full h-full bg-center bg-cover"
            style={{ backgroundImage: `url(${ban3})` }}
          >
            {/* 필요시 배너 위에 텍스트/버튼 추가 */}
            <div className="flex items-center justify-center h-full">
              <h2 className="text-white text-3xl font-bold"></h2>
            </div>
          </div>
        </SwiperSlide>

{/* 3번 슬라이드 */}
        <SwiperSlide>
      <div className="flex items-center justify-around w-full h-full ">
        <img
          src={ban5}   // ✅ import 한 이미지 그대로 사용
          alt="산 여행"
          className="w-1/2 h-full object-cover cursor-pointer"
          onClick={() => navigate("/error")}
        />
        <img
          src={ban6}
          alt="해변 여행"
          className="w-1/2 h-full object-cover cursor-pointer"
          onClick={() => navigate("/error")}
        />
      </div>
    </SwiperSlide>

      </Swiper>

      {/* 재생/정지 버튼 + 불렛을 React로 직접 한 줄 배치 */}
      <div className="flex justify-center items-center gap-3 mt-4">
        {/* <button
          type="button"
          onClick={toggleAutoplay}
          aria-label={isPlaying ? "롤링배너 일시정지" : "롤링배너 재생"}
          className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-900 transition"
        > */}
        {/* </button> */}
        {/* Swiper가 bullet을 렌더링할 영역 */}
        <div className="swiper-pagination flex gap-2"></div>
      </div>
    </section>
  );
}
