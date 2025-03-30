import styled from 'styled-components';

const LoginPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 380px;
  height: 100vh; /* 전체 화면 높이 */
  min-height: 750px;
  margin: 0 auto;
  padding: 0 30px;
  justify-content: center;
  max-width: 100%; /* 화면 크기가 작을 때 대응 */
  gap: 40px;
  position: relative;
`;

export default LoginPageWrapper;
