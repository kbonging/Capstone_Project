// pages/CampaignCreate.jsx
import React, { useContext } from "react";
import MyPageLayout from "../components/mypage/MyPageLayout";
import CampaignForm from "../components/campaign/CampaignForm";
import { AppContext } from '../contexts/AppContext';

export default function CampaignCreate() {
    const { user } = useContext(AppContext);

    const getUserRole = (user) => {
      if (user && user.authDTOList && user.authDTOList.length > 0) {
        return user.authDTOList[0].auth;
      }
      return null;
    };

    const userRole = getUserRole(user);

    if (!user) {
      return <div>로딩 중...</div>;
    }

    return (
      <MyPageLayout userRole={userRole}>
        <div className="relative two">
          <h1 className="relative mb-9 text-[30px] font-light font-[Raleway] text-[#080808] transition-all duration-400 ease-in-out capitalize">
            체험단 등록
          </h1>
        </div>
        <CampaignForm key={Date.now()}/>
      </MyPageLayout>
    );
}