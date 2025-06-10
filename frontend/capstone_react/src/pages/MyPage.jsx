// src/pages/MyPage.jsx
import React from "react";
import MyPageLayout from "../components/mypage/MyPageLayout";
import ProfileTabs from "../components/mypage/ProfileTabs";
import ProfileStats from "../components/mypage/ProfileStats";

export default function MyPage() {
  const name = "namguk";
  const role = "소상공인";
  const statsData = [
    { label: "상세페이지", value: "미등록", status: true },
    { label: "완료된 체험단 수", value: "0건" },
    { label: "리뷰노트 방문수", value: "4회" },
    { label: "패널티", value: "0회" },
    { label: "하트수", value: "0명" },
    { label: "평가", value: "0명" },
  ];

  return (
    <MyPageLayout>
      <ProfileTabs />

      {/* 50:50 레이아웃 */}
      <div className="flex w-full gap-6 ">
        {/* 왼쪽: 아바타만 */}
        <div className="w-1/2 flex justify-center items-center">
          <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-400">
            <i className="fas fa-user"></i>
          </div>
        </div>

        {/* 오른쪽: 역할·닉네임 + 통계 박스 */}
        <div className="w-1/2 space-y-3">
          {/* 소상공인 · namguk */}
          <div className="flex items-baseline space-x-2">
            <div className="text-sm text-blue-400 bg-blue-100 font-bold rounded-md p-2">
              {role}
            </div>
            <h2 className="text-2xl font-bold">{name}</h2>
          </div>

          {/* 통계 박스 */}
          <ProfileStats stats={statsData} />
        </div>
      </div>

      {/* 진행중 / 완료 탭 */}
      <div className="mt-10">
        <div className="flex space-x-8 text-sm border-b pb-2 mb-4">
          <div className="text-blue-600 font-medium">진행중 체험단</div>
          <div className="text-gray-400">진행 완료 체험단</div>
        </div>
        <p className="text-gray-500">내역이 없습니다.</p>
      </div>
    </MyPageLayout>
  );
}
