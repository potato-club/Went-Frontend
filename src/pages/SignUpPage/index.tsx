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
  CategoryItem,
  CategoryList,
  CategoryWrapper,
  Form,
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
    { categoryId: '1', name: 'book', koName: '책' },
    { categoryId: '2', name: 'location', koName: '장소' },
    { categoryId: '3', name: 'music', koName: '음악' },
    { categoryId: '4', name: 'performance', koName: '공연' },
    { categoryId: '5', name: 'movie', koName: '영화' },
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
        <Form onSubmit={nextPage}>
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
            <CategoryList>
              {categories.map((category) => (
                <CategoryItem
                  key={category.categoryId}
                  type='button'
                  selected={signUpData.categoryIds.includes(
                    category.categoryId
                  )}
                  onClick={() => {
                    const isSelected = signUpData.categoryIds.includes(
                      category.categoryId
                    );
                    setSignUpData((prev: SignUpData) => ({
                      ...prev,
                      categoryIds: isSelected
                        ? prev.categoryIds.filter(
                            (id) => id !== category.categoryId
                          )
                        : [...prev.categoryIds, category.categoryId],
                    }));
                  }}
                >
                  {category.koName}
                  {signUpData.categoryIds.includes(category.categoryId) && ' ×'}
                </CategoryItem>
              ))}
            </CategoryList>
          </CategoryWrapper>

          <ButtonBox>
            <Button color='#eee'>취소</Button>
            <Button color='#1d1d1d' type='submit'>
              가입하기
            </Button>
          </ButtonBox>
        </Form>
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
