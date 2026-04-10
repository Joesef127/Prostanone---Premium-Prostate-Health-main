import React from 'react';
import BlogCardSkeleton from './BlogCardSkeleton';

interface BlogArticleGridSkeletonProps {
  count?: number;
}

/** Mirrors the 3-column article grid */
const BlogArticleGridSkeleton: React.FC<BlogArticleGridSkeletonProps> = ({ count = 6 }) => (
  <section className="py-16 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: count }).map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </section>
);

export default BlogArticleGridSkeleton;
