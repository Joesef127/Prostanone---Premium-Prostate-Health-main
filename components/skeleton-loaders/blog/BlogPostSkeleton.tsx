import React from 'react';
import BlogPostHeaderSkeleton  from './BlogPostHeaderSkeleton';
import BlogPostBodySkeleton    from './BlogPostBodySkeleton';
import BlogRelatedPostsSkeleton from './BlogRelatedPostsSkeleton';

/** Full-page skeleton for a single BlogPost page */
const BlogPostSkeleton: React.FC = () => (
  <div className="bg-white pt-16">
    <BlogPostHeaderSkeleton />
    <BlogPostBodySkeleton />
    <BlogRelatedPostsSkeleton />
  </div>
);

export default BlogPostSkeleton;
