import React, { createContext, useContext, useEffect, useState } from "react";
import { API_BASE } from "../lib/constants";

interface AuthState {
  isAdmin: boolean;
  adminEmail: string | null;
  isLoading: boolean;
  twoFactorEnabled: boolean;
  twoFactorMethod: "email" | "sms" | null;
}

interface LoginResult {
  success: boolean;
  step?: "complete" | "method-select"; // complete = no 2FA needed, method-select = 2FA required
  method?: "email" | "sms"; // which method to use
  email?: string; // masked email (if 2FA required)
  error?: string;
}

interface VerifyTokenResult {
  success: boolean;
  error?: string;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<LoginResult>;
  verifyToken: (
    email: string,
    code: string,
    trustThisDevice: boolean,
  ) => Promise<VerifyTokenResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    isAdmin: false,
    adminEmail: null,
    isLoading: true,
    twoFactorEnabled: false,
    twoFactorMethod: null,
  });

  // Check if already logged in on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setState({
            isAdmin: true,
            adminEmail: data.email,
            twoFactorEnabled: data.twoFactorEnabled,
            twoFactorMethod: data.twoFactorMethod,
            isLoading: false,
          });
        } else {
          setState({
            isAdmin: false,
            adminEmail: null,
  twoFactorEnabled: false,
  twoFactorMethod: null,
            isLoading: false,
          });
        }
      } catch (err) {
        console.error("Failed to check session:", err);
        setState({
          isAdmin: false,
          adminEmail: null,
  twoFactorEnabled: false,
  twoFactorMethod: null,
          isLoading: false,
        });
      }
    };

    checkSession();
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<LoginResult> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Case 1: 2FA not enabled or trusted device — auto-login
        if (data.success && !data.pendingVerification) {
          setState({
            isAdmin: true,
            adminEmail: data.email,
  twoFactorEnabled: data.twoFactorEnabled ?? false,
  twoFactorMethod: data.twoFactorMethod ?? null,
            isLoading: false,
          });
          return { success: true, step: "complete", email: data.email };
        }

        // Case 2: 2FA required — ask for code
        if (data.pendingVerification) {
          return {
            success: true,
            step: "method-select",
            method: data.method,
            email: data.email, // masked email from backend
          };
        }

        // Fallback
        return { success: false, error: "Unexpected response from server" };
      } else {
        return { success: false, error: data.error ?? "Login failed" };
      }
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const verifyToken = async (
    email: string,
    code: string,
    trustThisDevice: boolean,
  ): Promise<VerifyTokenResult> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies
        body: JSON.stringify({
          email,
          verificationToken: code,
          trustThisDevice,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Set admin state — user is now logged in
        setState({
          isAdmin: true,
          adminEmail: data.email,
  twoFactorEnabled: data.twoFactorEnabled ?? false,
  twoFactorMethod: data.twoFactorMethod ?? null,
          isLoading: false,
        });
        return { success: true };
      } else {
        return { success: false, error: data.error ?? "Verification failed" };
      }
    } catch (err) {
      console.error("Token verification error:", err);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include", // Include cookies
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear state regardless of API response
      setState({
        isAdmin: false,
        adminEmail: null,
  twoFactorEnabled: false,
  twoFactorMethod: null,
        isLoading: false,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, verifyToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
