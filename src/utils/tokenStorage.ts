// 세션 스토리지를 사용한 토큰 관리 유틸리티

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenStorage = {
  // 액세스 토큰 저장
  setAccessToken: (token: string) => {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  // 액세스 토큰 조회
  getAccessToken: (): string | null => {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  },

  // 리프레시 토큰 저장
  setRefreshToken: (token: string) => {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  // 리프레시 토큰 조회
  getRefreshToken: (): string | null => {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // 모든 토큰 삭제
  clearTokens: () => {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // 인증 상태 확인
  isAuthenticated: (): boolean => {
    return !!sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }
};
