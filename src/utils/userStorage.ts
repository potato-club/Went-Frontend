// 사용자 정보 전용 세션 스토리지 관리 유틸리티

const SOCIAL_KEY = 'socialKey';
const USER_EMAIL = 'email';
const USER_NICKNAME = 'nickname';
const IS_LOGGED_IN = 'isLoggedIn';

export interface UserData {
  socialKey: string | null;
  email: string | null;
  nickname: string | null;
  isLoggedIn: boolean;
}

export const userStorage = {
  // 사용자 데이터 저장
  saveUserData: (userData: UserData) => {
    if (userData.socialKey) {
      sessionStorage.setItem(SOCIAL_KEY, userData.socialKey);
    } else {
      sessionStorage.removeItem(SOCIAL_KEY);
    }

    if (userData.email) {
      sessionStorage.setItem(USER_EMAIL, userData.email);
    } else {
      sessionStorage.removeItem(USER_EMAIL);
    }

    if (userData.nickname) {
      sessionStorage.setItem(USER_NICKNAME, userData.nickname);
    } else {
      sessionStorage.removeItem(USER_NICKNAME);
    }

    sessionStorage.setItem(IS_LOGGED_IN, userData.isLoggedIn.toString());
  },

  // 사용자 데이터 조회
  getUserData: (): UserData | null => {
    const socialKey = sessionStorage.getItem(SOCIAL_KEY);
    const email = sessionStorage.getItem(USER_EMAIL);
    const nickname = sessionStorage.getItem(USER_NICKNAME);
    const isLoggedIn = sessionStorage.getItem(IS_LOGGED_IN) === 'true';

    // 하나라도 있으면 사용자 데이터가 있다고 판단
    if (socialKey || email || nickname || isLoggedIn) {
      return {
        socialKey,
        email,
        nickname,
        isLoggedIn,
      };
    }

    return null;
  },

  // 사용자 데이터 삭제
  clearUserData: () => {
    sessionStorage.removeItem(SOCIAL_KEY);
    sessionStorage.removeItem(USER_EMAIL);
    sessionStorage.removeItem(USER_NICKNAME);
    sessionStorage.removeItem(IS_LOGGED_IN);
  }
};