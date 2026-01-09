import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types';
import { api } from '../services/api';

export type AuthContextValue = {
  user: User | null;
  token: string | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  initializing: true,
  login: async () => ({}),
  signup: async () => ({}),
  logout: async () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    (async () => {
      // Restore token + user from storage on app start
      const [storedToken, storedUserRaw] = await Promise.all([
        AsyncStorage.getItem('auth_token'),
        AsyncStorage.getItem('user'),
      ]);
      if (storedToken) setToken(storedToken);
      if (storedUserRaw) setUser(JSON.parse(storedUserRaw));
      setInitializing(false);
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.login(email, password);
    if (res.error) return { error: res.error };
    setUser(res.data.user);
    setToken(res.data.token);
    return {};
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const res = await api.signup(name, email, password);
    if (res.error) return { error: res.error };
    setUser(res.data.user);
    setToken(res.data.token);
    return {};
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, initializing, login, signup, logout }),
    [user, token, initializing, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
