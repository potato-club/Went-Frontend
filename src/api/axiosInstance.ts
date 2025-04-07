// src/api/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  //   baseURL: process.env.REACT_APP_API_BASE_URL || '', // .env에서 관리
  baseURL: process.env.REACT_APP_API_TEMP_URL || '', // .env에서 관리
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// // ✅ 요청 인터셉터 (토큰 자동 추가 가능)
// axiosInstance.interceptors.request.use((config) => {
//   // 토큰이 있다면 헤더에 추가
//   const token = localStorage.getItem('token'); // 또는 context 등
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// ✅ 응답 인터셉터 (공통 에러 처리 가능)
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('❌ API Error:', err.response || err.message);
    // 필요한 경우 전역 에러 처리 로직 추가
    return Promise.reject(err);
  }
);

export default axiosInstance;
