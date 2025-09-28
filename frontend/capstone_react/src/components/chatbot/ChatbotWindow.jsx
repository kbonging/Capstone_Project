import React, { useEffect, useRef, useState } from "react";
import { FiX, FiSend, FiMinus, FiChevronDown } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ────────────────────────────────────────────────
 *  UI 유틸
 * ──────────────────────────────────────────────── */
function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

/* ────────────────────────────────────────────────
 *  말풍선 (assistant는 Markdown 렌더)
 * ──────────────────────────────────────────────── */
function Bubble({ role, text }) {
  const isUser = role === "user";
  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"} my-1`}>
      <div
        className={classNames(
          "max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm",
          isUser
            ? "bg-blue-600 text-white dark:bg-blue-500"
            : "bg-white text-gray-900 dark:bg-zinc-800 dark:text-gray-100 border border-gray-100 dark:border-white/10"
        )}
        style={{ wordBreak: "break-word" }}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap">{text}</div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-base font-semibold mt-1 mb-2" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-base font-semibold mt-1 mb-2" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-sm font-semibold mt-1 mb-2" {...props} />,
              p:  ({node, ...props}) => <p className="mb-2 leading-6" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
              code: ({inline, children, ...props}) =>
                inline ? (
                  <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10" {...props}>{children}</code>
                ) : (
                  <pre className="p-3 rounded bg-black/5 dark:bg-white/10 overflow-x-auto text-xs" {...props}>
                    <code>{children}</code>
                  </pre>
                ),
              table: ({node, ...props}) => (
                <div className="overflow-x-auto my-2">
                  <table className="min-w-full text-xs border-collapse" {...props} />
                </div>
              ),
              thead: ({node, ...props}) => <thead className="bg-gray-50 dark:bg-zinc-700/40" {...props} />,
              th: ({node, ...props}) => (
                <th className="border px-2 py-1 text-left dark:border-white/10" {...props} />
              ),
              td: ({node, ...props}) => (
                <td className="border px-2 py-1 align-top dark:border-white/10" {...props} />
              ),
              hr: () => <hr className="my-3 border-black/10 dark:border-white/10" />,
            }}
          >
            {text}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
 *  카테고리/템플릿
 * ──────────────────────────────────────────────── */
const TEMPLATES = {
  탐색: [
    "서울 방문형 인스타 모집중 추천해줘",
    "경기 배송형 블로그 뭐 있어?",
    "부산 유튜브 모집중 뭐 있어?",
  ],
  카운트: [
    "서울 인스타 모집중 몇 개야?",
    "배송형 블로그는 총 몇 건 있어?",
    "부산 블로그 캠페인은 몇 건?",
  ],
  경쟁률: [
    "OOO 경쟁률",
    "서울 \"OOO 캠페인\" 경쟁률 알려줘",
    "\"인생맥주 캠페인\" 경쟁률",
  ],
  리뷰어: [
    "내 신청 현황 알려줘",
    "내 북마크 보여줘",
    "내 리뷰 제출 현황",
    "리뷰 마감 언제야?",
  ],
  오너: ["내 캠페인 현황 보여줘", "내가 등록한 캠페인들", "우리 가게 캠페인 현황"],
  가이드: [
    "리뷰 제출 방법 알려줘",
    "선정 기준 알려줘",
    "패널티 정책 알려줘",
    "포인트 언제 들어와?",
  ],
};

const TIPS = [
  "“있어?/찾아줘/보여줘/추천해줘”처럼 자연어로 편하게 질문하세요.",
  "“몇 개/몇 건”이라고 물으면 개수만 딱 알려드려요.",
  "제목이 길면 따옴표로 감싸면 정확도가 올라가요. (예: \"OOO 캠페인\" 경쟁률)",
];

/* ────────────────────────────────────────────────
 *  칩/아코디언/인트로
 * ──────────────────────────────────────────────── */
function ChipList({ items, onPick }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t, idx) => (
        <button
          key={idx}
          onClick={() => onPick?.(t)}
          className="px-3 py-1.5 rounded-full text-sm bg-white border border-gray-200
                     hover:bg-gray-50 shadow-sm dark:bg-zinc-800 dark:border-white/10 dark:hover:bg-zinc-700
                     transition-colors"
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700"
        onClick={() => setOpen(v => !v)}
      >
        <span className="font-medium">{title}</span>
        <FiChevronDown
          className={classNames("transition-transform", open ? "rotate-180" : "rotate-0")}
        />
      </button>
      {open && <div className="p-3 bg-white dark:bg-zinc-900">{children}</div>}
    </div>
  );
}

