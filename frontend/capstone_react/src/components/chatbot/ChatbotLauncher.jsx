// src/components/chatbot/ChatbotLauncher.jsx
import React, { useState, useCallback, useEffect } from "react";
import ChatbotModal from "./ChatbotModal";
import ChatbotWindow from "./ChatbotWindow";
import ChatbotTeaser from "./ChatbotTeaser";
import ChatbotWelcome from "./ChatbotWelcome";

export default function ChatbotLauncher({ className = "" }) {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState("welcome"); // 'welcome' | 'chat'

  const openChat = useCallback(() => {
    setStage("welcome");
    setOpen(true);
  }, []);
  const closeChat = useCallback(() => {
    setOpen(false);
    setStage("welcome");
  }, []);

  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && closeChat();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeChat]);

  return (
    <>
      {/* 고정 티저 버튼 (네가 쓰던 자리 그대로) */}
      <button
        type="button"
        onClick={openChat}
        aria-label="챗봇 열기"
        className={`rounded-full transition ${className}`}
      >
        <ChatbotTeaser onClick={openChat} className={className} />
      </button>

      {/* 모달 안에서 단계 전환 */}
      <ChatbotModal open={open} onClose={closeChat}>
        {stage === "welcome" ? (
          <ChatbotWelcome
            onInquiry={() => setStage("chat")}
            onClose={closeChat}
          />
        ) : (
          <ChatbotWindow onClose={closeChat} />
        )}
      </ChatbotModal>
    </>
  );
}
