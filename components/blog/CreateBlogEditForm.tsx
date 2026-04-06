import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Save } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import CreateBlogCoverImage from './CreateBlogCoverImage';
import CreateBlogTemplatePicker from './CreateBlogTemplatePicker';
import type { BlogTemplate } from '../../lib/blogTemplates';
import type { CreateBlogFormErrors } from '../../hooks/useCreateBlogForm';

interface CreateBlogEditFormProps {
  form: {
    title: string;
    excerpt: string;
    category: string;
    coverImage: string;
    content: string;
  };
  errors: CreateBlogFormErrors;
  saving: boolean;
  isEditing: boolean;
  readTime: string;
  availableCategories: string[];
  imageMode: 'url' | 'file';
  fileWarning: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  showTemplates: boolean;
  editorKey: number;
  onSet: (field: 'title' | 'excerpt' | 'category' | 'coverImage' | 'content', value: string) => void;
  onImageModeChange: (mode: 'url' | 'file') => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveCover: () => void;
  onToggleTemplates: () => void;
  onSelectTemplate: (tpl: BlogTemplate) => void;
  onSave: () => void;
}

const CreateBlogEditForm: React.FC<CreateBlogEditFormProps> = ({
  form,
  errors,
  saving,
  isEditing,
  readTime,
  availableCategories,
  imageMode,
  fileWarning,
  fileInputRef,
  showTemplates,
  editorKey,
  onSet,
  onImageModeChange,
  onFileUpload,
  onRemoveCover,
  onToggleTemplates,
  onSelectTemplate,
  onSave,
}) => (
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
      {!isEditing && (
        <CreateBlogTemplatePicker
          showTemplates={showTemplates}
          onToggle={onToggleTemplates}
          onSelect={onSelectTemplate}
        />
      )}
    </div>

    <CreateBlogCoverImage
      coverImage={form.coverImage}
      imageMode={imageMode}
      fileWarning={fileWarning}
      fileInputRef={fileInputRef}
      onModeChange={onImageModeChange}
      onUrlChange={url => onSet('coverImage', url)}
      onFileUpload={onFileUpload}
      onRemove={onRemoveCover}
    />

    {/* Title */}
    <div>
      <label className="block text-sm font-semibold text-secondary mb-1.5">
        Title <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={form.title}
        onChange={e => onSet('title', e.target.value)}
        placeholder="An engaging post title…"
        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${errors.title ? 'border-red-400' : 'border-gray-200'}`}
      />
      {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
    </div>

    {/* Excerpt */}
    <div>
      <label className="block text-sm font-semibold text-secondary mb-1.5">
        Description <span className="text-gray-400 font-normal">(optional)</span>
      </label>
      <textarea
        value={form.excerpt}
        onChange={e => onSet('excerpt', e.target.value)}
        rows={2}
        placeholder="A short summary shown on the blog card and below the title…"
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
      />
    </div>

    {/* Category */}
    <div>
      <label className="block text-sm font-semibold text-secondary mb-1.5">
        Tag / Category <span className="text-gray-400 font-normal">(optional)</span>
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {availableCategories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => onSet('category', form.category === cat ? '' : cat)}
            className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
              form.category === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={form.category}
        onChange={e => onSet('category', e.target.value)}
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

    {/* Content */}
    <div>
      <label className="block text-sm font-semibold text-secondary mb-1.5">
        Content <span className="text-red-500">*</span>
      </label>
      <RichTextEditor key={editorKey} content={form.content} onChange={v => onSet('content', v)} />
      {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content}</p>}
    </div>

    {/* Bottom save */}
    <div className="flex justify-end pb-16">
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
      >
        <Save className="w-4 h-4" />
        {saving ? 'Saving…' : isEditing ? 'Update post' : 'Publish post'}
      </button>
    </div>
  </motion.div>
);

export default CreateBlogEditForm;
