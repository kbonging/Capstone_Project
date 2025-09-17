import React, { useContext } from "react";
import MyPageLayout from "../components/mypage/MyPageLayout";
import { AppContext } from '../contexts/AppContext';
import Alarm from "../components/mypage/Alarm";

export default function AlarmPage(){
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
            알림
            <span className="block text-sm font-medium text-gray-500 mt-1">
              3개월 이상된 오래된 알림부터 자동으로 삭제됩니다.
            </span>
          </h1>
        </div>
      <Alarm />
    </MyPageLayout>
  );
}