import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import styled from 'styled-components';

function App() {
  return (
    <AppWrapper>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </AppWrapper>
  );
}

const AppWrapper = styled.div`
  background-color: #f8f5f2;
  height: 100vh;
`;

export default App;
