import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { getCategoryColor } from '../../lib/categoryColors';
import type { BlogPost } from '../../lib/blogData';

interface BlogRelatedPostsProps {
  posts: BlogPost[];
}

const BlogRelatedPosts: React.FC<BlogRelatedPostsProps> = ({ posts }) => {
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-gray-100 bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-secondary mb-8">More Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map(related => (
            <Link
              key={related.slug}
              to={`/blog/${related.slug}`}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              {related.coverImage && (
                <div className="aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={related.coverImage}
                    alt={related.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full mb-2 self-start ${getCategoryColor(related.category)}`}
                >
                  {related.category}
                </span>
                <h3 className="font-bold text-secondary group-hover:text-primary transition-colors leading-snug mb-2">
                  {related.title}
                </h3>
                <span className="flex items-center gap-1 text-xs text-text-muted mt-auto">
                  <Clock className="w-3 h-3" /> {related.readTime}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogRelatedPosts;
