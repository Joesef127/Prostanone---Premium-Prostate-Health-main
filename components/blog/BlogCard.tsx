import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ImageOff, ArrowRight } from 'lucide-react';
import { getCategoryColor } from '../../lib/categoryColors';
import type { BlogPost } from '../../lib/blogData';
import FadeIn from './FadeIn';

const BlogCard: React.FC<{ post: BlogPost; delay?: number }> = ({ post, delay = 0 }) => (
  <FadeIn delay={delay}>
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full"
    >
      <div className="aspect-video overflow-hidden bg-gray-100">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
            <ImageOff className="w-8 h-8" />
            <span className="text-xs font-medium">No cover image</span>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>
        <h2 className="text-lg font-bold text-secondary mb-2 leading-snug group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        <p className="text-sm text-text-muted leading-relaxed flex-1 mb-4">{post.excerpt}</p>
        <div className="flex items-center gap-1 text-primary text-sm font-semibold">
          Read article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  </FadeIn>
);

export default BlogCard;
