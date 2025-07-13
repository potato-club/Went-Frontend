import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { findUser, kakaoLogin, registerUser } from '../../api/user';
import { useAuth } from '../../contexts/AuthContext';

const KakaoRedirectPage = () => {
  const navigate = useNavigate();
  const { setSignUpData, setCurrentUser } = useAuth();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (!code) return;

    console.log('카카오 로그인 코드:', code);

    const fetchKakaoUser = async () => {
      try {
        // 백엔드에 code 전달하여 사용자 정보 획득
        const kakaoRes = await kakaoLogin(code);

        console.log('카카오 사용자 정보:', kakaoRes);

        const { socialKey, nickname, email, birthDate, region } = kakaoRes.data;

        const newUserData = {
          socialKey: socialKey?.trim() || '',
          nickname: nickname || '',
          email: email || '',
          birthDate: birthDate || '',
          region: region || '',
        };

        setSignUpData((prev) => ({
          ...prev,
          ...newUserData,
        }));

        // AuthContext의 현재 사용자 정보도 업데이트
        setCurrentUser({
          socialKey: newUserData.socialKey,
          email: newUserData.email,
        });

        try {
          const res = await findUser({ socialKey: newUserData.socialKey, email: newUserData.email });

          const hasMissingFields =
            !res.nickname ||
            !res.region ||
            !res.birthDate ||
            !res.categoryIds?.length;

          navigate(hasMissingFields ? '/signup' : '/');
        } catch (err: any) {
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            await registerUser({ socialKey: newUserData.socialKey, email: newUserData.email });
            navigate('/signup');
          } else {
            console.error('❌ API Error:', err.response || err.message);
            alert('로그인 중 오류가 발생했습니다.');
          }
        }
      } catch (error) {
        console.error('카카오 로그인 실패:', error);
      }
    };

    fetchKakaoUser();
  }, [navigate, setSignUpData, setCurrentUser]);

  return <div>카카오 로그인 중입니다...</div>;
};

export default KakaoRedirectPage;