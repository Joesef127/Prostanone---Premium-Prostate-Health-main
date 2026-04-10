import React from 'react';
import Skeleton from '../Skeleton';

/** Mirrors a single BlogCard: image + category badge + title + meta */
const BlogCardSkeleton: React.FC = () => (
  <div className="flex flex-col rounded-2xl border border-gray-100 overflow-hidden bg-white">
    {/* cover image */}
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="flex flex-col gap-3 p-5">
      {/* category badge */}
      <Skeleton className="h-5 w-20 rounded-full" />
      {/* title */}
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-4/5" />
      {/* excerpt */}
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      {/* meta row */}
      <div className="flex items-center gap-3 mt-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  </div>
);

export default BlogCardSkeleton;
