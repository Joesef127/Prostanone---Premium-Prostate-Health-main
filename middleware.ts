/**
 * Vercel Edge Middleware — Open Graph / link-preview support
 *
 * Social media crawlers (WhatsApp, Telegram, Twitter, Facebook…) don't
 * execute JavaScript, so the dynamic meta tags set by useSeoMeta are
 * invisible to them. For blog post URLs this middleware intercepts crawler
 * requests and rewrites them to /api/og/blog/:slug, which returns a minimal
 * HTML page with the correct OG / Twitter Card tags already embedded.
 * Regular visitors are passed through to the React SPA as usual.
 */

/**
 * Social media / link-preview crawlers that need server-side OG meta tags.
 */
const SOCIAL_CRAWLERS = [
  'facebookexternalhit',
  'facebot',
  'twitterbot',
  'whatsapp',
  'linkedinbot',
  'slackbot',
  'telegrambot',
  'discordbot',
  'vkshare',
  'redditbot',
  'applebot',
  'googlebot',
  'bingbot',
  'embedly',
  'outbrain',
  'pinterest',
  'quora link preview',
  'rogerbot',
  'showyoubot',
  'skypeuripreview',
  'nuzzel',
  'w3c_validator',
];

function isSocialCrawler(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return SOCIAL_CRAWLERS.some((bot) => ua.includes(bot));
}

export default async function middleware(request: Request): Promise<Response | undefined> {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';

  // Only intercept social media crawlers on blog post pages (/blog/:slug)
  if (isSocialCrawler(userAgent)) {
    const blogMatch = url.pathname.match(/^\/blog\/([^/]+)$/);
    if (blogMatch) {
      const slug = blogMatch[1];
      const ogUrl = new URL(`/api/og/blog/${slug}`, url.origin);
      // Proxy the OG HTML response without changing the URL in the browser,
      // while preserving the original request headers and method so crawler
      // detection and locale-sensitive behavior remain consistent.
      return fetch(new Request(ogUrl.toString(), request));
    }
  }

  // Pass through all other requests
  return undefined;
}

export const config = {
  // Only run the middleware on blog post paths
  matcher: ['/blog/:slug+'],
};
