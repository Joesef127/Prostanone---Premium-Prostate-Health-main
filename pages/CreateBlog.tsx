import React from 'react';
import { useDynamicTitle } from '../hooks/useDynamicTitle';
import useCreateBlogForm from '../hooks/useCreateBlogForm';
import CreateBlogTopBar from '../components/blog/CreateBlogTopBar';
import CreateBlogPreviewPane from '../components/blog/CreateBlogPreviewPane';
import CreateBlogEditForm from '../components/blog/CreateBlogEditForm';

const CreateBlog: React.FC = () => {
  const {
    form, errors, saving, previewMode, setPreviewMode,
    imageMode, setImageMode, fileInputRef, fileWarning, setFileWarning,
    showTemplates, setShowTemplates, editorKey, readTime,
    availableCategories, isEditing,
    set, handleFileUpload, loadTemplate, handleSave, handleDelete, handleBackNavigation,
  } = useCreateBlogForm();

  useDynamicTitle(isEditing ? 'Edit Post' : 'New Post');

  return (
    <div className="min-h-screen bg-white pt-24">
      <CreateBlogTopBar
        isEditing={isEditing}
        saving={saving}
        previewMode={previewMode}
        onBack={handleBackNavigation}
        onTogglePreview={() => setPreviewMode(p => !p)}
        onDelete={handleDelete}
        onSave={handleSave}
      />

      {previewMode ? (
        <CreateBlogPreviewPane
          title={form.title}
          excerpt={form.excerpt}
          category={form.category}
          coverImage={form.coverImage}
          content={form.content}
          readTime={readTime}
        />
      ) : (
        <CreateBlogEditForm
          form={form}
          errors={errors}
          saving={saving}
          isEditing={isEditing}
          readTime={readTime}
          availableCategories={availableCategories}
          imageMode={imageMode}
          fileWarning={fileWarning}
          fileInputRef={fileInputRef}
          showTemplates={showTemplates}
          editorKey={editorKey}
          onSet={set}
          onImageModeChange={(mode) => { setImageMode(mode); setFileWarning(''); }}
          onFileUpload={handleFileUpload}
          onRemoveCover={() => { set('coverImage', ''); setFileWarning(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
          onToggleTemplates={() => setShowTemplates(p => !p)}
          onSelectTemplate={loadTemplate}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default CreateBlog;
