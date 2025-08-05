import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { googleLogin } from "../../api/user";
import googleImg from "../../asset/googleImg.png";
import kakaoImg from "../../asset/kakaoImg.png";
import Button from "../../components/Button";
import LoginPageBody from "../../components/LoginPageBody";
import { useAuth } from "../../contexts/AuthContext";
import { useCustomKakaoLogin } from "../../hooks/useCustomKakaoLogin";
import { ButtonBox } from "../../styles/FormStyles";
import { DescriptionBox, Img, Title } from "../../styles/LayoutStyles";

// 타입 정의
interface GoogleLoginResponse {
  data: {
    socialKey: string;
    email: string;
    nickname?: string;
    region?: string;
    birthDate?: string;
    categoryIds?: string[];
  };
}

declare global {
  interface Window {
    Kakao: any;
  }
}

function LoginPage() {
  const navigate = useNavigate();
  const { setSignUpData, setCurrentUser } = useAuth();

  const goToMainPage = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleKakaoLogin = useCustomKakaoLogin();

  const hasRequiredFields = useCallback((data: GoogleLoginResponse['data']): boolean => {
    return Boolean(
      data.nickname &&
      data.region &&
      data.birthDate &&
      data.categoryIds?.length
    );
  }, []);

  const updateUserContext = useCallback((data: GoogleLoginResponse['data']) => {
    setSignUpData(prev => ({ ...prev, ...data }));
    setCurrentUser({
      socialKey: data.socialKey,
      email: data.email,
      nickname: data.nickname || '',
    });
  }, [setSignUpData, setCurrentUser]);

  const handleGoogleLogin = useCallback(async (credentialResponse: CredentialResponse) => {
    try {
      console.log("✅ 구글 로그인 응답:", credentialResponse);

      const idToken = credentialResponse.credential;
      if (!idToken) {
        alert("구글 인증에 실패했습니다.");
        return;
      }

      console.log("✅ 구글 ID 토큰:", idToken);

      const response = await googleLogin(idToken);
      console.log("✅ 구글 로그인 백엔드 응답:", response);

      if (response?.status === 200 && response.data) {
        console.log("✅ 구글 로그인 응답 데이터:", response.data);

        updateUserContext(response.data);

        // 세션 스토리지 확인용 로그
        console.log("📦 세션 스토리지 저장 확인:");
        console.log("- socialKey:", sessionStorage.getItem('socialKey'));
        console.log("- userEmail:", sessionStorage.getItem('userEmail'));
        console.log("- userNickName:", sessionStorage.getItem('userNickName'));
        console.log("- accessToken:", sessionStorage.getItem('accessToken'));

        const hasAllRequiredFields = hasRequiredFields(response.data);
        const targetPath = hasAllRequiredFields ? '/' : '/signup';

        console.log("✅ 구글 로그인 성공!", hasAllRequiredFields ? "메인 페이지로 이동" : "회원가입 페이지로 이동");
        navigate(targetPath);
      }
    } catch (error) {
      console.error("❌ 구글 로그인 처리 실패:", error);
      alert("로그인 중 문제가 발생했습니다.");
    }
  }, [navigate, hasRequiredFields, updateUserContext]);

  return (
    <LoginPageWrapper>
      <Title>(), 다녀왔습니다.</Title>
      <DescriptionBox>아래의 로그인 방식으로 함께 하세요</DescriptionBox>

      <LoginPageBody>
        <ImageBoxWrapper>
          <Img
            alt="카카오 로그인"
            src={kakaoImg}
            onClick={handleKakaoLogin}
          />
          <Img
            alt="구글 로그인"
            src={googleImg}
          />
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => alert("구글 로그인 실패")}
            useOneTap
          />
        </ImageBoxWrapper>
      </LoginPageBody>

      <ButtonBox>
        <Button color="#fff" bgColor="#1D1D1D" onClick={goToMainPage}>
          메인 페이지로 이동하기
        </Button>
      </ButtonBox>
    </LoginPageWrapper>
  );
}

const ImageBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 20px;
  justify-content: center;
  align-items: center;
  padding: 70px 0;
`;

const LoginPageWrapper = styled.div`
  width: 400px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  justify-content: center;
  overflow: hidden;
  gap: 50px;
`;

export default LoginPage;
