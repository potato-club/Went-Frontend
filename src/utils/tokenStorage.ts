// 세션 스토리지를 사용한 토큰 및 사용자 정보 관리 유틸리티

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const SOCIAL_KEY = 'socialKey';
const USER_EMAIL = 'userEmail';
const USER_NICKNAME = 'userNickName';

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

  // socialKey 저장
  setSocialKey: (socialKey: string) => {
    sessionStorage.setItem(SOCIAL_KEY, socialKey);
  },

  // socialKey 조회
  getSocialKey: (): string | null => {
    return sessionStorage.getItem(SOCIAL_KEY);
  },

  // 사용자 이메일 저장
  setUserEmail: (email: string) => {
    sessionStorage.setItem(USER_EMAIL, email);
  },

  // 사용자 이메일 조회
  getUserEmail: (): string | null => {
    return sessionStorage.getItem(USER_EMAIL);
  },

  // 사용자 닉네임 저장
  setUserNickName: (nickName: string) => {
    sessionStorage.setItem(USER_NICKNAME, nickName);
  },

  // 사용자 닉네임 조회
  getUserNickName: (): string | null => {
    return sessionStorage.getItem(USER_NICKNAME);
  },

  // 모든 정보 삭제 (로그아웃)
  clearAll: () => {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(SOCIAL_KEY);
    sessionStorage.removeItem(USER_EMAIL);
    sessionStorage.removeItem(USER_NICKNAME);
  },

  // 토큰만 삭제 (기존 호환성)
  clearTokens: () => {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // 인증 상태 확인
  isAuthenticated: (): boolean => {
    return !!sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }
};
