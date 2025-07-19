import { createContext, ReactNode, useContext, useState } from 'react';
import { cleanSignUpData } from '../utils/cleanSignUpData';
import { tokenStorage } from '../utils/tokenStorage';
import { UserData, userStorage } from '../utils/userStorage';

export interface SignUpData {
  socialKey: string;
  nickname: string;
  email: string;
  birthDate?: string;
  region: string;
  categoryIds: string[];
  profileImageUrl?: string;
}

interface CurrentUser {
  socialKey: string | null;
  email: string | null;
  nickname: string | null;
  isLoggedIn: boolean;
}

interface AuthContextType {
  signUpData: SignUpData;
  cleanedSignUpData: Partial<SignUpData>;
  setSignUpData: React.Dispatch<React.SetStateAction<SignUpData>>;
  currentUser: CurrentUser;
  setCurrentUser: (user: { socialKey: string; email: string; nickname?: string; }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode; }) => {
  const [signUpData, setSignUpData] = useState<SignUpData>({
    socialKey: '',
    nickname: '',
    email: '',
    birthDate: '',
    region: '',
    categoryIds: [] as string[],
    profileImageUrl: '',
  });

  // 세션 스토리지에서 현재 사용자 정보 초기화
  const [currentUser, setCurrentUserState] = useState<CurrentUser>(() => {
    const savedUserData = userStorage.getUserData();
    return savedUserData || {
      socialKey: null,
      email: null,
      nickname: null,
      isLoggedIn: tokenStorage.isAuthenticated(),
    };
  });

  const cleanedSignUpData = cleanSignUpData(signUpData);

  // 현재 사용자 정보 설정 (자동 persist)
  const setCurrentUser = (user: { socialKey: string; email: string; nickname?: string; }) => {
    const newUserData: UserData = {
      socialKey: user.socialKey,
      email: user.email,
      nickname: user.nickname || null,
      isLoggedIn: true,
    };

    // 상태 업데이트
    setCurrentUserState(newUserData);

    // 세션 스토리지에 자동 저장
    userStorage.saveUserData(newUserData);
  };

  // 로그아웃 (토큰 + 사용자 정보 클리어)
  const logout = () => {
    // 상태 초기화
    setCurrentUserState({
      socialKey: null,
      email: null,
      nickname: null,
      isLoggedIn: false,
    });

    // 세션 스토리지 클리어
    tokenStorage.clearTokens();
    userStorage.clearUserData();
  };

  return (
    <AuthContext.Provider
      value={{
        signUpData,
        setSignUpData,
        cleanedSignUpData,
        currentUser,
        setCurrentUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
