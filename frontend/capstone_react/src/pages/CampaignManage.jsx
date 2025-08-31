// pages/CampaignManage.jsx
import React, { useContext } from "react";
import MyPageLayout from "../components/mypage/MyPageLayout";
import { AppContext } from '../contexts/AppContext';

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
    return <div>로딩 중...</div>;
  }

  return (
    <MyPageLayout userRole={userRole}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 p-4 text-center">
        <div className="w-40 h-40 mb-6 relative">
          <span className="absolute text-[6rem] animate-bounce">🚧</span>
        </div>
        <h1 className="text-4xl font-bold text-yellow-800 mb-2 font-[Raleway]">
          체험단 관리 페이지 공사중..
        </h1>
        <p className="text-lg text-yellow-700 font-medium mb-6">
          잠시만 기다려주세요! 곧 새로운 기능으로 찾아옵니다 🎉
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-yellow-400 text-yellow-900 font-semibold rounded-full hover:bg-yellow-300 transition-colors"
        >
          홈으로 돌아가기
        </a>
      </div>
    </MyPageLayout>
  );
}