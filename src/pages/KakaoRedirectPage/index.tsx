import axios from 'axios';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { kakaoLogin, registerUser } from '../../api/user';
import { useAuth } from '../../contexts/AuthContext';

// 타입 정의
interface KakaoLoginResponse {
  data: {
    socialKey: string;
    email: string;
    nickname?: string;
    region?: string;
    birthDate?: string;
    categoryIds?: string[];
  };
}

const KakaoRedirectPage = () => {
  const navigate = useNavigate();
  const { setSignUpData, setCurrentUser } = useAuth();

  const hasRequiredFields = (data: KakaoLoginResponse['data']): boolean => {
    return Boolean(
      data.nickname &&
      data.region &&
      data.birthDate &&
      data.categoryIds?.length
    );
  };

  const updateUserContext = useCallback((data: KakaoLoginResponse['data']) => {
    setSignUpData(prev => ({ ...prev, ...data }));
    setCurrentUser({
      socialKey: data.socialKey,
      email: data.email,
      nickname: data.nickname || '',
    });
  }, [setSignUpData, setCurrentUser]);

  const handleUserRegistration = useCallback(async (userData: KakaoLoginResponse['data']) => {
    try {
      await registerUser({
        socialKey: userData.socialKey,
        email: userData.email
      });
      navigate('/signup');
    } catch (error) {
      console.error('❌ 사용자 등록 실패:', error);
      alert('사용자 등록 중 오류가 발생했습니다.');
    }
  }, [navigate]);

  const processKakaoLogin = useCallback(async (code: string) => {
    try {
      const kakaoResponse = await kakaoLogin(code);
      console.log('카카오 사용자 정보:', kakaoResponse);

      updateUserContext(kakaoResponse.data);

      const hasAllRequiredFields = hasRequiredFields(kakaoResponse.data);
      const targetPath = hasAllRequiredFields ? '/' : '/signup';

      navigate(targetPath);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // 신규 사용자인 경우 등록 후 회원가입 페이지로 이동
        const kakaoResponse = await kakaoLogin(code);
        await handleUserRegistration(kakaoResponse.data);
      } else {
        console.error('❌ 카카오 로그인 API 오류:', error);
        alert('로그인 중 오류가 발생했습니다.');
      }
    }
  }, [navigate, updateUserContext, handleUserRegistration]);

  useEffect(() => {
    const urlParams = new URL(window.location.href).searchParams;
    const authCode = urlParams.get('code');

    if (!authCode) {
      console.error('❌ 카카오 인증 코드가 없습니다.');
      return;
    }

    console.log('카카오 로그인 코드:', authCode);
    processKakaoLogin(authCode);
  }, [processKakaoLogin]);

  return (
    <div>카카오 로그인 중입니다...</div>
  );
};

export default KakaoRedirectPage;