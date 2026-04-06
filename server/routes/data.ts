import { Hono } from 'hono';
import { inArray } from 'drizzle-orm';
import { db } from '../db';
import { orders, distributors, newsletterSubscribers, contactMessages } from '../db/schema';
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

// DELETE /api/orders — admin only; body { ids?: number[] } or empty for all
data.delete('/orders', requireAdmin, async (c) => {
  const body = await c.req.json<{ ids?: number[] }>().catch(() => ({ ids: undefined }));
  if (body.ids && body.ids.length > 0) {
    await db.delete(orders).where(inArray(orders.id, body.ids));
  } else {
    await db.delete(orders);
  }
  return c.json({ success: true });
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

// DELETE /api/distributors — admin only
data.delete('/distributors', requireAdmin, async (c) => {
  const body = await c.req.json<{ ids?: number[] }>().catch(() => ({ ids: undefined }));
  if (body.ids && body.ids.length > 0) {
    await db.delete(distributors).where(inArray(distributors.id, body.ids));
  } else {
    await db.delete(distributors);
  }
  return c.json({ success: true });
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

// DELETE /api/subscribers — admin only
data.delete('/subscribers', requireAdmin, async (c) => {
  const body = await c.req.json<{ ids?: number[] }>().catch(() => ({ ids: undefined }));
  if (body.ids && body.ids.length > 0) {
    await db.delete(newsletterSubscribers).where(inArray(newsletterSubscribers.id, body.ids));
  } else {
    await db.delete(newsletterSubscribers);
  }
  return c.json({ success: true });
});

// POST /api/contacts — public (contact form)
data.post('/contacts', async (c) => {
  const body = await c.req.json<{ name: string; email: string; message: string }>();
  if (!body.name || !body.email || !body.message) return c.json({ error: 'All fields required' }, 400);

  const [created] = await db.insert(contactMessages).values({
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    message: body.message.trim(),
  }).returning();

  return c.json(created, 201);
});

// GET /api/contacts — admin only
data.get('/contacts', requireAdmin, async (c) => {
  const rows = await db.select().from(contactMessages).orderBy(contactMessages.createdAt);
  return c.json(rows);
});

// DELETE /api/contacts — admin only
data.delete('/contacts', requireAdmin, async (c) => {
  const body = await c.req.json<{ ids?: number[] }>().catch(() => ({ ids: undefined }));
  if (body.ids && body.ids.length > 0) {
    await db.delete(contactMessages).where(inArray(contactMessages.id, body.ids));
  } else {
    await db.delete(contactMessages);
  }
  return c.json({ success: true });
});

// GET /api/stats — admin only, returns counts for all entities
data.get('/stats', requireAdmin, async (c) => {
  const [o, d, s, cm] = await Promise.all([
    db.select().from(orders),
    db.select().from(distributors),
    db.select().from(newsletterSubscribers),
    db.select().from(contactMessages),
  ]);

  const paidOrders = o.filter(order =>
    order.paymentStatus === 'success' ||
    order.paymentStatus === 'completed' ||
    order.paymentStatus === 'paid' ||
    order.paymentMethod === 'Cash on Delivery (COD)'
  );

  return c.json({
    orders: o.length,
    paidOrders: paidOrders.length,
    distributors: d.length,
    subscribers: s.length,
    contacts: cm.length,
  });
});

export default data;
