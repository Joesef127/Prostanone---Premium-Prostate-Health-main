/**
 * SEO Configuration and Utilities
 * Central hub for all SEO-related settings and helpers
 */

// Compute frontend URLs once at module initialization
const FRONTEND_URL: string = import.meta.env.VITE_FRONTEND_URL || 'https://holisbotanicals.com';
const SITE_LOGO_URL: string = `${FRONTEND_URL}/logo.png`;
const SITE_DEFAULT_IMAGE_URL: string = `${FRONTEND_URL}/prostanone-home.jpg`;

export const SITE_CONFIG = {
  name: 'Prostanone',
  fullName: 'Prostanone | Premium Prostate Health',
  domain: FRONTEND_URL,
  description: 'Premium natural herbal supplement for prostate health. NAFDAC certified, proven ingredients, 100% natural formula. Improve urinary function and prostate wellness.',
  keywords: ['prostate health', 'prostate supplement', 'urinary health', 'NAFDAC certified', 'natural herbal supplement'],
  logo: SITE_LOGO_URL,
  defaultImage: SITE_DEFAULT_IMAGE_URL,
  instagramHandle: 'prostanone',
  twitterHandle: '@Prostanone',
  supportEmail: 'prostanone@gmail.com',
  locale: 'en_NG',
};

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.domain,
  logo: SITE_CONFIG.logo,
  description: SITE_CONFIG.description,
  sameAs: [
    'https://www.facebook.com/Prostanone',
    'https://www.instagram.com/prostanone',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    email: SITE_CONFIG.supportEmail,
    availableLanguage: ['en'],
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'NG',
    addressLocality: 'Lagos',
  },
};

export const PAGE_URLS = {
  home: '/',
  about: '/about',
  product: '/product',
  science: '/science',
  reviews: '/reviews',
  quiz: '/quiz',
  results: '/results',
  summary: '/summary',
  contact: '/contact',
  checkout: '/checkout',
  blog: '/blog',
  distributor: '/distributor',
  terms: '/terms',
} as const;

/**
 * Generate full URL from path
 */
export function getFullUrl(path: string): string {
  return `${SITE_CONFIG.domain}${path}`;
}

/**
 * SEO-friendly page metadata type
 */
export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  url: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  robots?: string;
}

/**
 * Generate metadata for a page
 */
export function generatePageMeta(override: Partial<PageMeta>): PageMeta {
  const url = getFullUrl(override.url || PAGE_URLS.home);
  return {
    title: override.title || SITE_CONFIG.fullName,
    description: override.description || SITE_CONFIG.description,
    keywords: override.keywords,
    image: override.image || SITE_CONFIG.defaultImage,
    imageAlt: override.imageAlt || SITE_CONFIG.name,
    url,
    type: override.type || 'website',
    author: override.author,
    publishedDate: override.publishedDate,
    modifiedDate: override.modifiedDate,
    canonicalUrl: override.canonicalUrl || url,
    noindex: override.noindex || false,
    robots: override.robots,
  };
}

/**
 * Generate Open Graph meta tags
 */
export function generateOpenGraphTags(meta: PageMeta): Record<string, string> {
  return {
    'og:site_name': SITE_CONFIG.name,
    'og:type': meta.type === 'article' ? 'article' : 'website',
    'og:title': meta.title,
    'og:description': meta.description,
    'og:url': meta.url,
    'og:image': meta.image || SITE_CONFIG.defaultImage,
    'og:image:alt': meta.imageAlt || SITE_CONFIG.name,
    'og:locale': SITE_CONFIG.locale,
  };
}

/**
 * Generate Twitter Card meta tags
 */
export function generateTwitterCardTags(meta: PageMeta): Record<string, string> {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:site': SITE_CONFIG.twitterHandle,
    'twitter:creator': SITE_CONFIG.twitterHandle,
    'twitter:title': meta.title,
    'twitter:description': meta.description,
    'twitter:image': meta.image || SITE_CONFIG.defaultImage,
    'twitter:image:alt': meta.imageAlt || SITE_CONFIG.name,
  };
}

/**
 * Generate structured data schema for a page
 */
export function generateSchema(type: string, data: Record<string, unknown> = {}): Record<string, unknown> {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
  };
  return { ...baseSchema, ...data };
}

/**
 * Generate Product schema
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  image?: string;
  brand?: string;
  manufacturer?: string;
  rating?: number;
  reviewCount?: number;
  price?: number;
  currency?: string;
  sku?: string;
  availability?: string;
}): Record<string, unknown> {
  return generateSchema('Product', {
    name: product.name,
    description: product.description,
    image: product.image || SITE_CONFIG.defaultImage,
    brand: {
      '@type': 'Brand',
      name: product.brand || SITE_CONFIG.name,
    },
    manufacturer: {
      '@type': 'Organization',
      name: product.manufacturer || 'Holis Botanical Gardens',
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.toString(),
        reviewCount: product.reviewCount || 1,
      },
    }),
    ...(product.price && {
      offers: {
        '@type': 'Offer',
        price: product.price.toString(),
        priceCurrency: product.currency || 'NGN',
        availability: product.availability || 'https://schema.org/InStock',
      },
    }),
  });
}

/**
 * Generate Article/BlogPost schema
 */
export function generateArticleSchema(article: {
  headline: string;
  description: string;
  image?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  url?: string;
}): Record<string, unknown> {
  return generateSchema('BlogPosting', {
    headline: article.headline,
    description: article.description,
    image: article.image || SITE_CONFIG.defaultImage,
    author: {
      '@type': 'Organization',
      name: article.author || SITE_CONFIG.name,
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url || SITE_CONFIG.domain,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: SITE_CONFIG.logo,
      },
    },
  });
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): Record<string, unknown> {
  return generateSchema('BreadcrumbList', {
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: (index + 1).toString(),
      name: item.name,
      item: item.url,
    })),
  });
}

/**
 * Generate FAQPage schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): Record<string, unknown> {
  return generateSchema('FAQPage', {
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  });
}

/**
 * Generate LocalBusiness schema
 */
export function generateLocalBusinessSchema(): Record<string, unknown> {
  return generateSchema('LocalBusiness', {
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    image: SITE_CONFIG.logo,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NG',
      addressLocality: 'Lagos',
    },
    sameAs: [
      'https://www.facebook.com/Prostanone',
      'https://www.instagram.com/prostanone',
    ],
  });
}

/**
 * Inject structured data into page head
 */
export function injectSchema(schema: Record<string, unknown>): void {
  if (typeof document === 'undefined') return;

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}
