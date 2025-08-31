// src/components/mypage/Profile.jsx
import React, { useState, useContext } from "react";
import ProfileStats from "./ProfileStats";
import { AppContext } from '../../contexts/AppContext';
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("진행중");

  const getUserRole = (user) => {
    if (user && user.authDTOList && user.authDTOList.length > 0) {
      return user.authDTOList[0].auth;
    }
    return null;
  };

  const userRole = getUserRole(user);

  let statsData = [];
  let role = "";
  let userStats1 = [];
  let userStats2 = [];
  let nameToDisplay = "";

  const handleClick = (label) => {
    // 사이드바에서 커뮤니티로 이동하는 기능과 중복될 수 있으므로, 주석 처리 또는 제거 고려
    // if (label === '커뮤니티') {
    //   navigate('/community');
    // }
  };

  if (userRole === "ROLE_OWNER") {
    role = "소상공인";
    statsData = [
      { label: "상세페이지", value: "미등록", status: true },
      { label: "완료된 체험단 수", value: "0건" },
      { label: "리뷰노트 방문수", value: "4회" },
      { label: "패널티", value: "0회" },
      { label: "하트수", value: "0명" },
      { label: "평가", value: "0명" },
    ];
    nameToDisplay = user ? user.businessName : "사용자";
  } else if (userRole === "ROLE_USER") {
    role = "체험단";
    userStats1 = [
      { label: "방문수", value: "0회" },
      { label: "패널티", value: "0회" },
      { label: "취소 횟수", value: "0회" },
      { label: "활동 지역", value: "서울" },
      { label: "활동 주제", value: "맛집" },
      { label: "하트수", value: "0개" },
    ];
    userStats2 = [
      { label: "네이버", value: "블로그" },
      { label: "인스타그램", value: "사진" },
      { label: "유튜브", value: "영상" },
      { label: "틱톡", value: "쇼츠" },
      { label: "협찬 경력", value: "5회" },
      { label: "평가", value: "우수" },
    ];
    nameToDisplay = user ? user.nickname : "사용자";
  }

  if (!userRole) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex w-full gap-6 ">
        <div className="w-1/2 flex justify-center items-center">
          <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-400">
            <i className="fas fa-user"></i>
          </div>
        </div>
        <div className="w-1/2 space-y-3">
          <div className="flex items-baseline space-x-2">
            <div className="text-sm text-blue-400 bg-blue-100 font-bold rounded-md p-2">
              {role}
            </div>
            <h2 className="text-2xl font-bold">{nameToDisplay}</h2>
          </div>
          {userRole === "ROLE_OWNER" ? (
            <div className="space-y-2">
              <ProfileStats stats={statsData} />
            </div>
          ) : (
            // gap-4를 gap-y-6으로 변경하여 세로 간격만 늘림
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              <ProfileStats stats={userStats1} />
              <ProfileStats stats={userStats2} />
            </div>
          )}
        </div>
      </div>
      
      {/* 탭 영역 */}
      <div className="mt-10">
        <div className="flex justify-center w-full">
          <div className="flex w-full justify-center">
            <div className="flex w-full space-x-8 text-sm pb-2 mb-4 justify-center border-b border-gray-300"> 
              <div
                className={`relative cursor-pointer px-2 py-1 font-medium ${activeTab === '진행중' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
                onClick={() => setActiveTab('진행중')}
              >
                진행중 체험단
                {activeTab === '진행중' && (
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 bg-[rgb(26,176,246)]" style={{ width: 'calc(100% - 16px)' }}></span>
                )}
              </div>
              
              <div
                className={`relative cursor-pointer px-2 py-1 font-medium ${activeTab === '완료' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
                onClick={() => setActiveTab('완료')}
              >
                진행 완료 체험단
                {activeTab === '완료' && (
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 bg-[rgb(26,176,246)]" style={{ width: 'calc(100% - 16px)' }}></span>
                )}
              </div>
            </div>
          </div>
        </div>
        <p className="text-gray-500 text-center">내역이 없습니다.</p>
      </div>
    </>
  );
}