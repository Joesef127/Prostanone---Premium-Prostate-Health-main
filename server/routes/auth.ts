import { Hono } from "hono";
// import { setCookie, deleteCookie } from "hono/cookie";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { db } from "../db";
import { admins } from "../db/schema";
import { eq } from "drizzle-orm";
import {
  requireAdmin,
  type AdminEnv,
  createTrustDeviceCookie,
  setTrustDeviceCookie,
  // clearTrustDeviceCookie,
  isTrustedDevice,
  setAdminTokenCookie,
  clearAdminTokenCookie,
} from "../middleware/auth";
import {
  generateVerificationCode,
  getTokenExpiryTime,
  isTokenExpired,
} from "../utils/2fa";
import { sendVerificationEmail } from "../utils/email";
import { sendVerificationSMS } from "../utils/sms";

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required");
const jwtSecret = process.env.JWT_SECRET;

const E164_RE = /^\+[1-9]\d{7,14}$/;

const auth = new Hono<AdminEnv>();

// HMACs the verification code using the JWT secret to prevent token forgery if the database is compromised
function hmacCode(code: string): string {
  return crypto.createHmac("sha256", jwtSecret).update(code).digest("hex");
}

// POST /api/auth/login
// Step 1: Validate email + password, send verification code
// Returns: { pendingVerification: true, method: 'email' | 'sms' }
auth.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json<{
      email: string;
      password: string;
    }>();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email.toLowerCase().trim()));

    if (!admin) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const passwordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordValid) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    // 2FA not set up — issue JWT directly
    if (!admin.twoFactorEnabled) {
      const token = jwt.sign(
        { adminId: admin.id, email: admin.email },
        jwtSecret,
        { expiresIn: "7d" },
      );

      setAdminTokenCookie(c, token);

      return c.json({
        success: true,
        email: admin.email,
        twoFactorEnabled: false,
      });
    }

    if (!admin.twoFactorMethod) {
      console.error(
        "[/api/auth/login] 2FA enabled but no delivery method configured",
        {
          adminId: admin.id,
        },
      );
      return c.json(
        { error: "Two-factor authentication is misconfigured" },
        500,
      );
    }

    // Trusted device — skip 2FA, issue JWT directly
    if (isTrustedDevice(c, admin.id)) {
      const token = jwt.sign(
        { adminId: admin.id, email: admin.email },
        jwtSecret,
        { expiresIn: "7d" },
      );

      setAdminTokenCookie(c, token);

      return c.json({
        success: true,
        email: admin.email,
        twoFactorEnabled: true,
        twoFactorMethod: admin.twoFactorMethod,
        trustedDevice: true,
      });
    }

    // Generate and store verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = getTokenExpiryTime();
    const loginChallenge = crypto.randomBytes(32).toString("hex");
    const challengeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db
      .update(admins)
      .set({
        verificationToken: hmacCode(verificationCode),
        verificationTokenExpiresAt: expiresAt,
        loginChallenge,
        loginChallengeExpiresAt: challengeExpiresAt,
      })
      .where(eq(admins.id, admin.id));

    // Send verification code via configured method
    let sendSuccess = false;
    if (admin.twoFactorMethod === "email") {
      sendSuccess = await sendVerificationEmail(
        admin.email,
        verificationCode,
        expiresAt,
      );
    } else if (admin.twoFactorMethod === "sms" && admin.phone) {
      sendSuccess = await sendVerificationSMS(
        admin.phone,
        verificationCode,
        expiresAt,
      );
    }

    if (!sendSuccess) {
      return c.json(
        {
          error: `Failed to send verification code via ${admin.twoFactorMethod}. Please try again.`,
        },
        500,
      );
    }

    return c.json({
      pendingVerification: true,
      method: admin.twoFactorMethod,
      email: admin.email.replace(
        /^(.)(.*)(@.*)$/,
        (_, a, b, c) => `${a}${"*".repeat(b.length)}${c}`,
      ),
      loginChallenge, // frontend holds this, sends it back with OTP
    });
  } catch (err) {
    console.error("[/api/auth/login]", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /api/auth/verify-token
// Step 2: Verify OTP code, issue JWT + optional trust device cookie
auth.post("/verify-token", async (c) => {
  try {
    const { email, verificationToken, trustThisDevice, loginChallenge } =
      await c.req.json<{
        email: string;
        verificationToken: string;
        trustThisDevice?: boolean;
        loginChallenge: string;
      }>();

    if (!email || !verificationToken || !loginChallenge) {
      return c.json(
        {
          error: "Email, verification token, and login challenge are required",
        },
        400,
      );
    }

    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email.toLowerCase().trim()));

    if (!admin) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    if (!admin.twoFactorEnabled) {
      return c.json(
        { error: "Two-factor authentication is not enabled for this account" },
        400,
      );
    }

    // Validate challenge — proves password was checked in this session
    if (
      !admin.loginChallenge ||
      !admin.loginChallengeExpiresAt ||
      Date.now() > admin.loginChallengeExpiresAt.getTime() ||
      !crypto.timingSafeEqual(
        Buffer.from(admin.loginChallenge),
        Buffer.from(loginChallenge),
      )
    ) {
      return c.json(
        { error: "Invalid or expired login session. Please log in again." },
        401,
      );
    }

    if (isTokenExpired(admin.verificationTokenExpiresAt)) {
      return c.json({ error: "Verification token has expired" }, 401);
    }

    const storedToken = admin.verificationToken;
    const incomingHash = hmacCode(verificationToken);

    if (
      !storedToken ||
      storedToken.length !== incomingHash.length ||
      !crypto.timingSafeEqual(
        Buffer.from(storedToken),
        Buffer.from(incomingHash),
      )
    ) {
      return c.json({ error: "Invalid verification token" }, 401);
    }

    // Consume challenge and clear token
    await db
      .update(admins)
      .set({
        verificationToken: null,
        verificationTokenExpiresAt: null,
        loginChallenge: null, // ← consumed, can't be reused
        loginChallengeExpiresAt: null,
        lastLoginAt: new Date(),
      })
      .where(eq(admins.id, admin.id));

    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      jwtSecret,
      { expiresIn: "7d" },
    );

    setAdminTokenCookie(c, token);

    if (trustThisDevice) {
      const trustCookie = createTrustDeviceCookie(admin.id);
      setTrustDeviceCookie(c, trustCookie);
    }

    return c.json({
      success: true,
      email: admin.email,
      twoFactorEnabled: admin.twoFactorEnabled,
      twoFactorMethod: admin.twoFactorMethod,
      trusted: trustThisDevice ?? false,
    });
  } catch (err) {
    console.error("[/api/auth/verify-token]", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /api/auth/resend-code
// Resends verification code without requiring password re-submission
// Body: { email }
auth.post("/resend-code", async (c) => {
  try {
    const { email, loginChallenge } = await c.req.json<{
      email: string;
      loginChallenge: string;
    }>();

    if (!email || !loginChallenge) {
      return c.json({ error: "Email and login challenge are required" }, 400);
    }

    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email.toLowerCase().trim()));

    // Fail silently if admin not found — prevents enumeration
    if (!admin || !admin.twoFactorEnabled || !admin.twoFactorMethod) {
      return c.json({ success: true });
    }

    // Validate challenge
    if (
      !admin.loginChallenge ||
      !admin.loginChallengeExpiresAt ||
      Date.now() > admin.loginChallengeExpiresAt.getTime() ||
      !crypto.timingSafeEqual(
        Buffer.from(admin.loginChallenge),
        Buffer.from(loginChallenge),
      )
    ) {
      return c.json({ error: "Invalid or expired login session. Please log in again." }, 401);
    }

    const verificationCode = generateVerificationCode();
    const expiresAt = getTokenExpiryTime();

    await db
      .update(admins)
      .set({
        verificationToken: hmacCode(verificationCode),
        verificationTokenExpiresAt: expiresAt,
        // Challenge stays valid — resend doesn't consume it
      })
      .where(eq(admins.id, admin.id));

    if (admin.twoFactorMethod === "email") {
      await sendVerificationEmail(admin.email, verificationCode, expiresAt);
    } else if (admin.twoFactorMethod === "sms" && admin.phone) {
      await sendVerificationSMS(admin.phone, verificationCode, expiresAt);
    }

    return c.json({ success: true });
  } catch (err) {
    console.error("[/api/auth/resend-code]", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /api/auth/setup-2fa
// Admin configures 2FA method (email or SMS) and phone number
// Requires authentication
auth.post("/setup-2fa", requireAdmin, async (c) => {
  try {
    const { method, phone } = await c.req.json<{
      method: "email" | "sms";
      phone?: string;
    }>();

    if (!method || !["email", "sms"].includes(method)) {
      return c.json(
        { error: "Invalid 2FA method. Must be 'email' or 'sms'" },
        400,
      );
    }

    if (method === "sms" && !phone) {
      return c.json({ error: "Phone number is required for SMS method" }, 400);
    }

    const admin = c.get("admin");

    let sanitizedPhone = phone;
    if (method === "sms") {
      const cleaned = phone!.replace(/\D/g, "");
      sanitizedPhone = `+${cleaned}`;

      // Validate against the same E.164 regex used in sms.ts
      if (!E164_RE.test(sanitizedPhone)) {
        return c.json(
          {
            error:
              "Invalid phone number. Must be in E.164 format (e.g. +2348012345678)",
          },
          400,
        );
      }
    }

    // Generate code and store it — 2FA is NOT enabled until confirmed
    const testCode = generateVerificationCode();
    const expiresAt = getTokenExpiryTime();

    await db
      .update(admins)
      .set({
        verificationToken: hmacCode(testCode),
        verificationTokenExpiresAt: expiresAt,
        pendingTwoFactorMethod: method,
        pendingPhone: method === "sms" ? sanitizedPhone : null,
      })
      .where(eq(admins.id, admin.adminId));

    let sendSuccess = false;
    if (method === "email") {
      sendSuccess = await sendVerificationEmail(
        admin.email,
        testCode,
        expiresAt,
      );
    } else if (method === "sms") {
      sendSuccess = await sendVerificationSMS(
        sanitizedPhone!,
        testCode,
        expiresAt,
      );
    }

    if (!sendSuccess) {
      return c.json(
        {
          error: `Failed to send verification code via ${method}. Please check your details and try again.`,
        },
        500,
      );
    }

    return c.json({
      success: true,
      pendingConfirmation: true,
      message: `A code has been sent via ${method}. Call /confirm-2fa with the code to activate.`,
      method,
    });
  } catch (err) {
    console.error("[/api/auth/setup-2fa]", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /api/auth/confirm-2fa
// Confirms 2FA setup by verifying the test code — only now is 2FA activated
auth.post("/confirm-2fa", requireAdmin, async (c) => {
  try {
    const { code } = await c.req.json<{ code: string }>();
    if (!code) return c.json({ error: "Verification code is required" }, 400);

    const admin = c.get("admin");
    const [row] = await db
      .select()
      .from(admins)
      .where(eq(admins.id, admin.adminId));

    if (!row) return c.json({ error: "Admin not found" }, 404);

    if (isTokenExpired(row.verificationTokenExpiresAt)) {
      return c.json(
        { error: "Code has expired. Please restart 2FA setup." },
        400,
      );
    }

    const storedToken = row.verificationToken;
    const incomingHash = hmacCode(code);

    if (
        !storedToken ||
        storedToken.length !== incomingHash.length ||
        !crypto.timingSafeEqual(
            Buffer.from(storedToken),
            Buffer.from(incomingHash),
        )
    ) {
      return c.json({ error: "Invalid verification code" }, 401);
    }

    // Code confirmed — now activate 2FA with the pending settings
    await db
      .update(admins)
      .set({
        twoFactorEnabled: true,
        twoFactorMethod: row.pendingTwoFactorMethod,
        phone: row.pendingPhone ?? row.phone,
        verificationToken: null,
        verificationTokenExpiresAt: null,
        pendingTwoFactorMethod: null,
        pendingPhone: null,
      })
      .where(eq(admins.id, admin.adminId));

    return c.json({
      success: true,
      message: `Two-factor authentication has been activated via ${row.pendingTwoFactorMethod}.`,
    });
  } catch (err) {
    console.error("[/api/auth/confirm-2fa]", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /api/auth/me
auth.get("/me", requireAdmin, async (c) => {
  const admin = c.get("admin");
  const [row] = await db
    .select()
    .from(admins)
    .where(eq(admins.id, admin.adminId));

  if (!row) return c.json({ error: "Admin not found" }, 404);

  return c.json({
    email: row.email,
    twoFactorEnabled: row.twoFactorEnabled,
    twoFactorMethod: row.twoFactorMethod ?? null,
  });
});

// POST /api/auth/logout
auth.post("/logout", (c) => {
  clearAdminTokenCookie(c);
  // trust_device_token intentionally NOT cleared — persists for 7 days across sessions
  return c.json({ success: true });
});

export default auth;
