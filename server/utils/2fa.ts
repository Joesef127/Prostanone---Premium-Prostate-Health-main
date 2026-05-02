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
 * Generates a SHA-256 device fingerprint from user agent and IP address.
 * A separator is used to prevent hash collision across input boundaries.
 *
 * IMPORTANT: Fingerprints are identifiers, not secrets.
 * Do not rely on this alone for authentication — pair with session tokens.
 */
export function generateDeviceFingerprint(userAgent: string, ipAddress: string): string {
  if (!userAgent || !ipAddress) {
    throw new Error('userAgent and ipAddress are required to generate a device fingerprint');
  }

  return crypto
    .createHash('sha256')
    .update(`${userAgent}:${ipAddress}`)
    .digest('hex');
}

/**
 * Returns true if the token has expired or if expiresAt is null/undefined.
 * Fail-closed: a missing expiry is treated as already expired.
 */
export function isTokenExpired(expiresAt: Date | null | undefined): boolean {
  if (!expiresAt) return true;
  return Date.now() > expiresAt.getTime();
}

/**
 * Returns an expiry Date offset from now by the given duration.
 * Defaults to 5 minutes. Pass a different value for other token types
 * (e.g. 15 * 60 * 1000 for a 15-minute magic link).
 */
export function getTokenExpiryTime(durationMs: number = 5 * 60 * 1000): Date {
  return new Date(Date.now() + durationMs);
}

// ---------------------------------------------------------------------------
// IP extraction
// ---------------------------------------------------------------------------

const IPV4_RE = /^(\d{1,3}\.){3}\d{1,3}$/;
const IPV6_RE = /^[\da-f:]+$/i;

function isValidIP(ip: string): boolean {
  const stripped = ip.startsWith('[') && ip.endsWith(']') ? ip.slice(1, -1) : ip;
  return IPV4_RE.test(stripped) || IPV6_RE.test(stripped);
}

/**
 * Extracts the real client IP from request headers, accounting for reverse proxies.
 *
 * @param headers          - Incoming request headers (e.g. req.headers).
 * @param trustedProxyCount - Number of proxy hops you own/control (default: 1).
 *                           The function skips that many IPs from the right of
 *                           x-forwarded-for, then picks the next one — which is
 *                           the first IP your infrastructure cannot have forged.
 * @returns A validated IP string, or null if none could be extracted.
 *
 * SECURITY NOTE:
 * x-forwarded-for is client-controlled. Never trust the leftmost value without
 * knowing exactly how many proxies sit in front of your app. Calibrate
 * trustedProxyCount to your actual deployment (1 for a single load balancer, 2
 * for a CDN + load balancer, etc.).
 */
export function getClientIP(
  headers: Record<string, string | string[] | undefined>,
  trustedProxyCount: number = 1,
): string | null {
  const raw = headers['x-forwarded-for'];
  const forwarded = Array.isArray(raw) ? raw.join(',') : raw;

  if (forwarded) {
    const ips = forwarded.split(',').map((ip) => ip.trim());
    const targetIndex = ips.length - trustedProxyCount;

    if (targetIndex >= 0) {
      const candidate = ips[targetIndex];
      if (candidate && isValidIP(candidate)) return candidate;
    }
  }

  // x-real-ip is set by Nginx and reflects the connecting client
  const realIp = headers['x-real-ip'];
  const realIpStr = Array.isArray(realIp) ? realIp[0] : realIp;
  if (realIpStr && isValidIP(realIpStr.trim())) return realIpStr.trim();

  return null; // Caller decides how to handle missing IP
}