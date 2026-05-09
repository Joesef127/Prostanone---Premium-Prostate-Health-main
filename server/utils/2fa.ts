import crypto from 'crypto';

/**
 * Generates a cryptographically secure random 6-digit verification code.
 * Range: 100000–999999 (inclusive), ensuring always 6 digits.
 */
export function generateVerificationCode(): string {
  // randomInt upper bound is exclusive, so 1000000 gives us 100000–999999
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Returns true if the token has expired or if expiresAt is null/undefined.
 * Fail-closed: a missing expiry is treated as already expired.
 */
export function isTokenExpired(expiresAt: Date | null | undefined): boolean {
  if (!expiresAt) return true;
  return Date.now() >= expiresAt.getTime();
}

/**
 * Returns an expiry Date offset from now by the given duration.
 * Defaults to 5 minutes. Pass a different value for other token types
 * (e.g. 15 * 60 * 1000 for a 15-minute magic link).
 */
export function getTokenExpiryTime(durationMs: number = 5 * 60 * 1000): Date {
  return new Date(Date.now() + durationMs);
}