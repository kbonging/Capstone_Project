// src/contexts/AppContext.jsx
import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUser } from '../api/authApi';
import axios from 'axios';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0); // 🔹 읽지 않은 알림 카운트
  const navigate = useNavigate();

  // 로그인 시 유저 정보 + 알림 개수 불러오기
  useEffect(() => {
    const loadUserAndNotifications = async () => {
      if (!token) {
        setLoading(false);
        setUnreadCount(0);
        return;
      }

      try {
        // 1️⃣ 사용자 정보
        const userData = await fetchUser(token);
        setUser(userData);

        // 2️⃣ 읽지 않은 알림 개수
        const res = await axios.get('/api/notifications/count', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUnreadCount(res.data.unreadCount ?? 0);
      } catch (err) {
        console.error("유저 또는 알림 조회 실패:", err);
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        setUnreadCount(0);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndNotifications();
  }, [token]);

  const isAdmin = useMemo(() => {
    return user?.authDTOList?.some(auth => auth.auth === 'ROLE_ADMIN') ?? false;
  }, [user]);

  const logout = () => {
    setUser(null);
    setToken(null);
    setUnreadCount(0);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        logout,
        loading,
        isAdmin,
        unreadCount,
        setUnreadCount, // 🔹 알림 처리 후 갱신 가능
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
