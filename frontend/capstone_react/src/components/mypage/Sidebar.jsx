import React from "react";

export default function Sidebar() {
  return (
    <aside className="w-[200px] border-r p-6 space-y-4 text-sm">
      <div className="font-bold text-lg mt-6">마이페이지</div>
      <ul className="space-y-2 border-b pb-2">
        <li className="hover:text-black hover:font-bold">체험단 관리</li>
        <li className="hover:text-black hover:font-bold">체험단 모집</li>
      </ul>

      <div className="mt-6">
        <div className="font-semibold mb-1">커뮤니티</div>
        <ul className="space-y-2 border-b pb-2">
          <li className="hover:text-black hover:font-bold">커뮤니티</li>
          <li className="hover:text-black hover:font-bold">캠페인</li>
        </ul>
      </div>

      <div className="mt-6">
        <div className="font-semibold mb-1">내 정보 관리</div>
        <ul className="space-y-2 border-b pb-2">
          <li className="font-bold text-black">프로필</li>
          <li className="hover:text-black hover:font-bold">포인트</li>
          <li className="hover:text-black hover:font-bold">쿠폰 사용</li>
        </ul>
      </div>

      <div className="mt-6">
        <div className="font-semibold mb-1">고객센터</div>
        <ul className="space-y-2">
          <li className="hover:text-black hover:font-bold">자주 묻는 질문</li>
          <li className="hover:text-black hover:font-bold">공지/이벤트</li>
          <li className="hover:text-black hover:font-bold">문의내역</li>
          <li className="hover:text-black hover:font-bold">이용 가이드</li>
        </ul>
      </div>

      <button className="mt-6 border px-3 py-1 rounded text-sm hover:text-black hover:font-bold">
        로그아웃
      </button>
    </aside>
  );
}
