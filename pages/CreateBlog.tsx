import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Eye, Clock, Tag, Upload, Link2, FileText, ChevronDown, X } from 'lucide-react';
import RichTextEditor from '../components/blog/RichTextEditor';
import {
  saveLocalBlogPost,
  getLocalBlogPosts,
  generateSlug,
  calculateReadTime,
  deleteLocalBlogPost,
  type LocalBlogPost,
} from '../lib/blogStorage';
import { BLOG_TEMPLATES, type BlogTemplate } from '../lib/blogTemplates';

const PRESET_CATEGORIES = ['Prostate Health', 'Nutrition', 'Lifestyle'];

const EMPTY_FORM = {
  title: '',
  excerpt: '',
  category: '',
  coverImage: '',
  content: '',
};

const CreateBlog: React.FC = () => {
  const navigate = useNavigate();
  const { slug: editSlug } = useParams<{ slug?: string }>();
  const isEditing = Boolean(editSlug);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof EMPTY_FORM, string>>>({});
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Cover image mode
  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileWarning, setFileWarning] = useState('');

  // Template picker
  const [showTemplates, setShowTemplates] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  // Pre-fill form when editing an existing local post
  useEffect(() => {
    if (!editSlug) return;
    const post = getLocalBlogPosts().find(p => p.slug === editSlug);
    if (post) {
      setForm({
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        coverImage: post.coverImage,
        content: post.content,
      });
    }
  }, [editSlug]);

  const readTime = calculateReadTime(form.content);

  const set = (field: keyof typeof EMPTY_FORM, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.title.trim()) next.title = 'Title is required.';
    if (!form.content || form.content === '<p></p>') next.content = 'Blog body cannot be empty.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileWarning('');
    // Warn if the image is large — base64 in localStorage can fill up quickly
    if (file.size > 500 * 1024) {
      setFileWarning('Large image detected (>500 KB). Consider using a URL instead to avoid hitting localStorage limits.');
    }
    const reader = new FileReader();
    reader.onload = () => set('coverImage', reader.result as string);
    reader.readAsDataURL(file);
  };

  const loadTemplate = (tpl: BlogTemplate) => {
    setForm({
      title: tpl.title,
      excerpt: tpl.excerpt,
      category: tpl.category,
      coverImage: tpl.coverImage,
      content: tpl.content,
    });
    setEditorKey(k => k + 1); // force editor remount with new content
    setErrors({});
    setShowTemplates(false);
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaving(true);

    const slug = isEditing && editSlug ? editSlug : generateSlug(form.title);

    const post: LocalBlogPost = {
      slug,
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      category: form.category.trim() || 'General',
      date: isEditing
        ? (getLocalBlogPosts().find(p => p.slug === editSlug)?.date ?? new Date().toISOString().slice(0, 10))
        : new Date().toISOString().slice(0, 10),
      readTime,
      coverImage: form.coverImage.trim(),
      content: form.content,
      contentType: 'html',
      isLocal: true,
    };

    saveLocalBlogPost(post);
    setSaving(false);
    navigate(`/blog/${slug}`);
  };

  const handleDelete = () => {
    if (!editSlug) return;
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    deleteLocalBlogPost(editSlug);
    navigate('/blog');
  };

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewMode(p => !p)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-secondary border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-1.5 transition-colors"
            >
              <Eye className="w-4 h-4" />
              {previewMode ? 'Edit' : 'Preview'}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-sm font-medium text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 rounded-lg px-3 py-1.5 transition-colors"
              >
                Delete
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving…' : isEditing ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      {previewMode ? (
        /* ── Preview pane ── */
        <motion.div
          key="preview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          {form.coverImage && (
            <div className="aspect-21/9 rounded-2xl overflow-hidden bg-gray-100 mb-8">
              <img src={form.coverImage} alt="Cover" className="w-full h-full object-cover" />
            </div>
          )}

          {form.category && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full mb-4">
              <Tag className="w-3 h-3" />
              {form.category}
            </span>
          )}

          <h1 className="text-3xl sm:text-4xl font-extrabold text-secondary leading-tight mb-4">
            {form.title || <span className="text-gray-300">Post title</span>}
          </h1>

          {form.excerpt && (
            <p className="text-lg text-text-muted mb-6">{form.excerpt}</p>
          )}

          <div className="flex items-center gap-3 text-sm text-text-muted border-t border-b border-gray-100 py-3 mb-8">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {readTime}
            </span>
            <span>{new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: form.content }}
          />
        </motion.div>
      ) : (
        /* ── Edit form ── */
        <motion.div
          key="edit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-7"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold text-secondary">
              {isEditing ? 'Edit post' : 'Create new post'}
            </h1>

            {/* Template picker */}
            {!isEditing && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowTemplates(p => !p)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold border border-gray-200 hover:border-primary text-gray-600 hover:text-primary rounded-xl px-4 py-2 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Load template
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showTemplates && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-30"
                    >
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Choose a template</p>
                      </div>
                      <ul className="py-1.5 max-h-72 overflow-y-auto">
                        {BLOG_TEMPLATES.map(tpl => (
                          <li key={tpl.id}>
                            <button
                              type="button"
                              onClick={() => loadTemplate(tpl)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                            >
                              <p className="text-sm font-semibold text-secondary leading-snug">{tpl.name}</p>
                              <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{tpl.excerpt}</p>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Cover image */}
          <div>
            <label className="block text-sm font-semibold text-secondary mb-1.5">
              Cover image
            </label>

            {/* Mode toggle */}
            <div className="flex gap-1 mb-3 bg-gray-100 p-1 rounded-lg w-fit">
              <button
                type="button"
                onClick={() => { setImageMode('url'); setFileWarning(''); }}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${imageMode === 'url' ? 'bg-white text-secondary shadow-sm' : 'text-gray-500 hover:text-secondary'}`}
              >
                <Link2 className="w-3.5 h-3.5" />
                Image URL
              </button>
              <button
                type="button"
                onClick={() => { setImageMode('file'); setFileWarning(''); }}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${imageMode === 'file' ? 'bg-white text-secondary shadow-sm' : 'text-gray-500 hover:text-secondary'}`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload file
              </button>
            </div>

            {imageMode === 'url' ? (
              <input
                type="url"
                value={form.coverImage.startsWith('data:') ? '' : form.coverImage}
                onChange={e => set('coverImage', e.target.value)}
                placeholder="https://images.unsplash.com/…"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            ) : (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 border-2 border-dashed border-gray-300 hover:border-primary rounded-xl px-5 py-4 w-full text-sm text-gray-500 hover:text-primary transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {form.coverImage.startsWith('data:') ? 'Replace image…' : 'Click to choose an image…'}
                </button>
                {fileWarning && (
                  <p className="mt-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    {fileWarning}
                  </p>
                )}
              </div>
            )}

            {/* Preview — works for both URL and base64 */}
            {form.coverImage && (
              <div className="mt-3 relative group">
                <div className="aspect-21/9 rounded-xl overflow-hidden bg-gray-100">
                  <img src={form.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => { set('coverImage', ''); setFileWarning(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 rounded-full p-1 shadow transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-secondary mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="An engaging post title…"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${errors.title ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Description / Excerpt */}
          <div>
            <label className="block text-sm font-semibold text-secondary mb-1.5">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={form.excerpt}
              onChange={e => set('excerpt', e.target.value)}
              rows={2}
              placeholder="A short summary shown on the blog card and below the title…"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          {/* Tag / Category */}
          <div>
            <label className="block text-sm font-semibold text-secondary mb-1.5">
              Tag / Category <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {PRESET_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => set('category', form.category === cat ? '' : cat)}
                  className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                    form.category === cat
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={form.category}
              onChange={e => set('category', e.target.value)}
              placeholder="Or type a custom tag…"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          {/* Reading time indicator */}
          {form.content && form.content !== '<p></p>' && (
            <div className="flex items-center gap-1.5 text-xs text-text-muted bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 w-fit">
              <Clock className="w-3.5 h-3.5" />
              Estimated reading time: <strong className="text-secondary">{readTime}</strong>
            </div>
          )}

          {/* Blog body */}
          <div>
            <label className="block text-sm font-semibold text-secondary mb-1.5">
              Content <span className="text-red-500">*</span>
            </label>
            <RichTextEditor key={editorKey} content={form.content} onChange={v => set('content', v)} />
            {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content}</p>}
          </div>

          {/* Bottom save button */}
          <div className="flex justify-end pb-16">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving…' : isEditing ? 'Update post' : 'Publish post'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CreateBlog;
