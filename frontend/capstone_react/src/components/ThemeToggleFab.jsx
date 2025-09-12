// src/components/ThemeToggleFab.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { useThemeCtx } from '../theme/ThemeProvider';
import { FiMoon, FiSun } from 'react-icons/fi';

/**
 * 요구사항
 * - 라벨 없음
 * - 동일 크기(44x44) 원형 버튼이 일정 간격으로 위로 펼쳐짐
 * - 다크 모드 배경은 너무 어둡지 않게 (zinc-700 + 75% 투명)
 * - 선택한 모드에 따라 FAB 아이콘이 즉시 바뀜
 */
export default function ThemeToggleFab() {
  const { mode, setMode } = useThemeCtx(); // mode 추가
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  // 시스템 모드일 때 OS 테마 변화도 반영하기 위한 상태
  const [systemPrefersDark, setSystemPrefersDark] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false
  );

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => setSystemPrefersDark(e.matches);

    // 시스템 모드일 때만 리스너 활성화 (불필요한 렌더 방지)
    if (mode === 'system') {
      mql.addEventListener('change', onChange);
      setSystemPrefersDark(mql.matches);
    }
    return () => mql.removeEventListener('change', onChange);
  }, [mode]);

  // FAB에 표시할 아이콘: 현재 적용될 "실제" 다크 여부
  const isEffectiveDark = useMemo(() => {
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    // 'system'일 때는 OS 선호도
    return systemPrefersDark;
  }, [mode, systemPrefersDark]);

  // 버튼 간격과 크기
  const STEP = 56; // 버튼 간격(= 버튼 44 + 여백 12)
  const SIZE = 44; // 버튼 크기(px)

  // 바깥 클릭 닫기
  useEffect(() => {
    function onDocClick(e) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  // ESC 닫기
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // 공통 원형 버튼
  const circleBtn =
    [
      'inline-flex items-center justify-center rounded-full border shadow-md hover:shadow-lg',
      'transition-all duration-200 ease-out',
      'backdrop-blur',
      // 라이트 모드
      'bg-white/90 border-zinc-200 text-zinc-800',
      // 다크 모드 (한 톤 밝게)
      'dark:bg-zinc-700/75 dark:border-zinc-600 dark:text-zinc-100',
      // 포커스 링
      'focus:outline-none focus:ring-2 focus:ring-sky-400',
    ].join(' ');

  const circleStyle = { width: SIZE, height: SIZE };

  return (
    <div ref={wrapRef} className="fixed bottom-5 right-5 z-50">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        {/* 옵션: 라이트 */}
        <button
          type="button"
          onClick={() => {
            setMode('light');
            setOpen(false);
          }}
          className={[
            'absolute right-0',
            circleBtn,
            open
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-90 pointer-events-none',
            'hover:bg-white/95 dark:hover:bg-zinc-700/85',
          ].join(' ')}
          style={{
            ...circleStyle,
            transform: open ? `translateY(-${STEP}px)` : 'translateY(0px)',
            transitionDelay: open ? '40ms' : '0ms',
          }}
          aria-hidden={!open}
          tabIndex={open ? 0 : -1}
          title="라이트 모드"
        >
          <FiSun />
        </button>

        {/* 옵션: 다크 */}
        <button
          type="button"
          onClick={() => {
            setMode('dark');
            setOpen(false);
          }}
          className={[
            'absolute right-0',
            circleBtn,
            open
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-90 pointer-events-none',
            'hover:bg-white/95 dark:hover:bg-zinc-700/85',
          ].join(' ')}
          style={{
            ...circleStyle,
            transform: open ? `translateY(-${STEP * 2}px)` : 'translateY(0px)',
            transitionDelay: open ? '80ms' : '0ms',
          }}
          aria-hidden={!open}
          tabIndex={open ? 0 : -1}
          title="다크 모드"
        >
          <FiMoon />
        </button>

        {/* FAB (토글) */}
        <button
          type="button"
          aria-label="테마 전환"
          onClick={() => setOpen((v) => !v)}
          className={[
            'absolute right-0 bottom-0',
            circleBtn,
            'hover:scale-105',
            open ? 'rotate-45' : 'rotate-0',
          ].join(' ')}
          style={circleStyle}
          title="테마 전환"
        >
          {/* 현재 적용 모드에 따라 아이콘 변경 */}
          {isEffectiveDark ? <FiMoon /> : <FiSun />}
        </button>
      </div>
    </div>
  );
}
