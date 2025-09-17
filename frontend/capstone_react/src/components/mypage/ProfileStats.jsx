// src/components/mypage/ProfileStats.jsx
import React from 'react';

export default function ProfileStats({ user, userRole }) {
  if (!user) return null;

  // 소상공인 데이터
  if (userRole === "ROLE_OWNER") {
    return (
      <div className="space-y-4">
        <div className="w-full flex justify-between border px-4 py-3 rounded-xl font-semibold">
          <span>상세페이지</span>
          <span className="text-gray-400">
            {user.businessUrl ? (
              <a href={user.businessUrl} target="_blank" rel="noreferrer" className="text-blue-500">
                {user.businessUrl}
              </a>
            ) : "미등록"}
          </span>
        </div>
        <div className="w-full flex justify-between border px-4 py-3 rounded-xl font-semibold">
          <span>완료된 체험단 수</span>
          <span className="text-gray-400">0건</span>
        </div>
        <div className="w-full flex justify-between border px-4 py-3 rounded-xl font-semibold">
          <span>리뷰노트 방문수</span>
          <span className="text-gray-400">0회</span>
        </div>
        <div className="w-full flex justify-between border px-4 py-3 rounded-xl font-semibold">
          <span>패널티</span>
          <span className="text-gray-400">{user.penalty ?? 0}</span>
        </div>
        <div className="w-full flex justify-between border px-4 py-3 rounded-xl font-semibold">
          <span>하트수</span>
          <span className="text-gray-400">{user.heartCount ?? 0}</span>
        </div>
      </div>
    );
  }

  // 리뷰어 데이터
  if (userRole === "ROLE_USER") {
    // 리뷰어 채널 종류
    const channels = ["블로그", "인스타", "유튜브", "기타"];
    return (
      <div className="space-y-4">
        <div className="w-full border px-4 py-3 rounded-xl font-semibold">
          <span className="font-bold">소개글</span>
          <p className="text-gray-400">{user.intro || "미등록"}</p>
        </div>

        <div className="w-full flex justify-between border px-4 py-3 rounded-xl font-semibold">
          <span>하트수</span>
          <span className="text-gray-400">{user.heartCount ?? 0}</span>
        </div>
        <div className="w-full flex justify-between border px-4 py-3 rounded-xl font-semibold">
          <span>패널티</span>
          <span className="text-gray-400">{user.penalty ?? 0}</span>
        </div>
        <div className="w-full flex justify-between border px-4 py-3 rounded-xl font-semibold">
          <span>활동지역</span>
          <span className="text-gray-400">{user.activityArea || "미등록"}</span>
        </div>
        <div className="w-full flex justify-between border px-4 py-3 rounded-xl font-semibold">
          <span>활동주제</span>
          <span className="text-gray-400">{user.activityTopic || "미등록"}</span>
        </div>

        {/* 채널 */}
        {channels.map((type) => {
          const channel = user.reviewerChannelList?.find(c => c.infTypeCodeId === getChannelCode(type));
          return (
            <div key={type} className="w-full flex justify-between border px-4 py-3 rounded-xl font-semibold">
              <span>{type}</span>
              <span className="text-gray-400">
                {channel?.channelUrl ? (
                  <a href={channel.channelUrl} target="_blank" rel="noreferrer" className="text-blue-500">
                    등록
                  </a>
                ) : "미등록"}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}

// 헬퍼 함수: 채널 타입 이름 → 코드
function getChannelCode(type) {
  switch(type) {
    case "블로그": return "INF001";
    case "인스타": return "INF002";
    case "유튜브": return "INF003";
    case "기타": return "INF004";
    default: return null;
  }
}
