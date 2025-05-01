// src/utils/auth/googleLogin.ts
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { findUser, registerUser } from '../api/user';
import { useAuth } from '../contexts/AuthContext';

export const useCustomGoogleLogin = () => {
  const navigate = useNavigate();
  const { setSignUpData } = useAuth();

  return useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      const { access_token } = tokenResponse;

      try {
        const userInfoRes = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        const userInfo = userInfoRes.data;
        console.log('구글 사용자 정보:', userInfo);
        const newUserData = {
          socialKey: access_token?.trim() || '',
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
            !user.nickname ||
            !user.region ||
            !user.birthdate ||
            !user.categoryIds?.length;

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
      } catch (err) {
        console.error('❌ 구글 로그인 오류:', err);
        alert('구글 로그인 중 오류가 발생했습니다.');
      }
    },
    onError: () => {
      console.log('구글 로그인 실패');
    },
  });
};
