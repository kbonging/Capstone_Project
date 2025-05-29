// src/pages/LoginPage.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import { loginUser } from "../api/authApi"; // 아래 예시처럼 구현해 두세요

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
    <div className="h-screen grid place-items-center text-[#333]">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-[400px] rounded-lg p-8 shadow-[0_0_25px_rgba(0,0,0,0.2)]"
      >
        <h2 className="text-center capitalize text-3xl mb-6">login</h2>

        {/* <span className="block relative mb-5 text-center or">or</span> */}

        {/* 에러 메시지 */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Email & Password */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <input
              id="memberId"
              type="text"
              placeholder="Enter your ID"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="border block w-full p-2 pl-12 rounded-md outline-none focus:border-blue-400 placeholder-gray-400 focus:placeholder-transparent"
              required
            />
            <span className="absolute top-2 left-3 text-xl text-gray-300">
              <i className="bx bx-envelope"></i>
            </span>
          </div>

          <div className="relative">
            <input
              id="user-pw"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={memberPwd}
              onChange={(e) => setMemberPwd(e.target.value)}
              className="border block w-full p-2 pl-12 rounded-md outline-none focus:border-blue-400 placeholder-gray-400 focus:placeholder-transparent"
              maxLength={12}
              required
            />
            <span className="absolute top-2 left-3 text-xl text-gray-300">
              <i className="bx bx-lock"></i>
            </span>
            <button
              type="button"
              onClick={togglePassword}
              className="absolute top-2 right-3 text-xl text-gray-500 hover:text-gray-700"
            >
              <i className={`bx ${showPassword ? "bx-show" : "bx-hide"}`}></i>
            </button>
          </div>
        </div>

        {/* Save account & forgot */}
        <div className="flex justify-between items-center mb-6 text-sm">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={saveAccount}
              onChange={(e) => setSaveAccount(e.target.checked)}
              className="hidden peer"
            />
            <span className="inline-block w-5 h-5 mr-1 bg-[url('/images/icon-radio.png')] bg-no-repeat bg-left peer-checked:bg-right"></span>
            save account
          </label>
          <Link to="/forgot-password" className="hover:underline">
            forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white w-full text-center p-3 rounded-md hover:bg-blue-600 transition"
        >
          log in
        </button>

        <p className="text-center capitalize mt-4 text-sm">
          don&apos;t have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
