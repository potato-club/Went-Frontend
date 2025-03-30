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
import axios from 'axios';
import { findUser, registerUser } from '../../api/user'; // ✅ registerUser 추가

function LoginPage() {
  const { step } = useParams();
  const navigate = useNavigate();
  const { signUpData, setSignUpData, cleanedSignUpData } = useAuth();

  const login = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      const { access_token } = tokenResponse;

      try {
        const userInfoRes = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        const userInfo = userInfoRes.data;

        const newUserData = {
          socialKey: userInfo.sub?.trim() || '',
          email: userInfo.email?.trim() || '',
        };

        setSignUpData((prev) => ({
          ...prev,
          ...newUserData,
        }));

        try {
          const res = await findUser(newUserData);
          console.log('✅ 사용자 존재함:', res);
          // ✅ 누락된 정보가 있는 경우 → 추가 입력 페이지로 이동
          const hasMissingFields =
            !res.nickname ||
            !res.region ||
            !res.birthdate ||
            !res.categoryIds?.length;

          if (hasMissingFields) {
            console.log('❗ 누락된 정보 있음 → 회원가입 페이지로 이동');
            // setSignUpData((prev) => ({
            //   ...prev,
            //   ...res,
            //   categoryIds: (res.categoryIds ?? []).map(String), // string[]로 통일
            // }));
            navigate('/signUp/1');
          } else {
            // ✅ 모든 정보가 있다면 → 메인 페이지로 이동
            navigate('/');
          }
        } catch (err: any) {
          // ✅ 404인 경우 → 회원가입 시도
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            console.log('❗ 사용자 없음 → 자동 회원가입 시도');

            await registerUser({
              ...newUserData,
            });

            navigate('/signUp/1'); // 추가 정보 입력 페이지로 이동
          } else {
            console.error('❌ API Error:', err.response || err.message);
            alert('로그인 중 오류가 발생했습니다.');
          }
        }
      } catch (err) {
        console.error('❌ 구글 로그인 오류:', err);
        alert('구글 로그인 중 오류가 발생했습니다.');
      }
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
