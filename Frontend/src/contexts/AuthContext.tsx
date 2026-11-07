import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserSession } from '../types/api';
import {
  getStoredSession,
  setStoredSession,
  clearStoredSession,
  AUTH_UNAUTHORIZED_EVENT,
} from '../api/client';

interface AuthContextType {
  session: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (session: UserSession) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage safely
    const stored = getStoredSession();
    if (stored) {
      setSession(stored);
    }
    setIsLoading(false);

    // Handle 401 unauthorized events dispatched by apiClient
    const handleUnauthorized = () => {
      setSession(null);
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, []);

  const login = useCallback((newSession: UserSession) => {
    setStoredSession(newSession);
    setSession(newSession);
  }, []);

  const logout = useCallback(() => {
    clearStoredSession();
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: !!session?.token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
