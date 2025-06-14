import React from "react";
import LogoImage from '../images/Logo.png';

export default function FindPwd() {
  return (
    <main className="w-full max-w-md p-6 justify-center text-center m-auto mt-[40px] mb-[200px]">
      
      <img src={LogoImage} alt="Revory Logo" className="w-[200px] h-full inline-block mb-[35px]" />
        

      <p className="text-base font-semibold text-gray-800 mb-5">
        비밀번호 찾기
      </p>

      <form className="flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="이메일"
          className="w-auto border border-gray-300 rounded-md px-4 py-3 text-sm"
          required 
        />
        <button 
          type="submit"
          className="bg-[#8687f9] hover:bg-[#5f61f6] text-white font-semibold py-3 rounded-md"
        >
          메일 전송
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        아이디가 기억나지 않는다면? &nbsp;
        <a href="#" className="text-black-600 font-semibold">아이디 찾기</a>
        {/* link ↑ */}
      </p>

      <p className="mt-8 text-xs text-gray-400">
        <strong className="font-bold">Revory</strong> | 회원정보 고객센터
      </p>
    </main>
  );
}
