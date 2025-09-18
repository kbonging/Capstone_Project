// src/pages/MyCampaigns.jsx
import React, { useContext, useEffect, useState } from "react";
import MyPageLayout from "../components/mypage/MyPageLayout";
import { AppContext } from "../contexts/AppContext";
// 내 체험단 리스트 컴포넌트
import MyCampaignList from "../components/campaign/MyCampaignList";

export default function MyCampaigns() {
  const { user } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  // 유저 권한 추출
  const getUserRole = (user) => {
    if (user?.authDTOList?.length > 0) {
      return user.authDTOList[0].auth;
    }
    return null;
  };

  const userRole = getUserRole(user);

  useEffect(() => {
    if (userRole) setLoading(false);
  }, [userRole]);

  if (loading) return <div>Loading...</div>;

  return (
    <MyPageLayout userRole={userRole}>
      <MyCampaignList /> 
    </MyPageLayout>
  );
}
