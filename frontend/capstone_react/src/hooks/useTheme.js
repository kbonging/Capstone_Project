// src/theme/useTheme.js
import { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'theme'; // 'light' | 'dark' | 'system'

export function useTheme() {
  const [mode, setMode] = useState(() =>
    localStorage.getItem(STORAGE_KEY) || 'system'
  );

  const apply = useCallback((nextMode) => {
    const root = document.documentElement; // <html>
    // system 모드일 땐 시스템 설정을 읽어서 적용
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const effectiveDark = nextMode === 'dark' || (nextMode === 'system' && isSystemDark);

    root.classList.toggle('dark', effectiveDark);
    // iOS/모바일 깜빡임 최소화용 색상스킴 힌트
    root.style.colorScheme = effectiveDark ? 'dark' : 'light';
  }, []);

  useEffect(() => {
    apply(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode, apply]);

  // 시스템 모드 변화 실시간 반영
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => mode === 'system' && apply('system');
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [mode, apply]);

  return { mode, setMode };
}
