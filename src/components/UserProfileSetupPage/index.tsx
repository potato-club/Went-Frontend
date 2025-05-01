import LoginPageBody from '../LoginPageBody';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import AddressSearch from '../AddressSearch';
import { useEffect } from 'react';
import { useAuth, SignUpData } from '../../contexts/AuthContext';
import {
  InputBox,
  Input,
  RadioBox,
  CategoryWrapper,
  ButtonBox,
} from '../../styles/FormStyles';
import {
  ChangedComponent,
  DescriptionBox,
  SubTitle,
} from '../../styles/LayoutStyles';

function UserProfileSetupPage() {
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
    navigate('/signUp/2');
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
    <LoginPageBody>
      <ChangedComponent>
        {/* <InputBox direction='column'>
          <Input
            type='text'
            placeholder='닉네임'
            onChange={handleNicknameChange}
            value={signUpData.nickname}
          />
          {signUpData.region ? (
            <Input type='text' placeholder='지역' value={signUpData.region} />
          ) : (
            <AddressSearch onAddressSelect={handleAddress} />
          )}
        </InputBox> */}
      </ChangedComponent>

      {/* <ChangedComponent>
        <DescriptionBox>1개 이상의 관심사를 선택해주세요</DescriptionBox>
        <RadioBox>
          <CategoryWrapper>
            {categories.map((category) => (
              <label key={category.categoryId}>
                <input
                  type='checkbox'
                  name='categories'
                  value={category.categoryId}
                  onChange={handleInterestChange}
                  checked={signUpData.categoryIds.includes(category.categoryId)}
                />
                <span>{category.name}</span>
              </label>
            ))}
          </CategoryWrapper>
        </RadioBox>
      </ChangedComponent> */}

      <ButtonBox>
        <Button>취소</Button>
        <Button onClick={nextPage}>다음</Button>
      </ButtonBox>
    </LoginPageBody>
  );
}

// ─────────────────────── 스타일링 ───────────────────────

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

// const InputBox = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
//   margin: 5% 0 10% 0;
// `;

// const Input = styled.input`
//   width: 100%;
//   height: 60px;
//   border: 2px solid #c6c4c2;
//   background: #fff;
//   text-align: center;
//   font-size: 20px;
// `;

// const RadioBox = styled.div`
//   width: 100%;
//   height: 20%;
//   text-align: center;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   gap: 20%;
// `;

// const CategoryWrapper = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   justify-content: center;
//   gap: 20px;

//   label {
//     width: calc((100% - 40px) / 3); // 👉 3개씩 나열, gap 고려
//     display: flex;
//     justify-content: center;
//     align-items: center;
//   }
// `;

// const ButtonBox = styled.div`
//   width: 100%;
//   display: flex;
//   gap: 10px;
// `;

export default UserProfileSetupPage;
