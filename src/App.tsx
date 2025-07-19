import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import Layout from './components/Layout/Layout';
import ExistUserPage from './pages/ExistUserPage';
import KakaoRedirectPage from './pages/KakaoRedirectPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage/MainPage';
import MyPage from './pages/MyPage/Mypage';
import ReviewList from './pages/ReviewListPage/ReviewList';
import SignUpPage from "./pages/SignUpPage";
import WelcomePage from './pages/WelcomePage';
import WritePage from "./pages/WritePage";
function App() {
  return (
    <AppWrapper>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth/kakao/callback" element={<KakaoRedirectPage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/existUser" element={<ExistUserPage />} />
        {/* 헤더를 포함하는 페이지 */}
        <Route element={<Layout />}>
          <Route path='/' element={<MainPage />} />
          <Route path='/mypage' element={<MyPage />} />
          <Route path='/reviewlist' element={<ReviewList />} />
          <Route path="/write" element={<WritePage />} />
        </Route>
      </Routes>
    </AppWrapper>
  );
}

const AppWrapper = styled.div``;

export default App;
