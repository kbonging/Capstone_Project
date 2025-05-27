// import './App.css';
// import Header from './components/Header';
// import CardSection from './components/CardSection';

// const premiumCards = Array.from({ length: 4 }).map(() => ({}));
// const popularCards = Array.from({ length: 4 }).map(() => ({}));
// const hotCards = Array.from({ length: 4 }).map(() => ({}));

// function App() {
//   return (
//     <>
//       <Header />
//       <CardSection title="프리미엄 체험단" data={premiumCards} />  {/* useEfect 로 서버 요청후 json 데이터 집어넣으세요  */}
//       <CardSection title="인기 체험단" data={popularCards} />     {/* useEfect 로 서버 요청후 json 데이터 집어넣으세요  */}
//       <CardSection title="마감임박 체험단" data={hotCards} />          {/* useEfect 로 서버 요청후 json 데이터 집어넣으세요  */}
//       <CardSection title="신규 체험단" data={hotCards} />          {/* useEfect 로 서버 요청후 json 데이터 집어넣으세요  */}
//     </>
//   );
// }

// export default App;


// src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider }    from './contexts/AppContext';
import Header             from './components/Header';
import Main               from './components/Main';
import Footer             from './components/Footer';
import AppRouter          from './routes/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Header />
        <Main>
          <AppRouter />
        </Main>
        <Footer />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
