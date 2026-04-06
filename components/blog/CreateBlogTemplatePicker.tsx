import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronDown } from 'lucide-react';
import { BLOG_TEMPLATES, type BlogTemplate } from '../../lib/blogTemplates';

interface CreateBlogTemplatePickerProps {
  showTemplates: boolean;
  onToggle: () => void;
  onSelect: (tpl: BlogTemplate) => void;
}

const CreateBlogTemplatePicker: React.FC<CreateBlogTemplatePickerProps> = ({
  showTemplates,
  onToggle,
  onSelect,
}) => (
  <div className="relative">
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold border border-gray-200 hover:border-primary text-gray-600 hover:text-primary rounded-xl px-4 py-2 transition-colors"
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
                  onClick={() => onSelect(tpl)}
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
);

export default CreateBlogTemplatePicker;
