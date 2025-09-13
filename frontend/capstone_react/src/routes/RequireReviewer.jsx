// src/routes/RequireReviewer.jsx
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getApplyPage, HttpError } from "../api/campaigns/api";
import { FiLogIn, FiHome, FiAlertCircle, FiX } from "react-icons/fi";

export default function RequireReviewer({ children }) {
  const { id } = useParams();
  const nav = useNavigate();
  const location = useLocation();

  const [state, setState] = useState({
    ok: null,
    gate: null,
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const token = localStorage.getItem("token");
        await getApplyPage(id, token); // ✅ 여기서 승인 상태 포함해서 내려오도록 백엔드 수정 필요
        if (!alive) return;
        setState({ ok: true, gate: null });
      } catch (e) {
        if (!alive) return;
        if (e instanceof HttpError) {
          if (e.status === 401) {
            setState({ ok: false, gate: { type: "unauth" } });
            return;
          }
          if (e.status === 403) {
            // 서버 응답 body에 status 포함한다고 가정 (CAMAPP_PENDING, CAMAPP_REJECTED 등)
            const serverType = e.body?.status || "forbidden";
            setState({
              ok: false,
              gate: {
                type: serverType,
                message:
                  e.body?.message || "승인된 신청자만 리뷰 등록이 가능합니다.",
              },
            });
            return;
          }
        }
        setState({
          ok: false,
          gate: { type: "error", message: "접근할 수 없는 페이지입니다." },
        });
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, location.pathname, location.search]);

  const goLogin = () =>
    nav(
      `/login?redirect=${encodeURIComponent(
        location.pathname + location.search
      )}`,
      { replace: true }
    );
  const goHome = () => nav(`/`, { replace: true });
  const goCampaigns = () => nav(`/search`, { replace: true });

  if (state.ok === true) return children;

  return (
    <>
      {state.ok === null && (
        <div className="grid min-h-[40vh] place-items-center">
          <div className="flex items-center gap-3 rounded-2xl border border-stone-200/60 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-stone-700/60 dark:bg-stone-900/50">
            <span className="inline-block h-2 w-2 animate-ping rounded-full bg-sky-500" />
            <span className="text-sm text-stone-600 dark:text-stone-300">
              접근 권한 확인 중…
            </span>
          </div>
        </div>
      )}

      <GateModal
        open={!!state.gate}
        onClose={goHome}
        type={state.gate?.type}
        message={state.gate?.message}
        goLogin={goLogin}
        goHome={goHome}
        goCampaigns={goCampaigns}
      />
    </>
  );
}

function GateModal({
  open,
  onClose,
  type = "error",
  message,
  goLogin,
  goHome,
  goCampaigns,
}) {
  const overlayRef = useRef(null);
  const initialRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!open) return;
    setMounted(true);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    initialRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev && prev.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  // 상태 코드 → 제목 / 설명 매핑
  const titleMap = {
    unauth: "로그인이 필요합니다",
    CAMAPP_PENDING: "승인 대기 중입니다",
    CAMAPP_REJECTED: "리뷰어 신청이 탈락되었습니다",
    forbidden: "권한이 없습니다",
    error: "오류가 발생했습니다",
  };

  const descMap = {
    unauth: "신청을 위해 먼저 로그인해 주세요.",
    CAMAPP_PENDING: "승인 완료 후 리뷰 등록이 가능합니다.",
    CAMAPP_REJECTED: "해당 캠페인 리뷰 등록 권한이 없습니다.",
    forbidden: "리뷰어 전용 페이지입니다.",
    error: "접근할 수 없는 페이지입니다.",
  };

  const title = titleMap[type] || "알 수 없는 상태";
  const desc = (message ?? descMap[type]) || "관리자에게 문의하세요.";

  const iconTone =
    type === "unauth"
      ? "bg-sky-100 text-sky-600 dark:bg-sky-950/50 dark:text-sky-300"
      : type === "CAMAPP_PENDING"
      ? "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300"
      : type === "CAMAPP_REJECTED"
      ? "bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300"
      : type === "forbidden"
      ? "bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300"
      : "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300";

  const baseBtn =
    "inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-stone-900";

  const Primary = ({ children, ...props }) => (
    <button
      ref={initialRef}
      className={`${baseBtn} bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-400`}
      {...props}
    >
      {children}
    </button>
  );
  const Secondary = ({ children, ...props }) => (
    <button
      className={`${baseBtn} border border-stone-300 bg-white text-stone-800 hover:bg-stone-50 focus:ring-stone-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800`}
      {...props}
    >
      {children}
    </button>
  );

  // 상태별 버튼 구성
  let actions;
  if (type === "unauth") {
    actions = (
      <div className="mt-4 flex gap-2">
        <Primary onClick={goLogin}>
          <FiLogIn className="mr-2" />
          로그인 하기
        </Primary>
        <Secondary onClick={goHome}>
          <FiHome className="mr-2" />
          홈으로
        </Secondary>
      </div>
    );
  } else if (type === "CAMAPP_PENDING") {
    actions = (
      <div className="mt-4 flex gap-2">
        <Secondary onClick={goHome}>홈으로</Secondary>
      </div>
    );
  } else if (type === "CAMAPP_REJECTED" || type === "forbidden") {
    actions = (
      <div className="mt-4 flex gap-2">
        <Primary onClick={goHome}>
          <FiHome className="mr-2" />
          홈으로
        </Primary>
        <Secondary onClick={goCampaigns}>캠페인 둘러보기</Secondary>
      </div>
    );
  } else {
    actions = (
      <div className="mt-4 flex gap-2">
        <Primary onClick={goHome}>
          <FiHome className="mr-2" />
          홈으로
        </Primary>
      </div>
    );
  }

  return createPortal(
    <div>
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="gate-title"
        aria-describedby="gate-desc"
        ref={overlayRef}
        className={`fixed inset-x-4 top-[15vh] z-50 mx-auto max-w-md rounded-3xl border border-stone-200/70 bg-white/80 p-5 shadow-2xl backdrop-blur-xl transition-all duration-200 dark:border-stone-700/60 dark:bg-stone-900/70 ${
          mounted
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-3 scale-[0.98]"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`grid h-11 w-11 place-items-center rounded-2xl ${iconTone}`}
          >
            <FiAlertCircle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3
              id="gate-title"
              className="text-lg font-semibold text-stone-900 dark:text-stone-100"
            >
              {title}
            </h3>
            <p
              id="gate-desc"
              className="mt-1 text-sm text-stone-600 dark:text-stone-300"
            >
              {desc}
            </p>
            {actions}
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="rounded-xl p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-800 dark:hover:bg-stone-800"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
