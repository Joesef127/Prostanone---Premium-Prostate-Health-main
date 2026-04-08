import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import jwt from 'jsonwebtoken';

export interface AdminPayload {
  adminId: number;
  email: string;
}

export type AdminEnv = { Variables: { admin: AdminPayload } };

export async function requireAdmin(c: Context<AdminEnv>, next: Next) {
  // Prefer Authorization: Bearer header (works cross-origin), fall back to httpOnly cookie
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : getCookie(c, 'admin_token');

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AdminPayload;
    c.set('admin', payload);
    await next();
  } catch {
    return c.json({ error: 'Invalid or expired session' }, 401);
  }
}
