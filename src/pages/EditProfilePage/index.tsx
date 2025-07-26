import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getUserProfile, updateUser } from "../../api/user";
import LoginPageBody from "../../components/LoginPageBody";
import UserProfileForm from "../../components/UserProfileForm";
import { SignUpData, useAuth } from "../../contexts/AuthContext";
import { Title } from "../../styles/LayoutStyles";

function EditProfilePage() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [originalData, setOriginalData] = useState<SignUpData | null>(null);

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
  console.log('EditProfilePage formData:', formData);
  console.log('EditProfilePage originalData:', originalData);

  // 변경사항이 있는지 확인하는 함수
  const hasChanges = () => {
    if (!originalData) return false;

    return (
      formData.nickname !== originalData.nickname ||
      formData.birthDate !== originalData.birthDate ||
      formData.region !== originalData.region ||
      formData.profileImageUrl !== originalData.profileImageUrl ||
      JSON.stringify(formData.categoryIds.sort()) !== JSON.stringify(originalData.categoryIds.sort())
    );
  };

  // 사용자 정보가 없으면 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!currentUser.isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
    }
  }, [currentUser.isLoggedIn, navigate]);

  // 실제 사용자 프로필 정보 불러오기 (한 번만 실행)
  useEffect(() => {
    if (!currentUser.isLoggedIn) return;

    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        console.log('📡 사용자 프로필 정보 조회 시작...');

        const profileData = await getUserProfile();
        console.log('✅ 사용자 프로필 정보 조회 성공:', profileData);

        // categoryIds를 문자열 배열로 변환 (API에서 숫자로 올 수 있음)
        const formattedData: SignUpData = {
          socialKey: profileData.socialKey || currentUser.socialKey || '',
          nickname: profileData.nickname || '',
          email: profileData.email || currentUser.email || '',
          birthDate: profileData.birthDate || '',
          region: profileData.region || '',
          categoryIds: profileData.categories ? profileData.categories.map((cat: any) => cat.id.toString()) : [],
          profileImageUrl: profileData.profileImageUrl || '',
        };

        setFormData(formattedData);
        setOriginalData(formattedData); // 원본 데이터 저장

        // AuthContext의 currentUser도 업데이트
        setCurrentUser({
          socialKey: formattedData.socialKey,
          email: formattedData.email,
          nickname: formattedData.nickname,
          birthDate: formattedData.birthDate,
          region: formattedData.region,
          categoryIds: formattedData.categoryIds,
          profileImageUrl: formattedData.profileImageUrl,
        });

      } catch (error) {
        console.error('❌ 사용자 프로필 정보 조회 실패:', error);
        // API 실패 시 현재 AuthContext의 정보를 사용
        alert('프로필 정보를 불러오는데 실패했습니다. 기본 정보로 진행합니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 의존성 배열로 한 번만 실행

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 변경사항이 없으면 API 호출하지 않음
    if (!hasChanges()) {
      alert('변경된 내용이 없습니다.');
      return;
    }

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

      // 원본 데이터도 업데이트
      setOriginalData(formData);

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

  // 로딩 중일 때 표시
  if (isLoading) {
    return (
      <EditProfilePageWrapper>
        <LoginPageBody>
          <Title>프로필 수정</Title>
          <LoadingMessage>프로필 정보를 불러오는 중...</LoadingMessage>
        </LoginPageBody>
      </EditProfilePageWrapper>
    );
  }

  return (
    <EditProfilePageWrapper>
      <LoginPageBody>
        <UserProfileForm
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          submitButtonText={hasChanges() ? "수정하기" : "변경사항 없음"}
          cancelButtonText="취소"
          onCancel={handleCancel}
          showCancelButton={true}
          isSubmitDisabled={!hasChanges()}
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

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  font-size: 16px;
  padding: 40px 20px;
`;

export default EditProfilePage;
