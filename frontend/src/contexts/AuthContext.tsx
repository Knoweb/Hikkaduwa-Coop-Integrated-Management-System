import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { logoutUser } from '../services/authService';

export interface AuthUser {
  username: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  isAuditor: boolean;
  isAdmin: boolean;
  canMutateBusinessData: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<AuthUser | null>(() => {
    const role = localStorage.getItem('user_role');
    const username = localStorage.getItem('username');
    if (role && username) {
      return { role, username };
    }
    return null;
  });

  const setUser = useCallback((newUser: AuthUser | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('user_role', newUser.role);
      localStorage.setItem('username', newUser.username);
    }
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUserState(null);
  }, []);

  // Keep in sync if localStorage changes in other tabs
  useEffect(() => {
    const handleStorage = () => {
      const role = localStorage.getItem('user_role');
      const username = localStorage.getItem('username');
      if (role && username) {
        setUserState({ role, username });
      } else {
        setUserState(null);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const isAuditor = user?.role === 'ROLE_AUDITOR';
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const canMutateBusinessData = !isAuditor;

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isAuditor, isAdmin, canMutateBusinessData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
};

export default AuthContext;
