import React from 'react';
import Skeleton from '../Skeleton';

/** Mirrors the horizontal category filter pill bar */
const BlogCategoryFilterSkeleton: React.FC = () => (
  <div className="py-6 px-4 border-b border-gray-100">
    <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-20 rounded-full shrink-0" />
      ))}
    </div>
  </div>
);

export default BlogCategoryFilterSkeleton;
