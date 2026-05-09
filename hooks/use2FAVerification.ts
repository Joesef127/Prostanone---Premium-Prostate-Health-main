import { useState, useEffect } from "react";

export type TwoFAMethod = "email" | "sms";

export interface Use2FAVerificationResult {
  // State
  method: TwoFAMethod | null;
  confirmationCode: string;
  error: string | null;
  loading: boolean;
  codeTimeLeft: number;
  resendCountdown: number;
  resendDisabled: boolean;
  
  // Handlers
  setMethod: (method: TwoFAMethod | null) => void;
  setConfirmationCode: (code: string) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  handleCodeInput: (digits: string) => void;
  handleResendCode: (onResend: () => Promise<void>) => Promise<void>;
  reset: () => void;
  startTimer: () => void;
}

/**
 * Shared hook for handling 2FA verification logic:
 * - Code expiry timer (5 minutes)
 * - Resend cooldown timer (30 seconds)
 * - Code input validation
 * - Error and loading state management
 */
export function use2FAVerification(): Use2FAVerificationResult {
  const [method, setMethod] = useState<TwoFAMethod | null>(null);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [codeExpiresAt, setCodeExpiresAt] = useState<Date | null>(null);
  const [codeTimeLeft, setCodeTimeLeft] = useState(0);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);

  // Code expiry countdown timer
  useEffect(() => {
    if (!codeExpiresAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((codeExpiresAt.getTime() - now.getTime()) / 1000);

      if (diff <= 0) {
        setError("Verification code expired. Please request a new one.");
        setCodeExpiresAt(null);
        setCodeTimeLeft(0);
        setConfirmationCode("");
        clearInterval(interval);
      } else {
        setCodeTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [codeExpiresAt]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCountdown <= 0) {
      setResendDisabled(false);
      return;
    }

    const interval = setInterval(() => {
      setResendCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [resendCountdown]);

  const handleCodeInput = (digits: string) => {
    if (digits.length <= 6) {
      setConfirmationCode(digits);
    }
  };

  // Add to use2FAVerification
  const startTimer = () => {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);
    setCodeExpiresAt(expiresAt);
    setCodeTimeLeft(300);
  };

  const handleResendCode = async (onResend: () => Promise<void>) => {
    setError(null);
    setLoading(true);
    setResendDisabled(true);
    setResendCountdown(30);

    try {
      await onResend();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);
      setCodeExpiresAt(expiresAt);
      setCodeTimeLeft(300);
      setConfirmationCode("");
      setError(null);
    } catch (err) {
      setError("Failed to resend code");
      setResendDisabled(false);
      setResendCountdown(0);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMethod(null);
    setConfirmationCode("");
    setError(null);
    setLoading(false);
    setCodeExpiresAt(null);
    setCodeTimeLeft(0);
    setResendCountdown(0);
    setResendDisabled(false);
  };

  return {
    method,
    confirmationCode,
    error,
    loading,
    setLoading,
    codeTimeLeft,
    resendCountdown,
    resendDisabled,
    setMethod,
    setConfirmationCode,
    setError,
    handleCodeInput,
    handleResendCode,
    reset,
startTimer,
  };
}
