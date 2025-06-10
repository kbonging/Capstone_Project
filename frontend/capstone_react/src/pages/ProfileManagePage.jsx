// src/pages/ProfileManagePage.jsx
import React from "react";
import MyPageLayout from "../components/mypage/MyPageLayout";
import ProfileTabs from "../components/mypage/ProfileTabs";
import ProfileManageForm from "../components/mypage/ProfileManageForm";

export default function ProfileManagePage() {
  return (
    <MyPageLayout>
      {/* 탭 UI: 관리 탭 활성화 */}
      <ProfileTabs />
      {/* 프로필 관리 폼 */}
      <ProfileManageForm />
    </MyPageLayout>
  );
}
