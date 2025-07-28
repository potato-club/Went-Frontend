import { createContext, ReactNode, useContext, useState } from 'react';
import { logout as apiLogout } from '../api/user';
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
  birthDate: string | null;
  region: string | null;
  categoryIds: string[];
  profileImageUrl: string | null;
  isLoggedIn: boolean;
}

interface AuthContextType {
  signUpData: SignUpData;
  cleanedSignUpData: Partial<SignUpData>;
  setSignUpData: React.Dispatch<React.SetStateAction<SignUpData>>;
  currentUser: CurrentUser;
  setCurrentUser: (user: { socialKey: string; email: string; nickname?: string; birthDate?: string; region?: string; categoryIds?: string[]; profileImageUrl?: string; }) => void;
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
    return savedUserData ? {
      ...savedUserData,
      birthDate: null, // 아직 세션 스토리지에 저장하지 않는 필드들
      region: null,
      categoryIds: [],
      profileImageUrl: null,
    } : {
      socialKey: null,
      email: null,
      nickname: null,
      birthDate: null,
      region: null,
      categoryIds: [],
      profileImageUrl: null,
      isLoggedIn: tokenStorage.isAuthenticated(),
    };
  });

  const cleanedSignUpData = cleanSignUpData(signUpData);

  // 현재 사용자 정보 설정 (자동 persist)
  const setCurrentUser = (user: { socialKey: string; email: string; nickname?: string; birthDate?: string; region?: string; categoryIds?: string[]; profileImageUrl?: string; }) => {
    const newUserData: CurrentUser = {
      socialKey: user.socialKey,
      email: user.email,
      nickname: user.nickname || null,
      birthDate: user.birthDate || null,
      region: user.region || null,
      categoryIds: user.categoryIds || [],
      profileImageUrl: user.profileImageUrl || null,
      isLoggedIn: true,
    };

    // 상태 업데이트
    setCurrentUserState(newUserData);

    // 세션 스토리지에는 기본 정보만 저장 (기존 방식 유지)
    const basicUserData: UserData = {
      socialKey: user.socialKey,
      email: user.email,
      nickname: user.nickname || null,
      isLoggedIn: true,
    };
    userStorage.saveUserData(basicUserData);
  };

  // 로그아웃 (API 호출 + 상태 클리어)
  const logout = () => {
    // API 레벨에서 토큰 삭제
    apiLogout();

    // AuthContext 상태 클리어 (사용자 정보)
    setCurrentUserState({
      socialKey: null,
      email: null,
      nickname: null,
      birthDate: null,
      region: null,
      categoryIds: [],
      profileImageUrl: null,
      isLoggedIn: false,
    });

    // 사용자 정보 세션 스토리지 클리어
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
