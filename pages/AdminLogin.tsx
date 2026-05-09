import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAdminLogin } from "../hooks/useAdminLogin";
import TokenInput from "@/components/ui/TokenInput";
import CodeCountdown from "../components/CodeCountdown";
import Button from "@/components/Button";

const AdminLogin: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const login = useAdminLogin();

  // Redirect when login completes
  useEffect(() => {
    if (isAdmin || login.step === "complete") {
      navigate("/admin/profile", { replace: true });
    }
  }, [isAdmin, login.step, navigate]);

  const minutes = Math.floor(login.codeTimeLeft / 60);
  const seconds = login.codeTimeLeft % 60;
  const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="pt-20 bg-background min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-surface border border-border rounded-2xl p-5 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-text">Admin Access</h1>
            <p className="text-text-muted text-sm mt-1">
              Sign in to manage site content
            </p>
          </div>

          {/* Error Alert */}
          {login.error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs sm:text-sm flex gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{login.error}</span>
            </div>
          )}

          {/* STEP 1: Password Form */}
          {login.step === "password" && (
            <form onSubmit={login.handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    value={login.email}
                    onChange={(e) => login.handleEmailChange(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                    placeholder="admin@example.com"
                    disabled={login.loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type={login.showPassword ? "text" : "password"}
                    value={login.password}
                    onChange={(e) => login.handlePasswordChange(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                    placeholder="••••••••"
                    disabled={login.loading}
                  />
                  <button
                    type="button"
                    onClick={login.toggleShowPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                    tabIndex={-1}
                  >
                    {login.showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={login.loading}
                className="w-full py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {login.loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Method Selection */}
          {login.step === "method-select" && login.pendingVerification && (
            <div className="space-y-5">
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-xs sm:text-sm text-blue-700 dark:text-blue-400">
                A verification code has been sent to your{" "}
                <strong>{login.method === "email" ? "email" : "phone"}</strong>.
              </div>

              {(login.maskedEmail || login.email) && (
                <div className="bg-gray-100 dark:bg-gray-800/20 rounded-lg p-2.5 text-center text-xs sm:text-sm text-text-muted">
                  {login.maskedEmail || login.email}
                </div>
              )}

              <button
                onClick={() =>
                  login.handleMethodSelect(login.method || "email")
                }
                disabled={login.loading}
                className="w-full py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {login.loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Loading…
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          )}

          {/* STEP 3: Code Input */}
          {login.step === "code-input" && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-xs sm:text-sm text-blue-700 dark:text-blue-400">
                Enter the 6-digit code sent to your{" "}
                {login.method === "email" ? "email" : "phone"}
              </div>

              <div className="space-y-3">
                {/* Token Input Component (6 fields) */}
                <TokenInput
                  value={login.confirmationCode}
                  onChange={login.handleCodeInput}
                  disabled={login.loading}
                  error={login.error}
                />

                {/* Expiry Timer */}
                <div
                  className={`text-xs sm:text-sm font-medium ${
                    login.codeTimeLeft < 60
                      ? "text-red-600 dark:text-red-400"
                      : "text-text-muted"
                  }`}
                >
                  ⏱️ Code expires in {formatted}
                </div>
              </div>

              {/* Resend Button */}
              <button
                type="button"
                onClick={login.handleResendCode}
                disabled={login.resendDisabled || login.loading}
                className="w-full text-xs sm:text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {login.resendDisabled
                  ? `Resend code in ${login.resendCountdown}s`
                  : "Resend code"}
              </button>

              {/* Trust Device Checkbox */}
              <label className="flex items-center gap-2 p-3 border border-border rounded-lg cursor-pointer hover:bg-surface/50">
                <input
                  type="checkbox"
                  checked={login.trustThisDevice}
                  onChange={(e) => login.setTrustThisDevice(e.target.checked)}
                  className="w-4 h-4 text-primary rounded mt-0.5"
                />
                <div>
                  <p className="font-medium text-sm text-text">
                    Trust this device
                  </p>
                  <p className="text-xs text-text-muted">
                    You won't need a code on this device for the next 7 days
                  </p>
                </div>
              </label>

              <button
                onClick={() => login.handleCodeSubmit(login.confirmationCode)}
                disabled={login.confirmationCode.length !== 6 || login.loading}
                className="w-full py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {login.loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Verifying…
                  </>
                ) : (
                  "Verify Code"
                )}
              </button>
            </div>
          )}

          {/* Success State */}
          {login.step === "complete" && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto" />
              <h2 className="text-lg font-semibold text-text">
                Login Successful
              </h2>
              <p className="text-sm text-text-muted">
                Redirecting to admin dashboard...
              </p>
              <Button
                variant="primary"
                size="sm"
                children="Go to dashboard"
                className="rounded-lg!"
                onClick={() => navigate("/admin/profile")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
