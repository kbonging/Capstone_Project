import React, { useEffect, useState } from "react";
import Carousel from "../components/common/Carousel";
import QuickNav from "../components/common/QuickNav";
import PremiumSection from "../components/campaign/PremiumSection";
import { getPremiumCampaigns } from "../api/campaigns";
import ShowcaseSlider from "../components/Home/ShowcaseSlider";

export default function HomePage() {
  const [premium, setPremium] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getPremiumCampaigns();
      setPremium(res || []);
    })();
  }, []);

  const heroItems = [
    {
      badge: "시원한 바람이 반겨주는 곳",
      title: "푸른 자연을 만나는\n경북 청송 추천 코스",
      href: "#",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop",
      alt: "청송 협곡",
      tint: "#eaf6d6", // 연녹 배경
    },
    {
      badge: "그림처럼 투명한 물빛💓",
      title: "나만 알고 싶은\n제주 스노클링 명소 3",
      href: "#",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
      alt: "제주 물빛",
      tint: "#d8f5f7", // 파스텔 민트
    },
    {
      badge: "물놀이 가고플 때,",
      title: "재미에 낭만을 더한,\n전국 워터파크 추천 4",
      href: "#",
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1600&auto=format&fit=crop",
      alt: "워터파크",
      tint: "#dfefff", // 연하늘
    },
  ];

  const banners = [
    {
      image:
        "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=1600&auto=format&fit=crop",
      href: "#",
      alt: "이벤트 당첨자 발표",
    },
    {
      image:
        "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?q=80&w=1600&auto=format&fit=crop",
      href: "#",
      alt: "앱에서 올인원",
    },
  ];

  return (
    <div className=" w-full   ">
      {/* ✅ 헤더 바로 아래 풀-블리드 히어로 */}
      <div className="w-full">
        <ShowcaseSlider />
      </div>

      {/* 퀵 내비 */}
      <section className="mt-6 sm:mt-8 flex justify-center" aria-label="빠른 이동">
        <div className="w-full sm:max-w-xl md:max-w-2xl">
          <QuickNav />
        </div>
      </section>

      {/* 프리미엄 섹션 */}
      <section className="px-16 max-w-screen-2xl mt-8 sm:mt-10 md:mt-12" aria-label="프리미엄 체험단">
        <PremiumSection
          items={premium}
        />
      </section>
    </div>
  );
}
