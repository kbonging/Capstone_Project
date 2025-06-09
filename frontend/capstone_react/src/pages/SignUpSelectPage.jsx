import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';


export default function SignUpPage() {
  const navigate = useNavigate();

  return (
    <div className="font-['Noto_Sans_KR'] text-center m-0 p-0 bg-white min-h-screen">
      <h1 className="mt-20 text-4xl font-bold">회원가입</h1>

      <div className="flex justify-center gap-[200px] mt-[150px]">

        {/* 소상공인 버튼 */}
        <div className="flex flex-col items-center transition-transform duration-200 hover:-translate-y-1">
          <div className="w-[100px] h-[100px] bg-[#f9f9f9] rounded-full flex justify-center items-center text-[48px]">
            <img
              src="/src/images/Owner.png"
              alt="소상공인 회원가입 선택 아이콘"
              className="w-[60px] h-[60px] object-contain block mx-auto mb-2.5"
            />
          </div>
          <button
            className="mt-5 px-5 py-2 text-base border-[1.5px] rounded-md bg-white text-[#f57c00] border-[#f57c00] cursor-pointer"
            onClick={() => navigate('/signup/owner')} // 이동 경로
          >
            소상공인으로 시작
          </button>
        </div>

        {/* 리뷰어 버튼 */}
        <div className="flex flex-col items-center transition-transform duration-200 hover:-translate-y-1">
          <div className="w-[100px] h-[100px] bg-[#f9f9f9] rounded-full flex justify-center items-center text-[48px]">
            <img
              src="/src/images/Reviewer.png"
              alt="리뷰어 회원가입 선택 아이콘"
              className="w-[60px] h-[60px] object-contain block mx-auto mb-2.5"
            />
          </div>
          <button
            className="mt-5 px-5 py-2 text-base border-[1.5px] rounded-md bg-white text-[#4caf50] border-[#4caf50] cursor-pointer"
            onClick={() => navigate('/signup/reviewer')}
          >
            리뷰어로 시작
          </button>
        </div>
      </div>
    </div>
  );
}
