import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { updateUser } from "../../api/user";
import LoginPageBody from "../../components/LoginPageBody";
import UserProfileForm from "../../components/UserProfileForm";
import { useAuth } from "../../contexts/AuthContext";
import { Title } from "../../styles/LayoutStyles";

function SignUpPage() {
  const navigate = useNavigate();
  const { signUpData, setSignUpData, cleanedSignUpData, setCurrentUser } = useAuth();

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

    if (signUpData.categoryIds.length === 0) {
      alert('관심 카테고리를 최소 1개 이상 선택해주세요.');
      return;
    }

    try {
      console.log('회원정보 업데이트 시작:', signUpData);

      // updateUser API 호출
      await updateUser(signUpData);

      console.log('✅ 회원정보 업데이트 성공');

      // AuthContext의 currentUser 정보 업데이트
      setCurrentUser({
        socialKey: signUpData.socialKey,
        email: signUpData.email,
        nickname: signUpData.nickname,
      });

      console.log('✅ 사용자 정보 업데이트 완료:', {
        socialKey: signUpData.socialKey,
        email: signUpData.email,
        nickname: signUpData.nickname,
      });

      alert('회원가입이 완료되었습니다!');

      // 웰컴 페이지로 이동
      navigate("/welcome");

    } catch (error) {
      console.error('❌ 회원정보 업데이트 실패:', error);
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    console.log("signUpData:", signUpData);
    console.log("cleanedSignUpData:", cleanedSignUpData);
  }, [signUpData, cleanedSignUpData]);

  return (
    <SignUpPageWrapper>
      <LoginPageBody>
        <Title>(), 다녀왔습니다.</Title>
        <UserProfileForm
          formData={signUpData}
          onFormDataChange={setSignUpData}
          onSubmit={handleSubmit}
          submitButtonText="가입하기"
          cancelButtonText="취소"
          showCancelButton={true}
        />
      </LoginPageBody>
    </SignUpPageWrapper>
  );
}

const SignUpPageWrapper = styled.div`
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

export default SignUpPage;