import { Hono } from 'hono';
import { db } from '../db';
import { blogPosts } from '../db/schema';
import { eq } from 'drizzle-orm';

const seo = new Hono();

/**
 * Get the frontend URL from environment or use default
 */
function getFrontendUrl(): string {
  return process.env.VITE_FRONTEND_URL || 'https://holisbotanicals.com';
}

/**
 * Main sitemap index
 * Lists all available sitemaps
 */
seo.get('/sitemap.xml', (c) => {
  const baseUrl = getFrontendUrl();
  const sitemaps = [
    { url: `${baseUrl}/api/sitemap-static.xml` },
    { url: `${baseUrl}/api/sitemap-blog.xml` },
  ];

  const xml = generateSitemapIndex(sitemaps);
  c.header('Content-Type', 'application/xml; charset=utf-8');
  c.header('Cache-Control', 'max-age=86400'); // Cache for 24 hours
  return c.text(xml);
});

/**
 * Static pages sitemap
 */
seo.get('/sitemap-static.xml', (c) => {
  const baseUrl = getFrontendUrl();
  const staticPages = [
    { loc: `${baseUrl}/`, changefreq: 'weekly', priority: '1.0' },
    { loc: `${baseUrl}/about`, changefreq: 'monthly', priority: '0.9' },
    { loc: `${baseUrl}/product`, changefreq: 'weekly', priority: '1.0' },
    { loc: `${baseUrl}/science`, changefreq: 'yearly', priority: '0.8' },
    { loc: `${baseUrl}/reviews`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/quiz`, changefreq: 'weekly', priority: '0.7' },
    { loc: `${baseUrl}/blog`, changefreq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${baseUrl}/distributor`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${baseUrl}/terms`, changefreq: 'yearly', priority: '0.3' },
  ];

  const xml = generateSitemap(staticPages);
  c.header('Content-Type', 'application/xml; charset=utf-8');
  c.header('Cache-Control', 'max-age=86400');
  return c.text(xml);
});

/**
 * Blog posts sitemap
 * Fetches all published blog posts from the database and generates a sitemap.
 * 
 * TODO: Connect to database
 * - Fetch all published blog posts with: loc, lastmod, changefreq, priority
 * - Include pagination if there are > 50,000 URLs (create multiple sitemaps)
 * - Cache appropriately based on publish frequency
 * 
 * @example expected structure:
 * { loc: 'https://holisbotanicals.com/blog/post-slug', lastmod: '2024-03-15', changefreq: 'monthly', priority: '0.7' }
 */
seo.get('/sitemap-blog.xml', async (c) => {
  try {
    // TODO: Implement database connection
    // const db = getDatabase();
    // const blogPosts = await db.query('SELECT slug, updated_at FROM blog_posts WHERE published = true');
    // const blogPages = blogPosts.map(post => ({
    //   loc: `${getFrontendUrl()}/blog/${post.slug}`,
    //   lastmod: post.updated_at.toISOString().split('T')[0],
    //   changefreq: 'monthly',
    //   priority: '0.7',
    // }));

    // For now, return empty sitemap structure
    const blogPages: Array<{ loc: string; lastmod?: string; changefreq: string; priority: string }> = [
      // Example:
      // { loc: 'https://holisbotanicals.com/blog/post-slug', lastmod: '2024-03-15', changefreq: 'monthly', priority: '0.7' },
    ];

    const xml = generateSitemap(blogPages);
    c.header('Content-Type', 'application/xml; charset=utf-8');
    c.header('Cache-Control', 'max-age=43200'); // Cache for 12 hours
    return c.text(xml);
  } catch (error) {
    console.error('Error generating blog sitemap:', error);
    return c.json({ error: 'Failed to generate sitemap' }, 500);
  }
});

/**
 * Generate XML sitemap from URLs
 */
function generateSitemap(
  pages: Array<{
    loc: string;
    lastmod?: string;
    changefreq?: string;
    priority?: string;
  }>,
): string {
  const urls = pages
    .map(
      page => `  <url>
    <loc>${escapeXml(page.loc)}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ''}
    ${page.priority ? `<priority>${page.priority}</priority>` : ''}
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;
}

/**
 * Generate sitemap index for multiple sitemaps
 */
function generateSitemapIndex(
  sitemaps: Array<{ url: string }>,
): string {
  const sitemapEntries = sitemaps
    .map(
      sitemap => `  <sitemap>
    <loc>${escapeXml(sitemap.url)}</loc>
  </sitemap>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}

/**
 * Robots.txt endpoint
 */
seo.get('/robots.txt', (c) => {
  const baseUrl = getFrontendUrl();
  const robots = `# Holis Botanical Gardens Robots.txt

User-agent: *
Allow: /

# Disallow admin routes
Disallow: /admin
Disallow: /admin-login
Disallow: /api/admin

# Sitemaps
Sitemap: ${baseUrl}/api/sitemap.xml

# Comment: This robots.txt is served from ${baseUrl}
`;

  c.header('Content-Type', 'text/plain; charset=utf-8');
  c.header('Cache-Control', 'max-age=86400');
  return c.text(robots);
});

/**
 * OG meta HTML for blog posts — used by the Edge Middleware to serve crawlers.
 * Returns a minimal HTML page with proper Open Graph / Twitter Card tags so that
 * social media link previews (WhatsApp, Telegram, Twitter, Facebook, …) show
 * the correct title, description, and cover image for each blog post.
 */
seo.get('/og/blog/:slug', async (c) => {
  const slug = c.req.param('slug');
  if (!slug) return c.text('Not found', 404);

  const frontendUrl = getFrontendUrl();

  let title = 'Prostanone Blog';
  let description = 'Premium natural herbal supplement for prostate health.';
  let image = `${frontendUrl}/Prostanone.png`;
  let pageUrl = `${frontendUrl}/blog/${slug}`;

  try {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    if (post) {
      title = `${post.title} - Prostanone Blog`;
      description = post.excerpt || post.title;
      image = post.coverImage || image;
    }
  } catch {
    // Fall through to defaults if DB is unavailable
  }

  const escTitle = escapeXml(title);
  const escDesc = escapeXml(description);
  const escImage = escapeXml(image);
  const escUrl = escapeXml(pageUrl);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>${escTitle}</title>
  <meta name="description" content="${escDesc}"/>

  <!-- Open Graph -->
  <meta property="og:site_name" content="Prostanone"/>
  <meta property="og:type" content="article"/>
  <meta property="og:title" content="${escTitle}"/>
  <meta property="og:description" content="${escDesc}"/>
  <meta property="og:url" content="${escUrl}"/>
  <meta property="og:image" content="${escImage}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:image:alt" content="${escTitle}"/>
  <meta property="og:locale" content="en_NG"/>

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:site" content="@Prostanone"/>
  <meta name="twitter:title" content="${escTitle}"/>
  <meta name="twitter:description" content="${escDesc}"/>
  <meta name="twitter:image" content="${escImage}"/>
  <meta name="twitter:image:alt" content="${escTitle}"/>

  <link rel="canonical" href="${escUrl}"/>

  <!-- Redirect human visitors to the SPA -->
  <meta http-equiv="refresh" content="0;url=${escUrl}"/>
  <script>window.location.replace("${pageUrl}");</script>
</head>
<body>
  <p>Redirecting… <a href="${pageUrl}">Click here if not redirected.</a></p>
</body>
</html>`;

  c.header('Content-Type', 'text/html; charset=utf-8');
  c.header('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
  return c.html(html);
});

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default seo;
