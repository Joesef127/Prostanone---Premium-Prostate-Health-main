import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Calendar, Tag, Pencil } from 'lucide-react';
import { getCategoryColor } from '../../lib/categoryColors';
import type { BlogPost } from '../../lib/blogData';

interface BlogPostHeaderProps {
  post: BlogPost;
}

const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({ post }) => {
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <div className="flex items-center justify-between mb-5">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${getCategoryColor(post.category)}`}
        >
          <Tag className="w-3 h-3" />
          {post.category}
        </span>

          <button
            onClick={() => navigate(`/blog/edit/${post.slug}`)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary border border-gray-200 hover:border-primary rounded-lg px-3 py-1.5 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-secondary leading-tight mb-5">
        {post.title}
      </h1>

      {post.excerpt && (
        <p className="text-sm sm:text-base lg:text-lg text-text-muted mb-6">{post.excerpt}</p>
      )}

      <div className="flex items-center gap-4 text-xs sm:text-sm text-text-muted border-t border-b border-gray-100 py-4">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          {new Date(post.date).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          {post.readTime}
        </span>
      </div>
    </motion.header>
  );
};

export default BlogPostHeader;
