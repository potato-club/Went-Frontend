import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import googleImg from "../../asset/googleImg.png";
import kakaoImg from "../../asset/kakaoImg.png";
import Button from "../../components/Button";
import LoginPageBody from "../../components/LoginPageBody";
import LoginPageWrapper from "../../components/LoginPageWrapper";
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
  // const { setSignUpData } = useAuth();


  const goToMainPage = () => {
    navigate("/main");
  };

  const handleKakaoLogin = useCustomKakaoLogin();

  const handleGoogleLogin = async (codeResponse: { code: string; }) => {
    try {
      console.log("✅ 구글 로그인 응답:", codeResponse);
      const code = codeResponse.code;
      console.log("구글 로그인 코드:", code);

    } catch (error) {
      console.error("❌ 구글 로그인 처리 실패:", error);
      alert("로그인 중 문제가 발생했습니다.");
    }
  };

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: handleGoogleLogin,
    onError: () => alert("구글 로그인 실패"),
  });

  return (
    <FullPageWrapper>
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
              onClick={() => googleLogin()}
              style={{ cursor: "pointer" }}
            />
          </ImageBoxWrapper>
        </LoginPageBody>

        <ButtonBox>
          <Button color="#fff" bgColor="#1D1D1D" onClick={goToMainPage}>
            메인 페이지로 이동하기
          </Button>
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
  gap: 20px;
  justify-content: center;
  align-items: center;
  padding: 70px 0;
  border-bottom: 1px solid #e2e2e2;
`;

const FullPageWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100vh;
  margin: 0 auto;
`;

export default LoginPage;