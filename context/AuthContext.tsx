import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthState {
  isAdmin: boolean;
  adminEmail: string | null;
  isLoading: boolean;
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
  });

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setState({ isAdmin: !!data?.email, adminEmail: data?.email ?? null, isLoading: false });
      })
      .catch(() => setState({ isAdmin: false, adminEmail: null, isLoading: false }));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setState({ isAdmin: true, adminEmail: data.email, isLoading: false });
      return { success: true };
    }
    return { success: false, error: data.error ?? 'Login failed' };
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setState({ isAdmin: false, adminEmail: null, isLoading: false });
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
