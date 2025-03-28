import styled from 'styled-components';
import LoginPageBody from '../LoginPageBody';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function LoginPageStepTwo() {
  const navigate = useNavigate();

  // 생년월일을 위한 3개의 독립적인 useState
  const [year, setYear] = useState<string>('0');
  const [month, setMonth] = useState<string>('0');
  const [day, setDay] = useState<string>('0');

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(e.target.value);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(e.target.value);
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDay(e.target.value);
  };

  const nextPage = () => {
    // 다음 페이지로 이동하기 전에 저장된 생년월일 확인 (디버깅용)
    console.log('생년월일:', { 년도: year, 월: month, 일: day });
    navigate('/welcome'); // Navigate to the next page
  };

  useEffect(() => {
    console.log('year :', year);
    console.log('month :', month);
    console.log('day :', day);
  }, [year, month, day]);

  return (
    <LoginPageBody>
      <DescriptionBox>생년월일은 선택적으로 입력해주세요.</DescriptionBox>
      <InputBox>
        {/* 추후에 select 방식으로 변경 */}
        {/* <Input type='text' placeholder='년/연' /> */}
        {/* <Input type='text' placeholder='월' /> */}
        {/* <Input type='text' placeholder='일' /> */}
        <SelectBox value={year} onChange={handleYearChange}>
          <option value='0'>년도</option>
          <option value='1990'>1990년</option>
          <option value='1991'>1991년</option>
          <option value='1992'>1992년</option>
        </SelectBox>
        <SelectBox value={month} onChange={handleMonthChange}>
          <option value='0'>월</option>
          <option value='1'>1월</option>
          <option value='2'>2월</option>
          <option value='3'>3월</option>
        </SelectBox>
        <SelectBox value={day} onChange={handleDayChange}>
          <option value='0'>일</option>
          <option value='1'>1일</option>
          <option value='2'>2일</option>
          <option value='3'>3일</option>
        </SelectBox>
      </InputBox>
      <ButtonBox>
        <Button>취소</Button>
        <Button onClick={nextPage}>다음</Button>
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
