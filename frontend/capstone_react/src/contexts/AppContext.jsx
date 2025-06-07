// src/contexts/AppContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { fetchUser } from '../api/authApi';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

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
        });
    }
  }, [token, user]);

  //console.log(user);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    // 필요하면 페이지 이동도 처리
  };

  return (
    <AppContext.Provider value={{ user, setUser, token, setToken, logout }}>
      {children}
    </AppContext.Provider>
  );
}
