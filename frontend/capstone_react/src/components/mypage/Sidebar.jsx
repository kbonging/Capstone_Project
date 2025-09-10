import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { AppContext } from "../../contexts/AppContext"; // AppContext 가져오기

export default function Sidebar({ userRole }) { 
  const navigate = useNavigate();
  const location = useLocation(); 
  const { logout } = useContext(AppContext); // logout 함수 사용

  const getMenusByRole = (role) => {
    if (role === "ROLE_OWNER") {
      return {
        체험단: [
          { name: "📋 체험단 관리", path: "/campaign/manage" },
          { name: "📄 체험단 모집", path: "/campaign/create" }
          ],
        커뮤니티: [{ name: "커뮤니티", path: "/community" }],
        "내 정보 관리": [
          { name: "프로필", path: "/mypage" },
          { name: "포인트", path: "/mypage/points" },
          { name: "쿠폰 사용", path: "/mypage/coupons" }
        ],
        고객센터: [
          { name: "자주 묻는 질문", path: "/mypage/faq" },
          { name: "공지/이벤트", path: "/mypage/notice" },
          { name: "문의내역", path: "/mypage/inquiry" },
          { name: "이용 가이드", path: "/mypage/guide" }
        ],
      };
    }
    
    if (role === "ROLE_USER") {
      return {
        체험단: [
          { name: "📝 내 체험단", path: "/mypage/my-campaigns" }, 
          { name: "📝 체험단 취소", path: "/mypage/cancel-campaigns" }
        ],
        커뮤니티: [{ name: "커뮤니티", path: "/community" }],
        "내 정보 관리": [
          { name: "프로필", path: "/mypage" }, 
          { name: "찜목록", path: "/mypage/wishlist" }, 
          { name: "포인트", path: "/mypage/points" }
        ],
        고객센터: [
          { name: "자주 묻는 질문", path: "/mypage/faq" }, 
          { name: "공지/이벤트", path: "/mypage/notice" }, 
          { name: "문의내역", path: "/mypage/inquiry" }, 
          { name: "이용 가이드", path: "/mypage/guide" }],
      };
    }

    if (role === "ROLE_ADMIN") {
      return {
        관리: [{ name: "체험단 승인", path: "/mypage" },
              {name: "체험단 시간", path: "/mypage/admin"}
        ],
      };
    }

    return {};
  };

  const menus = getMenusByRole(userRole);

  const handleClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();        // AppContext logout 실행
    navigate("/");   // 홈으로 이동
  };

  return (
    <aside className="w-[240px] h-full bg-white border-r border-gray-200 p-6 flex flex-col justify-between">
      <div className="flex-1 overflow-y-auto pr-2"> 
        <div className="font-extrabold text-xl text-gray-800 mb-8">마이페이지</div>
        {Object.entries(menus).map(([group, items]) => (
          <div key={group} className="mb-8">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {group}
            </h2>
            <ul className="space-y-1">
              {items.map((item) => (
                // <li
                //   key={item.name}
                //   onClick={() => handleClick(item.path)}
                //   className={`px-3 py-2 rounded-md cursor-pointer transition 
                //     ${
                //       location.pathname.startsWith(item.path)
                //         ? "bg-gray-100 font-bold text-blue-600"
                //         : "hover:bg-gray-50 hover:text-blue-600 text-gray-700"
                //     }`}
                // >
                //   {item.name}
                // </li>
                    <li
                      key={item.name}
                      onClick={() => handleClick(item.path)}
                      className={`px-3 py-2 rounded-md cursor-pointer transition 
                        ${
                          (item.path === "/campaign/manage" &&
                            (location.pathname.startsWith("/campaign/manage") ||
                            location.pathname.startsWith("/campaign/edit"))) 
                            ? "bg-gray-100 font-bold text-blue-600"
                            : location.pathname.startsWith(item.path)
                            ? "bg-gray-100 font-bold text-blue-600"
                            : "hover:bg-gray-50 hover:text-blue-600 text-gray-700"
                        }`}
                    >
                      {item.name}
                    </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-6"> 
        <button
          onClick={handleLogout}
          className="w-full py-2 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 hover:text-blue-600 transition"
        >
          로그아웃
        </button>
      </div>
    </aside>
  );
}
