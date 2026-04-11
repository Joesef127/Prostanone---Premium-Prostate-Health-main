import { Hono } from 'hono';

const seo = new Hono();

/**
 * Get the frontend URL from environment or use default
 */
function getFrontendUrl(): string {
  return process.env.FRONTEND_URL || 'https://holisbotanicals.com';
}

/**
 * Main sitemap index
 * Lists all available sitemaps
 */
seo.get('/sitemap.xml', (c) => {
  const baseUrl = getFrontendUrl();
  const sitemaps = [
    { url: `${baseUrl}/api/sitemap-static.xml`, priority: '1.0' },
    { url: `${baseUrl}/api/sitemap-blog.xml`, priority: '0.8' },
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
    { loc: `${baseUrl}/science`, changefreq: 'quarterly', priority: '0.8' },
    { loc: `${baseUrl}/reviews`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/blog`, changefreq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${baseUrl}/distributor`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${baseUrl}/terms`, changefreq: 'yearly', priority: '0.3' },
    { loc: `${baseUrl}/quiz`, changefreq: 'weekly', priority: '0.7' },
  ];

  const xml = generateSitemap(staticPages);
  c.header('Content-Type', 'application/xml; charset=utf-8');
  c.header('Cache-Control', 'max-age=86400');
  return c.text(xml);
});

/**
 * Blog posts sitemap
 * This should be fetched dynamically from your blog database
 * For now, we'll return a template that can be updated
 */
seo.get('/sitemap-blog.xml', async (c) => {
  try {
    // In production, fetch from your database
    // const db = getDatabase();
    // const posts = await db.select().from(blogPosts);

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
  sitemaps: Array<{ url: string; priority?: string }>,
): string {
  const sitemapEntries = sitemaps
    .map(
      sitemap => `  <sitemap>
    <loc>${escapeXml(sitemap.url)}</loc>
    ${sitemap.priority ? `<priority>${sitemap.priority}</priority>` : ''}
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
  const robots = `# Prostanone Robots.txt
# Generated dynamically based on FRONTEND_URL environment variable

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
