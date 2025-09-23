// src/components/icons/ChatbotIcon.jsx
import React from "react";
// import lightIcon from "../images/chatBot.png";        // 기존 밝은 버전
import light_darkIcon from "../images/chatbot_icon_dark_transparent.png"; // 위에서 만든 다크 버전

export default function ChatbotIcon({ size = 56, className = "", alt = "Chatbot", onClick }) {
  return (
    <>
      <img
        src={light_darkIcon}
        alt={alt}
        width={size}
        height={size}
        className={`object-contain dark:hidden ${className}`}
        onClick={onClick}
      />
      <img
        src={light_darkIcon}
        alt={alt}
        width={size}
        height={size}
        className={`object-contain hidden dark:block ${className}`}
        onClick={onClick}
      />
    </>
  );
}
