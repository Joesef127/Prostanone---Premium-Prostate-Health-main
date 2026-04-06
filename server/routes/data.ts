import { Hono } from 'hono';
import { db } from '../db';
import { orders, distributors, newsletterSubscribers } from '../db/schema';
import { requireAdmin } from '../middleware/auth';

const data = new Hono();

// POST /api/orders — captures a new order from the frontend
data.post('/orders', async (c) => {
  const body = await c.req.json<{
    name: string;
    email: string;
    phone: string;
    altPhone?: string;
    shippingAddress: string;
    notes?: string;
    itemsOrdered: string;
    deliveryFee: number;
    totalAmount: number;
    paymentMethod?: string;
    paymentReference?: string;
    paymentStatus?: string;
    checkoutStep?: string;
  }>();

  const [created] = await db.insert(orders).values({
    name: body.name,
    email: body.email,
    phone: body.phone,
    altPhone: body.altPhone,
    shippingAddress: body.shippingAddress,
    notes: body.notes,
    itemsOrdered: body.itemsOrdered,
    deliveryFee: body.deliveryFee ?? 0,
    totalAmount: body.totalAmount ?? 0,
    paymentMethod: body.paymentMethod,
    paymentReference: body.paymentReference,
    paymentStatus: body.paymentStatus,
    checkoutStep: body.checkoutStep,
  }).returning();

  return c.json(created, 201);
});

// GET /api/orders — admin only
data.get('/orders', requireAdmin, async (c) => {
  const rows = await db.select().from(orders).orderBy(orders.createdAt);
  return c.json(rows);
});

// POST /api/distributors — public (form submission)
data.post('/distributors', async (c) => {
  const body = await c.req.json<{
    fullName: string;
    phone: string;
    email: string;
    state: string;
    businessType?: string;
    expectedMonthlyOrder?: string;
    message?: string;
  }>();

  const [created] = await db.insert(distributors).values({
    fullName: body.fullName,
    phone: body.phone,
    email: body.email,
    state: body.state,
    businessType: body.businessType,
    expectedMonthlyOrder: body.expectedMonthlyOrder,
    message: body.message,
  }).returning();

  return c.json(created, 201);
});

// GET /api/distributors — admin only
data.get('/distributors', requireAdmin, async (c) => {
  const rows = await db.select().from(distributors).orderBy(distributors.createdAt);
  return c.json(rows);
});

// POST /api/subscribers — public (newsletter popup)
data.post('/subscribers', async (c) => {
  const body = await c.req.json<{ email: string; name?: string }>();

  if (!body.email) return c.json({ error: 'Email is required' }, 400);

  const [created] = await db
    .insert(newsletterSubscribers)
    .values({ email: body.email.toLowerCase().trim(), name: body.name })
    .onConflictDoNothing()
    .returning();

  return c.json({ success: true, created: !!created });
});

// GET /api/subscribers — admin only
data.get('/subscribers', requireAdmin, async (c) => {
  const rows = await db.select().from(newsletterSubscribers).orderBy(newsletterSubscribers.createdAt);
  return c.json(rows);
});

export default data;
