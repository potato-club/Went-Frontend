import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import WentImg from "../../asset/WentLogo.png";
import Button from "../../components/Button";
import LoginPageBody from "../../components/LoginPageBody";
import { useAuth } from "../../contexts/AuthContext";
import { ButtonBox } from "../../styles/FormStyles";
import { Title } from "../../styles/LayoutStyles";

function WelcomePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const goToMainPage = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const getUserDisplayName = useCallback((): string => {
    return currentUser.nickname ||
      sessionStorage.getItem('nickname') ||
      '사용자';
  }, [currentUser.nickname]);

  console.log("WelcomePage - currentUser:", currentUser);
  console.log("WelcomePage - nickname:", currentUser.nickname);
  console.log("WelcomePage - 세션 스토리지 nickname:", sessionStorage.getItem('nickname'));

  return (
    <WelcomePageWrapper>
      <WelcomePageContent>
        <Title>(), 다녀왔습니다.</Title>
        <SubTitle>
          <div>{getUserDisplayName()} 님,</div>
          <div>회원가입을 환영합니다! 🎉</div>
        </SubTitle>

        <LoginPageBody>
          <Img alt="went 로고" src={WentImg} />
        </LoginPageBody>

        <ButtonBox direction="column">
          <Button color="#fff" bgColor="#1d1d1d">
            실시간 인기 리뷰 보러가기
          </Button>
          <Button onClick={goToMainPage}>메인 페이지로 이동하기</Button>
        </ButtonBox>
      </WelcomePageContent>
    </WelcomePageWrapper>
  );
}

const WelcomePageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100dvh;
`;

const WelcomePageContent = styled.div`
  width: 400px;
  min-height: 750px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;

const SubTitle = styled.div`
  margin: 65px 0 50px 0;
  font-size: 35px;
  text-align: center;
  color: var(--gray-900, #1d1d1d);
  text-align: center;
  font-family: "pretendard";
  font-size: 32px;
  font-style: normal;
  font-weight: 600;
  line-height: 145%;
  letter-spacing: -0.8px;
`;

const Img = styled.img``;

export default WelcomePage;
