import { createContext, useContext, useState, ReactNode } from 'react';

interface SignUpData {
  token: string;
  nickname: string;
  location: string;
  interests: string[];
  birthdate?: {
    year: string;
    month: string;
    day: string;
  };
}

interface AuthContextType {
  token: string;
  setToken: (token: string) => void;
  signUpData: Omit<SignUpData, 'token'>;
  setSignUpData: (data: Omit<SignUpData, 'token'>) => void;
  birthdate: { year: string; month: string; day: string };
  setBirthdate: (date: { year: string; month: string; day: string }) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState('');
  const [signUpData, setSignUpData] = useState<Omit<SignUpData, 'token'>>({
    nickname: '',
    location: '',
    interests: [],
  });
  const [birthdate, setBirthdate] = useState({
    year: '0',
    month: '0',
    day: '0',
  });

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        signUpData,
        setSignUpData,
        setBirthdate,
        birthdate,
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
