import React from 'react';
import Skeleton from '../Skeleton';

/** Mirrors the blog hero banner (dark background with centered text) */
const BlogHeroSkeleton: React.FC = () => (
  <div className="bg-gray-900 py-24 px-4 flex flex-col items-center gap-4">
    <Skeleton className="h-5 w-24 rounded-full bg-gray-700" />
    <Skeleton className="h-10 w-72 bg-gray-700" />
    <Skeleton className="h-5 w-80 max-w-full bg-gray-700" />
  </div>
);

export default BlogHeroSkeleton;
