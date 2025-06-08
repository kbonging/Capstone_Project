import React, {
  useContext,
} from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";

function PrivateRoute({ children }) {
  const { user, loading } =
    useContext(AppContext);

  if (loading) {
    // 유저 정보를 불러오는 중이면 대기 화면 (또는 스피너)
    return (
      <div className="min-h-[100vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-blue-200 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    // 로그인이 안 되어 있으면 로그인 페이지로 리디렉션
    return (
      <Navigate to="/login" replace />
    );
  }

  // 로그인이 되어 있으면 해당 children(페이지 컴포넌트) 렌더링
  return children;
}

export default PrivateRoute;
