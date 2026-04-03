export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** Free-form category / tag */
  category: string;
  date: string;
  readTime: string;
  coverImage: string;
  content: string;
  /** 'markdown' for static posts, 'html' for Tiptap-created posts */
  contentType?: 'markdown' | 'html';
  /** true for posts created via the UI and stored in localStorage */
  isLocal?: boolean;
}

export const BLOG_POSTS: BlogPost[] = [];

import { getLocalBlogPosts } from './blogStorage';

/** Returns all posts: localStorage-created first, then static. */
export function getAllBlogPosts(): BlogPost[] {
  const local = getLocalBlogPosts() as unknown as BlogPost[];
  return [...local, ...BLOG_POSTS];
}

export const getBlogPost = (slug: string): BlogPost | undefined => {
  const local = getLocalBlogPosts().find(p => p.slug === slug);
  if (local) return local as unknown as BlogPost;
  return BLOG_POSTS.find(post => post.slug === slug);
};

export const getBlogPostsByCategory = (category: string): BlogPost[] => {
  const all = getAllBlogPosts();
  return category === 'All' ? all : all.filter(post => post.category === category);
};

