import { Hono } from 'hono';
import { db } from '../db';
import { testimonials } from '../db/schema';
import { asc, eq } from 'drizzle-orm';
import { requireAdmin } from '../middleware/auth';

const testimonialsRoute = new Hono();

// GET /api/testimonials — public
testimonialsRoute.get('/', async (c) => {
  const rows = await db.select().from(testimonials).orderBy(asc(testimonials.createdAt));
  return c.json(rows);
});

// POST /api/testimonials — admin only
testimonialsRoute.post('/', requireAdmin, async (c) => {
  const body = await c.req.json<{
    name: string;
    age?: number | null;
    location?: string | null;
    text: string;
    rating?: number;
  }>();

  if (!body.name?.trim()) return c.json({ error: 'name is required' }, 400);
  if (!body.text?.trim()) return c.json({ error: 'text is required' }, 400);

  const inserted = await db
    .insert(testimonials)
    .values({
      name: body.name.trim(),
      age: body.age ?? null,
      location: body.location?.trim() || null,
      text: body.text.trim(),
      rating: body.rating ?? 5,
    })
    .returning();

  return c.json(inserted[0], 201);
});

// PUT /api/testimonials/:id — admin only
testimonialsRoute.put('/:id', requireAdmin, async (c) => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400);

  const body = await c.req.json<{
    name?: string;
    age?: number | null;
    location?: string | null;
    text?: string;
    rating?: number;
  }>();

  const fields: Record<string, unknown> = {};
  if (body.name !== undefined) fields.name = body.name.trim();
  if (body.age !== undefined) fields.age = body.age;
  if (body.location !== undefined) fields.location = body.location?.trim() || null;
  if (body.text !== undefined) fields.text = body.text.trim();
  if (body.rating !== undefined) fields.rating = body.rating;

  const updated = await db
    .update(testimonials)
    .set(fields)
    .where(eq(testimonials.id, id))
    .returning();

  if (updated.length === 0) return c.json({ error: 'Testimonial not found' }, 404);
  return c.json(updated[0]);
});

// DELETE /api/testimonials/:id — admin only
testimonialsRoute.delete('/:id', requireAdmin, async (c) => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400);

  const deleted = await db.delete(testimonials).where(eq(testimonials.id, id)).returning();
  if (deleted.length === 0) return c.json({ error: 'Testimonial not found' }, 404);
  return c.json({ success: true });
});

export default testimonialsRoute;
