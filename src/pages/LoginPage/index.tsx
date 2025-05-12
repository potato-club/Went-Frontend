import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { findUser } from "../../api/user";
import googleImg from "../../asset/googleImg.png";
import kakaoImg from "../../asset/kakaoImg.png";
import Button from "../../components/Button";
import LoginPageBody from "../../components/LoginPageBody";
import LoginPageWrapper from "../../components/LoginPageWrapper";
import { useCustomGoogleLogin } from "../../hooks/useCustomGoogleLogin";
import { ButtonBox } from "../../styles/FormStyles";
import { DescriptionBox, Img, Title } from "../../styles/LayoutStyles";

declare global {
  interface Window {
    Kakao: any;
  }
}

interface SocialLoginResponse {
  accessToken: string;
  refreshToken: string;
}

function LoginPage() {
  const navigate = useNavigate();

  const goToMainPage = () => {
    navigate("/main");
  };

  useEffect(() => {
    if (!window.Kakao?.isInitialized()) {
      window.Kakao?.init(process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY);
    }
  }, []);

  const handleKakaoLogin = async () => {
    try {
      if (!window.Kakao) {
        console.error("카카오 SDK가 로드되지 않았습니다.");
        return;
      }

      window.Kakao.Auth.login({
        scope: "account_email",
        success: async (authObj: { access_token: string; }) => {
          console.log("✅ 카카오 로그인 성공:", authObj);

          // ✅ 사용자 정보 요청
          window.Kakao.API.request({
            url: "/v2/user/me",
            success: async function (kakaoRes: any) {
              const email = kakaoRes.kakao_account?.email;

              console.log("✅ 사용자 이메일:", email);

              // ✅ 백엔드로 accessToken + email 전달
              // const backendRes = await axios.post("/api/auth/social-login", {
              //   provider: "kakao",
              //   token: authObj.access_token,
              //   email,
              // });

              const res = await findUser({
                socialKey: authObj.access_token,
                email: email,
              });

              console.log("✅ 백엔드 응답:", res);

              // const { accessToken, refreshToken, isNewUser } = backendRes.data;

              // // ✅ 세션 스토리지 저장
              // sessionStorage.setItem("accessToken", accessToken);
              // sessionStorage.setItem("refreshToken", refreshToken);

              // // ✅ 조건에 따라 이동
              // if (isNewUser) {
              //   navigate("/signup"); // 신규 유저 → 회원가입 페이지로
              // } else {
              //   navigate("/"); // 기존 유저 → 메인 페이지
              // }
            },
            fail: function (error: any) {
              console.error("❌ 사용자 정보 요청 실패:", error);
              alert("사용자 정보를 가져오지 못했습니다.");
            },
          });
        },
        fail: (err: unknown) => {
          console.error("❌ 카카오 로그인 실패:", err);
          alert("카카오 로그인에 실패했습니다.");
        },
      });
    } catch (error) {
      console.error("❌ 로그인 중 오류:", error);
      alert("로그인 중 문제가 발생했습니다.");
    }
  };
  // const handleGoogleLogin = useGoogleLogin({

  //   flow: "implicit",
  //   onSuccess: async (tokenResponse: TokenResponse) => {
  //     try {
  //       console.log("✅ 구글 로그인 성공:", tokenResponse);

  //       const { access_token } = tokenResponse;

  //       console.log("✅ 구글 access_token:", access_token);

  //       const userInfoRes = await axios.get(
  //         "https://www.googleapis.com/oauth2/v3/userinfo",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${access_token}`,
  //           },
  //         }
  //       );

  //       console.log(userInfoRes);

  //       // // 1. 구글 access_token을 백엔드로 전달
  //       // const res = await axios.post("/api/auth/social-login", {
  //       //   provider: "google",
  //       //   token: access_token,
  //       // });

  //       // 2. 백엔드가 at, rt 발급해서 응답
  //       // const { accessToken, refreshToken } = res.data;

  //       // console.log("✅ 백엔드 accessToken:", accessToken);
  //       // console.log("✅ 백엔드 refreshToken:", refreshToken);

  //       // // 3. 프론트 세션스토리지에 저장
  //       // sessionStorage.setItem("accessToken", accessToken);
  //       // sessionStorage.setItem("refreshToken", refreshToken);

  //       // // 4. 로그인 성공 후 이동
  //       // navigate("/");
  //     } catch (error) {
  //       console.error("❌ 로그인 실패:", error);
  //       alert("로그인 중 오류가 발생했습니다.");
  //     }
  //   },
  //   onError: (error: unknown) => {
  //     console.error("❌ 구글 로그인 에러:", error);
  //     alert("구글 로그인에 실패했습니다.");
  //   },
  // });

  const handleGoogleLogin = useCustomGoogleLogin();

  const REACT_APP_GOOGLE_OAUTH_CLIENT_ID =
    process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID;

  return (
    <FullPageWrapper>
      <LoginPageWrapper>
        <Title>(), 다녀왔습니다.</Title>
        <DescriptionBox>아래의 로그인 방식으로 함께 하세요</DescriptionBox>

        <LoginPageBody>
          {/* <ChangedComponent> */}
          <ImageBoxWrapper>
            {/* <ImageBox onClick={useCustomKakaoLogin}> */}
            <Img
              alt="카카오 로그인"
              src={kakaoImg}
              onClick={handleKakaoLogin}
            />
            {/* </ImageBox> */}
            {/* <ImageBox onClick={(e) => handleGoogleLogin()}> */}
            {/* <Img
              alt="구글 로그인"
              src={googleImg}
              onClick={() => handleGoogleLogin()}
            /> */}
            <Img
              alt="구글 로그인"
              src={googleImg}
              onClick={() => handleGoogleLogin()}
            />
            {/* </ImageBox> */}
          </ImageBoxWrapper>
          {/* </ChangedComponent> */}
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
