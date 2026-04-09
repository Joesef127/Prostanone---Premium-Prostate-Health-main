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

// POST /api/packages — admin only
packagesRoute.post('/', requireAdmin, async (c) => {
  const body = await c.req.json<{
    id: string;
    name: string;
    containers: number;
    price: number;
    originalPrice?: number;
    description: string;
    savingsText?: string | null;
    deliveryText?: string;
    usageNote?: string;
    badge?: string | null;
  }>();

  if (!body.id?.trim()) return c.json({ error: 'id is required' }, 400);
  if (!body.name?.trim()) return c.json({ error: 'name is required' }, 400);
  if (!body.price) return c.json({ error: 'price is required' }, 400);

  const inserted = await db
    .insert(packages)
    .values({
      id: body.id.trim(),
      name: body.name.trim(),
      containers: body.containers ?? 1,
      price: body.price,
      originalPrice: body.originalPrice ?? null,
      description: body.description?.trim() ?? '',
      savingsText: body.savingsText?.trim() || null,
      deliveryText: body.deliveryText?.trim() ?? '',
      usageNote: body.usageNote?.trim() ?? '',
      badge: body.badge?.trim() || null,
    })
    .returning();

  return c.json(inserted[0], 201);
});

// DELETE /api/packages/:id — admin only
packagesRoute.delete('/:id', requireAdmin, async (c) => {
  const id = c.req.param('id');
  if (!id) return c.json({ error: 'Missing id' }, 400);
  const deleted = await db.delete(packages).where(eq(packages.id, id)).returning();
  if (deleted.length === 0) return c.json({ error: 'Package not found' }, 404);
  return c.json({ success: true });
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
