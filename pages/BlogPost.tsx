import React from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { Clock, Calendar, Tag, Pencil } from 'lucide-react';
import { getBlogPost, getAllBlogPosts } from '../lib/blogData';

const CATEGORY_COLORS: Record<string, string> = {
  'Prostate Health': 'bg-blue-100 text-blue-700',
  Nutrition: 'bg-green-100 text-green-700',
  Lifestyle: 'bg-purple-100 text-purple-700',
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getBlogPost(slug) : undefined;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const allPosts = getAllBlogPosts();
  const relatedPosts = allPosts.filter(p => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="bg-white pt-16">
      {/* Article Header */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        <div className="flex items-center justify-between mb-5">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-600'}`}
          >
            <Tag className="w-3 h-3" />
            {post.category}
          </span>

          {post.isLocal && (
            <button
              onClick={() => navigate(`/blog/edit/${post.slug}`)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary border border-gray-200 hover:border-primary rounded-lg px-3 py-1.5 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
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

      {/* Cover Image */}
      {post.coverImage && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-gray-100">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Body */}
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
      >
        {post.contentType === 'html' ? (
          /* Tiptap HTML content */
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          /* Static Markdown content */
          <div className="blog-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        )}

        {/* CTA */}
        <div className="mt-14 bg-gradient-to-br from-primary/5 to-accent/10 border border-primary/20 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-secondary mb-2">Ready to support your prostate?</h3>
          <p className="text-text-muted mb-6 text-sm max-w-md mx-auto">
            Prostanone combines eight clinically-studied plant compounds in a NAFDAC-certified formulation designed for Nigerian men.
          </p>
          <Link
            to="/product"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
          >
            Learn About Prostanone
          </Link>
        </div>
      </motion.article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-secondary mb-8">More Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map(related => (
                <Link
                  key={related.slug}
                  to={`/blog/${related.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  {related.coverImage && (
                    <div className="aspect-[16/9] overflow-hidden bg-gray-100">
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
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full mb-2 self-start ${CATEGORY_COLORS[related.category] ?? 'bg-gray-100 text-gray-600'}`}
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
      )}
    </div>
  );
};

export default BlogPost;
