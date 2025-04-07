import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';
import SignUpPage from './pages/SignUpPage';
import ExistUserPage from './pages/ExistUserPage';
import KakaoRedirectPage from './pages/KakaoRedirectPage';
import MyPage from './pages/MyPage/Mypage';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <AppWrapper>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/auth/kakao/callback' element={<KakaoRedirectPage />} />
        <Route path='/signUp/:step' element={<SignUpPage />} />
        <Route path='/welcome' element={<WelcomePage />} />
        <Route path='/existUser' element={<ExistUserPage />} />
        {/* 헤더를 포함하는 페이지 */}
        <Route element={<Layout/>}>
        <Route path='/mypage' element={<MyPage />} />
        </Route>
      </Routes>
    </AppWrapper>
  );
}

const AppWrapper = styled.div`
  /* background-color: #f8f5f2; */
  display: flex;
  height: 100%;
`;

export default App;
