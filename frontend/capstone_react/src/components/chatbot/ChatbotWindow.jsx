import React, { useEffect, useRef, useState } from "react";
import { FiX, FiSend, FiMinus } from "react-icons/fi";

function Bubble({ role, text }) {
  const isUser = role === "user";
  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"} my-1`}>
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
  const [sending, setSending] = useState(false);       // 전송 중 상태
  const listRef = useRef(null);
  const textRef = useRef(null);
  const streamAbortRef = useRef(null);                 // 스트림 취소용

  // 스크롤 항상 최신 유지
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, minimized]);

  // textarea 자동 높이
  useEffect(() => {
    if (!textRef.current) return;
    textRef.current.style.height = "auto";
    textRef.current.style.height = Math.min(textRef.current.scrollHeight, 160) + "px";
  }, [input]);

  const readSSE = async (resp, onDelta) => {
    // 서버가 "data: ..." 형식으로 내려준다고 가정
    const reader = resp.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buf = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });

      // 이벤트 분할: \n\n 기준
      const events = buf.split("\n\n");
      // 마지막 토막은 불완전할 수 있으니 버퍼에 남겨둠
      buf = events.pop() || "";

      for (const evt of events) {
        // 각 이벤트는 여러 줄로 구성될 수 있음
        // data: 로 시작하는 라인 모으기
        const lines = evt.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trimStart();
          if (payload === "[DONE]") return;           // 종료
          if (payload) onDelta(payload);
        }
      }
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    // 사용자 메시지 추가
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");

    // 어시스턴트 빈 버블 자리 확보
    const assistantIndexRef = { current: null };
    setMessages((prev) => {
      const nextIdx = prev.length + 1; // user 추가 후 다음 인덱스
      assistantIndexRef.current = nextIdx;
      return [...prev, { role: "assistant", text: "" }];
    });

    const token = localStorage.getItem("accessToken") || undefined;
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const body = JSON.stringify({
      message: text,
      // 필요 시 top_k, conversationId 등 추가
      // top_k: 4,
      // conversation_id: "...",
    });

    setSending(true);
    const aborter = new AbortController();
    streamAbortRef.current = aborter;

    try {
      const resp = await fetch("/api/chat/stream", {
        method: "POST",
        headers,
        body,
        signal: aborter.signal,
      });

      if (!resp.ok) {
        throw new Error(`서버 오류 (${resp.status})`);
      }
      if (!resp.body) {
        // 스트리밍이 아닐 경우(백엔드가 원샷 JSON일 때) 대비
        try {
          const data = await resp.json();
          const answer = data?.answer ?? "응답을 해석할 수 없어요.";
          setMessages((prev) => {
            const next = [...prev];
            next[prev.length - 1] = { role: "assistant", text: answer };
            return next;
          });
          return;
        } catch {
          throw new Error("스트리밍 바디가 없어요.");
        }
      }

      // 스트리밍: 토큰 오면 누적해서 업데이트
      let acc = "";
      await readSSE(resp, (delta) => {
        acc += delta;
        setMessages((prev) => {
          const next = [...prev];
          const idx =
            assistantIndexRef.current !== null ? assistantIndexRef.current : next.length - 1;
          next[idx] = { role: "assistant", text: acc };
          return next;
        });
      });
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "죄송해요, 서버와 통신에 실패했어요. 😢" },
      ]);
    } finally {
      setSending(false);
      streamAbortRef.current = null;
    }
  };

  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      send();
    }
  };

  // 닫을 때 진행 중 스트림 중단
  const handleClose = () => {
    try {
      streamAbortRef.current?.abort();
    } catch {}
    onClose?.();
  };

  return (
    <div className="flex flex-col h-[70vh] sm:h-[72vh]">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur">
        <div className="font-medium text-gray-800 dark:text-gray-100">Revory 챗봇</div>
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
            onClick={handleClose}
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
            {sending && (
              <div className="text-xs text-gray-500 dark:text-gray-400 px-1 py-2">
                응답 생성 중…
              </div>
            )}
          </div>

          {/* 입력영역 */}
          <div className="border-t border-black/5 dark:border-white/10 p-3 bg-white dark:bg-zinc-900">
            <div className="flex items-end gap-2">
              <textarea
                ref={textRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="메시지를 입력하세요... (Ctrl/⌘ + Enter 전송)"
                className="flex-1 resize-none rounded-xl px-3 py-2 text-sm outline-none
                           bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100
                           placeholder:text-gray-400 dark:placeholder:text-gray-400
                           border border-transparent focus:border-blue-400/60"
                disabled={sending}
              />
              <button
                onClick={send}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm
                           bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600
                           disabled:opacity-60"
                disabled={!input.trim() || sending}
                title={sending ? "응답 대기 중..." : "보내기"}
              >
                <FiSend className="-mt-[1px]" />
                보내기
              </button>
            </div>
            {sending && (
              <div className="flex justify-end mt-2">
                <button
                  className="text-xs px-2 py-1 rounded border border-black/10 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10"
                  onClick={() => streamAbortRef.current?.abort()}
                  title="생성 중지"
                >
                  중지
                </button>
              </div>
            )}
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
