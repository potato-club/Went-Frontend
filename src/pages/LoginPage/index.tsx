import styled from 'styled-components';
import googleImg from '../../asset/googleIcon.png';
import kakaoImg from '../../asset/kakaoIcon.png';
import Button from '../../components/Button';
import LoginPageBody from '../../components/LoginPageBody';

function LoginPage() {
  return (
    <LoginPageWrapper>
      <Title>(), 다녀왔습니다.</Title>

      <LoginPageBody>
        <SubTitle>로그인/회원가입</SubTitle>

        <DescriptionBox>아래의 로그인 방식으로 함께 하세요.</DescriptionBox>

        <ImageBoxWrapper>
          <ImageBox>
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

const LoginPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 380px;
  height: 100vh;
  margin: 0 auto;
  padding: 0 20px;
  /* justify-content: center; */
  max-width: 100%; /* 화면 크기가 작을 때 대응 */
`;

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
