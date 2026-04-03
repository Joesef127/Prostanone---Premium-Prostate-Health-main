import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';
import { useModalInternal } from '../../context/ModalContext';

const Modal: React.FC = () => {
  const { config, respond } = useModalInternal();
  const [promptValue, setPromptValue] = useState('');
  const primaryBtnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Seed prompt input when a prompt modal opens
  useEffect(() => {
    if (config?.kind === 'prompt') {
      setPromptValue(config.defaultValue ?? '');
    }
  }, [config]);

  // Focus primary button (or input) when modal opens
  useEffect(() => {
    if (!config) return;
    const frame = requestAnimationFrame(() => {
      if (config.kind === 'prompt') {
        inputRef.current?.focus();
      } else {
        primaryBtnRef.current?.focus();
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [config]);

  // Close on ESC
  useEffect(() => {
    if (!config) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (config.kind === 'alert') respond(undefined);
      else if (config.kind === 'confirm') respond(false);
      else if (config.kind === 'prompt') respond(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [config, respond]);

  const isDestructive = config?.kind === 'confirm' && config.destructive === true;

  return (
    <AnimatePresence>
      {config && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-9998 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => {
              if (config.kind === 'alert') respond(undefined);
              else if (config.kind === 'confirm') respond(false);
              else if (config.kind === 'prompt') respond(null);
            }}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              initial={{ opacity: 0, scale: 0.93, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="pointer-events-auto w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start gap-3 p-6 pb-0">
                <div
                  className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isDestructive
                      ? 'bg-red-100 text-red-600'
                      : config.kind === 'alert'
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {isDestructive ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : config.kind === 'alert' ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <HelpCircle className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2
                    id="modal-title"
                    className="text-base font-bold text-secondary leading-snug"
                  >
                    {config.title}
                  </h2>
                  {config.kind !== 'prompt' && config.message && (
                    <p className="text-sm text-text-muted mt-1 leading-relaxed">
                      {config.message}
                    </p>
                  )}
                  {config.kind === 'prompt' && config.message && (
                    <p className="text-sm text-text-muted mt-1 leading-relaxed">
                      {config.message}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (config.kind === 'alert') respond(undefined);
                    else if (config.kind === 'confirm') respond(false);
                    else respond(null);
                  }}
                  className="shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Prompt input */}
              {config.kind === 'prompt' && (
                <div className="px-6 pt-4">
                  <input
                    ref={inputRef}
                    type="text"
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    placeholder={config.placeholder ?? ''}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') respond(promptValue || null);
                    }}
                  />
                </div>
              )}

              {/* Footer buttons */}
              <div className="flex justify-end gap-2 p-6 pt-4">
                {config.kind !== 'alert' && (
                  <button
                    onClick={() => {
                      if (config.kind === 'confirm') respond(false);
                      else respond(null);
                    }}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    {config.kind === 'confirm'
                      ? config.cancelLabel ?? 'Cancel'
                      : config.cancelLabel ?? 'Cancel'}
                  </button>
                )}
                <button
                  ref={primaryBtnRef}
                  onClick={() => {
                    if (config.kind === 'alert') respond(undefined);
                    else if (config.kind === 'confirm') respond(true);
                    else respond(promptValue.trim() || null);
                  }}
                  className={`px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors ${
                    isDestructive
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {config.kind === 'alert'
                    ? config.confirmLabel ?? 'OK'
                    : config.kind === 'confirm'
                    ? config.confirmLabel ?? 'Confirm'
                    : config.confirmLabel ?? 'OK'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
