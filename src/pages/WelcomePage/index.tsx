import styled from 'styled-components';
import Button from '../../components/Button';
import LoginPageBody from '../../components/LoginPageBody';
import LoginPageWrapper from '../../components/LoginPageWrapper';
import WentImg from '../../asset/WentLogo.png';
import { ButtonBox } from '../../styles/FormStyles';

function WelcomePage() {
  return (
    <LoginPageWrapper>
      <Title>(), 다녀왔습니다.</Title>
      <SubTitle>
        <div>(닉네임) 회원님,</div>
        <div>회원 가입을 환영합니다!</div>
      </SubTitle>

      <LoginPageBody>
        <Img alt='went 로고' src={WentImg} />
      </LoginPageBody>

      <ButtonBox direction='column'>
        <Button color='#1d1d1d'>실시간 인기 리뷰 보러가기</Button>
        <Button>메인 페이지로 이동하기</Button>
      </ButtonBox>
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

const Img = styled.img``;

export default WelcomePage;
