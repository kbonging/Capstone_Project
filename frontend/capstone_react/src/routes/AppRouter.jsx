import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CommunityPage from "../pages/CommunityPage";
import CommunityDetailPage from "../pages/CommunityDetailPage";
import LoginPage from "../pages/LoginPage";
import CommunityForm from "../components/community/CommunityForm";
import PrivateRoute from "./PrivateRoute";
import SignUpPage from "../pages/SignUpSelectPage";
import ReviewerFormPage from "../pages/ReviewerFormPage";
import OwnerFormPage from "../pages/OwnerFormPage";
import FindPwd from "../pages/FindPwdPage";
import FindId from "../pages/FindIdPage";
import MyPage     from '../pages/MyPage';
import ProfileManagePage from '../pages/ProfileManagePage';

// 안쓰는거 삭제 및 나중에 사용할거면 주석좀 해주세요.

// import SearchPage from '../pages/SearchPage';
// import Support    from '../pages/Support';
// import Events     from '../pages/Events';
// import SignupPage from '../pages/SignupPage';


export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* 비로그인시 접근을 막기 위해 PrivateRoute로 감쌉니다. */}
      <Route path="/community" element={
        <PrivateRoute>
          <CommunityPage/>
        </PrivateRoute>} 
      />
      {/* 게시글 등록 */}
      <Route path="/community/write" element={
        <PrivateRoute>
          <CommunityForm mode="create"/>
        </PrivateRoute>} 
      />
      {/* 게시글 수정 */}
      <Route path="/community/edit/:communityIdx" element={
        <PrivateRoute>
          <CommunityForm mode="edit" />
        </PrivateRoute>
      } />
      {/* 게시글 상세 페이지 */}
      <Route path="/community/:communityIdx" element={
        <PrivateRoute>
          <CommunityDetailPage />
        </PrivateRoute>} 
      />

      
      {/* <Route path="/search"     element={<SearchPage />} /> */}
      {/* <Route path="/support"    element={<Support    />} /> */}
      {/* <Route path="/events"     element={<Events     />} /> */}
      <Route path="/signup"     element={<SignUpPage />} />
      <Route path="/signup/Owner" element={<OwnerFormPage />} />
      <Route path="/signup/reviewer" element={<ReviewerFormPage />} />
      <Route path="/FindPwd" element={<FindPwd />} />
      <Route path="/FindId" element={<FindId />} />
      <Route path="/mypage"     element={<MyPage />} />
      <Route path="/mypage/manage" element={<ProfileManagePage />} />
      {/* 404 페이지도 추가 가능  나중에 할거임*/}
    </Routes>
  );
}
