import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [activeMenu, setActiveMenu] = useState("프로필"); // 초기 활성화 항목
  const navigate = useNavigate(); // 라우터 이동 함수

  const menus = {
    체험단: ["📋 체험단 관리", "📄 체험단 모집"],
    커뮤니티: ["커뮤니티", "캠페인"],
    "내 정보 관리": ["프로필", "포인트", "쿠폰 사용"],
    고객센터: ["자주 묻는 질문", "공지/이벤트", "문의내역", "이용 가이드"],
  };

  const handleClick = (item) => {
    setActiveMenu(item);

    // 메뉴 클릭 시 라우팅
    switch (item) {
      case "📋 체험단 관리":
        navigate("/campaign/manage");
        break;
      case "📄 체험단 모집":
        navigate("/campaign/create");
        break;
      case "프로필":
        navigate("/mypage");
        break;
      default:
        break;
    }
  };

  return (
    <aside className="w-[240px] h-screen bg-white border-r border-gray-200 p-6 flex flex-col justify-between">
      <div>
        {/* 타이틀 */}
        <div className="font-extrabold text-xl text-gray-800 mb-8">마이페이지</div>

        {/* 메뉴 그룹 */}
        {Object.entries(menus).map(([group, items]) => (
          <div key={group} className="mb-8">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {group}
            </h2>
            <ul className="space-y-1">
              {items.map((item) => (
                <li
                  key={item}
                  onClick={() => handleClick(item)}
                  className={`px-3 py-2 rounded-md cursor-pointer transition 
                    ${
                      activeMenu === item
                        ? "bg-gray-100 font-bold text-blue-600"
                        : "hover:bg-gray-50 hover:text-blue-600 text-gray-700"
                    }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 로그아웃 버튼 */}
      <button className="w-full py-2 mt-6 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 hover:text-blue-600 transition">
        로그아웃
      </button>
    </aside>
  );
}
