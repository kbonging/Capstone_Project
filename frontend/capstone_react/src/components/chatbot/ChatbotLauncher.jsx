import React, { useState, useCallback, useEffect } from "react";
import ChatbotModal from "./ChatbotModal";
import ChatbotWindow from "./ChatbotWindow";
// ⬇️ 네가 쓰는 ChatbotIcon 경로에 맞춰 import (질문 코드 기준)
// import ChatbotIcon from "../ChatbotIcon";
import ChatbotTeaser from "./ChatbotTeaser";

export default function ChatbotLauncher({ className = "" }) {
  const [open, setOpen] = useState(false);
  const openChat = useCallback(() => setOpen(true), []);
  const closeChat = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && closeChat();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeChat]);

  return (
    <>
      {/* 기존 아이콘 자리에 이 버튼만 렌더 */}
      <button
        type="button"
        onClick={openChat}
        aria-label="챗봇 열기"
        className={`rounded-full bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition ${className}`}
      >
        <ChatbotTeaser onClick={openChat} className={className} />
        {/* <ChatbotIcon size={28} className="cursor-pointer" /> */}
      </button>

      <ChatbotModal open={open} onClose={closeChat}>
        <ChatbotWindow onClose={closeChat} />
      </ChatbotModal>
    </>
  );
}
