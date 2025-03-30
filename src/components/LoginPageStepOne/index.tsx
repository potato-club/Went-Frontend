import styled from 'styled-components';
import LoginPageBody from '../LoginPageBody';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import AddressSearch from '../AddressSearch';
import { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function LoginPageStepOne({
  nickname,
  setNickname,
  setSelectedLocation,
  setSelectedInterests,
  selectedInterests,
  selectedLocation,
}: {
  nickname: string;
  setNickname: Dispatch<SetStateAction<string>>;
  setSelectedLocation: Dispatch<SetStateAction<string>>;
  setSelectedInterests: Dispatch<SetStateAction<string[]>>;
  selectedInterests: string[];
  selectedLocation: string;
}) {
  const navigate = useNavigate();

  const { setSignUpData } = useAuth();

  const nextPage = () => {
    setSignUpData({
      nickname,
      location: selectedLocation,
      interests: selectedInterests,
    });
    navigate('/signUp/2');
  };

  const handleAddress = (address: string) => {
    console.log('선택된 주소:', address);
    setSelectedLocation(address);
  };

  const handleNicknameChange = (e: { target: { value: any } }) => {
    console.log(e.target.value);
    setNickname(e.target.value);
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    console.log('value ', value);
    if (checked) {
      setSelectedInterests((prev: any) => [...prev, value]); // Add interest
    } else {
      setSelectedInterests((prev: any[]) =>
        prev.filter((interest: string) => interest !== value)
      ); // Remove interest
    }
  };

  useEffect(() => {
    console.log('EFFECT Selected Interests:', selectedInterests);
  }, [selectedInterests]);

  return (
    <LoginPageBody>
      <DescriptionBox>아래의 2개는 필수로 입력해주세요.</DescriptionBox>

      <InputBox>
        <Input
          type='text'
          placeholder='닉네임'
          onChange={handleNicknameChange}
        />
        {selectedLocation ? (
          <Input type='text' placeholder='지역' value={selectedLocation} />
        ) : (
          <AddressSearch onAddressSelect={handleAddress} />
        )}
      </InputBox>

      <DescriptionBox>1개 이상의 관심사를 선택해주세요.</DescriptionBox>

      <RadioBox>
        <div>
          <label>
            <input
              type='checkbox'
              name='interest'
              value='movie'
              onChange={handleInterestChange}
            />
            <span>영화</span>
          </label>
          <label>
            <input
              type='checkbox'
              name='interest'
              value='location'
              onChange={handleInterestChange}
            />
            <span>장소</span>
          </label>
          <label>
            <input
              type='checkbox'
              name='interest'
              value='book'
              onChange={handleInterestChange}
            />
            <span>책</span>
          </label>
        </div>
        <div>
          <label>
            <input
              type='checkbox'
              name='interest'
              value='music'
              onChange={handleInterestChange}
            />
            <span>음악</span>
          </label>
          <label>
            <input
              type='checkbox'
              name='interest'
              value='performance'
              onChange={handleInterestChange}
            />
            <span>공연</span>
          </label>
        </div>
      </RadioBox>
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

export default LoginPageStepOne;
