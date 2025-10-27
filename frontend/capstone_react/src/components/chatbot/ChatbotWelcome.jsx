// src/components/chatbot/ChatbotWelcome.jsx
import React, { useState } from "react";
import {
  FiChevronRight,
  FiHome,
  FiMessageCircle,
  FiSettings,
} from "react-icons/fi";
import OperatingHoursSheetInline from "./OperatingHoursSheetInline";
import { FiX } from "react-icons/fi";
import sLogo from "../../images/sLogo.png";

export default function ChatbotWelcome({ onInquiry, onClose }) {
  const [active, setActive] = useState("home");
  const [hoursOpen, setHoursOpen] = useState(false);

  const NavBtn = ({ id, icon: Icon, label, onClick }) => {
    const isActive = active === id;
    return (
      <button
        type="button"
        onClick={() => {
          setActive(id);
          onClick?.();
        }}
        className="flex flex-col items-center justify-center gap-1"
      >
        <Icon
          className={`text-xl ${isActive ? "text-blue-600" : "text-gray-400"}`}
        />
        <span
          className={`text-sm ${
            isActive ? "text-blue-600 font-medium" : "text-gray-400"
          }`}
        >
          {label}
        </span>
      </button>
    );
  };

  /* 봇 아바타(말풍선 왼쪽 원형 로고) */
  const RevoryAvatar = ({ size = 18, className = "" }) => (
    <div
      className={`h-7 w-7 rounded-full bg-white ring-1 ring-black/10 shadow-sm grid place-items-center ${className}`}
      aria-hidden="true"
    >
      <img
        src={sLogo}
        alt="Revory"
        width={size}
        height={size}
        className="pointer-events-none select-none"
        draggable={false}
      />
    </div>
  );

  return (
    // 🔹 모달 내부 전체를 relative/overflow-hidden으로 만들어 바텀시트를 이 안에서 띄움
    <div className="relative overflow-hidden min-h-[60vh] sm:min-h-[66vh] flex flex-col bg-white dark:bg-zinc-900">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-2">
          <RevoryAvatar />
          <div className="flex flex-col leading-tight">
            <div className="text-base font-semibold">Revory</div>
            <button
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 inline-flex items-center gap-1"
              type="button"
              onClick={() => setHoursOpen(true)}
              title="운영시간 보기"
            >
              운영시간 보기 <FiChevronRight />
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="닫기"
          className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
        >
          <FiX />
        </button>
      </div>

      {/* 본문 */}
      <div className="p-4 flex-1">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-white/10 p-4 shadow-sm">
          {/* 프로필 라인 */}
          <div className="flex items-center gap-3">
            <RevoryAvatar />
            <div className="flex-1">
              <div className="font-semibold">Revory</div>
              <button
                type="button"
                onClick={() => setHoursOpen(true)}
                className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
                title="운영시간 보기"
              >
                운영시간 보기
              </button>
            </div>
          </div>

          {/* 말풍선 카드 */}
          <div className="mt-3 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-zinc-800 p-3">
            <div className="text-sm">
              <b>Revory</b>
              <div className="mt-1 whitespace-pre-wrap">
                안녕하세요, Revory입니다.
                {"\n"}아래 메뉴에서 도움이 필요한 유형을 선택해 주세요
              </div>
            </div>
          </div>

          {/* 문의하기 버튼 */}
          <div className="mt-4">
            <button
              onClick={onInquiry}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-colors"
            >
              문의하기
            </button>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
              몇 분 내 답변 받으실 수 있어요
            </div>
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <span className="inline-block w-4 h-4 rounded-full bg-gray-200 dark:bg-zinc-700 grid place-items-center text-[10px]">
                ⦿
              </span>
              채널톡 이용중
            </div>
          </div>
        </div>
      </div>

      {/* 하단 탭 */}
      <div className="h-14 border-t border-black/5 dark:border-white/10 grid grid-cols-3 bg-white dark:bg-zinc-900">
        <NavBtn id="home" icon={FiHome} label="홈" />
        <NavBtn
          id="chat"
          icon={FiMessageCircle}
          label="대화"
          onClick={() => onInquiry?.()}
        />
        <NavBtn id="settings" icon={FiSettings} label="설정" />
      </div>

      {/* 🔹 모달 내부 인라인 바텀시트 */}
      <OperatingHoursSheetInline
        open={hoursOpen}
        onClose={() => setHoursOpen(false)}
        hours={{
          1: "오전 8:00 ~ 오후 5:00",
          2: "오전 8:00 ~ 오후 5:00",
          3: "오전 8:00 ~ 오후 5:00",
          4: "오전 8:00 ~ 오후 5:00",
          5: "오전 8:00 ~ 오후 5:00",
          6: null,
          0: null,
        }}
        // upcomingHolidays={[{ from: "2025-10-03" }, { from: "2025-10-06", to: "2025-10-09" }]}
        timezone="Asia/Seoul"
      />
    </div>
  );
}
