import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import { getBlogPost, BLOG_POSTS } from '../lib/blogData';

const CATEGORY_COLORS: Record<string, string> = {
  'Prostate Health': 'bg-blue-100 text-blue-700',
  Nutrition: 'bg-green-100 text-green-700',
  Lifestyle: 'bg-purple-100 text-purple-700',
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : undefined;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="bg-white min-h-screen">
      {/* Back link */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>

      {/* Article Header */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 ${CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-600'}`}
        >
          <Tag className="w-3 h-3" />
          {post.category}
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-secondary leading-tight mb-5">
          {post.title}
        </h1>

        <p className="text-lg text-text-muted mb-6">{post.excerpt}</p>

        <div className="flex items-center gap-4 text-sm text-text-muted border-t border-b border-gray-100 py-4">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-gray-100">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Article Body */}
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
      >
        <div className="prose prose-lg prose-slate max-w-none
          prose-headings:font-bold prose-headings:text-secondary
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-text-muted prose-p:leading-relaxed
          prose-strong:text-secondary
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-ul:text-text-muted prose-ol:text-text-muted
          prose-li:my-1
          prose-blockquote:border-primary prose-blockquote:text-text-muted
          prose-hr:border-gray-100
          prose-table:text-sm
          prose-th:bg-gray-50 prose-th:text-secondary prose-th:font-semibold
          prose-td:text-text-muted">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>

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
                  <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                    <img
                      src={related.coverImage}
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
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
