// src/components/layout/Header.jsx
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import LogoImage from "../images/main_logo.png";

export default function Header() {
  const { user, logout, token } = useContext(AppContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [unreadCount, setUnreadCount] = useState(0); // 🔹 알림 갯수 상태
  const navigate = useNavigate();
  const location = useLocation(); // 🔹 URL 쿼리 읽기용

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const keyword = query.get("benefitSearch") || ""; // URL에 없으면 ""
    setSearchKeyword(keyword);
  }, [location.search]);

  // 알림 개수 가져오기
  useEffect(() => {
    if (!token) {
      setUnreadCount(0);
      return; // 로그인 안 한 경우 스킵
    }
    fetch("/api/notifications/count", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUnreadCount(data.unreadCount))
      .catch((err) => console.error("알림 카운트 에러:", err));
  }, [token]);

  const handleSearch = () => {
    const trimmed = searchKeyword.trim();
    if (trimmed) {
      navigate(`/campaigns?benefitSearch=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const getDisplayName = (user) => {
    if (!user) return "로그인";
    if (user.nickname) return user.nickname;
    if (user.businessName) return user.businessName;
    return user.memberName;
  };

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/70 backdrop-blur font-['Noto_Sans_KR',sans-serif]">
      <div className="max-w-[1250px] mx-auto h-16 flex items-center justify-between px-1 text-zinc-900 dark:text-zinc-100">
        {/* 로고 + 검색창 묶음 */}
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-2xl font-bold uppercase">
            <Link to="/" className="inline-flex items-center">
              <img
                src={LogoImage}
                alt="Revory Logo"
                className="h-[30px] w-auto dark:brightness-200"
              />
            </Link>
          </h1>

          {/* 검색창 */}
          <div className="max-w-[280px] relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchKeyword} // 🔹 URL 쿼리와 동기화된 상태 사용
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 이하 기존 코드 그대로 */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-6 font-medium mr-8">
            <Link to="/campaigns" className="text-[16px] cursor-pointer text-gray-600 hover:text-gray-500">
              체험단검색
            </Link>
            <Link to="/community" className="text-[16px] cursor-pointer text-gray-600 hover:text-gray-500">
              커뮤니티
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* 🔹 로그인된 경우에만 알림 버튼 표시 */}
            {user && (
              <button
                onClick={() => console.log("알람 클릭")}
                className="relative p-1 hover:text-zinc-600 dark:hover:text-zinc-300"
                aria-label="알람"
              >
                <i className="fa-regular fa-bell text-xl"></i>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            <Link
              to={user ? "/mypage" : "/login"}
              className="flex items-center gap-2 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <i className="fa-regular fa-circle-user text-xl"></i>
              <span>{getDisplayName(user)}</span>
            </Link>

            {user ? (
              <button
                onClick={logout}
                className="hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                로그아웃
              </button>
            ) : (
              <Link
                to="/signup"
                className="hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                회원가입
              </Link>
            )}
          </div>

        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 hover:text-zinc-600 dark:hover:text-zinc-300" aria-label="메뉴 열기/닫기">
          <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"} text-xl`}></i>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/80 px-4 py-3 space-y-2 text-zinc-900 dark:text-zinc-100 backdrop-blur">
          <Link to="/campaigns" className="block hover:text-zinc-600 dark:hover:text-zinc-300" onClick={() => setMenuOpen(false)}>체험단검색</Link>
          <Link to="/community" className="block hover:text-zinc-600 dark:hover:text-zinc-300" onClick={() => setMenuOpen(false)}>커뮤니티</Link>
          <Link to="/support" className="block hover:text-zinc-600 dark:hover:text-zinc-300" onClick={() => setMenuOpen(false)}>1대1문의</Link>
          <Link to="/events" className="block hover:text-zinc-600 dark:hover:text-zinc-300" onClick={() => setMenuOpen(false)}>공지/이벤트</Link>
          <hr className="my-2 border-zinc-200 dark:border-zinc-800" />

          {user ? (
            <>
              <Link to="/mypage" className="block hover:text-zinc-600 dark:hover:text-zinc-300" onClick={() => setMenuOpen(false)}>{user.memberName}</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full text-left hover:text-zinc-600 dark:hover:text-zinc-300">로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block hover:text-zinc-600 dark:hover:text-zinc-300" onClick={() => setMenuOpen(false)}>로그인</Link>
              <Link to="/signup" className="block hover:text-zinc-600 dark:hover:text-zinc-300" onClick={() => setMenuOpen(false)}>회원가입</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
