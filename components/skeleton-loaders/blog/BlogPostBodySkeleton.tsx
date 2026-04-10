import React from 'react';
import Skeleton from '../Skeleton';

/** Mirrors the blog post body — cover image + long-form article text */
const BlogPostBodySkeleton: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex flex-col gap-4">
    {/* cover image */}
    <Skeleton className="h-64 w-full rounded-2xl mb-4" />
    {/* article paragraphs */}
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    ))}
  </div>
);

export default BlogPostBodySkeleton;
