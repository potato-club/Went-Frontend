import styled from 'styled-components';
import googleImg from '../../asset/googleImg.png';
import kakaoImg from '../../asset/kakaoImg.png';
import Button from '../../components/Button';
import LoginPageBody from '../../components/LoginPageBody';
import LoginPageWrapper from '../../components/LoginPageWrapper';
import {
  Title,
  SubTitle,
  DescriptionBox,
  ChangedComponent,
  Img,
} from '../../styles/LayoutStyles';
import { ButtonBox } from '../../styles/FormStyles';
import { useCustomKakaoLogin } from '../../hooks/useCustomKakaoLogin';
import { useCustomGoogleLogin } from '../../hooks/useCustomGoogleLogin';

function LoginPage() {
  const handleGoogleLogin = useCustomGoogleLogin(); // 훅 호출

  return (
    <FullPageWrapper>
      <LoginPageWrapper>
        <Title>(), 다녀왔습니다.</Title>
        <DescriptionBox>아래의 로그인 방식으로 함께 하세요</DescriptionBox>

        <LoginPageBody>
          {/* <ChangedComponent> */}
          <ImageBoxWrapper>
            {/* <ImageBox onClick={useCustomKakaoLogin}> */}
            <Img alt='카카오 로그인' src={kakaoImg} />
            {/* </ImageBox> */}
            {/* <ImageBox onClick={(e) => handleGoogleLogin()}> */}
            <Img alt='구글 로그인' src={googleImg} />
            {/* </ImageBox> */}
          </ImageBoxWrapper>
          {/* </ChangedComponent> */}
        </LoginPageBody>

        <ButtonBox>
          <Button>메인 페이지로 이동하기</Button>
        </ButtonBox>
      </LoginPageWrapper>
    </FullPageWrapper>
  );
}

const ImageBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  padding: 70px 0;
  /* padding-top: 20px; */
  border-bottom: 1px solid #e2e2e2;
`;

const ImageBox = styled.div`
  width: 100%;
  white-space: pre-wrap;
  display: flex;
  flex-direction: column;
  gap: 15px;
  cursor: pointer;

  span {
    text-align: center;
  }
`;

const FullPageWrapper = styled.div`
  display: flex;
  align-items: center; /* 세로 중앙 */
  height: 100vh; /* 화면 전체 높이 */
  margin: 0 auto; /* 수평 중앙 */
`;

export default LoginPage;
