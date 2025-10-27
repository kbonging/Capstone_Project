// src/components/chatbot/ChatbotWindow.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { FiX, FiSend, FiMinus, FiChevronDown } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ⬇️ 로고 이미지 import (경로는 현재 파일 위치 기준)
import sLogo from "../../images/sLogo.png";

// SSE 델타를 보기 좋게 연결
function appendSSE(prev, chunk) {
  let p = prev ?? "";
  let s = chunk ?? "";

  // 제목류가 시작되면 앞에 빈 줄 1개 확보
  if (/^(📌|###|##|\d+\.)\s/.test(s)) {
    if (!p.endsWith("\n\n")) {
      if (p.endsWith("\n")) p += "\n";
      else if (p) p += "\n\n";
    }
  }

  // 리스트 항목이면( - 또는 * ) 앞에 줄바꿈 보장
  if (/^\s*[-*]\s/.test(s)) {
    if (!p.endsWith("\n")) p += "\n";
  }

  // 델타가 줄 끝에 개행이 없으면 붙여줌
  if (!s.endsWith("\n")) s += "\n";

  return p + s;
}



function classNames(...xs) { return xs.filter(Boolean).join(" "); }
const nowKo = () =>
  new Intl.DateTimeFormat("ko-KR", { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date());

/* 상단바/히어로에서 쓰는 로고 */
const RevoryLogoImg = ({ size = 24, className = "" }) => (
  <img src={sLogo} alt="Revory" width={size} height={size} className={className} draggable={false} />
);

/* 봇 아바타(말풍선 왼쪽 원형 로고) */
const RevoryAvatar = ({ size = 18, className = "" }) => (
  <div
    className={`h-7 w-7 rounded-full bg-white ring-1 ring-black/10 shadow-sm grid place-items-center ${className}`}
    aria-hidden="true"
  >
    <img src={sLogo} alt="Revory" width={size} height={size} className="pointer-events-none select-none" draggable={false} />
  </div>
);

/* ─ 상단 히어로 ─ */
function AskHero({ onOpenHours }) {
  const timeStr = useMemo(nowKo, []);
  return (
    <div className="px-2 sm:px-3 pt-6 pb-2">
      <div className="flex flex-col items-center">
        <div className="mt-2 h-16 w-16 rounded-3xl bg-blue-50 grid place-items-center shadow-sm">
          <RevoryLogoImg size={40} />
        </div>
        <div className="mt-3 text-2xl font-bold tracking-tight">Revory에 문의하기</div>
        <button
          type="button"
          onClick={onOpenHours}
          className="mt-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 inline-flex items-center gap-1"
          title="운영시간 보기"
        >
          운영시간 보기 <FiChevronDown className="-rotate-90" />
        </button>
        <div className="mt-3 text-[11px] text-gray-400">{timeStr}</div>
      </div>
    </div>
  );
}

/* ─ 환영 말풍선 ─ */
function WelcomeIntro() {
  return (
    <div className="mt-3 mx-auto max-w-[560px] px-2 sm:px-3">
      <div className="flex items-start gap-2">
        <RevoryAvatar />
        <div className="rounded-2xl bg-gray-50 text-gray-900 dark:bg-zinc-800 dark:text-gray-100
                        border border-black/5 dark:border-white/10 px-4 py-3 text-sm leading-6 shadow-sm">
          <div className="font-semibold">안녕하세요, <span className="font-bold">Revory</span>입니다.</div>
          <div className="mt-1">아래 메뉴에서 도움이 필요한 유형을 선택해 주세요</div>
        </div>
      </div>
    </div>
  );
}

/* ─ 말풍선: assistant일 때 로고 아바타 노출 ─ */
function Bubble({ role, text }) {
  const isUser = role === "user";
  return (
    <div className={`w-full my-1 ${isUser ? "flex justify-end" : "flex justify-start"}`}>
      {!isUser && <RevoryAvatar className="mr-2 mt-0.5 shrink-0" />}

      <div
        className={classNames(
          "max-w-screen-lg rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm",
          isUser
            ? "bg-blue-600 text-white dark:bg-blue-500"
            : "bg-white text-gray-900 dark:bg-zinc-800 dark:text-gray-100 border border-gray-100 dark:border-white/10"
        )}
        style={{ wordBreak: "break-word" }}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap">{text}</div>
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        )}
      </div>
    </div>
  );
}

/* ─ 템플릿/인트로 카드 ─ */
const TEMPLATES = {
  탐색: ["서울 방문형 인스타 모집중 추천해줘", "경기 배송형 블로그 뭐 있어?", "부산 유튜브 모집중 뭐 있어?"],
  카운트: ["서울 인스타 모집중 몇 개야?", "배송형 블로그는 총 몇 건 있어?", "부산 블로그 캠페인은 몇 건?"],
  경쟁률: ["OOO 경쟁률", '서울 "OOO 캠페인" 경쟁률 알려줘', '"인생맥주 캠페인" 경쟁률'],
  리뷰어: ["내 신청 현황 알려줘", "내 북마크 보여줘", "내 리뷰 제출 현황", "리뷰 마감 언제야?"],
  오너: ["내 캠페인 현황 보여줘", "내가 등록한 캠페인들", "우리 가게 캠페인 현황"],
  가이드: ["리뷰 제출 방법 알려줘", "선정 기준 알려줘", "패널티 정책 알려줘", "포인트 언제 들어와?"],
};
const TIPS = [
  "“있어?/찾아줘/보여줘/추천해줘”처럼 자연어로 편하게 질문하세요.",
  "“몇 개/몇 건”이라고 물으면 개수만 딱 알려드려요.",
  '제목이 길면 따옴표로 감싸면 정확도가 올라가요. (예: "OOO 캠페인" 경쟁률)',
];

