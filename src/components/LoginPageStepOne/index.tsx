import styled from 'styled-components';
import LoginPageBody from '../LoginPageBody';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import LocationFinder from '../LocationFinder';
import useGeolocation from '../../hooks/useGeolocation';
import AddressSearch from '../AddressSearch';
import { useState } from 'react';

function LoginPageStepOne() {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState('');

  const nextPage = () => {
    navigate('/signUp/2'); // Navigate to the next page
  };

  const handleAddressSelect = (address: string) => {
    console.log('선택된 주소:', address);
    setSelectedLocation(address);
    // 선택된 주소 정보를 상태로 저장하거나 다른 처리 수행
  };
  return (
    <LoginPageBody>
      <DescriptionBox>아래의 2개는 필수로 입력해주세요.</DescriptionBox>

      <InputBox>
        <Input type='text' placeholder='닉네임' />
        <Input type='text' placeholder='지역' value={selectedLocation} />
        {/* <Map /> */}
        {/* <LocationFinder /> */}
        <AddressSearch onAddressSelect={handleAddressSelect} />
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
