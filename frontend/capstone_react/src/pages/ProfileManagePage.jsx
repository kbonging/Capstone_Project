// src/pages/ProfileManagePage.jsx
import React, { useContext, useState, useEffect } from "react";
import MyPageLayout from "../components/mypage/MyPageLayout";
import ProfileTabs from "../components/mypage/ProfileTabs";
import ProfileManageForm from "../components/mypage/ProfileManageForm";
import { AppContext } from '../contexts/AppContext';
import { useParams } from "react-router-dom";

export default function ProfileManagePage() {
  const { user: loggedInUser } = useContext(AppContext);
  const { memberIdx } = useParams(); // 혹시 URL로 들어올 경우 대비
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (!loggedInUser) return;

    // memberIdx가 있거나 없거나 모두 본인 확인
    if (memberIdx && memberIdx !== loggedInUser.memberIdx.toString()) {
      setUser(null); // 다른 회원이면 접근 불가
      setUserRole(null);
    } else {
      setUser(loggedInUser);
      const role = loggedInUser.authDTOList?.[0]?.auth || null;
      setUserRole(role);
    }
  }, [loggedInUser, memberIdx]);

  if (!user) {
    return <div className="p-6 text-center text-red-500">권한이 없습니다.</div>;
  }

  if (!userRole) {
    return <div>Loading...</div>;
  }

  return (
    <MyPageLayout userRole={userRole}>
      <ProfileTabs userRole={userRole} />
      <ProfileManageForm userRole={userRole} user={user} />
    </MyPageLayout>
  );
}
