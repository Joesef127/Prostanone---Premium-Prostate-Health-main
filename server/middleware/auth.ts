import { Context, Next } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export interface AdminPayload {
  adminId: number;
  email: string;
  phone?: string;
}

export type AdminEnv = { Variables: { admin: AdminPayload } };

// --- Module-level guards and derived secrets ---
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required");

const jwtSecret = process.env.JWT_SECRET;

const deviceCookieSecret = crypto
  .createHmac("sha256", jwtSecret)
  .update("device-cookie")
  .digest("hex");

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// --- Internal helpers ---

function verifyJWT(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, jwtSecret) as AdminPayload;
  } catch {
    return null;
  }
}

function verifyTrustDeviceCookie(cookieValue: string, adminId: number): boolean {
  try {
    const [signature, storedAdminId, expiryTime, nonce] = cookieValue.split(".");
    if (!signature || !storedAdminId || !expiryTime || !nonce) return false;
    if (storedAdminId !== String(adminId)) return false;

    const expiry = parseInt(expiryTime, 10);
    if (isNaN(expiry) || Date.now() > expiry) return false;

    const payload = `${storedAdminId}.${expiryTime}.${nonce}`;
    const expectedSignature = crypto
      .createHmac("sha256", deviceCookieSecret)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );
  } catch {
    return false;
  }
}

// --- Exported functions ---

export function createTrustDeviceCookie(adminId: number): string {
  const expiryTime = Date.now() + SEVEN_DAYS_MS;
  const nonce = crypto.randomBytes(16).toString("hex");
  const payload = `${adminId}.${expiryTime}.${nonce}`;

  const signature = crypto
    .createHmac("sha256", deviceCookieSecret)
    .update(payload)
    .digest("hex");

  return `${signature}.${payload}`;
}

export async function requireAdmin(c: Context<AdminEnv>, next: Next) {
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : getCookie(c, "admin_token");

  if (!token) {
    console.warn("requireAdmin: no token presented", { ip: c.req.header("x-real-ip") });
    return c.json({ error: "Unauthorized" }, 401);
  }

  const payload = verifyJWT(token);
  if (!payload) {
    console.warn("requireAdmin: invalid or expired token", { ip: c.req.header("x-real-ip") });
    return c.json({ error: "Invalid or expired session" }, 401);
  }

  c.set("admin", payload);
  await next();
}

export function isTrustedDevice(c: Context, adminId: number): boolean {
  const trustCookie = getCookie(c, "trust_device_token");
  if (!trustCookie) return false;
  return verifyTrustDeviceCookie(trustCookie, adminId);
}

export function setTrustDeviceCookie(c: Context, value: string): void {
  setCookie(c, "trust_device_token", value, {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
}

export function clearTrustDeviceCookie(c: Context): void {
  deleteCookie(c, "trust_device_token", {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",
  });
}

export function setAdminTokenCookie(c: Context, token: string): void {
  setCookie(c, "admin_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export function clearAdminTokenCookie(c: Context): void {
  deleteCookie(c, "admin_token", {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",
  });
}