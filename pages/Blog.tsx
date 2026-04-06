import React, { useState, useEffect } from 'react';
import type { BlogPost } from '../lib/blogData';
import { useDynamicTitle } from '../hooks/useDynamicTitle';
import BlogHeroSection from '../components/blog/BlogHeroSection';
import BlogCategoryFilter from '../components/blog/BlogCategoryFilter';
import BlogArticleGrid from '../components/blog/BlogArticleGrid';

const Blog: React.FC = () => {
  useDynamicTitle('Blog');
  const [activeCategory, setActiveCategory] = useState('All');
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch('/api/blog')
      .then(r => r.json())
      .then((data: BlogPost[]) => setAllPosts(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const categories = ['All', ...Array.from(new Set(allPosts.map(p => p.category)))];
  const filtered = activeCategory === 'All' ? allPosts : allPosts.filter(p => p.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      <BlogHeroSection />
      <BlogCategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <BlogArticleGrid
        posts={filtered}
        totalPostCount={allPosts.length}
        onPostDeleted={(slug) => setAllPosts(prev => prev.filter(p => p.slug !== slug))}
      />
    </div>
  );
};

export default Blog;
