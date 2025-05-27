// src/contexts/AppContext.jsx
import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

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
