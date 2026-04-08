import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE } from '../lib/constants';

const TOKEN_KEY = 'admin_token';

interface AuthState {
  isAdmin: boolean;
  adminEmail: string | null;
  isLoading: boolean;
  token: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAdmin: false,
    adminEmail: null,
    isLoading: true,
    token: null,
  });

  useEffect(() => {
    const stored = sessionStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setState({ isAdmin: false, adminEmail: null, isLoading: false, token: null });
      return;
    }
    fetch(`${API_BASE}/api/auth/me`, {
      credentials: 'include',
      headers: { Authorization: `Bearer ${stored}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.email) {
          setState({ isAdmin: true, adminEmail: data.email, isLoading: false, token: stored });
        } else {
          sessionStorage.removeItem(TOKEN_KEY);
          setState({ isAdmin: false, adminEmail: null, isLoading: false, token: null });
        }
      })
      .catch(() => {
        setState({ isAdmin: false, adminEmail: null, isLoading: false, token: null });
      });
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      sessionStorage.setItem(TOKEN_KEY, data.token);
      setState({ isAdmin: true, adminEmail: data.email, isLoading: false, token: data.token });
      return { success: true };
    }
    return { success: false, error: data.error ?? 'Login failed' };
  };

  const logout = async () => {
    const stored = sessionStorage.getItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: stored ? { Authorization: `Bearer ${stored}` } : {},
    });
    setState({ isAdmin: false, adminEmail: null, isLoading: false, token: null });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
