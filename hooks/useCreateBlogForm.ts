import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { getAllBlogPosts } from '../lib/blogData';
import {
  saveLocalBlogPost,
  getLocalBlogPosts,
  generateSlug,
  calculateReadTime,
  deleteLocalBlogPost,
  type LocalBlogPost,
} from '../lib/blogStorage';
import { BLOG_TEMPLATES, type BlogTemplate } from '../lib/blogTemplates';

const EMPTY_FORM = {
  title: '',
  excerpt: '',
  category: '',
  coverImage: '',
  content: '',
};

export type CreateBlogFormErrors = Partial<Record<keyof typeof EMPTY_FORM, string>>;

const useCreateBlogForm = () => {
  const navigate = useNavigate();
  const { slug: editSlug } = useParams<{ slug?: string }>();
  const isEditing = Boolean(editSlug);
  const { showConfirm } = useModal();

  const availableCategories = Array.from(
    new Set(getAllBlogPosts().map(p => p.category).filter(Boolean))
  );

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<CreateBlogFormErrors>({});
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileWarning, setFileWarning] = useState('');

  const [showTemplates, setShowTemplates] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

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
      setEditorKey(k => k + 1);
    }
  }, [editSlug]);

  const readTime = calculateReadTime(form.content);

  const set = (field: keyof typeof EMPTY_FORM, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: CreateBlogFormErrors = {};
    if (!form.title.trim()) next.title = 'Title is required.';
    if (!form.content || form.content === '<p></p>') next.content = 'Blog body cannot be empty.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileWarning('');
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
    setIsDirty(true);
    setEditorKey(k => k + 1);
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
    setIsDirty(false);
    navigate(`/blog/${slug}`);
  };

  const handleDelete = async () => {
    if (!editSlug) return;
    const confirmed = await showConfirm({
      title: 'Delete post',
      message: 'Are you sure you want to delete this post? This cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Keep post',
      destructive: true,
    });
    if (!confirmed) return;
    deleteLocalBlogPost(editSlug);
    navigate('/blog');
  };

  const handleBackNavigation = async () => {
    if (isDirty) {
      const ok = await showConfirm({
        title: 'Unsaved changes',
        message: 'You have unsaved changes. Are you sure you want to leave?',
        confirmLabel: 'Leave',
        cancelLabel: 'Stay',
        destructive: true,
      });
      if (!ok) return;
    }
    navigate('/blog');
  };

  return {
    form,
    errors,
    saving,
    previewMode,
    setPreviewMode,
    isDirty,
    imageMode,
    setImageMode,
    fileInputRef,
    fileWarning,
    setFileWarning,
    showTemplates,
    setShowTemplates,
    editorKey,
    readTime,
    availableCategories,
    isEditing,
    editSlug,
    set,
    handleFileUpload,
    loadTemplate,
    handleSave,
    handleDelete,
    handleBackNavigation,
  };
};

export default useCreateBlogForm;
