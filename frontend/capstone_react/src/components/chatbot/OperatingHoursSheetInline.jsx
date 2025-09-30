// src/components/chatbot/OperatingHoursSheetInline.jsx
import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

const Dot = ({ color = "bg-blue-500" }) => (
  <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
);

/**
 * 부모 컨테이너(챗봇 모달 내부)에 상대 배치로 올라오는 바텀시트
 * 부모는 반드시: position: relative; overflow: hidden; 이어야 함
 */
export default function OperatingHoursSheetInline({
  open,
  onClose,
  hours = {
    1: "오전 8:00 ~ 오후 5:00",
    2: "오전 8:00 ~ 오후 5:00",
    3: "오전 8:00 ~ 오후 5:00",
    4: "오전 8:00 ~ 오후 5:00",
    5: "오전 8:00 ~ 오후 5:00",
    6: null,
    0: null,
  },
  upcomingHolidays = [
    { from: "2025-10-03" },
    { from: "2025-10-06", to: "2025-10-09" },
  ],
  timezone = "Asia/Seoul",
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 컨테이너 내부만 덮는 반투명 백드롭 */}
          <motion.div
            className="absolute inset-0 z-40 bg-black/30"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 바텀시트 본체 (부모 하단 기준) */}
          <motion.div
            className="
              absolute z-50 left-0 right-0 bottom-0
              rounded-t-2xl bg-white dark:bg-zinc-900
              border-t border-black/5 dark:border-white/10
              shadow-xl
            "
            style={{ paddingBottom: "12px" }}
            role="dialog"
            aria-modal="true"
            initial={{ y: 320, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 320, opacity: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 36 }}
          >
            {/* 드래그 핸들 */}
            <div className="flex justify-center pt-2">
              <div className="h-1.5 w-12 rounded-full bg-black/15 dark:bg-white/15" />
            </div>

            <div className="px-4 pb-2">
              {/* 헤더 */}
              <div className="flex items-center justify-between mt-1 mb-2">
                <div className="text-sm font-semibold">운영시간</div>
                <button
                  onClick={onClose}
                  aria-label="닫기"
                  className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <FiX />
                </button>
              </div>

              {/* 내용 */}
              <div className="max-h-[48vh] overflow-y-auto pr-1">
                {/* 요일별 */}
                <div className="space-y-1.5">
                  {[1,2,3,4,5,6,0].map((d) => {
                    const label = DAY_LABELS[d];
                    const val = hours[d];
                    const isOpen = !!val;
                    return (
                      <div key={d} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Dot color={isOpen ? "bg-blue-500" : "bg-gray-300"} />
                          <span className="min-w-[2em]">{label}</span>
                        </div>
                        <div className={isOpen ? "" : "text-gray-400 dark:text-gray-500"}>
                          {isOpen ? val : "휴무"}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 예정된 휴일 */}
                <div className="mt-4">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    14일 이내에 예정된 휴일
                  </div>
                  <ul className="space-y-1.5">
                    {upcomingHolidays.length === 0 ? (
                      <li className="text-sm text-gray-400">없음</li>
                    ) : (
                      upcomingHolidays.map((h, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <Dot color="bg-gray-300" />
                          <span>{h.to ? `${h.from} ~ ${h.to}` : h.from}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                <div className="mt-3 text-xs text-gray-400">– Timezone: {timezone}</div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
