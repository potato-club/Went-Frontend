import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { updateUser } from "../../api/user";
import LoginPageBody from "../../components/LoginPageBody";
import UserProfileForm from "../../components/UserProfileForm";
import { SignUpData, useAuth } from "../../contexts/AuthContext";
import { Title } from "../../styles/LayoutStyles";

function EditProfilePage() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth();

  // 현재 사용자 정보로 폼 데이터 초기화
  const [formData, setFormData] = useState<SignUpData>({
    socialKey: currentUser.socialKey || '',
    nickname: currentUser.nickname || '',
    email: currentUser.email || '',
    birthDate: currentUser.birthDate || '',
    region: currentUser.region || '',
    categoryIds: currentUser.categoryIds || [],
    profileImageUrl: currentUser.profileImageUrl || '',
  });

  console.log('EditProfilePage currentUser:', currentUser);

  // 사용자 정보가 없으면 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!currentUser.isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }
  }, [currentUser.isLoggedIn, navigate]);

  // currentUser 정보가 변경될 때 formData 업데이트
  useEffect(() => {
    if (currentUser.isLoggedIn) {
      setFormData({
        socialKey: currentUser.socialKey || '',
        nickname: currentUser.nickname || '',
        email: currentUser.email || '',
        birthDate: currentUser.birthDate || '',
        region: currentUser.region || '',
        categoryIds: currentUser.categoryIds || [],
        profileImageUrl: currentUser.profileImageUrl || '',
      });
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 필수 필드 유효성 검사
    if (!formData.nickname?.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    if (!formData.region?.trim()) {
      alert('지역을 입력해주세요.');
      return;
    }

    if (!formData.birthDate?.trim()) {
      alert('생년월일을 입력해주세요.');
      return;
    }

    if (formData.categoryIds.length === 0) {
      alert('관심 카테고리를 최소 1개 이상 선택해주세요.');
      return;
    }

    try {
      console.log('회원정보 수정 시작:', formData);

      // updateUser API 호출
      await updateUser(formData);

      console.log('✅ 회원정보 수정 성공');

      // AuthContext의 currentUser 정보 업데이트 (모든 프로필 정보 포함)
      setCurrentUser({
        socialKey: formData.socialKey,
        email: formData.email,
        nickname: formData.nickname,
        birthDate: formData.birthDate,
        region: formData.region,
        categoryIds: formData.categoryIds,
        profileImageUrl: formData.profileImageUrl,
      });

      console.log('✅ 사용자 정보 업데이트 완료:', {
        socialKey: formData.socialKey,
        email: formData.email,
        nickname: formData.nickname,
      });

      alert('회원정보가 수정되었습니다!');

      // 이전 페이지로 돌아가기 또는 마이페이지로 이동
      navigate(-1);

    } catch (error) {
      console.error('❌ 회원정보 수정 실패:', error);
      alert('회원정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleCancel = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  return (
    <EditProfilePageWrapper>
      <LoginPageBody>
        <Title>프로필 수정</Title>
        <UserProfileForm
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          submitButtonText="수정하기"
          cancelButtonText="취소"
          onCancel={handleCancel}
          showCancelButton={true}
        />
      </LoginPageBody>
    </EditProfilePageWrapper>
  );
}

const EditProfilePageWrapper = styled.div`
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

export default EditProfilePage;
