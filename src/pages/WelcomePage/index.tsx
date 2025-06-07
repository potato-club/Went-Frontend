import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import WentImg from "../../asset/WentLogo.png";
import Button from "../../components/Button";
import LoginPageBody from "../../components/LoginPageBody";
import { ButtonBox } from "../../styles/FormStyles";
import { Title } from "../../styles/LayoutStyles";

function WelcomePage() {
  const navigate = useNavigate();

  const goToMainPage = () => {
    navigate("/main");
  };

  return (
    <WelcomePageWrapper>
      <WelcomePageContent>
        <Title>(), 다녀왔습니다.</Title>
        <SubTitle>
          <div>(닉네임) 님,</div>
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
  line-height: 145%; /* 46.4px */
  letter-spacing: -0.8px;
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


const LoginPageWrapper = styled.div`
  width: 400px;
  /* height: 830px; */
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  justify-content: center;
  margin-top: 20px;
  overflow: hidden; /* 스크롤바 숨기기 */
`;



const Img = styled.img``;

export default WelcomePage;
