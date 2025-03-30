import LoginPageBody from '../LoginPageBody';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { InputBox, SelectBox, ButtonBox } from '../../styles/FormStyles';
import { DescriptionBox, SubTitle } from '../../styles/LayoutStyles';
import { registerUser, updateUser } from '../../api/user';

function AdditionalDetailsPage() {
  const navigate = useNavigate();
  const { signUpData, setSignUpData } = useAuth();

  // 생년월일 local state
  const [year, setYear] = useState('0');
  const [month, setMonth] = useState('0');
  const [day, setDay] = useState('0');

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => 1900 + i
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

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
    try {
      const res = await updateUser(signUpData);

      if (res.status === 200 || res.status === 201) {
        navigate('/welcome');
      } else {
        alert('회원가입 실패');
      }
    } catch (err) {
      console.error('회원가입 중 오류:', err);
      alert('서버 오류 발생');
    }
  };

  return (
    <LoginPageBody>
      <SubTitle>회원가입</SubTitle>

      <DescriptionBox>생년월일은 선택적으로 입력해주세요.</DescriptionBox>
      <InputBox direction='row'>
        <SelectBox value={year} onChange={(e) => setYear(e.target.value)}>
          <option value='0'>년도</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}년
            </option>
          ))}
        </SelectBox>

        <SelectBox value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value='0'>월</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}월
            </option>
          ))}
        </SelectBox>

        <SelectBox value={day} onChange={(e) => setDay(e.target.value)}>
          <option value='0'>일</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {d}일
            </option>
          ))}
        </SelectBox>
      </InputBox>
      <ButtonBox>
        <Button>취소</Button>
        <Button onClick={handleSubmit}>회원가입</Button>
      </ButtonBox>
    </LoginPageBody>
  );
}

// const Title = styled.div`
//   margin-top: 80px;
//   font-size: 40px;
// `;

// const SubTitle = styled.div`
//   margin: 65px 0 50px 0;
//   font-size: 35px;
// `;

// const DescriptionBox = styled.div`
//   width: 100%;
//   height: 40px;
//   border-bottom: 3px solid #c6c4c2;
//   text-align: center;
//   display: flex;
//   flex-direction: column;
//   font-size: 20px;
//   padding-bottom: 10px;
//   white-space: pre-wrap;
// `;

// const RadioBox = styled.div`
//   width: 100%;
//   height: 20%;
//   text-align: center;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   gap: 20%;
//   /* padding: 10px 0; */
// `;

// const InputBox = styled.div`
//   width: 100%;
//   display: flex;
//   gap: 10px;
//   margin: 5% 0 10% 0;
// `;

// const SelectBox = styled.select`
//   width: 100%;
//   height: 60px;
//   border: 2px solid #c6c4c2;
//   background: #fff;
//   text-align: center;
//   font-size: 20px;
// `;

// const Input = styled.input`
//   width: 100%;
//   height: 60px;
//   border: 2px solid #c6c4c2;
//   background: #fff;
//   text-align: center;
//   font-size: 20px;
// `;

// const ButtonBox = styled.div`
//   width: 100%;
//   display: flex;
//   gap: 10px;
// `;

export default AdditionalDetailsPage;
