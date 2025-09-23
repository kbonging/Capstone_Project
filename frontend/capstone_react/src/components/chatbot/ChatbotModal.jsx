import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function ChatbotModal({ open, onClose, children }) {
  const overlayRef = useRef(null);
  const firstFocusRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setTimeout(() => firstFocusRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  return createPortal(
    <div
      ref={overlayRef}
      onClick={onOverlayClick}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-[1px]"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full sm:w-[420px] md:w-[480px] lg:w-[520px] max-h-[85vh] sm:rounded-2xl overflow-hidden shadow-2xl 
                   bg-white dark:bg-zinc-900 ring-1 ring-black/5 dark:ring-white/10
                   animate-[fadeIn_150ms_ease-out]"
        tabIndex={-1}
        ref={firstFocusRef}
      >
        {children}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px);} to { opacity: 1; transform: translateY(0);} }
      `}</style>
    </div>,
    document.body
  );
}
