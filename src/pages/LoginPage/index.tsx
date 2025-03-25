import styled from 'styled-components';
import googleImg from '../../asset/googleIcon.png';
import kakaoImg from '../../asset/kakaoIcon.png';

function LoginPage() {
  return (
    <LoginPageWrapper>
      <Title>(), 다녀왔습니다.</Title>

      <ChangeComponent>
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
      </ChangeComponent>

      <MainPageButton>메인 페이지로 이동하기</MainPageButton>
    </LoginPageWrapper>
  );
}

const LoginPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Title = styled.div`
  margin-top: 80px;
  font-size: 50px;
`;

const SubTitle = styled.div`
  margin: 65px 2px 100px 4px;
  font-size: 35px;
`;

const ChangeComponent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const DescriptionBox = styled.div`
  width: 400px;
  height: 40px;
  border-bottom: 3px solid #c6c4c2;
  text-align: center;
  display: flex;
  flex-direction: column;
  font-size: 20px;
  padding-bottom: 10px;
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

const MainPageButton = styled.div`
  width: 400px;
  height: 60px;
  border-radius: 15px;
  border: 1px solid #d0b9a8;
  text-align: center;
  align-content: center;
  font-size: 20px;
  margin-bottom: 64px;
  cursor: pointer;
`;

export default LoginPage;
