import styled from 'styled-components';
import Button from '../../components/Button';
import LoginPageBody from '../../components/LoginPageBody';

function SignUpPage() {
  return (
    <LoginPageWrapper>
      <Title>(), 다녀왔습니다.</Title>
      <LoginPageBody>
        <SubTitle>회원가입</SubTitle>

        <DescriptionBox>아래의 2개는 필수로 입력해주세요.</DescriptionBox>

        <InputBox>
          <Input type='text' placeholder='닉네임' />
          <Input type='text' placeholder='지역' />
        </InputBox>

        <DescriptionBox>1개 이상의 관심사를 선택해주세요.</DescriptionBox>

        <RadioBox>
          <div>
            <input type='radio' name='intertest' value='movie' />
            <span>영화</span>
            <input type='radio' name='intertest' value='location' />
            <span>장소</span>
            <input type='radio' name='intertest' value='book' />
            <span>책</span>
          </div>
          <div>
            <input type='radio' name='intertest' value='music' />
            <span>음악</span>
            <input type='radio' name='intertest' value='performance' />
            <span>공연</span>
          </div>
        </RadioBox>
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
  margin: 65px 0 50px 0;
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

const RadioBox = styled.div`
  width: 100%;
  height: 20%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20%;
  /* padding: 10px 0; */
`;

const InputBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 5% 0 10% 0;
`;

const Input = styled.input`
  width: 100%;
  height: 60px;
  border: 2px solid #c6c4c2;
  background: #fff;
  text-align: center;
  font-size: 20px;
`;

export default SignUpPage;
