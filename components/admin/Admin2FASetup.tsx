import React from "react";
import { Shield, AlertCircle, CheckCircle, Loader, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAdmin2FASetup } from "../../hooks/useAdmin2FASetup";
import TokenInput from "../ui/TokenInput";
import PhoneInput from "../PhoneInput";

import { motion } from "framer-motion";
import Button from "../Button";
import FormError from "./ui/FormError";

interface Admin2FASetupProps {
  twoFactorEnabled?: boolean;
  twoFactorMethod?: "email" | "sms" | null;
  onStartSetup: () => void;
  onCancelSetup: () => void;
  showSettings?: boolean;
}

const Admin2FASetup: React.FC<Admin2FASetupProps> = ({
  twoFactorEnabled = false,
  twoFactorMethod = null,
  onStartSetup,
  onCancelSetup,
  showSettings,
}) => {
  const { adminEmail } = useAuth();
  const setup2FA = useAdmin2FASetup(twoFactorEnabled, twoFactorMethod);

  const handleClose = () => {  
    setup2FA.handleCancel();  
    onCancelSetup();  
  }; 

  return (
    <div className="">
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className={`fixed inset-0 z-9998 bg-black/50 backdrop-blur-sm ${showSettings ? "block" : "hidden"}`}
        aria-hidden="true"
        onClick={handleClose} 
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          key="dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          initial={{ opacity: 0, scale: 0.93, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`relative pointer-events-auto w-full max-w-lg sm:max-w-xl lg:max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden p-4 sm:p-6 md:p-8 ${showSettings ? "block" : "hidden"}`}
        >
          <button
            onClick={handleClose} 
            className="absolute right-[3%] top-[3%] text-text-muted border border-transparent hover:text-text hover:border-primary rounded-2xl p-1.5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* STEP 1: Status */}
          {setup2FA.step === "status" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-text mb-2">
                    Two-Factor Authentication
                  </h2>
                  <p className="text-text-muted text-xs sm:text-sm mb-4">
                    Add an extra layer of security to your admin account. You'll
                    receive a verification code via email or SMS when you log
                    in.
                  </p>

                  <div className="bg-surface border border-border rounded-xl p-3 mb-6">
                    <p className="text-xs sm:text-sm text-text-muted mb-1">
                      Current status
                    </p>
                    <div className="flex items-center gap-2">
                      {setup2FA.twoFactorEnabled ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span className="font-semibold text-text text-sm sm:text-base">
                            Enabled via {setup2FA.twoFactorMethod?.toUpperCase()}
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                          <span className="font-semibold text-text text-sm sm:text-base">
                            Not enabled
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={setup2FA.handleStartSetup}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    {setup2FA.twoFactorEnabled
                      ? "Change 2FA Method"
                      : "Set Up 2FA"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Method Selection */}
          {setup2FA.step === "method-select" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-text">
                  Choose Verification Method
                </h3>
                {/* <button
                  onClick={setup2FA.handleCancel}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  <X className="w-5 h-5" />
                </button> */}
              </div>

              {setup2FA.error && <FormError error={setup2FA.error} />}

              <div className="space-y-3">
                {/* Email Option */}
                <label
                  className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    setup2FA.method === "email"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-surface/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value="email"
                    checked={setup2FA.method === "email"}
                    onChange={(e) =>
                      setup2FA.handleMethodSelect(e.target.value as "email")
                    }
                    className="w-4 h-4 text-primary mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-text text-sm sm:text-base">
                      Email
                    </p>
                    <p className="text-text-muted text-xs sm:text-sm">
                      Receive verification code at {adminEmail}
                    </p>
                  </div>
                </label>

                {/* SMS Option */}
                <label
                  className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    setup2FA.method === "sms"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-surface/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value="sms"
                    checked={setup2FA.method === "sms"}
                    onChange={(e) =>
                      setup2FA.handleMethodSelect(e.target.value as "sms")
                    }
                    className="w-4 h-4 text-primary mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-text text-sm sm:text-base">
                      SMS
                    </p>
                    <p className="text-text-muted text-xs sm:text-sm">
                      Receive verification code via text message
                    </p>
                  </div>
                </label>
              </div>

              {/* Phone Input (if SMS selected) */}
              {setup2FA.method === "sms" && (
                <div className="pt-4 border-t border-border">
                  <PhoneInput
                    value={setup2FA.phone}
                    onChange={setup2FA.handlePhoneChange}
                    required={true}
                    error={
                      setup2FA.error && setup2FA.error.includes("phone")
                        ? setup2FA.error
                        : null
                    }
                    disabled={setup2FA.loading}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 pt-4">
                <button
                  onClick={setup2FA.handleSendTestCode}
                  disabled={
                    !setup2FA.method ||
                    (setup2FA.method === "sms" && !setup2FA.phone) ||
                    setup2FA.loading
                  }
                  className="flex-1 py-2.5 rounded-lg bg-primary text-white font-semibold text-xs sm:text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {setup2FA.loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Send Test Code"
                  )}
                </button>
                <button
                  onClick={setup2FA.handleCancel}
                  disabled={setup2FA.loading}
                  className="px-4 py-2.5 rounded-lg border border-border text-text hover:bg-surface/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirm Code */}
          {setup2FA.step === "confirm-code" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text">
                  Verify Your Code
                </h3>
                {/* <button
                  onClick={setup2FA.handleCancel}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  <X className="w-5 h-5" />
                </button> */}
              </div>

              {setup2FA.error && <FormError error={setup2FA.error} />}

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-xs sm:text-sm text-blue-700 dark:text-blue-400">
                A test code has been sent to your{" "}
                {setup2FA.method === "email" ? "email" : "phone"}. Enter it below
                to activate 2FA.
              </div>

              <div className="space-y-4">
                <p className="text-xs sm:text-sm font-medium text-text">
                  6-Digit Code
                </p>
                <TokenInput
                  value={setup2FA.confirmationCode}
                  onChange={setup2FA.handleCodeInput}
                  disabled={setup2FA.loading}
                  error={setup2FA.error}
                />

                {/* Resend Button */}
              <button
                type="button"
                onClick={setup2FA.handleResend}
                disabled={setup2FA.resendDisabled || setup2FA.loading}
                className="w-full text-xs sm:text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {setup2FA.resendDisabled
                  ? `Resend code in ${setup2FA.resendCountdown}s`
                  : "Resend code"}
              </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-2 gap-3">
                <button
                  onClick={setup2FA.handleConfirmCode}
                  disabled={
                    setup2FA.confirmationCode.length !== 6 || setup2FA.loading
                  }
                  className="flex-1 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 col-span-2 sm:col-span-1"
                >
                  {setup2FA.loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Confirming…
                    </>
                  ) : (
                    "Confirm & Activate"
                  )}
                </button>
                <button
                  onClick={setup2FA.handleCancel}
                  disabled={setup2FA.loading}
                  className="px-4 py-2.5 rounded-lg border border-border text-text hover:bg-surface/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success */}
          {setup2FA.step === "success" && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto" />
              <h3 className="text-lg font-bold text-text">
                2FA Activated Successfully!
              </h3>
              <p className="text-text-muted text-sm">
                Your account is now protected. You'll receive a verification
                code via <strong>{setup2FA.twoFactorMethod?.toUpperCase()}</strong>{" "}
                on your next login.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Admin2FASetup;
