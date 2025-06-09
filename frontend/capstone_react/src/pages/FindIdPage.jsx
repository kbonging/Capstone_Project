import React, { useState, useRef } from "react";


export default function FindId() {


return(
    <main class="w-full max-w-md p-6 text-center">
    
        <img src="./img/Logo.png" alt = "Revory" class="w-[300px] mx-auto mb-10" />

    
        <p class="text-base font-semibold text-gray-800 mb-6">
        아이디 찾기
        </p>

        <form class="flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="이메일"
          class="w-full border border-gray-300 rounded-md px-4 py-3 text-sm"
          required 
         />
         <button 
          type="submit"
           class="bg-blue-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-md"
          >
           메일 전송
        </button>
     </form>

     <p class="mt-6 text-sm text-gray-600">
          아이디가 기억나지 않는다면? 
          <a href="#" class="text-blak-600 font-semibold">아이디 찾기</a>
     </p>

     <p class="mt-8 text-xs text-gray-400">
       <strong class="font-bold">Revory</strong> | 회원정보 고객센터
      </p>
    </main>
    )
}