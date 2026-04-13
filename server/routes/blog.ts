import { Hono } from 'hono';
import { db } from '../db';
import { blogPosts } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { requireAdmin } from '../middleware/auth';

const blog = new Hono();

// GET /api/blog — public
blog.get('/', async (c) => {
  const posts = await db
    .select()
    .from(blogPosts)
    .orderBy(blogPosts.createdAt);
  return c.json(posts);
});

// GET /api/blog/:slug — public (also increments view count)
blog.get('/:slug', async (c) => {
  const slug = c.req.param('slug');
  if (!slug) return c.json({ error: 'Missing slug' }, 400);
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
  if (!post) return c.json({ error: 'Not found' }, 404);
  // Increment views in the background — don't await to keep response fast
  db.update(blogPosts)
    .set({ views: sql`${blogPosts.views} + 1` })
    .where(eq(blogPosts.slug, slug))
    .execute()
    .catch(() => {});
  return c.json(post);
});

// POST /api/blog — protected
blog.post('/', requireAdmin, async (c) => {
  const body = await c.req.json<{
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    coverImage: string;
    content: string;
    contentType?: string;
    author?: string;
  }>();

  const [created] = await db.insert(blogPosts).values({
    slug: body.slug,
    title: body.title,
    excerpt: body.excerpt,
    category: body.category,
    date: body.date,
    readTime: body.readTime,
    coverImage: body.coverImage,
    content: body.content,
    contentType: body.contentType ?? 'markdown',
    author: body.author ?? 'Holis Botanicals',
  }).returning();

  return c.json(created, 201);
});

// PUT /api/blog/:slug — protected
blog.put('/:slug', requireAdmin, async (c) => {
  const slug = c.req.param('slug');
  if (!slug) return c.json({ error: 'Missing slug' }, 400);
  const body = await c.req.json<Partial<{
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    coverImage: string;
    content: string;
    contentType: string;
    author: string;
  }>>();

  const updated = await db
    .update(blogPosts)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(blogPosts.slug, slug))
    .returning();

  if (updated.length === 0) return c.json({ error: 'Not found' }, 404);
  return c.json(updated[0]);
});

// DELETE /api/blog/:slug — protected
blog.delete('/:slug', requireAdmin, async (c) => {
  const slug = c.req.param('slug');
  if (!slug) return c.json({ error: 'Missing slug' }, 400);
  const deleted = await db.delete(blogPosts).where(eq(blogPosts.slug, slug)).returning();
  if (deleted.length === 0) return c.json({ error: 'Not found' }, 404);
  return c.json({ success: true });
});

export default blog;