function ChipList({ items, onPick }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t, i) => (
        <button
          key={i}
          onClick={() => onPick?.(t)}
          className="px-3 py-1.5 ml-10  rounded-full text-sm bg-white border border-gray-200 hover:bg-gray-50 shadow-sm
                     dark:bg-zinc-800 dark:border-white/10 dark:hover:bg-zinc-700 transition-colors"
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
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-medium">{title}</span>
        <FiChevronDown className={classNames("transition-transform", open ? "rotate-180" : "rotate-0")} />
      </button>
      {open && <div className="p-3 bg-white dark:bg-zinc-900">{children}</div>}
    </div>
  );
}

function IntroCard({ onPick }) {
  const tabs = Object.keys(TEMPLATES);
  const [active, setActive] = useState(tabs[0]);
  return (
    <div className="bg-white rounded-2xl border mt-2 ml-10 border-gray-100 p-4 dark:bg-zinc-900 dark:border-white/10">
      {/* 탭 */}
      <div className="flex flex-wrap  gap-2">
        {tabs.map((tab) => {
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

        <Accordion title="모든 카테고리 한 번에 보기">
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

/* ─ 메인 ─ */
export default function ChatbotWindow({ onClose }) {
  const [messages, setMessages] = useState([]);     // 처음엔 안내 UI만
  const [input, setInput] = useState("");
  const [minimized, setMinimized] = useState(false);
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);
  const textRef = useRef(null);
  const streamAbortRef = useRef(null);

  const showIntroUI = messages.length === 0;

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

  const sendPreset = (text) => { setInput(text); setTimeout(() => send(true), 0); };

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");

    const assistantIndexRef = { current: null };
    setMessages((prev) => {
      const nextIdx = prev.length + 1;
      assistantIndexRef.current = nextIdx;
      return [...prev, { role: "assistant", text: "" }];
    });

    const token = localStorage.getItem("token") || undefined;
    const headers = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
    const body = JSON.stringify({ message: text });

    setSending(true);
    const aborter = new AbortController();
    streamAbortRef.current = aborter;

    try {
      const resp = await fetch("/api/chat/stream", { method: "POST", headers, body, signal: aborter.signal });
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
        acc = appendSSE(acc, delta);
        setMessages((prev) => {
          const next = [...prev];
          const idx = assistantIndexRef.current !== null ? assistantIndexRef.current : next.length - 1;
          next[idx] = { role: "assistant", text: acc };
          return next;
        });
      });
    } catch (e) {
      console.error(e);
      setMessages((prev) => [...prev, { role: "assistant", text: "죄송해요, 서버와 통신에 실패했어요. 😢" }]);
    } finally {
      setSending(false);
      streamAbortRef.current = null;
    }
  };

  const onKeyDown = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); send(); } };
  const handleClose = () => { try { streamAbortRef.current?.abort(); } catch {} onClose?.(); };

  return (
    <div className="flex flex-col h-[70vh] sm:h-[72vh]">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-blue-50 grid place-items-center">
            <RevoryLogoImg size={14} />
          </div>
          <div className="font-medium text-gray-800 dark:text-gray-100">Revory 챗봇</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded hover:bg-black/5 dark:hover:bg:white/10" aria-label="최소화" onClick={() => setMinimized((v) => !v)} title="최소화">
            <FiMinus />
          </button>
          <button className="p-2 rounded hover:bg-black/5 dark:hover:bg:white/10" aria-label="닫기" onClick={handleClose} title="닫기 (Esc)">
            <FiX />
          </button>
        </div>
      </div>

      {/* 스크롤 영역 */}
      {!minimized ? (
        <>
          <div ref={listRef} className="flex-1 overflow-y-auto bg-gray-50 dark:bg-zinc-950">
            {showIntroUI && <AskHero onOpenHours={() => { /* 운영시간 시트 */ }} />}
            {showIntroUI && <WelcomeIntro />}

            <div className="px-3 pb-3">
              {showIntroUI && (
                <div className="max-w-[90%] md:max-w-[70%] mb-3">
                  <IntroCard onPick={sendPreset} />
                </div>
              )}

              {showIntroUI && (
                <div className="max-w-[90%] md:max-w-[70%] mb-2">
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
              )}

              {messages.map((m, i) => (
                <Bubble key={i} role={m.role} text={m.text} />
              ))}

            
            </div>
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
        <div className="flex-1 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">최소화됨</div>
      )}
    </div>
  );
}
