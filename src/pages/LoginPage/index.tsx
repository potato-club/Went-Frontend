import styled from 'styled-components';
import googleImg from '../../asset/googleIcon.png';
import kakaoImg from '../../asset/kakaoIcon.png';
import Button from '../../components/Button';
import LoginPageBody from '../../components/LoginPageBody';
import LoginPageWrapper from '../../components/LoginPageWrapper';
import {
  Title,
  SubTitle,
  DescriptionBox,
  ChangedComponent,
} from '../../styles/LayoutStyles';
import { ButtonBox } from '../../styles/FormStyles';
import { useCustomKakaoLogin } from '../../hooks/useCustomKakaoLogin';
import { useCustomGoogleLogin } from '../../hooks/useCustomGoogleLogin';

function LoginPage() {
  const handleGoogleLogin = useCustomGoogleLogin(); // 훅 호출

  return (
    <LoginPageWrapper>
      <Title>(), 다녀왔습니다.</Title>
      <LoginPageBody>
        <SubTitle>로그인/회원가입</SubTitle>
        <ChangedComponent>
          <DescriptionBox>아래의 로그인 방식으로 함께 하세요.</DescriptionBox>

          <ImageBoxWrapper>
            <ImageBox onClick={(e) => handleGoogleLogin()}>
              <img alt='구글 로그인' src={googleImg} />
              <span>{'구글\n로그인'}</span>
            </ImageBox>
            <ImageBox onClick={useCustomKakaoLogin}>
              <img alt='카카오 로그인' src={kakaoImg} />
              <span>{'카카오\n로그인'}</span>
            </ImageBox>
          </ImageBoxWrapper>
        </ChangedComponent>
      </LoginPageBody>

      <ButtonBox>
        <Button>메인 페이지로 이동하기</Button>
      </ButtonBox>
    </LoginPageWrapper>
  );
}

const ImageBoxWrapper = styled.div`
  height: 100%;
  display: flex;
  gap: 80px;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`;

const ImageBox = styled.div`
  width: 80px;
  white-space: pre-wrap;
  display: flex;
  flex-direction: column;
  gap: 15px;
  cursor: pointer;

  span {
    text-align: center;
  }
`;

export default LoginPage;
