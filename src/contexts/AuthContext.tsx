import { createContext, useContext, useState, ReactNode } from 'react';

export interface SignUpData {
  socialKey: string;
  nickname: string;
  email: string;
  birthdate?: string;
  region: string;
  categoryIds: string[];
}

interface AuthContextType {
  signUpData: SignUpData;
  setSignUpData: React.Dispatch<React.SetStateAction<SignUpData>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [signUpData, setSignUpData] = useState<SignUpData>({
    socialKey: '',
    nickname: '',
    email: '',
    birthdate: '',
    region: '',
    categoryIds: [] as string[],
  });

  return (
    <AuthContext.Provider
      value={{
        signUpData,
        setSignUpData,
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
