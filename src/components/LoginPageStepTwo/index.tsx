import styled from 'styled-components';
import LoginPageBody from '../LoginPageBody';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function LoginPageStepTwo() {
  const navigate = useNavigate();
  const { signUpData, setSignUpData } = useAuth();

  // 생년월일 local state
  const [year, setYear] = useState('0');
  const [month, setMonth] = useState('0');
  const [day, setDay] = useState('0');

  useEffect(() => {
    if (year !== '0' && month !== '0' && day !== '0') {
      const birthdate = `${year}-${month.padStart(2, '0')}-${day.padStart(
        2,
        '0'
      )}`;
      setSignUpData((prev) => ({
        ...prev,
        birthdate,
      }));
    }
  }, [year, month, day, setSignUpData]);

  const handleBirthChange = () => {
    if (year !== '0' && month !== '0' && day !== '0') {
      const birthdate = `${year}-${month.padStart(2, '0')}-${day.padStart(
        2,
        '0'
      )}`;
      setSignUpData((prev) => ({
        ...prev,
        birthdate,
      }));
    }
  };

  const handleSubmit = async () => {
    const payload = {
      ...signUpData,
      categoryIds: signUpData.categoryIds.map((id) => Number(id)), // string[] → number[]
    };

    console.log('✅ 최종 전송 payload:', payload);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        navigate('/welcome');
      } else {
        alert('회원가입 실패');
      }
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
      alert('서버 오류 발생');
    }
  };

  return (
    <LoginPageBody>
      <DescriptionBox>생년월일은 선택적으로 입력해주세요.</DescriptionBox>
      <InputBox>
        {/* 추후에 select 방식으로 변경 */}
        {/* <Input type='text' placeholder='년/연' /> */}
        {/* <Input type='text' placeholder='월' /> */}
        {/* <Input type='text' placeholder='일' /> */}
        <SelectBox value={year} onChange={(e) => setYear(e.target.value)}>
          <option value='0'>년도</option>
          <option value='1990'>1990년</option>
          <option value='1991'>1991년</option>
          <option value='1992'>1992년</option>
        </SelectBox>
        <SelectBox value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value='0'>월</option>
          <option value='1'>1월</option>
          <option value='2'>2월</option>
          <option value='3'>3월</option>
        </SelectBox>
        <SelectBox value={day} onChange={(e) => setDay(e.target.value)}>
          <option value='0'>일</option>
          <option value='1'>1일</option>
          <option value='2'>2일</option>
          <option value='3'>3일</option>
        </SelectBox>
      </InputBox>
      <ButtonBox>
        <Button>취소</Button>
        <Button onClick={handleSubmit}>회원가입</Button>
      </ButtonBox>
    </LoginPageBody>
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
  gap: 10px;
  margin: 5% 0 10% 0;
`;

const SelectBox = styled.select`
  width: 100%;
  height: 60px;
  border: 2px solid #c6c4c2;
  background: #fff;
  text-align: center;
  font-size: 20px;
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

export default LoginPageStepTwo;
