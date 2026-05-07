import { useEffect, useState } from "react";
import { API_BASE } from "../lib/constants";
import { use2FAVerification, type TwoFAMethod } from "./use2FAVerification";

type SetupStep = "status" | "method-select" | "confirm-code" | "success";

export interface UseAdmin2FASetupResult {
  // State
  step: SetupStep;
  phone: string;
  error: string | null;
  loading: boolean;
  method: TwoFAMethod | null;
  confirmationCode: string;
  codeTimeLeft: number;
  resendCountdown: number;
  resendDisabled: boolean;
  twoFactorEnabled: boolean;
  twoFactorMethod: TwoFAMethod | null;

  // Handlers
  handlePhoneChange: (phone: string) => void;
  handleStartSetup: () => void;
  handleMethodSelect: (selectedMethod: TwoFAMethod) => void;
  handleSendTestCode: () => Promise<void>;
  handleConfirmCode: () => Promise<void>;
  handleCancel: () => void;
  handleCodeInput: (digits: string) => void;
  handleResend: () => Promise<void>;
}

/**
 * Hook for managing 2FA setup flow in Admin2FASetup component.
 * Handles method selection, code sending, verification, and success states.
 */
export function useAdmin2FASetup(
  initialTwoFactorEnabled = false,
  initialTwoFactorMethod: TwoFAMethod | null = null,
): UseAdmin2FASetupResult {
  const twoFA = use2FAVerification();

  const [step, setStep] = useState<SetupStep>("status");
  const [phone, setPhone] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    initialTwoFactorEnabled,
  );
  const [twoFactorMethod, setTwoFactorMethod] = useState(
    initialTwoFactorMethod,
  );

  useEffect(() => {
    setTwoFactorEnabled(initialTwoFactorEnabled);
    setTwoFactorMethod(initialTwoFactorMethod);
  }, [initialTwoFactorEnabled, initialTwoFactorMethod]);

  const handleStartSetup = () => {
    setStep("method-select");
    twoFA.setMethod(null);
    setPhone("");
    twoFA.setConfirmationCode("");
    twoFA.setError(null);
  };

  const handleMethodSelect = (selectedMethod: TwoFAMethod) => {
    twoFA.setMethod(selectedMethod);
    twoFA.setError(null);
  };

  const handleSendTestCode = async () => {
    // Validate inputs
    if (!twoFA.method) {
      twoFA.setError("Please select a method");
      return;
    }

    if (twoFA.method === "sms" && !phone) {
      twoFA.setError("Phone number is required for SMS");
      return;
    }

    twoFA.setError(null);
    twoFA.setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/setup-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          method: twoFA.method,
          phone: twoFA.method === "sms" ? phone : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStep("confirm-code");
        twoFA.startTimer();
      } else {
        twoFA.setError(data.error || "Failed to send test code");
      }
    } catch (err) {
      console.error("Error sending test code:", err);
      twoFA.setError("Network error. Please try again.");
    } finally {
      twoFA.setLoading(false);
    }
  };

  const handleConfirmCode = async () => {
    if (twoFA.confirmationCode.length !== 6) {
      twoFA.setError("Please enter a 6-digit code");
      return;
    }

    twoFA.setError(null);
    twoFA.setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/confirm-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: twoFA.confirmationCode }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStep("success");
        setTwoFactorEnabled(true);
        setTwoFactorMethod(twoFA.method);

        // Reset after 3 seconds
        setTimeout(() => {
          setStep("status");
          twoFA.reset();
          setPhone("");
        }, 3000);
      } else {
        twoFA.setError(data.error || "Invalid code");
        twoFA.setConfirmationCode("");
      }
    } catch (err) {
      console.error("Error confirming 2FA:", err);
      twoFA.setError("Network error. Please try again.");
    } finally {
      twoFA.setLoading(false);
    }
  };

  const handleCancel = () => {
    setStep("status");
    twoFA.reset();
    setPhone("");
  };

  const handlePhoneChange = (newPhone: string) => {
    setPhone(newPhone);
  };

  const handleResend = () => twoFA.handleResendCode(handleSendTestCode);

  return {
    step,
    phone,
    error: twoFA.error,
    loading: twoFA.loading,
    method: twoFA.method,
    confirmationCode: twoFA.confirmationCode,
    codeTimeLeft: twoFA.codeTimeLeft,
    resendCountdown: twoFA.resendCountdown,
    resendDisabled: twoFA.resendDisabled,
    twoFactorEnabled,
    twoFactorMethod,
    handleCodeInput: twoFA.handleCodeInput,
    handlePhoneChange,
    handleStartSetup,
    handleMethodSelect,
    handleSendTestCode,
    handleConfirmCode,
    handleCancel,
    handleResend,
  };
}
