import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MyPageLayout from "../components/mypage/MyPageLayout";
import ProfileTabs from "../components/mypage/ProfileTabs";
import Profile from "../components/mypage/Profile";
import { AppContext } from '../contexts/AppContext';
import AdminAllow from '../components/mypage/AdminAllow';
import { getUserByIdx } from "../api/memberApi";

export default function MyPage() {
  const { user: loggedInUser, token } = useContext(AppContext);
  const { memberIdx } = useParams();
  const [targetUser, setTargetUser] = useState(null);

  useEffect(() => {
    if (!loggedInUser) return; // loggedInUser가 없으면 아무 것도 안 함

    if (memberIdx && memberIdx !== loggedInUser.memberIdx.toString()) {
      // 타회원 프로필
      getUserByIdx(memberIdx, token)
        .then((data) => setTargetUser(data))
        .catch((err) => console.error(err));
    } else {
      // 자기 프로필
      setTargetUser(loggedInUser);
    }
  }, [memberIdx, loggedInUser, token]);

  const loggedInRole = loggedInUser?.authDTOList?.[0]?.auth;
  const targetRole = targetUser?.authDTOList?.[0]?.auth;

  if (!targetUser || !loggedInRole) return <div>Loading...</div>;

  if (loggedInRole === 'ROLE_ADMIN') {
    return (
      <MyPageLayout userRole={loggedInRole}>
        <AdminAllow />
      </MyPageLayout>
    );
  }

  return (
    <MyPageLayout userRole={loggedInRole}>
      {!memberIdx && <ProfileTabs userRole={targetRole} />}
      {targetUser && <Profile user={targetUser} />}
    </MyPageLayout>
  );
}