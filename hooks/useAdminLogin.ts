import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { use2FAVerification, type TwoFAMethod } from './use2FAVerification';
import { API_BASE } from '@/lib/constants';

type LoginStep = 'password' | 'method-select' | 'code-input' | 'complete';

export interface UseAdminLoginResult {
  email: string;
  password: string;
  showPassword: boolean;
  step: LoginStep;
  pendingVerification: boolean;
  maskedEmail: string | null;
  trustThisDevice: boolean;
  method: TwoFAMethod | null;
  confirmationCode: string;
  error: string | null;
  loading: boolean;
  codeTimeLeft: number;
  resendCountdown: number;
  resendDisabled: boolean;
  handleEmailChange: (email: string) => void;
  handlePasswordChange: (password: string) => void;
  toggleShowPassword: () => void;
  handlePasswordSubmit: (e: React.FormEvent) => Promise<void>;
  handleMethodSelect: (selectedMethod: TwoFAMethod) => void;
  handleCodeInput: (digits: string) => void;
  handleCodeSubmit: (code?: string) => Promise<void>;
  handleResendCode: () => Promise<void>;
  setTrustThisDevice: (trust: boolean) => void;
}

export function useAdminLogin(): UseAdminLoginResult {
  const { login, verifyToken } = useAuth();
  const twoFA = use2FAVerification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<LoginStep>('password');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
  const [trustThisDevice, setTrustThisDevice] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    twoFA.setError(null);

    try {
      const result = await login(email, password);

      if (result.success) {
        if (result.step === 'complete') {
          setStep('complete');
        } else if (result.step === 'method-select') {
          setStep('method-select');
          setPendingVerification(true);
          twoFA.setMethod(result.method || 'email');
          setMaskedEmail(result.email || null);
          twoFA.startTimer(); // drives codeTimeLeft in the UI
          twoFA.setError(null);
        }
      } else {
        twoFA.setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      twoFA.setError('Network error. Please try again.');
    }
  };

  const handleMethodSelect = (selectedMethod: TwoFAMethod) => {
    setStep('code-input');
    twoFA.setMethod(selectedMethod);
    twoFA.setConfirmationCode('');
    twoFA.setError(null);
  };

  const handleCodeInput = (digits: string) => {
    if (digits.length <= 6) {
      twoFA.setConfirmationCode(digits);
      if (digits.length === 6) {
        handleCodeSubmit(digits);
      }
    }
  };

  const handleCodeSubmit = async (code?: string) => {
    twoFA.setError(null);
    twoFA.setLoading(true);

    try {
      const result = await verifyToken(
        email,
        code || twoFA.confirmationCode,
        trustThisDevice,
      );

      if (result.success) {
        setStep('complete');
      } else {
        twoFA.setError(result.error || 'Verification failed');
        twoFA.setConfirmationCode('');
      }
    } catch (err) {
      console.error('Token verification error:', err);
      twoFA.setError('Network error. Please try again.');
    } finally {
      twoFA.setLoading(false);
    }
  };

  const handleResendCode = async () => {
  twoFA.setError(null);

  try {
    await twoFA.handleResendCode(async () => {
      const res = await fetch(`${API_BASE}/api/auth/resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to resend code");
      }
    });
  } catch (err) {
    console.error("Resend code error:", err);
    twoFA.setError("Failed to resend code. Please try again.");
  }
};

  return {
    email,
    password,
    showPassword,
    step,
    pendingVerification,
    maskedEmail,
    trustThisDevice,
    method: twoFA.method,
    confirmationCode: twoFA.confirmationCode,
    error: twoFA.error,
    loading: twoFA.loading,
    codeTimeLeft: twoFA.codeTimeLeft,
    resendCountdown: twoFA.resendCountdown,
    resendDisabled: twoFA.resendDisabled,
    handleEmailChange: (v) => setEmail(v),
    handlePasswordChange: (v) => setPassword(v),
    toggleShowPassword: () => setShowPassword((p) => !p),
    handlePasswordSubmit,
    handleMethodSelect,
    handleCodeInput,
    handleCodeSubmit,
    handleResendCode,
    setTrustThisDevice,
  };
}