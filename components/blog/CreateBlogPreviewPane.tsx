import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Tag } from 'lucide-react';

interface CreateBlogPreviewPaneProps {
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  content: string;
  readTime: string;
}

const CreateBlogPreviewPane: React.FC<CreateBlogPreviewPaneProps> = ({
  title,
  excerpt,
  category,
  coverImage,
  content,
  readTime,
}) => (
  <motion.div
    key="preview"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
  >
    {coverImage && (
      <div className="aspect-21/9 rounded-2xl overflow-hidden bg-gray-100 mb-8">
        <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
      </div>
    )}

    {category && (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full mb-4">
        <Tag className="w-3 h-3" />
        {category}
      </span>
    )}

    <h1 className="text-3xl sm:text-4xl font-extrabold text-secondary leading-tight mb-4">
      {title || <span className="text-gray-300">Post title</span>}
    </h1>

    {excerpt && <p className="text-lg text-text-muted mb-6">{excerpt}</p>}

    <div className="flex items-center gap-3 text-sm text-text-muted border-t border-b border-gray-100 py-3 mb-8">
      <span className="flex items-center gap-1.5">
        <Clock className="w-4 h-4" />
        {readTime}
      </span>
      <span>
        {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
      </span>
    </div>

    <div className="blog-content" dangerouslySetInnerHTML={{ __html: content }} />
  </motion.div>
);

export default CreateBlogPreviewPane;
