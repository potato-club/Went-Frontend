import styled from 'styled-components';
import LoginPageWrapper from '../../components/LoginPageWrapper';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, Dispatch, SetStateAction } from 'react';
import LoginPageStepTwo from '../../components/LoginPageStepTwo';
import LoginPageStepOne from '../../components/LoginPageStepOne';

function SignupPage() {}

function SignUpPage() {
  const { step } = useParams();
  // const [nickname, setNickname] = useState('');
  // const [selectedLocation, setSelectedLocation] = useState('');
  // const [selectedInterests, setSelectedInterests] = useState<string[]>([]); // State for selected interests

  return (
    <LoginPageWrapper>
      <Title>(), 다녀왔습니다.</Title>
      <SubTitle>회원가입</SubTitle>

      {step === '1' && <LoginPageStepOne />}
      {step === '2' && <LoginPageStepTwo />}
    </LoginPageWrapper>
  );
}

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

const ButtonBox = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
`;

export default SignUpPage;
