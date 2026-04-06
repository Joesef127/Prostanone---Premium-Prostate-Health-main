import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PenSquare } from 'lucide-react';
import type { BlogPost } from '../../lib/blogData';
import BlogCard from './BlogCard';
import { useAuth } from '../../context/AuthContext';

interface BlogArticleGridProps {
  posts: BlogPost[];
  totalPostCount: number;
}

const BlogArticleGrid: React.FC<BlogArticleGridProps> = ({ posts, totalPostCount }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            {totalPostCount === 0 ? (
              <>
                <p className="text-text-muted mb-4">No posts yet.</p>
                {isAdmin && (
                  <button
                    onClick={() => navigate('/blog/create')}
                    className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    <PenSquare className="w-4 h-4" />
                    Create first post
                  </button>
                )}
              </>
            ) : (
              <p className="text-text-muted">No articles in this category yet.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <BlogCard key={post.slug} post={post} delay={i * 0.08} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogArticleGrid;
