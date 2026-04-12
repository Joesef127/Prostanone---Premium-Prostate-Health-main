import { API_BASE } from '../lib/constants';
import type { BlogPost } from '../lib/blogData';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { PAGE_URLS, generateSchema, SITE_CONFIG } from '../lib/seo';
import BlogHeroSection from '../components/blog/BlogHeroSection';
import BlogCategoryFilter from '../components/blog/BlogCategoryFilter';
import BlogArticleGrid from '../components/blog/BlogArticleGrid';
import BlogSkeleton from '../components/skeleton-loaders/blog/BlogSkeleton';
import { useState, useEffect } from 'react';

const Blog: React.FC = () => {
  // SEO configuration for blog page
  useSeoMeta(
    {
      title: 'Prostate Health Blog - Tips, Research & Wellness Insights',
      description: 'Read the latest articles on prostate health, wellness tips, and research insights. Learn about natural treatments, lifestyle changes, and expert advice for better health.',
      keywords: [
        'prostate health blog',
        'prostate tips',
        'prostate research',
        'urinary health articles',
        'wellness insights',
        'prostate information',
      ],
      url: PAGE_URLS.blog,
      image: SITE_CONFIG.defaultImage,
      imageAlt: 'Prostanone Blog - Prostate Health Articles',
      type: 'website',
    },
    {
      schema: generateSchema('CollectionPage', {
        name: 'Prostate Health Blog',
        description: 'Collection of articles on prostate health, wellness, and lifestyle tips',
        url: PAGE_URLS.blog,
      }),
    },
  );

  const [activeCategory, setActiveCategory] = useState('All');
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/blog`)
      .then(r => r.json())
      .then((data: BlogPost[]) => setAllPosts(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <BlogSkeleton />;

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
