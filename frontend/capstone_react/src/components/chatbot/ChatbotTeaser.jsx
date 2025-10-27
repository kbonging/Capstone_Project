// src/components/chatbot/ChatbotTeaser.jsx
import React from "react";
import ChatbotIcon from "../ChatbotIcon";

export default function ChatbotTeaser({ onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="챗봇 열기"
      className={`group flex items-center rounded-full px-2 py-1 
                  bg-gradient-to-r from-[#EAF0FF] to-[#E9ECFF]
                  dark:from-[#1f2545] dark:to-[#2a2f57]
                   hover:brightness-105 transition ${className}  focus:outline-none`}
    >
      {/* 왼쪽 텍스트 */}
      <div className="flex flex-col text-left leading-tight pr-3">
        <span className="text-[12px] text-gray-700/90 dark:text-gray-200/90">
          무엇이든 궁금한 점을
        </span>
        <span className="text-[12px]">
          <b className="text-blue-600 dark:text-blue-300">챗봇 Ai</b>
          <span className="text-gray-700/90 dark:text-gray-200/90">에게 물어보세요.</span>
        </span>
      </div>

      {/* 오른쪽 끝 아이콘 */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full">
        <ChatbotIcon size={16} className="shrink-0" />
      </div>
    </button>
  );
}
