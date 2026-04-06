import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { BlogPost } from '../../lib/blogData';

interface BlogPostBodyProps {
  post: BlogPost;
}

const BlogPostBody: React.FC<BlogPostBodyProps> = ({ post }) => (
  <motion.article
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
  >
    {post.contentType === 'html' ? (
      <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
    ) : (
      <div className="blog-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    )}

    {/* CTA */}
    <div className="mt-14 bg-linear-to-br from-primary/5 to-accent/10 border border-primary/20 rounded-2xl p-8 text-center">
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
);

export default BlogPostBody;
