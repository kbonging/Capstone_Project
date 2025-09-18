import React from 'react';
import Sidebar from './Sidebar';

export default function MyPageLayout({ userRole, children }) {
  return (
    <div className="w-full flex justify-center">
      <div className="flex w-full max-w-screen-xl min-h-screen">
        {/* Sidebar */}
        <Sidebar userRole={userRole} />

        {/* Content */}
        <main className="flex-1 px-10 py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
