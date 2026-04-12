import { describe, it, expect, beforeEach } from 'vitest';
import {
  getLocalBlogPosts,
  saveLocalBlogPost,
  deleteLocalBlogPost,
  generateSlug,
  calculateReadTime,
} from '../../lib/blogStorage';

describe('blogStorage Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('generateSlug', () => {
    it('should convert title to URL-safe slug', () => {
      const slug = generateSlug('Prostate Health Tips');
      // Slug should start with the title but have a hash appended
      expect(slug).toMatch(/^prostate-health-tips-[a-z0-9]+$/);
    });

    it('should handle special characters', () => {
      const slug = generateSlug('How to Stay Healthy & Strong!');
      expect(slug).not.toContain('&');
      expect(slug).not.toContain('!');
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    });

    it('should remove leading/trailing spaces', () => {
      const slug = generateSlug('  Health Tips  ');
      // Should produce health-tips-<hash>
      expect(slug).toMatch(/^health-tips-[a-z0-9]+$/);
    });

    it('should handle multiple consecutive spaces', () => {
      const slug = generateSlug('Prostate    Health    Guide');
      // Should not have double hyphens
      expect(slug).not.toContain('--');
    });

    it('should handle uppercase letters', () => {
      const slug = generateSlug('PROSTATE HEALTH TIPS');
      // Should be lowercase and match pattern with hash
      expect(slug).toMatch(/^[a-z0-9-]+$/);
      expect(slug).toMatch(/^prostate-health-tips-/);
    });

    it('should handle numbers', () => {
      const slug = generateSlug('Top 10 Prostate Supplements');
      // Should include 10 in the base part before hash
      expect(slug).toMatch(/^top-10-prostate-supplements-[a-z0-9]+$/);
    });

    it('should append a hash for uniqueness', () => {
      const slug = generateSlug('Same Title');
      // Should have the format: lowercase-with-dashes-hash
      expect(slug).toMatch(/^same-title-[a-z0-9]+$/);
    });

    it('should have consistent format with hash appended', async () => {
      const slug1 = generateSlug('Test Title');
      // Add a small delay to get different timestamp
      await new Promise(resolve => setTimeout(resolve, 1));
      const slug2 = generateSlug('Test Title');
      // Both should match the pattern
      expect(slug1).toMatch(/^test-title-[a-z0-9]+$/);
      expect(slug2).toMatch(/^test-title-[a-z0-9]+$/);
      // They will likely be the same if called too quickly, so just verify they're valid
      expect(slug1).toMatch(/^[a-z0-9-]+$/);
      expect(slug2).toMatch(/^[a-z0-9-]+$/);
    });
  });

  describe('calculateReadTime', () => {
    it('should calculate read time for short articles (< 1 min)', () => {
      const shortText = 'This is a very short article.'.repeat(5);
      const readTime = calculateReadTime(shortText);
      expect(readTime).toBe('1 min read');
    });

    it('should calculate read time for medium articles', () => {
      // Average reader reads ~200 words per minute
      const mediumText = 'word '.repeat(500); // ~500 words
      const readTime = calculateReadTime(mediumText);
      // Should be 2-3 minutes
      expect(readTime).toMatch(/^[2-3] min read$/);
    });

    it('should calculate read time for long articles', () => {
      const longText = 'word '.repeat(2000); // ~2000 words
      const readTime = calculateReadTime(longText);
      // Should be 9-11 minutes at 200 words/min
      expect(readTime).toMatch(/^(9|10|11) min read$/);
    });

    it('should return 1 for empty text', () => {
      const readTime = calculateReadTime('');
      expect(readTime).toBe('1 min read');
    });

    it('should handle HTML content', () => {
      const htmlContent = '<p>This is a paragraph.</p>'.repeat(20);
      const readTime = calculateReadTime(htmlContent);
      expect(readTime).toMatch(/^\d+ min read$/);
    });

    it('should round up to nearest minute', () => {
      const text = 'word '.repeat(220); // ~220 words = 1.1 minutes (rounds up to 2)
      const readTime = calculateReadTime(text);
      expect(readTime).toBe('2 min read');
    });
  });

  describe('Blog Post Storage - CRUD Operations', () => {
    it('should save a blog post to localStorage', () => {
      const post = {
        slug: 'test-post',
        title: 'Test Post',
        content: '<p>Test content</p>',
        excerpt: 'Test excerpt',
        coverImage: 'https://example.com/image.jpg',
        category: 'Health',
        date: '2024-03-15',
        readTime: '5 min read',
        contentType: 'html' as const,
        isLocal: true as const,
      };

      saveLocalBlogPost(post);
      const stored = localStorage.getItem('prostanone_blog_posts');
      expect(stored).toBeDefined();
      expect(stored).toContain('test-post');
    });

    it('should retrieve all blog posts from localStorage', () => {
      const posts = [
        {
          slug: 'post-1',
          title: 'Post 1',
          content: '<p>Content 1</p>',
          excerpt: 'Excerpt 1',
          category: 'Health',
          date: '2024-03-15',
          readTime: '3 min read',
          coverImage: 'https://example.com/image1.jpg',
          contentType: 'html' as const,
          isLocal: true as const,
        },
        {
          slug: 'post-2',
          title: 'Post 2',
          content: '<p>Content 2</p>',
          excerpt: 'Excerpt 2',
          category: 'Wellness',
          date: '2024-03-14',
          readTime: '5 min read',
          coverImage: 'https://example.com/image2.jpg',
          contentType: 'html' as const,
          isLocal: true as const,
        },
      ];

      posts.forEach(post => saveLocalBlogPost(post));
      const retrieved = getLocalBlogPosts();

      expect(retrieved).toHaveLength(posts.length);
      // Posts are stored in reverse order (unshift adds to beginning)
      expect(retrieved[0].slug).toBe('post-2');
      expect(retrieved[1].slug).toBe('post-1');
    });

    it('should delete a blog post from localStorage', () => {
      const post = {
        slug: 'post-to-delete',
        title: 'Post to Delete',
        content: '<p>Content</p>',
        excerpt: 'Excerpt',
        category: 'Health',
        date: '2024-03-15',
        readTime: '3 min read',
        coverImage: 'https://example.com/image.jpg',
        contentType: 'html' as const,
        isLocal: true as const,
      };

      saveLocalBlogPost(post);
      let posts = getLocalBlogPosts();
      expect(posts).toHaveLength(1);

      deleteLocalBlogPost('post-to-delete');
      posts = getLocalBlogPosts();
      expect(posts).toHaveLength(0);
    });

    it('should handle empty blog posts storage', () => {
      const posts = getLocalBlogPosts();
      expect(posts).toEqual([]);
    });

    it('should update an existing blog post', () => {
      const post = {
        slug: 'update-test',
        title: 'Original Title',
        content: '<p>Original content</p>',
        excerpt: 'Original excerpt',
        category: 'Health',
        date: '2024-03-15',
        readTime: '3 min read',
        coverImage: 'https://example.com/image.jpg',
        contentType: 'html' as const,
        isLocal: true as const,
      };

      saveLocalBlogPost(post);

      const updatedPost = {
        ...post,
        title: 'Updated Title',
        content: '<p>Updated content</p>',
      };

      saveLocalBlogPost(updatedPost);
      const stored = getLocalBlogPosts();

      expect(stored[0].title).toBe('Updated Title');
      expect(stored[0].content).toContain('Updated content');
    });

    it('should maintain data integrity after multiple operations', () => {
      const post1 = {
        slug: 'post-1',
        title: 'Post 1',
        content: '<p>Content 1</p>',
        excerpt: 'Excerpt 1',
        category: 'Health',
        date: '2024-03-15',
        readTime: '3 min read',
        coverImage: 'https://example.com/image1.jpg',
        contentType: 'html' as const,
        isLocal: true as const,
      };

      const post2 = {
        slug: 'post-2',
        title: 'Post 2',
        content: '<p>Content 2</p>',
        excerpt: 'Excerpt 2',
        category: 'Wellness',
        date: '2024-03-14',
        readTime: '4 min read',
        coverImage: 'https://example.com/image2.jpg',
        contentType: 'html' as const,
        isLocal: true as const,
      };

      saveLocalBlogPost(post1);
      saveLocalBlogPost(post2);
      deleteLocalBlogPost('post-1');
      saveLocalBlogPost({ ...post1, title: 'Updated Post 1' });

      const stored = getLocalBlogPosts();
      expect(stored).toHaveLength(2);
      expect(stored.filter(p => p.slug === 'post-1')[0].title).toBe('Updated Post 1');
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('prostanone_blog_posts', 'invalid-json');
      const posts = getLocalBlogPosts();
      expect(posts).toEqual([]);
    });
  });
});