function IntroCard({ onPick }) {
  const tabs = Object.keys(TEMPLATES);
  const [active, setActive] = useState(tabs[0]);
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 dark:bg-zinc-900 dark:border-white/10">
      <div className="text-lg">👋 안녕하세요! <b>Revory 챗봇</b>입니다.</div>

      {/* 탭 */}
      <div className="mt-3 flex flex-wrap gap-2">
        {tabs.map(tab => {
          const isActive = tab === active;
          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={classNames(
                "px-3 py-1.5 text-sm rounded-full border transition-colors",
                isActive
                  ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500"
                  : "bg-white text-gray-800 dark:bg-zinc-800 dark:text-gray-100 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-zinc-700"
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 탭 콘텐츠 */}
      <div className="mt-3 space-y-3">
        <div className="rounded-xl border border-gray-100 dark:border-white/10 p-3 bg-white dark:bg-zinc-900">
          <div className="text-sm font-medium mb-2">📌 <span className="align-middle">{active} 질문 예시</span></div>
          <ChipList items={TEMPLATES[active]} onPick={onPick} />
        </div>

        <Accordion title="모든 카테고리 한 번에 보기" defaultOpen={false}>
          <div className="space-y-3">
            {Object.entries(TEMPLATES).map(([cat, items]) => (
              <div key={cat} className="rounded-lg border border-gray-100 dark:border-white/10 p-3">
                <div className="text-xs font-semibold mb-2 opacity-80">{cat}</div>
                <ChipList items={items} onPick={onPick} />
              </div>
            ))}
          </div>
        </Accordion>

        <div className="rounded-xl border border-gray-100 dark:border-white/10 p-3 bg-white dark:bg-zinc-900">
          <div className="font-medium text-sm mb-1">🧭 꿀팁</div>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {TIPS.map((t, i) => (<li key={i}>{t}</li>))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
 *  메인 컴포넌트
 * ──────────────────────────────────────────────── */
export default function ChatbotWindow({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "안녕하세요! Revory 챗봇입니다.\n\n" +
        "상단의 탭/칩에서 질문을 선택해 보세요.\n" +
        "• 탐색: 지역/유형/채널로 추천\n" +
        "• 카운트: 조건에 맞는 개수만\n" +
        "• 경쟁률: 특정 캠페인 경쟁률\n" +
        "• 리뷰어/오너: 내 현황(로그인 필요)\n" +
        "• 가이드: 제출 방법/규정/정책",
    },
  ]);
  const [input, setInput] = useState("");
  const [minimized, setMinimized] = useState(false);
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);
  const textRef = useRef(null);
  const streamAbortRef = useRef(null);

  const showIntroUI = messages.length <= 2;

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, minimized]);

  useEffect(() => {
    if (!textRef.current) return;
    textRef.current.style.height = "auto";
    textRef.current.style.height = Math.min(textRef.current.scrollHeight, 160) + "px";
  }, [input]);

  const readSSE = async (resp, onDelta) => {
    const reader = resp.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buf = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const events = buf.split("\n\n");
      buf = events.pop() || "";
      for (const evt of events) {
        for (const line of evt.split("\n")) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trimStart();
          if (payload === "[DONE]") return;
          if (payload) onDelta(payload);
        }
      }
    }
  };

  const sendPreset = (text) => {
    setInput(text);
    setTimeout(() => send(true), 0);
  };

  const send = async (isPreset = false) => {
    const text = (isPreset ? input : input).trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");

    const assistantIndexRef = { current: null };
    setMessages((prev) => {
      const nextIdx = prev.length + 1;
      assistantIndexRef.current = nextIdx;
      return [...prev, { role: "assistant", text: "" }];
    });

    const token = localStorage.getItem("accessToken") || undefined;
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const body = JSON.stringify({ message: text });

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
      if (!resp.ok) throw new Error(`서버 오류 (${resp.status})`);
      if (!resp.body) {
        const data = await resp.json().catch(() => ({}));
        const answer = data?.answer ?? "응답을 해석할 수 없어요.";
        setMessages((prev) => {
          const next = [...prev];
          next[prev.length - 1] = { role: "assistant", text: answer };
          return next;
        });
        return;
      }
      let acc = "";
      await readSSE(resp, (delta) => {
        acc += delta;
        setMessages((prev) => {
          const next = [...prev];
          const idx = assistantIndexRef.current !== null ? assistantIndexRef.current : next.length - 1;
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

  const handleClose = () => {
    try { streamAbortRef.current?.abort(); } catch {}
    onClose?.();
  };

  return (
    <div className="flex flex-col h-[70vh] sm:h-[72vh]">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-blue-600 text-white grid place-items-center text-xs dark:bg-blue-500">R</div>
          <div className="font-medium text-gray-800 dark:text-gray-100">Revory 챗봇</div>
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
          <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-3 bg-gray-50 dark:bg-zinc-950">
            {/* 인트로 카드 */}
            {showIntroUI && (
              <div className="max-w-[90%] md:max-w-[70%] mb-3">
                <IntroCard onPick={sendPreset} />
              </div>
            )}

            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} text={m.text} />
            ))}

            {sending && (
              <div className="text-xs text-gray-500 dark:text-gray-400 px-1 py-2">응답 생성 중…</div>
            )}

            {/* 빠른 칩(추가) */}
            {showIntroUI && (
              <div className="max-w-[90%] md:max-w-[70%]">
                <div className="mt-2">
                  <ChipList
                    onPick={sendPreset}
                    items={[
                      "서울 방문형 인스타 모집중 추천해줘",
                      "OOO 경쟁률",
                      "리뷰 제출 방법 알려줘",
                      "내 캠페인 현황 보여줘",
                    ]}
                  />
                </div>
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
                onClick={() => send()}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm
                           bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600
                           disabled:opacity-60 transition-colors"
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
