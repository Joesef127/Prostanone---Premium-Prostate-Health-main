import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, BookOpen, PenSquare } from 'lucide-react';
import {
  BLOG_CATEGORIES,
  getBlogPostsByCategory,
  type BlogCategory,
} from '../lib/blogData';

const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

const CATEGORY_COLORS: Record<string, string> = {
  'Prostate Health': 'bg-blue-100 text-blue-700',
  Nutrition: 'bg-green-100 text-green-700',
  Lifestyle: 'bg-purple-100 text-purple-700',
};

const BlogCard: React.FC<{ post: ReturnType<typeof getBlogPostsByCategory>[number]; delay?: number }> = ({
  post,
  delay = 0,
}) => (
  <FadeIn delay={delay}>
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full"
    >
      <div className="aspect-[16/9] overflow-hidden bg-gray-100">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-600'}`}
          >
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>
        <h2 className="text-lg font-bold text-secondary mb-2 leading-snug group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        <p className="text-sm text-text-muted leading-relaxed flex-1 mb-4">{post.excerpt}</p>
        <div className="flex items-center gap-1 text-primary text-sm font-semibold">
          Read article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  </FadeIn>
);

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<BlogCategory>('All');
  const filtered = getBlogPostsByCategory(activeCategory);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-secondary/90 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-7 h-7 text-accent" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Prostate Health Blog</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Evidence-based insights on prostate health, nutrition, and lifestyle — written for
              Nigerian men who want to take control of their wellbeing.
            </p>
            <div className="mt-8">
              <button
                onClick={() => navigate('/blog/create')}
                className="inline-flex items-center gap-2 bg-accent text-secondary font-bold px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors shadow-md"
              >
                <PenSquare className="w-4 h-4" />
                Create post
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Category Filter */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
            {BLOG_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Article Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <p className="text-center text-text-muted py-12">No articles in this category yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((post, i) => (
                <BlogCard key={post.slug} post={post} delay={i * 0.08} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
