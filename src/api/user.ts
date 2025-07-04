// src/api/user.ts
import { SignUpData } from '../contexts/AuthContext';
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
  return response;
};