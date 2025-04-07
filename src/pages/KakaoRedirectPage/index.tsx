import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { findUser, registerUser } from '../../api/user';

const KakaoRedirectPage = () => {
  const navigate = useNavigate();
  const { setSignUpData } = useAuth();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (!code) return;

    const fetchKakaoUser = async () => {
      try {
        // 토큰 발급 요청
        const tokenRes = await axios.post(
          'https://kauth.kakao.com/oauth/token',
          new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: process.env.REACT_APP_KAKAO_REST_API_KEY!,
            redirect_uri: process.env.REACT_APP_KAKAO_REDIRECT_URI!,
            code,
          }),
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          }
        );

        const access_token = tokenRes.data.access_token;

        // 사용자 정보 요청
        const userInfoRes = await axios.get(
          'https://kapi.kakao.com/v2/user/me',
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );

        const kakaoAccount = userInfoRes.data.kakao_account;

        console.log('카카오 사용자 정보:', userInfoRes);

        const newUserData = {
          socialKey: access_token?.trim() || '',
          email: kakaoAccount.email || '',
        };

        setSignUpData((prev) => ({
          ...prev,
          ...newUserData,
        }));

        try {
          const res = await findUser(newUserData);

          const hasMissingFields =
            !res.nickname ||
            !res.region ||
            !res.birthdate ||
            !res.categoryIds?.length;

          navigate(hasMissingFields ? '/signUp/1' : '/');
        } catch (err: any) {
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            await registerUser(newUserData);
            navigate('/signUp/1');
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
  }, [navigate, setSignUpData]);

  return <div>카카오 로그인 중입니다...</div>;
};

export default KakaoRedirectPage;
