import { useEffect } from 'react';
import type { PageMeta } from '../lib/seo';
import {
  generatePageMeta,
  generateOpenGraphTags,
  generateTwitterCardTags,
  injectSchema,
} from '../lib/seo';

/**
 * Comprehensive SEO/Meta management hook
 * Handles:
 * - Document title
 * - Meta tags (description, keywords, etc.)
 * - Open Graph tags
 * - Twitter Card tags
 * - Canonical URLs
 * - Structured data (schema.org)
 * - Robots meta tags
 *
 * @example
 * useSeoMeta({
 *   title: 'About Prostanone',
 *   description: 'Learn about our premium prostate health formula...',
 *   url: '/about',
 *   keywords: ['about', 'company', 'health'],
 * });
 *
 * @example with article and structured data
 * useSeoMeta({
 *   title: articleTitle,
 *   description: articleExcerpt,
 *   url: `/blog/${articleSlug}`,
 *   type: 'article',
 *   publishedDate: article.createdAt,
 *   modifiedDate: article.updatedAt,
 *   schema: generateArticleSchema(article),
 * });
 */
export function useSeoMeta(
  pageMetaInput: Partial<PageMeta>,
  options?: {
    schema?: Record<string, unknown>;
    includeOG?: boolean;
    includeTwitter?: boolean;
  },
): void {
  const {
    schema,
    includeOG = true,
    includeTwitter = true,
  } = options || {};

  useEffect(() => {
    // Generate standardized meta
    const pageMeta = generatePageMeta(pageMetaInput);

    // Update document title
    document.title = pageMeta.title;

    // Set common meta tags
    setMetaTag('description', pageMeta.description);
    setMetaTag('keywords', pageMeta.keywords?.join(', ') || '');
    setMetaTag('theme-color', '#ffffff');

    // Set robots meta
    if (pageMeta.robots) {
      setMetaTag('robots', pageMeta.robots);
    } else if (pageMeta.noindex) {
      setMetaTag('robots', 'noindex, nofollow');
    }

    // Set canonical URL
    const canonicalUrl = pageMeta.canonicalUrl || pageMeta.url;
    setCanonicalLink(canonicalUrl);

    // Set Open Graph tags
    if (includeOG) {
      const ogTags = generateOpenGraphTags(pageMeta);
      Object.entries(ogTags).forEach(([key, value]) => {
        setMetaTag(key, value, 'property');
      });
    }

    // Set Twitter Card tags
    if (includeTwitter) {
      const twitterTags = generateTwitterCardTags(pageMeta);
      Object.entries(twitterTags).forEach(([key, value]) => {
        setMetaTag(key, value, 'name');
      });
    }

    // Inject structured data schema
    if (schema) {
      injectSchema(schema);
    }

    // Cleanup: remove schema on unmount
    return () => {
      // Meta tags will be updated by next page
      // Schema scripts persist but next page will add its own
    };
  }, [
    pageMetaInput,
    schema,
    includeOG,
    includeTwitter,
  ]);
}

/**
 * Helper: Set or update a meta tag
 */
function setMetaTag(
  name: string,
  content: string,
  attribute: 'name' | 'property' = 'name',
): void {
  if (!content || typeof document === 'undefined') return;

  // Try to find existing meta tag
  let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement | null;

  // If not found, create new one
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }

  // Update content
  meta.content = content;
}

/**
 * Helper: Set canonical link
 */
function setCanonicalLink(url: string): void {
  if (!url || typeof document === 'undefined') return;

  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }

  link.href = url;
}

/**
 * Alternative: Hook for simple title-only updates (backward compatible)
 * 
 * @deprecated Use useSeoMeta instead for comprehensive SEO
 */
export function useDynamicTitle(title?: string, suffix = 'Prostanone'): void {
  useEffect(() => {
    if (!title) return;
    document.title = title + ' | ' + suffix;
    return () => {
      document.title = 'Prostanone | Premium Prostate Health';
    };
  }, [title, suffix]);
}

/**
 * Set multiple meta tags at once
 */
export function setMultipleMetaTags(
  tags: Record<string, string>,
  attribute: 'name' | 'property' = 'name',
): void {
  Object.entries(tags).forEach(([name, content]) => {
    setMetaTag(name, content, attribute);
  });
}
