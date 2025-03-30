import styled from 'styled-components';
import googleImg from '../../asset/googleIcon.png';
import kakaoImg from '../../asset/kakaoIcon.png';
import Button from '../../components/Button';
import LoginPageBody from '../../components/LoginPageBody';
import LoginPageWrapper from '../../components/LoginPageWrapper';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import {
  Title,
  SubTitle,
  DescriptionBox,
  ChangedComponent,
} from '../../styles/LayoutStyles';
import { ButtonBox } from '../../styles/FormStyles';

function LoginPage() {
  const { step } = useParams();

  const navigate = useNavigate();

  const { signUpData, setSignUpData, cleanedSignUpData } = useAuth();

  const login = useGoogleLogin({
    flow: 'implicit', // 또는 'auth-code'로 설정 가능
    onSuccess: async (tokenResponse) => {
      const { access_token } = tokenResponse;

      // 구글 유저 정보 요청
      const userInfoRes = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const userInfo = await userInfoRes.json();
      console.log('구글 유저 정보:', userInfo);

      setSignUpData((prev) => ({
        ...prev,
        socialKey: userInfo.sub,
        email: userInfo.email,
      }));

      // // 백엔드 유저 확인
      // const res = await fetch('/api/auth/check', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ socialKey: userInfo.sub }),
      // });

      // const { exists } = await res.json();
      console.log('loginPage signUpData : ', signUpData);
      console.log('loginPage cleanedSignUpData : ', cleanedSignUpData);
      navigate(false ? '/' : '/signUp/1');
    },
    onError: () => console.log('구글 로그인 실패'),
  });

  return (
    <LoginPageWrapper>
      <Title>(), 다녀왔습니다.</Title>

      <LoginPageBody>
        <SubTitle>로그인/회원가입</SubTitle>
        <ChangedComponent>
          <DescriptionBox>아래의 로그인 방식으로 함께 하세요.</DescriptionBox>

          <ImageBoxWrapper>
            <ImageBox onClick={() => login()}>
              <img alt='구글 로그인' src={googleImg} />
              <span>{'구글\n로그인'}</span>
            </ImageBox>
            <ImageBox>
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
  /* padding: 20px 0; */
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
