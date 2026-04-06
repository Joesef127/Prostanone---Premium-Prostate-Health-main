import React, { useState, useEffect, useCallback } from 'react';
import { getAllBlogPosts } from '../lib/blogData';
import { useDynamicTitle } from '../hooks/useDynamicTitle';
import BlogHeroSection from '../components/blog/BlogHeroSection';
import BlogCategoryFilter from '../components/blog/BlogCategoryFilter';
import BlogArticleGrid from '../components/blog/BlogArticleGrid';

const Blog: React.FC = () => {
  useDynamicTitle('Blog');
  const [activeCategory, setActiveCategory] = useState('All');
  const [allPosts, setAllPosts] = useState(() => getAllBlogPosts());

  const refresh = useCallback(() => setAllPosts(getAllBlogPosts()), []);
  useEffect(() => {
    refresh();
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, [refresh]);

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
      <BlogArticleGrid posts={filtered} totalPostCount={allPosts.length} />
    </div>
  );
};

export default Blog;
