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
      setPremium(res);
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
    <div className="mx-auto w-full max-w-6xl p-4 md:p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Carousel items={banners} />
        <Carousel items={[...banners].reverse()} />
      </div>

      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-2xl">
          <QuickNav />
        </div>
      </div>

      <PremiumSection
        title="프리미엄 체험단"
        items={premium}
        onMore={() => (window.location.href = "/campaigns?premium=1")}
      />
    </div>
  );
}
