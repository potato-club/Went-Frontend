import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { updateUser } from "../../api/user";
import Button from "../../components/Button";
import LoginPageBody from "../../components/LoginPageBody";
import { CATEGORIES } from "../../constants/categories";
import { SignUpData, useAuth } from "../../contexts/AuthContext";
import {
  ButtonBox,
  CategoryItem,
  CategoryList,
  CategoryWrapper,
  Form,
  Input,
  InputBox,
  InputWrapper,
} from "../../styles/FormStyles";
import { Title } from "../../styles/LayoutStyles";

function SignUpPage() {
  const navigate = useNavigate();
  const { signUpData, setSignUpData, cleanedSignUpData } = useAuth();

  // 주소 검색 관련 state 추가
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 필수 필드 유효성 검사
    if (!signUpData.nickname?.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    if (!signUpData.region?.trim()) {
      alert('지역을 입력해주세요.');
      return;
    }

    if (!signUpData.birthDate?.trim()) {
      alert('생년월일을 입력해주세요.');
      return;
    }

    if (!validateBirthdate(signUpData.birthDate)) {
      alert('올바른 생년월일을 입력해주세요.');
      return;
    }

    if (signUpData.categoryIds.length === 0) {
      alert('관심 카테고리를 최소 1개 이상 선택해주세요.');
      return;
    }

    try {
      console.log('회원정보 업데이트 시작:', signUpData);

      // updateUser API 호출
      await updateUser(signUpData);

      console.log('✅ 회원정보 업데이트 성공');
      alert('회원가입이 완료되었습니다!');

      // 메인 페이지로 이동
      navigate("/welcome");

    } catch (error) {
      console.error('❌ 회원정보 업데이트 실패:', error);
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
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

  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // 숫자와 하이픈만 허용
    value = value.replace(/[^\d-]/g, '');

    // 최대 10자리까지만 허용 (YYYY-MM-DD 형식)
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    // 연속된 하이픈 방지
    value = value.replace(/--+/g, '-');

    // 맨 앞에 하이픈 방지
    if (value.startsWith('-')) {
      value = value.slice(1);
    }

    // 맨 뒤에 하이픈이 여러 개 있으면 하나만 남기기
    value = value.replace(/-+$/, (match) => match.length > 1 ? '-' : match);

    setSignUpData((prev: SignUpData) => ({
      ...prev,
      birthDate: value,
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

  const handleCategoryClick = (categoryId: string) => {
    const isSelected = signUpData.categoryIds.includes(categoryId);
    setSignUpData((prev: SignUpData) => ({
      ...prev,
      categoryIds: isSelected
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  // 카카오 주소 검색 API 호출
  const searchAddressKakao = async (query: string) => {
    if (query.length < 2) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('주소 검색 실패');
      }

      const data = await response.json();

      // 카카오 API 응답에서 주소 추출
      const addresses = data.documents?.map((doc: any) =>
        doc.road_address?.address_name || doc.address?.address_name
      ).filter(Boolean) || [];

      setAddressSuggestions(addresses.slice(0, 5));
      setShowSuggestions(addresses.length > 0);

    } catch (error) {
      console.error('주소 검색 실패:', error);
      setAddressSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsSearching(false);
    }
  };

  // 카카오 좌표 → 주소 변환
  const getCurrentLocationAddressKakao = async () => {
    if (!navigator.geolocation) {
      alert('위치 서비스를 지원하지 않는 브라우저입니다.');
      return;
    }

    setIsSearching(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`,
            {
              headers: {
                Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
              },
            }
          );

          const data = await response.json();
          const address = data.documents?.[0]?.road_address?.address_name ||
            data.documents?.[0]?.address?.address_name;

          if (address) {
            setSignUpData((prev: SignUpData) => ({
              ...prev,
              region: address,
            }));
          }
        } catch (error) {
          console.error('현재 위치 주소 가져오기 실패:', error);
          alert('현재 위치를 가져올 수 없습니다.');
        } finally {
          setIsSearching(false);
        }
      },
      (error) => {
        console.error('위치 정보 가져오기 실패:', error);
        alert('위치 정보를 가져올 수 없습니다.');
        setIsSearching(false);
      }
    );
  };

  // 주소 입력 핸들러 (디바운싱 적용)
  const handleAddressInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSignUpData((prev: SignUpData) => ({
      ...prev,
      region: value,
    }));

    // 디바운싱을 위한 타이머 설정
    if (value.trim()) {
      setTimeout(() => {
        searchAddressKakao(value);
      }, 300); // 300ms 후 검색
    } else {
      setShowSuggestions(false);
      setAddressSuggestions([]);
    }
  };

  // 주소 선택 핸들러
  const selectAddress = (address: string) => {
    setSignUpData((prev: SignUpData) => ({
      ...prev,
      region: address,
    }));
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  // 생년월일 유효성 검증 함수
  const validateBirthdate = (birthdate: string): boolean => {
    // 형식 체크 (0000-00-00)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birthdate)) {
      return false;
    }

    const [year, month, day] = birthdate.split('-').map(Number);

    // 년도 체크 (1900 ~ 현재 년도)
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) {
      return false;
    }

    // 월 체크 (1 ~ 12)
    if (month < 1 || month > 12) {
      return false;
    }

    // 일 체크
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
      return false;
    }

    return true;
  };

  // 생년월일 에러 메시지 상태
  const [birthdateError, setBirthdateError] = useState<string>('');

  // 생년월일 유효성 검증
  const handleBirthdateBlur = () => {
    if (!signUpData.birthDate) {
      setBirthdateError('');
      return;
    }

    if (!validateBirthdate(signUpData.birthDate)) {
      setBirthdateError('올바른 생년월일을 입력해주세요 (YYYY-MM-DD)');
    } else {
      setBirthdateError('');
    }
  };

  useEffect(() => {
    console.log("signUpData:", signUpData);
    console.log("cleanedSignUpData:", cleanedSignUpData);
  }, [signUpData, cleanedSignUpData]);

  return (
    <LoginPageWrapper>
      <LoginPageBody>
        <Title>(), 다녀왔습니다.</Title>
        <Form onSubmit={handleSubmit}>
          <InputWrapper>
            <InputBox direction="column">
              <label>닉네임</label>
              <Input
                placeholder="사용할 닉네임을 입력해 주세요"
                value={signUpData.nickname}
                onChange={handleNicknameChange}
              />
            </InputBox>

            <InputBox direction="column">
              <label>지역</label>
              <AddressInputWrapper>
                <StyledInput
                  placeholder="사는 지역을 입력해 주세요"
                  value={signUpData.region}
                  onChange={handleAddressInput}
                  autoComplete="off"
                />
                <LocationButton
                  type="button"
                  onClick={getCurrentLocationAddressKakao}
                  disabled={isSearching}
                >
                  현재 위치
                </LocationButton>

                {showSuggestions && addressSuggestions.length > 0 && (
                  <SuggestionList>
                    {addressSuggestions.map((address, index) => (
                      <SuggestionItem
                        key={index}
                        onClick={() => selectAddress(address)}
                      >
                        {address}
                      </SuggestionItem>
                    ))}
                  </SuggestionList>
                )}
              </AddressInputWrapper>
            </InputBox>

            <InputBox direction="column">
              <label>생년월일</label>
              <Input
                placeholder="생년월일 8자리 (YYYY-MM-DD)"
                value={signUpData.birthDate}
                onChange={handleBirthdateChange}
                onBlur={handleBirthdateBlur}
                maxLength={10}
              />
              {birthdateError && <ErrorMessage>{birthdateError}</ErrorMessage>}
            </InputBox>
          </InputWrapper>

          <CategoryWrapper>
            <InputBox direction="column">
              <label>카테고리 선택 (1개 이상 선택)</label>
              <CategoryList>
                {CATEGORIES.map((category) => (
                  <CategoryItem
                    key={category.categoryId}
                    type="button"
                    selected={signUpData.categoryIds.includes(
                      String(category.categoryId)
                    )}
                    onClick={() => handleCategoryClick(String(category.categoryId))}
                  >
                    {category.koName}
                    {signUpData.categoryIds.includes(String(category.categoryId)) &&
                      " ×"}
                  </CategoryItem>
                ))}
              </CategoryList>
            </InputBox>
          </CategoryWrapper>

          <ButtonBox>
            <Button bgColor="#eee">취소</Button>
            <Button bgColor="#1d1d1d" color="#ffffff" type="submit">
              가입하기
            </Button>
          </ButtonBox>
        </Form>
      </LoginPageBody>
    </LoginPageWrapper>
  );
}

// 새로운 스타일드 컴포넌트 추가
const AddressInputWrapper = styled.div`
  position: relative;
`;

const LocationButton = styled.button`
  position: absolute;
  right: 4px; /* 8px → 4px로 변경 */
  top: 50%;
  height: 100%;
  transform: translateY(-50%);
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 4px 6px; /* 좌우 패딩 8px → 6px로 줄임 */
  font-size: 12px;
  color: #666;
  cursor: pointer;
  white-space: nowrap;
  
  &:hover {
    background: #e9ecef;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const SuggestionList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  list-style: none;
  padding: 0;
  margin: 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SuggestionItem = styled.li`
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const LoginPageWrapper = styled.div`
  width: 400px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  justify-content: center;
  margin-top: 20px;
  overflow: hidden;
`;

const StyledInput = styled(Input)`
  padding-right: 80px; /* 버튼 공간 확보 */
`;

// 에러 메시지 스타일 컴포넌트
const ErrorMessage = styled.div`
  color: #ff4757;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
`;

export default SignUpPage;