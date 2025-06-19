// src/pages/LoginPage.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import { loginUser } from "../api/authApi"; // 아래 예시처럼 구현해 두세요
import LogoImage from '../images/Logo.png';

export default function LoginPage() {
  const { setToken } = useContext(AppContext); //전역으로 할당
  const navigate = useNavigate();

  const [memberId, setMemberId] = useState("");
  const [memberPwd, setMemberPwd] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [saveAccount, setSaveAccount] = useState(false);
  const [error, setError] = useState(null);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // 1) 서버에 로그인 요청
      const { token } = await loginUser({ memberId, memberPwd });
      // 2) 토큰을 로컬스토리지에 저장 (다음번 자동 로그인용)
      if (saveAccount) {
        localStorage.setItem("token", token);
      }
      // 3) Context에 유저·토큰 정보 업데이트
      setToken(token);
      //setUser(user);
      // 4) 로그인 후 홈으로 이동
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-screen flex flex-col items-center justify-center bg-white font-['Noto_Sans_KR'] px-4">

  <div className="mb-[20px] mt-[100px]">
    <img src={LogoImage} alt="Revory Logo" className="w-[200px] h-full" />
  </div>

  <form
    onSubmit={handleSubmit}
    className="w-full max-w-[450px] bg-white rounded-[10px] p-[40px] text-center shadow-none mb-[100px]"
  >
    <h2 className="text-2xl font-semibold mb-[50px] text-[#333]">로그인</h2>

    {/* input ID */}
    <div className="flex items-center mb-3 rounded-[10px] border border-gray-300 overflow-hidden h-[55px]">
      <div className="flex items-center justify-center w-[55px] border-r border-gray-300">
        <i className="bx bx-user text-xl text-gray-500"></i>
      </div>
      <input
        id="memberId"
        type="text"
        placeholder="아이디"
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
        className="w-full h-full px-3 text-[15px] outline-none"
        required
      />
    </div>

    {/* input PWD */}
    <div className="flex items-center mb-4 rounded-[10px] border border-gray-300 overflow-hidden h-[55px] relative">
      <div className="flex items-center justify-center w-[55px] border-r border-gray-300">
        <i className="bx bx-lock text-xl text-gray-500"></i>
      </div>
      <input
        id="user-pw"
        type={showPassword ? "text" : "password"}
        placeholder="비밀번호"
        value={memberPwd}
        onChange={(e) => setMemberPwd(e.target.value)}
        className="w-full h-full px-3 text-[15px] outline-none"
        maxLength={12}
        required
      />
      <button
        type="button"
        onClick={togglePassword}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 hover:text-gray-700"
      >
        <i className={`bx ${showPassword ? "bx-show" : "bx-hide"}`}></i>
      </button>
    </div>

    {error && (
      <p className="text-[#FF322E] text-sm mb-4 text-left">{error}</p>
    )}


    <div className="flex items-center justify-start mb-5 text-sm text-gray-600">
      <input
        type="checkbox"
        checked={saveAccount}
        onChange={(e) => setSaveAccount(e.target.checked)}
        className="w-4 h-4 rounded mr-2 border border-gray-300"
      />
      <label>로그인 상태 유지</label>
    </div>

    <button
      type="submit"
      className="w-full h-[55px] bg-[#5f61f6] hover:bg-[#8687f9]  text-white text-lg rounded-[10px] transition"
    >
      로그인
    </button>

    {/* find, signup */}
    <div className="mt-6 text-sm text-[#666] flex justify-center gap-3">
      <Link to="/FindId" className="hover:text-[#1769FF]">아이디 찾기</Link>
      <span className="text-gray-300">|</span>
      {/* 아직 미적용 ↑ */}

      <Link to="/FindPwd" className="hover:text-[#1769FF]">비밀번호 찾기</Link>
      <span className="text-gray-300">|</span>

      <Link to="/signup" className="hover:text-[#1769FF]">회원가입</Link>
    </div>
  </form>
</div>
  );
}
