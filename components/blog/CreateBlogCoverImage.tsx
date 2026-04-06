import React, { useRef } from 'react';
import { Link2, Upload, X } from 'lucide-react';

interface CreateBlogCoverImageProps {
  coverImage: string;
  imageMode: 'url' | 'file';
  fileWarning: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onModeChange: (mode: 'url' | 'file') => void;
  onUrlChange: (url: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

const CreateBlogCoverImage: React.FC<CreateBlogCoverImageProps> = ({
  coverImage,
  imageMode,
  fileWarning,
  fileInputRef,
  onModeChange,
  onUrlChange,
  onFileUpload,
  onRemove,
}) => (
  <div>
    <label className="block text-sm font-semibold text-secondary mb-1.5">Cover image</label>

    <div className="flex gap-1 mb-3 bg-gray-100 p-1 rounded-lg w-fit">
      <button
        type="button"
        onClick={() => onModeChange('url')}
        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${imageMode === 'url' ? 'bg-white text-secondary shadow-sm' : 'text-gray-500 hover:text-secondary'}`}
      >
        <Link2 className="w-3.5 h-3.5" />
        Image URL
      </button>
      <button
        type="button"
        onClick={() => onModeChange('file')}
        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${imageMode === 'file' ? 'bg-white text-secondary shadow-sm' : 'text-gray-500 hover:text-secondary'}`}
      >
        <Upload className="w-3.5 h-3.5" />
        Upload file
      </button>
    </div>

    {imageMode === 'url' ? (
      <input
        type="url"
        value={coverImage.startsWith('data:') ? '' : coverImage}
        onChange={e => onUrlChange(e.target.value)}
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
          onChange={onFileUpload}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 border-2 border-dashed border-gray-300 hover:border-primary rounded-xl px-5 py-4 w-full text-sm text-gray-500 hover:text-primary transition-colors"
        >
          <Upload className="w-4 h-4" />
          {coverImage.startsWith('data:') ? 'Replace image…' : 'Click to choose an image…'}
        </button>
        {fileWarning && (
          <p className="mt-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            {fileWarning}
          </p>
        )}
      </div>
    )}

    {coverImage && (
      <div className="mt-3 relative group">
        <div className="aspect-21/9 rounded-xl overflow-hidden bg-gray-100">
          <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 rounded-full p-1 shadow transition-colors opacity-0 group-hover:opacity-100"
          title="Remove image"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )}
  </div>
);

export default CreateBlogCoverImage;
