import React, { useEffect, useRef, useState } from "react";
import { FiX, FiSend, FiMinus } from "react-icons/fi";

function Bubble({ role, text }) {
  const isUser = role === "user";
  return (
    <div
      className={`w-full flex ${isUser ? "justify-end" : "justify-start"} my-1`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed
          ${
            isUser
              ? "bg-blue-600 text-white dark:bg-blue-500"
              : "bg-gray-100 text-gray-900 dark:bg-zinc-800 dark:text-gray-100"
          }`}
      >
        {text}
      </div>
    </div>
  );
}

export default function ChatbotWindow({ onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "안녕하세요! Revory 입니다 무엇을 도와드릴까요? 😊" },
  ]);
  const [input, setInput] = useState("");
  const [minimized, setMinimized] = useState(false);
  const listRef = useRef(null);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    // TODO: 여기서 실제 백엔드/AI 호출 붙이기
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: `“${text}”에 대해 더 자세히 알려주실래요?` },
      ]);
    }, 200);
  };

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, minimized]);

  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-[70vh] sm:h-[72vh]">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur">
        <div className="font-medium text-gray-800 dark:text-gray-100">
          Revory 챗봇
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="최소화"
            onClick={() => setMinimized((v) => !v)}
            title="최소화"
          >
            <FiMinus />
          </button>
          <button
            className="p-2 rounded hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="닫기"
            onClick={onClose}
            title="닫기 (Esc)"
          >
            <FiX />
          </button>
        </div>
      </div>

      {/* 바디 */}
      {!minimized ? (
        <>
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto px-3 py-3 bg-gray-50 dark:bg-zinc-950"
          >
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} text={m.text} />
            ))}
          </div>

          {/* 입력영역 */}
          <div className="border-t border-black/5 dark:border-white/10 p-3 bg-white dark:bg-zinc-900">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="메시지를 입력하세요... (Ctrl/⌘ + Enter 전송)"
                className="flex-1 resize-none rounded-xl px-3 py-2 text-sm outline-none
                           bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100
                           placeholder:text-gray-400 dark:placeholder:text-gray-400
                           border border-transparent focus:border-blue-400/60"
              />
              <button
                onClick={send}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm
                           bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600
                           disabled:opacity-60"
                disabled={!input.trim()}
              >
                <FiSend className="-mt-[1px]" />
                보내기
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          최소화됨
        </div>
      )}
    </div>
  );
}
