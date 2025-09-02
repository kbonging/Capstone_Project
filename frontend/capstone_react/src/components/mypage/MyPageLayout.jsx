// src/components/mypage/MyPageLayout.jsx
import React from 'react';
import Sidebar from './Sidebar';

// MyPage.jsx에서 전달받은 userRole을 props로 받습니다.
export default function MyPageLayout({ userRole, children }) {
  return (
        <div className="w-full flex justify-center">
        <div className="w-[1100px] flex min-h-screen">
            <Sidebar userRole={userRole} />
            <main className="flex-1 px-10 py-10">
            {children}
            </main>
        </div>
        </div>
  );
}