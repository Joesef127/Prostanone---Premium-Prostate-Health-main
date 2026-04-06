import React from 'react';
import { ArrowLeft, Save, Eye } from 'lucide-react';

interface CreateBlogTopBarProps {
  isEditing: boolean;
  saving: boolean;
  previewMode: boolean;
  onBack: () => void;
  onTogglePreview: () => void;
  onDelete: () => void;
  onSave: () => void;
}

const CreateBlogTopBar: React.FC<CreateBlogTopBarProps> = ({
  isEditing,
  saving,
  previewMode,
  onBack,
  onTogglePreview,
  onDelete,
  onSave,
}) => (
  <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-secondary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to blog
      </button>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onTogglePreview}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-secondary border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-1.5 transition-colors"
        >
          <Eye className="w-4 h-4" />
          {previewMode ? 'Edit' : 'Preview'}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onDelete}
            className="text-sm font-medium text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 rounded-lg px-3 py-1.5 transition-colors"
          >
            Delete
          </button>
        )}

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : isEditing ? 'Update' : 'Publish'}
        </button>
      </div>
    </div>
  </div>
);

export default CreateBlogTopBar;
