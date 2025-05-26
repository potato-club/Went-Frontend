// src/utils/auth/googleLogin.ts
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { findUser, registerUser } from '../api/user';
import { useAuth } from '../contexts/AuthContext';

export const useCustomGoogleLogin = () => {
  const navigate = useNavigate();
  const { setSignUpData } = useAuth();

  return useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      try {
        // 1. 인가 코드 획득
        const authCode = codeResponse.code;
        console.log('✅ 구글 Authorization Code:', authCode);

        // 2. 백엔드에 Authorization Code 전달 → 백엔드에서 id_token 발급 처리
        const tokenRes = await axios.post('/api/auth/google', {
          code: authCode,
          redirectUri: process.env.REACT_APP_GOOGLE_REDIRECT_URI, // 백엔드와 일치해야 함
        });

        const { id_token, access_token } = tokenRes.data;
        console.log('✅ 받은 id_token:', id_token);
        console.log('✅ 받은 access_token:', access_token);

        // 3. id_token 디코딩하여 사용자 정보 추출 (선택)
        const userInfoRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const userInfo = userInfoRes.data;
        const newUserData = {
          socialKey: id_token || '',
          email: userInfo.email?.trim() || '',
        };

        setSignUpData((prev) => ({
          ...prev,
          ...newUserData,
        }));

        try {
          const res = await findUser(newUserData);
          const user = res;

          const hasMissingFields =
            !user.nickname || !user.region || !user.birthdate || !user.categoryIds?.length;

          if (hasMissingFields) {
            navigate('/signUp/1');
          } else {
            navigate('/');
          }
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
        console.error('❌ 구글 로그인 처리 중 오류:', error);
        alert('구글 로그인 중 오류가 발생했습니다.');
      }
    },
    onError: (err) => {
      console.error('❌ 구글 로그인 실패:', err);
      alert('구글 로그인에 실패했습니다.');
    },
  });
};
