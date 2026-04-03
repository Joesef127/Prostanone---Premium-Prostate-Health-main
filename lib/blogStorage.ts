// ─── Reading Time ────────────────────────────────────────────────────────────
/** Change this to adjust the reading-speed assumption across the whole app. */
export const WORDS_PER_MINUTE = 200;

/**
 * Accepts plain text or HTML and returns a human-readable reading time string,
 * e.g. "4 min read".
 */
export function calculateReadTime(content: string): string {
  // Strip HTML tags so we count actual words
  const plainText = content.replace(/<[^>]+>/g, ' ');
  const wordCount = plainText
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

// ─── Types ───────────────────────────────────────────────────────────────────
export interface LocalBlogPost {
  slug: string;
  title: string;
  /** Optional short description shown on cards and at the top of the post */
  excerpt: string;
  /** Free-form category / tag string */
  category: string;
  /** ISO date string, e.g. "2026-04-03" */
  date: string;
  readTime: string;
  /** URL to the cover image */
  coverImage: string;
  /** Tiptap-generated HTML */
  content: string;
  contentType: 'html';
  isLocal: true;
}

// ─── Storage helpers ─────────────────────────────────────────────────────────
const STORAGE_KEY = 'prostanone_blog_posts';

export function getLocalBlogPosts(): LocalBlogPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocalBlogPost[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalBlogPost(post: LocalBlogPost): void {
  const posts = getLocalBlogPosts();
  const idx = posts.findIndex(p => p.slug === post.slug);
  if (idx >= 0) {
    posts[idx] = post;
  } else {
    posts.unshift(post);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function deleteLocalBlogPost(slug: string): void {
  const remaining = getLocalBlogPosts().filter(p => p.slug !== slug);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
}

// ─── Slug generation ─────────────────────────────────────────────────────────
export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 80);

  // Append a short timestamp suffix to avoid collisions
  return `${base}-${Date.now().toString(36)}`;
}
