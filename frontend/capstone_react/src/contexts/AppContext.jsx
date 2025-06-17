// src/contexts/AppContext.jsx
import React, { createContext, useState, useEffect, useMemo } from 'react';
import { fetchUser } from '../api/authApi';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  // 페이지 로딩 시 사용자 정보를 받아올때까지 지연시키기 위해 만듦
  const [loading, setLoading] = useState(true);

  // 🔽 초기 마운트 시 토큰이 있으면 사용자 정보 불러오기
  useEffect(() => {
    if (token && !user) {
      fetchUser(token)
        .then((userData) => {
          console.log(userData);
          setUser(userData);
        })
        .catch((err) => {
          console.error("유저 정보 조회 실패:", err.message);
          setToken(null);
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false); // ✅ 무조건 로딩 끝 표시
        });
    }else{
      setLoading(false); // ✅ 토큰 없거나 이미 유저 있으면 로딩 종료
    }
  }, [token, user]);

  //console.log(user);

  const isAdmin = useMemo(() => {
    return user?.authDTOList?.some(auth => auth.auth === 'ROLE_ADMIN') ?? false;
  }, [user]);
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    // 필요하면 페이지 이동도 처리
  };

  return (
    <AppContext.Provider value={{ user, setUser, token, setToken, logout, loading, isAdmin }}>
      {children}
    </AppContext.Provider>
  );
}
