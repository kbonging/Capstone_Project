// src/pages/ProfileManagePage.jsx
import React, { useContext } from "react";
import MyPageLayout from "../components/mypage/MyPageLayout";
import ProfileTabs from "../components/mypage/ProfileTabs";
import ProfileManageForm from "../components/mypage/ProfileManageForm";
import { AppContext } from '../contexts/AppContext'; // AppContext 임포트

export default function ProfileManagePage() {
  const { user } = useContext(AppContext);

  const getUserRole = (user) => {
    if (user && user.authDTOList && user.authDTOList.length > 0) {
      return user.authDTOList[0].auth;
    }
    return null;
  };

  const userRole = getUserRole(user);

  if (!userRole) {
    return <div>Loading...</div>;
  }
  
  return (
    <MyPageLayout userRole={userRole}>
      {/* 탭 UI: 관리 탭 활성화 */}
      <ProfileTabs userRole={userRole} />
      {/* 프로필 관리 폼 */}
      <ProfileManageForm userRole={userRole}/>
    </MyPageLayout>
  );
}