// src/components/layout/Header.jsx
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';

export default function Header() {
  const { user, logout } = useContext(AppContext);

  return (
    <header className="bg-white bg-opacity-80 backdrop-blur border-b">
      <div className="max-w-[1350px] mx-auto h-16 flex items-center justify-between px-4">
        {/* 로고 */}
        <h1 className="text-2xl font-bold uppercase text-black">
          <Link to="/">revory</Link>
        </h1>

        {/* 네비게이션 */}
        <nav className="flex-1 pl-8 space-x-6 text-black capitalize">
          <Link to="/search" className="hover:text-gray-500">체험단검색</Link>
          <Link to="/community" className="hover:text-gray-500">커뮤니티</Link>
          <Link to="/support" className="hover:text-gray-500">1대1문의</Link>
          <Link to="/events" className="hover:text-gray-500">공지/이벤트</Link>
        </nav>

        {/* 우측 액션 버튼들 */}
        <div className="flex items-center space-x-4 text-black">
          {user ? (
            <>
               <Link to="/mypage" className="hover:text-gray-500">{user.memberName} </Link>
              <button onClick={logout} className="hover:text-gray-500">로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-500">로그인</Link>
              <Link to="/signup" className="hover:text-gray-500">회원가입</Link>
            </>
          )}

          {/* 알림 아이콘 */}
          <button className="relative p-1 hover:text-gray-500">
            <i className="fa-regular fa-bell text-xl"></i>
          </button>

          {/* 프로필 아이콘 */}
          <Link to={user ? "/mypage" : "/login"} className="relative p-1 hover:text-gray-500">
            <i className="fa-regular fa-circle-user text-xl"></i>
          </Link>
        </div>
      </div>
    </header>
  );
}
