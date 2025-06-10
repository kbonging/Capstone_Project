import React from 'react';
import Sidebar from './Sidebar';

export default function MyPageLayout({ children }) {
  return (
    <div className="w-full flex justify-center">
      <div className="w-[1100px] flex min-h-screen">
        <Sidebar />
        <main className="flex-1 px-10 py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
