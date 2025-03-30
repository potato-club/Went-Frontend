import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <AppWrapper>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signUp/:step' element={<SignUpPage />} />
        <Route path='/welcome' element={<WelcomePage />} />
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
