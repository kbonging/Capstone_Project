// src/routes/RequireReviewer.jsx
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { fetchUser } from "../api/authApi"; // /api/members/info
import { getReviewAccess, HttpError } from "../api/campaigns/api"; // /api/campaigns/:id/reviews/access
import { FiAlertCircle, FiX } from "react-icons/fi";

/**
 * RequireReviewer
 * - 로그인 + 역할(ROLE_USER or ROLE_ADMIN) 확인
 * - requireApproved=true 인 경우, 캠페인별 승인 상태까지 확인(APPROVED / PENDING / REJECTED)
 *
 * 사용 예시:
 *  // 신청 페이지(승인검사 X)
 *  <RequireReviewer>
 *    <ApplyPage />
 *  </RequireReviewer>
 *
 *  // 리뷰 제출 페이지(승인검사 O)
 *  <RequireReviewer requireApproved>
 *    <ReviewSubmitPage />
 *  </RequireReviewer>
 */
export default function RequireReviewer({ children, requireApproved = false }) {
  const { campaignId: fromCampaignId, id: fromId } = useParams();
  const campaignId = fromCampaignId ?? fromId; // :campaignId 또는 :id 모두 지원
  const nav = useNavigate();
  const location = useLocation();

  const [state, setState] = useState({ ok: null, gate: null });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // 0) 토큰 확인
        const token = localStorage.getItem("token") || "";
        console.debug("[RR] start", { requireApproved, path: location.pathname, hasToken: !!token });

        if (!token) {
          if (!alive) return;
          setState({ ok: false, gate: { type: "unauth" } });
          console.debug("[RR] early return: no token");
          return;
        }

        // 1) 역할 확인
        const me = await fetchUser(token);
        if (!alive) return;

        const roles = new Set(
          (me?.authDTOList ?? []).map((a) => String(a?.auth || "").toUpperCase())
        );
        const isReviewer = roles.has("ROLE_USER");
        const isAdmin = roles.has("ROLE_ADMIN");

        console.debug("[RR] roles", { roles: Array.from(roles), isReviewer, isAdmin });

        if (!(isReviewer || isAdmin)) {
          setState({
            ok: false,
            gate: { type: "forbidden", message: "리뷰어 전용 페이지입니다." },
          });
          console.debug("[RR] early return: not reviewer/admin");
          return;
        }

        // 2) 승인 검사가 필요 없는 페이지(신청 등) 또는 관리자면 바로 통과
        if (!requireApproved || isAdmin) {
          setState({ ok: true, gate: null });
          console.debug("[RR] pass without access check", { requireApproved, isAdmin });
          return;
        }

        // 3) 승인 검사(리뷰 제출 페이지 등에서만 실행)
        console.debug("[RR] calling getReviewAccess", { campaignId });
        const r = await getReviewAccess(campaignId, token);
        if (!alive) return;
        console.debug("[RR] getReviewAccess response", r);

        const norm = (v) => (typeof v === "string" ? v.toUpperCase() : v);

        // 명시적 승인 키워드
        const OK_SET = new Set(["CAMAPP_APPROVED", "APPROVED", "ALLOW", "ALLOWED", "OK", true, "Y"]);

        // 대기/거절 (부분일치 허용)
        const PENDING_HINTS = ["PENDING", "WAIT", "HOLD", "IN_REVIEW", "UNDER_REVIEW"];
        const REJECT_HINTS  = ["REJECT", "DENY", "DECLINE", "FAIL", "BLOCK"];

        const status  = norm(r?.status);
        const allowed = norm(r?.allowed);

        // ✅ 명시적 승인만 통과 (200 빈 {}는 더이상 승인 취급 X)
        //    204를 승인으로 쓰고 싶다면 getReviewAccess에서 {approved:true}로 변환 후 아래 라인 유지
        const approved =
          OK_SET.has(status) ||
          OK_SET.has(allowed) ||
          r?.approved === true; // (선택) 204 대응용. 래퍼에서 세팅 시에만 true

        const isPending =
          typeof status === "string" && PENDING_HINTS.some((s) => status.includes(s));
        const isRejected =
          typeof status === "string" && REJECT_HINTS.some((s) => status.includes(s));

        if (approved) {
          setState({ ok: true, gate: null });
        } else if (isPending) {
          setState({ ok: false, gate: { type: "CAMAPP_PENDING", message: r?.message } });
        } else if (isRejected) {
          setState({ ok: false, gate: { type: "CAMAPP_REJECTED", message: r?.message } });
        } else {
          setState({
            ok: false,
            gate: { type: "forbidden", message: r?.message || "리뷰어 전용 페이지입니다." },
          });
        }
      } catch (e) {
        if (!alive) return;
        console.debug("[RR] error", e);

        if (e instanceof HttpError) {
          if (e.status === 200) {
            setState({ ok: true, gate: null });
            return;
          }
          if (e.status === 401) {
            setState({ ok: false, gate: { type: "unauth" } });
            return;
          }
          if (e.status === 403) {
            // 서버가 본문 status를 다양한 문자열로 줄 수 있으므로 넓게 매핑
            const codeRaw = e.body?.status ?? "FORBIDDEN";
            const code = String(codeRaw).toUpperCase();

            const isPending =
              ["PENDING", "WAIT", "HOLD", "IN_REVIEW", "UNDER_REVIEW"].some((s) =>
                code.includes(s)
              );
            const isRejected =
              ["REJECT", "DENY", "DECLINE", "FAIL", "BLOCK"].some((s) => code.includes(s));

            setState({
              ok: false,
              gate: {
                type: isPending ? "CAMAPP_PENDING" : isRejected ? "CAMAPP_REJECTED" : "forbidden",
                message: e.body?.message,
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
  }, [campaignId, location.pathname, location.search, requireApproved]);

  const goLogin = () =>
    nav(
      `/login?redirect=${encodeURIComponent(location.pathname + location.search)}`,
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
            <span className="text-sm text-stone-600 dark:text-stone-300">접근 권한 확인 중…</span>
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

function GateModal({ open, onClose, type = "error", message, goLogin, goHome, goCampaigns }) {
  const initialRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) setMounted(true);
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

  const titleMap = {
    unauth: "로그인이 필요합니다",
    CAMAPP_PENDING: "승인 대기 중입니다",
    CAMAPP_REJECTED: "리뷰어 신청이 탈락되었습니다",
    forbidden: "권한이 없습니다",
    error: "오류가 발생했습니다",
  };

  const descMap = {
    unauth: "신청/등록을 위해 먼저 로그인해 주세요.",
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
      : type === "CAMAPP_REJECTED" || type === "forbidden"
      ? "bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300"
      : "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300";

  const baseBtn =
    "inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-stone-900";
  const Primary = (p) => (
    <button
      ref={initialRef}
      className={`${baseBtn} bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-400`}
      {...p}
    />
  );
  const Secondary = (p) => (
    <button
      className={`${baseBtn} border border-stone-300 bg-white text-stone-800 hover:bg-stone-50 focus:ring-stone-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800`}
      {...p}
    />
  );

  let actions;
  if (type === "unauth") {
    actions = (
      <div className="mt-4 flex gap-2">
        <Primary onClick={goLogin}>로그인 하기</Primary>
        <Secondary onClick={goHome}>홈으로</Secondary>
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
        <Primary onClick={goHome}>홈으로</Primary>
        <Secondary onClick={goCampaigns}>캠페인 둘러보기</Secondary>
      </div>
    );
  } else {
    actions = (
      <div className="mt-4 flex gap-2">
        <Primary onClick={goHome}>홈으로</Primary>
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
        className={`fixed inset-x-4 top-[15vh] z-50 mx-auto max-w-md rounded-3xl border border-stone-200/70 bg-white/80 p-5 shadow-2xl backdrop-blur-xl transition-all duration-200 dark:border-stone-700/60 dark:bg-stone-900/70 ${
          mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-[0.98]"
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`grid h-11 w-11 place-items-center rounded-2xl ${iconTone}`}>
            <FiAlertCircle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">{title}</h3>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{desc}</p>
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
