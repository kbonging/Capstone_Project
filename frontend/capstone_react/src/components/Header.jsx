// src/components/layout/Header.jsx
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../contexts/AppContext"; // 경로는 프로젝트 구조에 맞게 유지
import LogoImage from "../images/main_logo.png";
// import LogoImageDark from "../images/Logo-dark.png"; // 다크 전용 로고 있으면 사용

export default function Header() {
  const { user, logout } = useContext(AppContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/70 backdrop-blur">
      <div className="max-w-[1350px] mx-auto h-16 flex items-center justify-between px-1 text-zinc-900 dark:text-zinc-100">
        {/* 로고 */}
        <h1 className="text-2xl font-bold uppercase">
          <Link to="/" className="inline-flex items-center">
            {/* 라이트/다크 로고 분기 (다크 전용 파일이 있으면 아래 방식 권장) */}
            {/* 
            <img src={LogoImage} alt="Revory Logo" className="w-[90px] h-full inline-block dark:hidden" />
            <img src={LogoImageDark} alt="Revory Logo" className="w-[90px] h-full hidden dark:inline-block" />
            */}
            {/* 다크 전용 로고가 없을 때 임시 보정 */}
            <img
              src={LogoImage}
              alt="Revory Logo"
              className="h-[30px] w-auto dark:brightness-200"
            />
          </Link>
        </h1>

        {/* 네비게이션 (데스크탑 전용) */}
        <nav className="hidden md:flex flex-1 pl-8 space-x-6">
          <Link to="/search" className="hover:text-zinc-600 dark:hover:text-zinc-300">
            체험단검색
          </Link>
          <Link to="/community" className="hover:text-zinc-600 dark:hover:text-zinc-300">
            커뮤니티
          </Link>
          <Link to="/support" className="hover:text-zinc-600 dark:hover:text-zinc-300">
            1대1문의
          </Link>
          <Link to="/events" className="hover:text-zinc-600 dark:hover:text-zinc-300">
            공지/이벤트
          </Link>
        </nav>

        {/* 우측 액션 (데스크탑 전용) */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/mypage" className="hover:text-zinc-600 dark:hover:text-zinc-300">
                {user.memberName}
              </Link>
              <button onClick={logout} className="hover:text-zinc-600 dark:hover:text-zinc-300">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-zinc-600 dark:hover:text-zinc-300">
                로그인
              </Link>
              <Link to="/signup" className="hover:text-zinc-600 dark:hover:text-zinc-300">
                회원가입
              </Link>
            </>
          )}

          {/* 아이콘들은 상위 텍스트 색을 상속받음 */}
          <Link
            to={user ? "/mypage" : "/login"}
            className="relative p-1 hover:text-zinc-600 dark:hover:text-zinc-300"
            aria-label="프로필"
            title="프로필"
          >
            <i className="fa-regular fa-circle-user text-xl"></i>
          </Link>
        </div>

        {/* 모바일 햄버거 */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 hover:text-zinc-600 dark:hover:text-zinc-300"
          aria-label="메뉴 열기/닫기"
        >
          <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"} text-xl`}></i>
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/80 px-4 py-3 space-y-2 text-zinc-900 dark:text-zinc-100 backdrop-blur">
          <Link
            to="/search"
            className="block hover:text-zinc-600 dark:hover:text-zinc-300"
            onClick={() => setMenuOpen(false)}
          >
            체험단검색
          </Link>
          <Link
            to="/community"
            className="block hover:text-zinc-600 dark:hover:text-zinc-300"
            onClick={() => setMenuOpen(false)}
          >
            커뮤니티
          </Link>
          <Link
            to="/support"
            className="block hover:text-zinc-600 dark:hover:text-zinc-300"
            onClick={() => setMenuOpen(false)}
          >
            1대1문의
          </Link>
          <Link
            to="/events"
            className="block hover:text-zinc-600 dark:hover:text-zinc-300"
            onClick={() => setMenuOpen(false)}
          >
            공지/이벤트
          </Link>

          <hr className="my-2 border-zinc-200 dark:border-zinc-800" />

          {user ? (
            <>
              <Link
                to="/mypage"
                className="block hover:text-zinc-600 dark:hover:text-zinc-300"
                onClick={() => setMenuOpen(false)}
              >
                {user.memberName}
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="block w-full text-left hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block hover:text-zinc-600 dark:hover:text-zinc-300"
                onClick={() => setMenuOpen(false)}
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="block hover:text-zinc-600 dark:hover:text-zinc-300"
                onClick={() => setMenuOpen(false)}
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
