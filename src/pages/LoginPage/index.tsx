import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { googleLogin } from "../../api/user";
import googleImg from "../../asset/googleImg.png";
import kakaoImg from "../../asset/kakaoImg.png";
import Button from "../../components/Button";
import LoginPageBody from "../../components/LoginPageBody";
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

  // useEffect(() => {
  //   if (!window.Kakao?.isInitialized()) {
  //     window.Kakao?.init(process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY);
  //   }
  // }, []);

  const handleKakaoLogin = useCustomKakaoLogin();

  // const handleKakaoLogin = async () => {
  //   try {
  //     if (!window.Kakao) {
  //       console.error("카카오 SDK가 로드되지 않았습니다.");
  //       return;
  //     }

  //     window.Kakao.Auth.login({
  //       scope: "account_email",
  //       success: async (authObj: { access_token: string; }) => {
  //         console.log("✅ 카카오 로그인 성공:", authObj);

  //         window.Kakao.API.request({
  //           url: "/v2/user/me",
  //           success: async function (kakaoRes: any) {
  //             const email = kakaoRes.kakao_account?.email;
  //             console.log("✅ 사용자 이메일:", email);

  //             const res = await findUser({
  //               socialKey: authObj.access_token,
  //               email,
  //             });
  //             console.log("✅ 백엔드 응답:", res);
  //             // 이후 로직 필요 시 작성
  //           },
  //           fail: function (error: any) {
  //             console.error("❌ 사용자 정보 요청 실패:", error);
  //             alert("사용자 정보를 가져오지 못했습니다.");
  //           },
  //         });
  //       },
  //       fail: (err: unknown) => {
  //         console.error("❌ 카카오 로그인 실패:", err);
  //         alert("카카오 로그인에 실패했습니다.");
  //       },
  //     });
  //   } catch (error) {
  //     console.error("❌ 로그인 중 오류:", error);
  //     alert("로그인 중 문제가 발생했습니다.");
  //   }
  // };

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

      // 로그인 성공 시 루트 경로로 리다이렉트
      if (res && res.status === 200) {
        console.log("✅ 구글 로그인 성공! 홈으로 이동합니다.");
        navigate('/');
      }

      // const decoded: { email: string; sub: string; } = jwtDecode(idToken);
      // const email = decoded.email;

      // console.log("✅ 구글 로그인 성공, 이메일:", email);

      // const res = await findUser({
      //   socialKey: idToken,
      //   email,
      // });
      // console.log("✅ 백엔드 응답:", res);
      // 이후 로직 필요 시 작성
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