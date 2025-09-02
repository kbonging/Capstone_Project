import React, { useEffect, useState } from "react";
import Carousel from "../components/common/Carousel";
import QuickNav from "../components/common/QuickNav";
import PremiumSection from "../components/campaign/PremiumSection";
import { getPremiumCampaigns } from "../api/campaigns";

export default function HomePage() {
  const [premium, setPremium] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getPremiumCampaigns();
      setPremium(res || []);
    })();
  }, []);

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
    <div className="mx-auto w-full min-h-screen max-w-6xl px-4 py-4 md:px-6 md:py-6">
      {/* 배너 영역: 모바일 1열 → md 이상 2열 */}
      <section aria-label="프로모션 배너" className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* 각 캐러셀은 부모 높이에 맞춤: 모바일 낮게, 데스크탑 높게 */}
        <div className=" rounded-xl   backdrop-blur
                        h-40 xs:h-48 sm:h-56 md:h-64 lg:h-80">
          {/* Carousel이 className을 받는다면 주입 */}
          <Carousel items={banners} className="h-full" />
        </div>
        <div className="overflow-hidden rounded-xl  backdrop-blur
                        h-40 xs:h-48 sm:h-56 md:h-64 lg:h-80">
          <Carousel items={[...banners].reverse()} className="h-full" />
        </div>
      </section>

      {/* 퀵 내비: 모바일 풀폭, md 이상은 가운데 고정폭 */}
      <section className="mt-6 sm:mt-8 flex justify-center" aria-label="빠른 이동">
        <div className="w-full sm:max-w-xl md:max-w-2xl">
          <QuickNav />
        </div>
      </section>

      {/* 프리미엄 섹션: 상단 여백 반응형, 내부 그리드는 PremiumSection에서 처리 */}
      <section className="mt-8 sm:mt-10 md:mt-12" aria-label="프리미엄 체험단">
        <PremiumSection
          title="프리미엄 체험단"
          items={premium}
          onMore={() => (window.location.href = "/campaigns?premium=1")}
          // (선택) PremiumSection이 className을 지원하면 다음처럼 여백/정렬 강화 가능
          // className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        />
      </section>
    </div>
  );
}
