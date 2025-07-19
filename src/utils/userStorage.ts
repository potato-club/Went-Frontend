// 사용자 정보 전용 세션 스토리지 관리 유틸리티

const USER_DATA_KEY = 'userData';

export interface UserData {
  socialKey: string | null;
  email: string | null;
  nickname: string | null;
  isLoggedIn: boolean;
}

export const userStorage = {
  // 사용자 데이터 저장
  saveUserData: (userData: UserData) => {
    sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  },

  // 사용자 데이터 조회
  getUserData: (): UserData | null => {
    const data = sessionStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  },

  // 사용자 데이터 삭제
  clearUserData: () => {
    sessionStorage.removeItem(USER_DATA_KEY);
  }
};
