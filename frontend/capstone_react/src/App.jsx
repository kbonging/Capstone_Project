// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import Header from "./components/Header"; // 경로 그대로 사용
import Main from "./components/Main";
import Footer from "./components/Footer";
import AppRouter from "./routes/AppRouter";
import ThemeProvider from "./theme/ThemeProvider";
import ThemeToggleFab from "./components/ThemeToggleFab";

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        {/* 테마 프로바이더로 감싸서 전역 다크 라이트 모드 적용 */}
        <ThemeProvider>
          {/* 메인 바깥쪽 다크모드 적용 */}
          <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 transition-colors">
            <Header />
            <Main>
              <AppRouter />
            </Main>
            <Footer />
            {/* 라이트모드 다크모드 버튼 */}
            <ThemeToggleFab />
          </div>
        </ThemeProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
