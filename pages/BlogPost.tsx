import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getBlogPost, getAllBlogPosts } from '../lib/blogData';
import { useDynamicTitle } from '../hooks/useDynamicTitle';
import BlogPostHeader from '../components/blog/BlogPostHeader';
import BlogPostBody from '../components/blog/BlogPostBody';
import BlogRelatedPosts from '../components/blog/BlogRelatedPosts';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : undefined;

  useDynamicTitle(post?.title, 'Prostanone Blog');

  if (!post) return <Navigate to="/blog" replace />;

  const relatedPosts = getAllBlogPosts().filter(p => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="bg-white pt-16">
      <BlogPostHeader post={post} />
      {post.coverImage && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="aspect-21/9 rounded-2xl overflow-hidden bg-gray-100">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      )}
      <BlogPostBody post={post} />
      <BlogRelatedPosts posts={relatedPosts} />
    </div>
  );
};

export default BlogPost;
