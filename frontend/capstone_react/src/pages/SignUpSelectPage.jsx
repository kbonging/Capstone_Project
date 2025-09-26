import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OwnerIcon from "../images/signup/Owner.png";
import ReviewIcon from "../images/signup/Reviewer.png";

export default function SignUpPage() {
  const [mode, setMode] = useState(null);   // 'owner' | 'reviewer' | null
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-white font-['Noto_Sans_KR']">
      {/* ===== 상단 타이틀 ===== */}
      <h1 className="mt-16 text-4xl font-semibold text-gray-900">
        회원가입
      </h1>

      {/* ===== 전체 레이아웃 컨테이너 ===== */}
      <div className="relative w-[760px] h-[320px] mt-32">
        {/* ===== 좌·우 안내 패널 ===== */}
        <div className="absolute inset-0 flex z-[1]">
          {/* 소상공인 안내 */}
          <div className="w-1/2 flex flex-col items-center justify-center">
            <div className="bg-gray-600/60 rounded-xl px-8 py-6 text-white text-center shadow-lg">
              <h2 className="text-3xl font-bold">소상공인으로 시작</h2>
              <p className="mt-4 text-lg">
                Revory 플랫폼에서 광고주(소상공인)<br/>로 가입을 원하시나요?
              </p>
              <button
                onClick={() => setMode("owner")}
                className="mt-6 px-5 py-3 text-lg bg-orange-400 hover:bg-orange-500 text-white rounded-md shadow-md transition"
              >
                소상공인으로 시작
              </button>
            </div>
          </div>
          {/* 리뷰어 안내 */}
          <div className="w-1/2 flex flex-col items-center justify-center">
            <div className="bg-gray-600/60 rounded-xl px-8 py-6 text-white text-center shadow-lg">
              <h2 className="text-3xl font-bold">리뷰어로 시작</h2>
              <p className="mt-4 text-lg">
                Revory 체험단·리뷰어로 참여하고<br/> 싶으신가요?
              </p>
              <button
                onClick={() => setMode("reviewer")}
                className="mt-6 px-5 py-3 text-lg bg-green-400 hover:bg-green-500 text-white rounded-md shadow-md transition"
              >
                리뷰어로 시작
              </button>
            </div>
          </div>
        </div>

        {/* ===== 중앙 변신 박스 ===== */}
        <div
          className={`
            absolute top-0 bg-white rounded-xl shadow-xl overflow-hidden
            transition-all duration-500 ease-in-out
            ${mode ? "z-[2]" : "z-[0]"}
            ${
              mode === "owner"
                ? "w-[380px] h-[460px] -top-[70px] left-0"
                : mode === "reviewer"
                ? "w-[380px] h-[460px] -top-[70px] left-[380px]"
                : "w-[760px] h-[320px] top-0 left-0"
            }
          `}
        >
          {/* 중앙 박스 안 배경 이미지 */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/42/U7Fc1sy5SCUDIu4tlJY3_NY_by_PhilippHenzler_philmotion.de.jpg?auto=format&fit=crop&w=960&q=50"
              alt=""
              className="w-full h-full object-cover grayscale opacity-20"
            />
          </div>

          <div className="relative w-full h-full flex flex-col items-center justify-center px-8">
            {mode && (
              <button
                onClick={() => setMode(null)}
                className="absolute top-5 left-5 text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            )}

            {mode === "owner" && (
              <>
                <h2 className="text-2xl font-bold mb-8 text-gray-800">
                  소상공인 회원가입
                </h2>
                <img src = {OwnerIcon} alt="소상공인 아이콘" className="w-20 h-20 object-contain mb-8"/>
                <button
                  onClick={() => navigate("/signup/owner")}
                  className="px-7 py-3 text-lg bg-orange-400 hover:bg-orange-500 text-white rounded-md shadow-md transition"
                >
                  회원가입
                </button>
              </>
            )}

            {mode === "reviewer" && (
              <>
                <h2 className="text-2xl font-bold mb-8 text-gray-800">
                  리뷰어 회원가입
                </h2>
                <img src = {ReviewIcon} alt="리뷰어 아이콘" className="w-20 h-20 object-contain mb-8"/>
                <button
                  onClick={() => navigate("/signup/reviewer")}
                  className="px-7 py-3 text-lg bg-green-400 hover:bg-green-500 text-white rounded-md shadow-md transition"
                >
                  회원가입
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
