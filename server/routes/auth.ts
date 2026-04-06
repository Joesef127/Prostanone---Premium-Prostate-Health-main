import { Hono } from 'hono';
import { setCookie, deleteCookie } from 'hono/cookie';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { admins } from '../db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin, type AdminEnv } from '../middleware/auth';

const auth = new Hono<AdminEnv>();

// POST /api/auth/login
auth.post('/login', async (c) => {
  const { email, password } = await c.req.json<{ email: string; password: string }>();

  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400);
  }

  const [admin] = await db.select().from(admins).where(eq(admins.email, email.toLowerCase().trim()));
  if (!admin) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const token = jwt.sign(
    { adminId: admin.id, email: admin.email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  setCookie(c, 'admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return c.json({ success: true, email: admin.email });
});

// POST /api/auth/logout
auth.post('/logout', (c) => {
  deleteCookie(c, 'admin_token', { path: '/' });
  return c.json({ success: true });
});

// GET /api/auth/me
auth.get('/me', requireAdmin, (c) => {
  const admin = c.get('admin');
  return c.json({ email: admin.email });
});

export default auth;
