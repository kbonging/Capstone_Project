import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
// import SearchPage from '../pages/SearchPage';
import CommunityPage from "../pages/CommunityPage";
import CommunityDetailPage from "../pages/CommunityDetailPage";
// import Support    from '../pages/Support';
// import Events     from '../pages/Events';
import LoginPage from "../pages/LoginPage";
// import SignupPage from '../pages/SignupPage';
// import MyPage     from '../pages/MyPage';
import CommunityForm from "../components/community/CommunityForm";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* <Route path="/search"     element={<SearchPage />} /> */}
      <Route path="/community" element={<CommunityPage />} />
      {/* <Route path="/support"    element={<Support    />} /> */}
      {/* <Route path="/events"     element={<Events     />} /> */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/community/:communityIdx" element={<CommunityDetailPage />} />
      <Route path="/community/write" element={<CommunityForm mode="create"/>} />
      {/* <Route path="/signup"     element={<SignupPage />} /> */}
      {/* <Route path="/mypage"     element={<MyPage     />} /> */}
      {/* 404 페이지도 추가 가능  나중에 할거임*/}
    </Routes>
  );
}
