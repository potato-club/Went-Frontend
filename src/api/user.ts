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

  return axios.put(`/api/users/profile`, payload);

  //   return axios.put(`/api/users/${id}`, payload);
};

// 내 정보 조회 API
export const getUserProfile = async () => {
  const response = await axios.get('/api/users/me');
  return response.data;
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

  return response;
};


export const logout = () => {
  // 클라이언트 측 토큰 삭제만으로 로그아웃 완료
  tokenStorage.clearTokens();
};

// 회원탈퇴 API
export const deleteUser = async () => {
  const response = await axios.delete('/api/users');
  return response.data;
};

// 내가 작성한 게시글 목록 조회 API
export const getUserPosts = async () => {
  const response = await axios.get('/api/users/me/posts');
  return response.data;
};

// 내가 좋아요 누른 게시글 목록 조회 API
export const getUserLikes = async () => {
  const response = await axios.get('/api/users/me/likes');
  return response.data;
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

  return response;
};