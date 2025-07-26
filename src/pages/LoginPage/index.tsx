import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
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

declare global {
  interface Window {
    Kakao: any;
  }
}

function LoginPage() {
  const navigate = useNavigate();
  const { setSignUpData, setCurrentUser } = useAuth();

  const goToMainPage = () => {
    navigate("/main");
  };

  const handleKakaoLogin = useCustomKakaoLogin();

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      console.log("✅ 구글 로그인 응답:", credentialResponse);
      const idToken = credentialResponse.credential;
      console.log("✅ 구글 ID 토큰:", idToken);
      if (!idToken) {
        alert("구글 인증에 실패했습니다.");
        return;
      }

      const res = await googleLogin(idToken);
      console.log("✅ 구글 로그인 백엔드 응답:", res);

      if (res && res.status === 200) {
        console.log("✅ 구글 로그인 응답 데이터:", res.data);

        // 회원가입 데이터에 구글 사용자 정보 설정
        setSignUpData((prev) => ({
          ...prev,
          ...res.data,
        }));

        // AuthContext의 현재 사용자 정보도 업데이트
        setCurrentUser({
          socialKey: res.data.socialKey,
          email: res.data.email,
          nickname: res.data.nickname, // nickName → nickname 통일
        });

        // 세션 스토리지 확인용 로그
        console.log("📦 세션 스토리지 저장 확인:");
        console.log("- socialKey:", sessionStorage.getItem('socialKey'));
        console.log("- userEmail:", sessionStorage.getItem('userEmail'));
        console.log("- userNickName:", sessionStorage.getItem('userNickName'));
        console.log("- accessToken:", sessionStorage.getItem('accessToken'));

        // 필수 필드가 누락되었는지 확인하여 회원가입 페이지 또는 메인 페이지로 이동
        const hasMissingFields =
          !res.data.nickname ||
          !res.data.region ||
          !res.data.birthDate ||
          !res.data.categoryIds?.length;

        console.log("✅ 구글 로그인 성공!", hasMissingFields ? "회원가입 페이지로 이동" : "메인 페이지로 이동");
        navigate(hasMissingFields ? '/signup' : '/');
      }
    } catch (error) {
      console.error("❌ 구글 로그인 처리 실패:", error);
      alert("로그인 중 문제가 발생했습니다.");
    }
  };

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
  border-bottom: 1px solid #e2e2e2;
`;

const LoginPageWrapper = styled.div`
  width: 400px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  justify-content: center;
  overflow: hidden; /* 스크롤바 숨기기 */
  gap: 50px;
`;

export default LoginPage;