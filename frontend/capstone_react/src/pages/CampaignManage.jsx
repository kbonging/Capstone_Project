// pages/CampaignManage.jsx
import React, { useContext } from "react";
import MyPageLayout from "../components/mypage/MyPageLayout";
import { AppContext } from "../contexts/AppContext";
import CampaignManageForm from "../components/campaign/CampaignManageForm";

export default function CampaignManage() {
  const { user } = useContext(AppContext);

  const getUserRole = (user) => {
    if (user && user.authDTOList && user.authDTOList.length > 0) {
      return user.authDTOList[0].auth;
    }
    return null;
  };

  const userRole = getUserRole(user);

  if (!user) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="w-8 h-8 border-2 border-blue-200 dark:border-blue-800 border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-gray-600 dark:text-gray-300">로딩 중...</span>
      </div>
    );
  }

  return (
    <MyPageLayout userRole={userRole}>
      <div className="relative two ">
        <h1 className="relative mb-9 text-[30px] font-light font-[Raleway] text-[#080808] dark:text-gray-100 transition-all duration-400 ease-in-out capitalize">
          체험단 관리
          <span className="block text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            본인이 등록한 체험단을 관리할 수 있습니다
          </span>
        </h1>
      </div>
      <CampaignManageForm />
    </MyPageLayout>
  );
}
