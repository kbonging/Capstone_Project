// src/components/icons/ChatbotIcon.jsx
import React from "react";
// import lightIcon from "../images/chatBot.png";        // 기존 밝은 버전
import lightIcon from "../images/chatbot_light.png";
import darkIcon from "../images/chatbot_dark.png"; // 위에서 만든 다크 버전

export default function ChatbotIcon({
  size = 28,
  className = "",
  alt = "Chatbot",
  onClick,
}) {
  return (
    <>
      <img
        src={lightIcon}
        alt={alt}
        width={size}
        height={size}
        className={`object-contain absolute right-[-10px] w-${size} dark:hidden ${className}`}
        onClick={onClick}
      />
      <img
        src={darkIcon}
        alt={alt}
        width={size}
        height={size}
        className={`object-contain hidden dark:block ${className} w-${size} absolute right-[-10px]`}
        onClick={onClick}
      />
    </>
  );
}
