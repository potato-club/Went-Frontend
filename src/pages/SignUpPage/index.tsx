import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import UserProfileSetupPage from '../../components/UserProfileSetupPage';
import AdditionalDetailsPage from '../../components/AdditionalDetailsPage';
import { Title, SubTitle, ChangedComponent } from '../../styles/LayoutStyles';
import LoginPageWrapper from '../../components/LoginPageWrapper';
import { useEffect } from 'react';
import Button from '../../components/Button';
import LoginPageBody from '../../components/LoginPageBody';
import { useAuth, SignUpData } from '../../contexts/AuthContext';
import {
  ButtonBox,
  CategoryWrapper,
  Input,
  InputBox,
  InputWrapper,
} from '../../styles/FormStyles';

function SignUpPage() {
  // const { step } = useParams();
  // const [nickname, setNickname] = useState('');
  // const [selectedLocation, setSelectedLocation] = useState('');
  // const [selectedInterests, setSelectedInterests] = useState<string[]>([]); // State for selected interests

  const categories = [
    { categoryId: '1', name: 'book', koName: '' },
    { categoryId: '2', name: 'game', koName: '' },
    { categoryId: '3', name: 'music', koName: '' },
    { categoryId: '4', name: 'performance', koName: '' },
    { categoryId: '5', name: 'movie', koName: '' },
  ];

  const navigate = useNavigate();
  const { signUpData, setSignUpData, cleanedSignUpData } = useAuth();

  const nextPage = () => {
    navigate('/welcome');
  };

  const handleAddress = (address: string) => {
    setSignUpData((prev: SignUpData) => ({
      ...prev,
      region: address,
    }));
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpData((prev: SignUpData) => ({
      ...prev,
      nickname: e.target.value,
    }));
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setSignUpData((prev: SignUpData) => ({
        ...prev,
        categoryIds: [...prev.categoryIds, value],
      }));
    } else {
      setSignUpData((prev: SignUpData) => ({
        ...prev,
        categoryIds: prev.categoryIds.filter((id) => id !== value),
      }));
    }
  };

  useEffect(() => {
    console.log('signUpData:', signUpData);
    console.log('cleanedSignUpData:', cleanedSignUpData);
  }, [signUpData, cleanedSignUpData]);

  return (
    <LoginPageWrapper>
      <LoginPageBody>
        <Title>(), 다녀왔습니다.</Title>

        <InputWrapper>
          <InputBox direction='column'>
            <label>닉네임</label>
            <Input placeholder='사용할 닉네임을 입력해주세요' />
          </InputBox>

          <InputBox direction='column'>
            <label>지역</label>
            <Input placeholder='사용할 닉네임을 입력해주세요' />
          </InputBox>

          <InputBox direction='column'>
            <label>생년월일</label>
            <Input placeholder='사용할 닉네임을 입력해주세요' />
          </InputBox>
        </InputWrapper>

        <CategoryWrapper>
          <div>카테고리 선택 (1개 이상 선택)</div>
          <div>
            <label htmlFor=''>
              <input type='checkbox' value='영화' /> 영화
            </label>
            <label htmlFor=''>
              <input type='checkbox' value='장소' /> 장소
            </label>
            <label htmlFor=''>
              <input type='checkbox' value='공연' /> 공연
            </label>
            <label htmlFor=''>
              <input type='checkbox' value='음악' /> 음악
            </label>
            <label htmlFor=''>
              <input type='checkbox' value='책' /> 책
            </label>
          </div>
        </CategoryWrapper>

        <ButtonBox>
          <Button color='#eee'>취소</Button>
          <Button color='#1d1d1d' onClick={nextPage}>
            가입하기
          </Button>
        </ButtonBox>
      </LoginPageBody>
    </LoginPageWrapper>
  );

  // return (
  //   <LoginPageWrapper>
  //     <Title>(), 다녀왔습니다.</Title>

  //     {step === '1' && <UserProfileSetupPage />}
  //     {step === '2' && <AdditionalDetailsPage />}
  //   </LoginPageWrapper>
  // );
}

export default SignUpPage;
