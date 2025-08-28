// pages/CampaignCreate.jsx
import React from "react";
import MyPageLayout from "../components/mypage/MyPageLayout";
import CampaignForm from "../components/campaign/CampaignForm";

export default function CampaignCreate() {
  return (
    <MyPageLayout>
          <div className="relative two">
            <h1 className="relative mb-9 text-[30px] font-light font-[Raleway] text-[#080808] transition-all duration-400 ease-in-out capitalize">
              체험단 등록
            </h1>
          </div>
      <CampaignForm />
    </MyPageLayout>
  );
}
