import styled from 'styled-components';
import googleImg from '../../asset/googleIcon.png';
import kakaoImg from '../../asset/kakaoIcon.png';
import Button from '../../components/Button';
import LoginPageBody from '../../components/LoginPageBody';
import LoginPageWrapper from '../../components/LoginPageWrapper';
import { useNavigate } from 'react-router-dom';
import { SignUpData, useAuth } from '../../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useEffect } from 'react';

function LoginPage() {
  const navigate = useNavigate();

  const { signUpData, setSignUpData } = useAuth();

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
      console.log(signUpData);
      navigate(false ? '/' : '/signUp/1');
    },
    onError: () => console.log('구글 로그인 실패'),
  });

  // const handleGoogleLogin = async () => {
  //   const token = await getGoogleToken(); // 실제 구현 필요
  //   setToken(token);

  //   // 백엔드에서 유저 존재 확인
  //   const userExists = await checkUserExists(token); // 실제 구현 필요
  //   if (!userExists) navigate('/signUp/1');
  //   else navigate('/'); // 메인페이지 등
  // };

  return (
    <LoginPageWrapper>
      <Title>(), 다녀왔습니다.</Title>
      <SubTitle>로그인/회원가입</SubTitle>

      <LoginPageBody>
        <DescriptionBox>아래의 로그인 방식으로 함께 하세요.</DescriptionBox>

        <ImageBoxWrapper>
          <ImageBox onClick={() => login()}>
            <Img alt='구글 로그인' src={googleImg} />
            <span>{'구글\n로그인'}</span>
          </ImageBox>
          <ImageBox>
            <Img alt='카카오 로그인' src={kakaoImg} />
            <span>{'카카오\n로그인'}</span>
          </ImageBox>
        </ImageBoxWrapper>
      </LoginPageBody>

      <Button>메인 페이지로 이동하기</Button>
    </LoginPageWrapper>
  );
}

const Title = styled.div`
  margin-top: 80px;
  font-size: 40px;
`;

const SubTitle = styled.div`
  margin: 65px 0 100px 0;
  font-size: 35px;
`;

const DescriptionBox = styled.div`
  width: 100%;
  height: 40px;
  border-bottom: 3px solid #c6c4c2;
  text-align: center;
  display: flex;
  flex-direction: column;
  font-size: 20px;
  padding-bottom: 10px;
  white-space: pre-wrap;
`;

const ImageBoxWrapper = styled.div`
  height: 100%;
  display: flex;
  gap: 80px;
  /* justify-content: space-between; */
  align-items: center;
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

const Img = styled.img``;

export default LoginPage;
