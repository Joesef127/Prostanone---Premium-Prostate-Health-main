import { Hono } from 'hono';
import { db } from '../db';
import { packages } from '../db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '../middleware/auth';

const packagesRoute = new Hono();

// GET /api/packages — public
packagesRoute.get('/', async (c) => {
  const rows = await db.select().from(packages).orderBy(packages.price);
  return c.json(rows);
});

// PUT /api/packages/:id — protected
packagesRoute.put('/:id', requireAdmin, async (c) => {
  const id = c.req.param('id');
  if (!id) return c.json({ error: 'Missing id' }, 400);
  const body = await c.req.json<{
    name?: string;
    price?: number;
    originalPrice?: number;
    description?: string;
    savingsText?: string | null;
    deliveryText?: string;
    usageNote?: string;
    badge?: string | null;
  }>();

  const allowedFields: Record<string, unknown> = {};
  if (body.name !== undefined) allowedFields.name = body.name;
  if (body.price !== undefined) allowedFields.price = body.price;
  if (body.originalPrice !== undefined) allowedFields.originalPrice = body.originalPrice;
  if (body.description !== undefined) allowedFields.description = body.description;
  if (body.savingsText !== undefined) allowedFields.savingsText = body.savingsText;
  if (body.deliveryText !== undefined) allowedFields.deliveryText = body.deliveryText;
  if (body.usageNote !== undefined) allowedFields.usageNote = body.usageNote;
  if (body.badge !== undefined) allowedFields.badge = body.badge;
  allowedFields.updatedAt = new Date();

  const updated = await db
    .update(packages)
    .set(allowedFields)
    .where(eq(packages.id, id))
    .returning();

  if (updated.length === 0) {
    return c.json({ error: 'Package not found' }, 404);
  }

  return c.json(updated[0]);
});

export default packagesRoute;
