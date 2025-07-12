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
  const response = await axios.post("/api/auth/kakao", { code });

  // 응답 헤더에서 토큰 추출 및 저장
  const accessToken = response.headers['authorization']?.replace('Bearer ', '');
  const refreshToken = response.headers['refresh-token']; // 리프레시 토큰이 있다면

  if (accessToken) {
    tokenStorage.setAccessToken(accessToken);
  }

  if (refreshToken) {
    tokenStorage.setRefreshToken(refreshToken);
  }

  return response;
};


export const logout = () => {
  tokenStorage.clearTokens();
  // 필요하다면 서버에 로그아웃 요청도 보낼 수 있음
  // return axios.post('/api/auth/logout');
};

export const googleLogin = async (idToken: string) => {
  const response = await axios.post("/api/auth/google", { idToken });

  // 응답 헤더에서 토큰 추출 및 저장
  const accessToken = response.headers['authorization']?.replace('Bearer ', '');
  const refreshToken = response.headers['refresh-token']; // 리프레시 토큰이 있다면

  if (accessToken) {
    tokenStorage.setAccessToken(accessToken);
  }

  if (refreshToken) {
    tokenStorage.setRefreshToken(refreshToken);
  }

  return response;
};