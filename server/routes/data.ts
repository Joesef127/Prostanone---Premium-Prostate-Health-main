import { Hono } from 'hono';
import { inArray, eq } from 'drizzle-orm';
import { db } from '../db';
import { orders, distributors, newsletterSubscribers, contactMessages } from '../db/schema';
import { requireAdmin } from '../middleware/auth';

const data = new Hono();

// GET /api/ping — lightweight health check / keep-alive
data.get('/ping', (c) => c.json({ ok: true }));

// POST /api/orders — captures a new order from the frontend
data.post('/orders', async (c) => {
  const body = await c.req.json<{
    orderId: string;
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

  if (!body.orderId) return c.json({ error: 'orderId is required' }, 400);

  const [created] = await db.insert(orders).values({
    orderId: body.orderId,
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

// GET /api/verify-payaza-transaction — verify Payaza payment using Secret Key
// Query: ?reference=PR-xxx (transaction reference)
// Returns: { status: 'success' | 'failed' | 'pending', message?: string, data?: {...} }
data.get('/verify-payaza-transaction', async (c) => {
  const reference = c.req.query('reference');

  if (!reference) {
    return c.json({ error: 'Missing transaction reference' }, 400);
  }

  const PAYAZA_SECRET_KEY = process.env.PAYAZA_SECRET_KEY;
  if (!PAYAZA_SECRET_KEY) {
    console.error('PAYAZA_SECRET_KEY not configured');
    return c.json({ error: 'Payment gateway not configured' }, 500);
  }

  try {
    // Encode the secret key in Base64 as required by Payaza
    const encodedKey = Buffer.from(PAYAZA_SECRET_KEY).toString('base64');

    // Call Payaza's transaction verification endpoint
    // Docs: https://docs.payaza.africa/developers/apis/sdks/check-transaction-status
    const payazaVerifyResponse = await fetch(
      `https://api.payaza.africa/live/merchant-collection/transfer_notification_controller/merchant/transaction-query?merchant_reference=${encodeURIComponent(reference)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Payaza ${encodedKey}`,
          'Content-Type': 'application/json',
        },
      },
    ).then(res => res.json());

    // Update the order's payment status in the database if found
    const existingOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.paymentReference, reference))
      .limit(1)
      .then(rows => rows[0]);

    if (existingOrder) {
      let verifiedStatus = 'pending';

      // Map Payaza transaction_status to our status
      // Documented Payaza statuses: "Completed", "Pending", "Processing", "Failed", "Cancelled", "Reversed"
      const txStatus = payazaVerifyResponse.data?.transaction_status;
      if (txStatus === 'Completed') {
        verifiedStatus = 'success';
      } else if (txStatus === 'Failed' || txStatus === 'Cancelled' || txStatus === 'Reversed') {
        verifiedStatus = 'failed';
      } else if (txStatus === 'Pending' || txStatus === 'Processing') {
        verifiedStatus = 'pending';
      } else {
        console.warn(`[payaza] Unknown transaction_status "${txStatus}" for reference ${reference}`);
      }

      // Update the order with verified status
      await db
        .update(orders)
        .set({ 
          paymentStatus: verifiedStatus, 
          checkoutStep: `payment_${verifiedStatus}` 
        })
        .where(eq(orders.id, existingOrder.id));

      return c.json({
        status: verifiedStatus,
        message: `Payment ${verifiedStatus}`,
        transactionStatus: payazaVerifyResponse.data?.transaction_status,
        amountReceived: payazaVerifyResponse.data?.amount_received,
      });
    }

    return c.json(
      {
        status: 'unknown',
        message: 'Transaction reference not found in system',
      },
      404,
    );
  } catch (error) {
    console.error('Payaza verification error:', error);
    return c.json(
      {
        error: 'Failed to verify payment',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500,
    );
  }
});

export default data;
