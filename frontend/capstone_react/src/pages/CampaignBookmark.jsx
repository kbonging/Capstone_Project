import React, { useContext } from "react";
import MyPageLayout from "../components/mypage/MyPageLayout";
import Bookmark from "../components/campaign/Bookmark";
import { AppContext } from '../contexts/AppContext';

export default function CampaignBookmark() {

    const { user } = useContext(AppContext);

    // 백엔드 JSON 구조에 맞게 유저의 역할을 추출하는 함수
    const getUserRole = (user) => {
    if (user && user.authDTOList && user.authDTOList.length > 0) {
        return user.authDTOList[0].auth;
    }
    return null;
    };

    const userRole = getUserRole(user);

    // userRole이 결정될 때까지 로딩 상태 표시
    if (!userRole) {
    return <div>Loading...</div>;
    }


    return (
      <MyPageLayout userRole={userRole}>
        <Bookmark />
      </MyPageLayout>
    );
}