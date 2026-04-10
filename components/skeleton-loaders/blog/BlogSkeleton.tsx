import React from 'react';
import BlogHeroSkeleton           from './BlogHeroSkeleton';
import BlogCategoryFilterSkeleton from './BlogCategoryFilterSkeleton';
import BlogArticleGridSkeleton    from './BlogArticleGridSkeleton';

/** Full-page skeleton for the Blog listing page */
const BlogSkeleton: React.FC = () => (
  <div className="bg-white min-h-screen">
    <BlogHeroSkeleton />
    <BlogCategoryFilterSkeleton />
    <BlogArticleGridSkeleton count={6} />
  </div>
);

export default BlogSkeleton;
