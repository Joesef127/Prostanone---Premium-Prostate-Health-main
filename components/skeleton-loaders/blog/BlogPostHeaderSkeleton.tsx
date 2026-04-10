import React from 'react';
import Skeleton from '../Skeleton';

/** Mirrors the blog post header (title, meta, author) */
const BlogPostHeaderSkeleton: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 flex flex-col gap-4">
    <Skeleton className="h-5 w-24 rounded-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-4/5" />
    <div className="flex items-center gap-4 mt-2">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3.5 w-20" />
      </div>
      <Skeleton className="h-4 w-16 ml-4" />
    </div>
  </div>
);

export default BlogPostHeaderSkeleton;
