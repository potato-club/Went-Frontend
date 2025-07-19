import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { kakaoLogin, registerUser } from '../../api/user';
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


        setSignUpData((prev) => ({
          ...prev,
          ...kakaoRes.data,
        }));

        // AuthContext의 현재 사용자 정보도 업데이트
        setCurrentUser({
          socialKey: kakaoRes.data.socialKey,
          email: kakaoRes.data.email,
          nickName: kakaoRes.data.nickName,
        });

        try {
          const hasMissingFields =
            !kakaoRes.data.nickname ||
            !kakaoRes.data.region ||
            !kakaoRes.data.birthDate ||
            !kakaoRes.data.categoryIds?.length;

          navigate(hasMissingFields ? '/signup' : '/');
        } catch (err: any) {
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            await registerUser({ socialKey: kakaoRes.data.socialKey, email: kakaoRes.data.email });
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