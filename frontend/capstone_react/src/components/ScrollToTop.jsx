import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 라우트가 바뀔 때마다 페이지 최상단으로 스크롤
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
