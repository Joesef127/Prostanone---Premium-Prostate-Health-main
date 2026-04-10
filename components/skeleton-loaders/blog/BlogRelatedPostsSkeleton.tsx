import React from 'react';
import Skeleton from '../Skeleton';
import BlogCardSkeleton from './BlogCardSkeleton';

/** Mirrors the related posts section at the bottom of a blog post */
const BlogRelatedPostsSkeleton: React.FC = () => (
  <section className="py-16 px-4 bg-gray-50">
    <div className="max-w-5xl mx-auto">
      <Skeleton className="h-7 w-48 mb-8" />
      <div className="grid sm:grid-cols-2 gap-6">
        <BlogCardSkeleton />
        <BlogCardSkeleton />
      </div>
    </div>
  </section>
);

export default BlogRelatedPostsSkeleton;
