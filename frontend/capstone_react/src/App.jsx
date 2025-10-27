// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import AppRouter from "./routes/AppRouter";
import ThemeProvider from "./theme/ThemeProvider";
import ThemeToggleFab from "./components/ThemeToggleFab";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatbotLauncher from "./components/chatbot/ChatbotLauncher";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
        <AppProvider>
         <ThemeProvider>
            <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 transition-colors">
             <Header />
              <Main>
                <AppRouter />
             </Main>
            <Footer />

              <div className="fixed bottom-20 right-5 flex flex-col gap-3 items-end rounded-full bg-white   dark:bg-zinc-800  shadow-sm">
                {/* <ChatbotIcon size={44} className="cursor-pointer" /> */}
                 <ChatbotLauncher />
               <ThemeToggleFab /> 
             </div>
            </div>
         </ThemeProvider>
        </AppProvider>
      </BrowserRouter>
  );
}

export default App;
