// src/api/user.ts
import { SignUpData } from '../contexts/AuthContext';
import { tokenStorage } from '../utils/tokenStorage';
import axios from './axiosInstance';

interface UserPayload {
  socialKey: string;
  email: string;
}

export const registerUser = async (data: UserPayload) => {
  const payload = {
    ...data,
    // categoryIds: data.categoryIds.map(Number), // string[] → number[]
  };

  console.log('✅ 최종 전송 payload:', payload);

  return axios.post('/api/users', payload);
};

export const findUser = async (data: UserPayload) => {
  //   const response = await axios.post('/api/users/find', data);
  const response = await axios.post('/api/users/find', data);
  return response.data;
};

export const updateUser = async (data: SignUpData) => {
  const payload = {
    ...data,
    categoryIds: data.categoryIds.map(Number), // string[] → number[]
  };

  console.log('✅ 최종 전송 payload:', payload);

  return axios.put(`/api/users/`, payload);

  //   return axios.put(`/api/users/${id}`, payload);
};

export const kakaoLogin = async (code: string) => {
  const response = await axios.post("/api/oauth/kakao", { code });

  // 응답 헤더에서 토큰 추출 및 저장
  const accessToken = response.headers['authorization']?.replace('Bearer ', '');
  const refreshToken = response.headers['refresh-token']; // 리프레시 토큰이 있다면

  if (accessToken) {
    tokenStorage.setAccessToken(accessToken);
  }

  if (refreshToken) {
    tokenStorage.setRefreshToken(refreshToken);
  }

  // 사용자 정보 저장 (응답 데이터에서)
  if (response.data) {
    const { socialKey, email } = response.data;
    if (socialKey) {
      tokenStorage.setSocialKey(socialKey);
    }
    if (email) {
      tokenStorage.setUserEmail(email);
    }
  }

  return response;
};


export const logout = () => {
  tokenStorage.clearAll(); // 모든 정보 삭제로 변경
  // 필요하다면 서버에 로그아웃 요청도 보낼 수 있음
  // return axios.post('/api/auth/logout');
};

export const googleLogin = async (idToken: string) => {
  const response = await axios.post("/api/oauth/google", { idToken });

  console.log("✅ 구글 로그인 응답:", response);
  console.log("✅ 응답 헤더 전체:", response.headers);
  console.log("✅ 응답 헤더 키 목록:", Object.keys(response.headers));

  // 다양한 방법으로 토큰 추출 시도
  const accessToken =
    response.headers['authorization']?.replace('Bearer ', '') ||
    response.headers['Authorization']?.replace('Bearer ', '') ||
    null;

  const refreshToken =
    response.headers['refresh-token'] ||
    response.headers['Refresh-Token'] ||
    null;

  console.log("google accessToken:", accessToken);
  console.log("google refreshToken:", refreshToken);

  // CORS 문제로 헤더에 접근할 수 없는 경우를 위한 임시 처리
  if (!accessToken) {
    console.warn("⚠️ Authorization 헤더에 접근할 수 없습니다. CORS 설정을 확인하세요.");
    console.log("사용 가능한 헤더들:", Object.keys(response.headers));
  }

  // 토큰 저장
  if (accessToken) {
    tokenStorage.setAccessToken(accessToken);
  }

  if (refreshToken) {
    tokenStorage.setRefreshToken(refreshToken);
  }

  // 사용자 정보 저장 (응답 데이터에서)
  if (response.data) {
    const { socialKey, email } = response.data;
    if (socialKey) {
      tokenStorage.setSocialKey(socialKey);
    }
    if (email) {
      tokenStorage.setUserEmail(email);
    }
  }

  return response;
};