import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, ImageOff, ArrowRight, MoreVertical, Eye, Pencil, Trash2 } from 'lucide-react';
import { getCategoryColor } from '../../lib/categoryColors';
import type { BlogPost } from '../../lib/blogData';
import FadeIn from './FadeIn';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import { API_BASE } from '../../lib/constants';

const BlogCard: React.FC<{ post: BlogPost; delay?: number; onDeleted?: (slug: string) => void }> = ({ post, delay = 0, onDeleted }) => {
  const { isAdmin } = useAuth();
  const { showConfirm } = useModal();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    const confirmed = await showConfirm({
      title: 'Delete post',
      message: `Are you sure you want to delete "${post.title}"? This cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Keep post',
      destructive: true,
    });
    if (!confirmed) return;
    await fetch(`${API_BASE}/api/blog/${post.slug}`, { method: 'DELETE', credentials: 'include' });
    onDeleted?.(post.slug);
  };

  return (
  <FadeIn delay={delay}>
    <div className="relative group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full">
      {isAdmin && (
        <div ref={menuRef} className="absolute top-2 right-2 z-10" onClick={e => e.preventDefault()}>
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); setMenuOpen(o => !o); }}
            className="p-1.5 rounded-full bg-white/90 hover:bg-white shadow text-gray-500 hover:text-gray-800 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Post options"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-20">
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); setMenuOpen(false); navigate(`/blog/${post.slug}`); }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Eye size={14} /> Preview
              </button>
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); setMenuOpen(false); navigate(`/blog/edit/${post.slug}`); }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      )}
      <Link
        to={`/blog/${post.slug}`}
        className="flex flex-col flex-1"
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
    </div>
  </FadeIn>
  );
};

export default BlogCard;
