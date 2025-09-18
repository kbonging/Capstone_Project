import React from "react";

export default function ProfileStats({ user, userRole }) {
  if (!user) return null;

  // 소상공인
  if (userRole === "ROLE_OWNER") {
    return (
      <div className="space-y-4">
        <div className="w-full flex justify-between border px-4 py-3 rounded-xl font-semibold">
          <span>상세페이지</span>
          <span className="text-gray-400">
            {user.businessUrl ? (
              <a
                href={user.businessUrl}
                target="_blank"
                rel="noreferrer"
                className="text-gray-700"
              >
                등록 완료
              </a>
            ) : (
              "미등록"
            )}
          </span>
        </div>
        <div className="w-full flex justify-between border px-4 py-3 rounded-xl font-semibold">
          <span>완료된 체험단 수</span>
          <span className="text-gray-400">0건</span>
        </div>
        <div className="w-full flex justify-between border px-4 py-3 rounded-xl font-semibold">
          <span>하트수</span>
          <span className="text-gray-400">{user.heartCount ?? 0}</span>
        </div>
        <div className="w-full flex justify-between border px-4 py-3 rounded-xl font-semibold">
          <span>패널티</span>
          <span className="text-gray-400">{user.penalty ?? 0}</span>
        </div>
      </div>
    );
  }

  // 리뷰어
  if (userRole === "ROLE_USER") {
    return (
      <div className="space-y-4">
        <div className="w-full border px-4 py-3 rounded-xl font-semibold">
          <span className="font-bold">소개글</span>
          <p className="text-gray-400">{user.intro || "미등록"}</p>
        </div>

        <div className="w-full flex justify-between border px-4 py-3 rounded-xl font-semibold">
          <span>활동지역</span>
          <span className="text-gray-400">{user.activityArea || "미등록"}</span>
        </div>
        <div className="w-full flex justify-between border px-4 py-3 rounded-xl font-semibold">
          <span>활동주제</span>
          <span className="text-gray-400">{user.activityTopic || "미등록"}</span>
        </div>
        <div className="w-full flex justify-between border px-4 py-3 rounded-xl font-semibold">
          <span>하트수</span>
          <span className="text-gray-400">{user.heartCount ?? 0}</span>
        </div>
        <div className="w-full flex justify-between border px-4 py-3 rounded-xl font-semibold">
          <span>패널티</span>
          <span className="text-gray-400">{user.penalty ?? 0}</span>
        </div>
      </div>
    );
  }

  return null;
}
