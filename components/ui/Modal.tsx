import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { useModalInternal } from "../../context/ModalContext";

const Modal: React.FC = () => {
  const { config, respond } = useModalInternal();
  const [promptValue, setPromptValue] = useState("");
  const [copied, setCopied] = useState(false);
  const primaryBtnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Seed prompt input when a prompt modal opens
  useEffect(() => {
    if (config?.kind === "prompt") {
      setPromptValue(config.defaultValue ?? "");
    }
    if (config?.kind === "share") {
      setCopied(false);
    }
  }, [config]);

  // Focus primary button (or input) when modal opens
  useEffect(() => {
    if (!config) return;
    const frame = requestAnimationFrame(() => {
      if (config.kind === "prompt") {
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
      if (e.key !== "Escape") return;
      if (config.kind === "alert") respond(undefined);
      else if (config.kind === "confirm") respond(false);
      else if (config.kind === "prompt") respond(null);
      else if (config.kind === "share") respond(undefined);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [config, respond]);

  const isDestructive =
    config?.kind === "confirm" && config.destructive === true;

  const handleCopyLink = () => {
    if (config?.kind !== "share") return;
    navigator.clipboard
      .writeText(config.url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      })
      .catch(() => {});
  };

  const getSocialLinks = (url: string, title: string) => ({
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    facebook: `http://www.facebook.com/sharer.php?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/feed/?shareActive=true&url=${encodeURIComponent(url)}&shareUrl=${encodeURIComponent(url)}`,
  });

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
              if (config.kind === "alert") respond(undefined);
              else if (config.kind === "confirm") respond(false);
              else if (config.kind === "prompt") respond(null);
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
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="pointer-events-auto w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="relative flex items-start gap-3 p-6 pb-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
                <div
                  className={`shrink-0 w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                    isDestructive
                      ? "bg-red-100 text-red-600"
                      : config.kind === "alert"
                        ? "bg-amber-100 text-amber-600"
                        : config.kind === "share"
                          ? "bg-primary/10 text-primary"
                          : "bg-primary/10 text-primary"
                  }`}
                >
                  {isDestructive ? (
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : config.kind === "alert" ? (
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : config.kind === "share" ? (
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2
                    id="modal-title"
                    className="text-base font-bold text-secondary leading-snug"
                  >
                    {config.title}
                  </h2>
                  {config.kind !== "prompt" &&
                    config.kind !== "share" &&
                    config.message && (
                      <p className="text-sm text-text-muted mt-1 leading-relaxed">
                        {config.message}
                      </p>
                    )}
                  {config.kind === "prompt" && config.message && (
                    <p className="text-sm text-text-muted mt-1 leading-relaxed">
                      {config.message}
                    </p>
                  )}
                </div>
                </div>
                <button
                  onClick={() => {
                    if (config.kind === "alert") respond(undefined);
                    else if (config.kind === "confirm") respond(false);
                    else if (config.kind === "share") respond(undefined);
                    else respond(null);
                  }}
                  className="absolute top-5 right-5 shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 z-20" />
                </button>
              </div>

              {/* Prompt input */}
              {config.kind === "prompt" && (
                <div className="px-6 pt-4">
                  <input
                    ref={inputRef}
                    type="text"
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    placeholder={config.placeholder ?? ""}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") respond(promptValue || null);
                    }}
                  />
                </div>
              )}

              {/* Share UI */}
              {config.kind === "share" &&
                (() => {
                  const links = getSocialLinks(config.url, config.title);
                  return (
                    <div className="px-6 pt-4 space-y-4">
                      {/* Copy link field */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                          Link
                        </label>
                        <div className="flex gap-2">
                          <input
                            readOnly
                            value={config.url}
                            className="flex-1 min-w-0 px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 bg-gray-50 focus:outline-none truncate"
                          />
                          <button
                            type="button"
                            onClick={handleCopyLink}
                            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors
                            text-primary border-primary/30 hover:bg-primary/5 data-copied:text-green-600 data-copied:border-green-300"
                            data-copied={copied || undefined}
                          >
                            {copied ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            {copied ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>

                      {/* Social share buttons */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2">
                          Share on
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Twitter / X */}
                          <a
                            href={links.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-black text-white hover:bg-gray-800 transition-colors"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.634 5.903-5.634Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            X
                          </a>
                          {/* WhatsApp */}
                          <a
                            href={links.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#25D366] text-white hover:bg-[#1ebe5d] transition-colors"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                            </svg>
                            WhatsApp
                          </a>
                          {/* Facebook */}
                          <a
                            href={links.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#1877F2] text-white hover:bg-[#166fe5] transition-colors"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                          </a>
                          {/* LinkedIn */}
                          <a
                            href={links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#0A66C2] text-white hover:bg-[#0958a8] transition-colors"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                            LinkedIn
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              {/* Footer buttons */}
              <div className="flex justify-end gap-2 p-6 pt-4">
                {config.kind !== "alert" && config.kind !== "share" && (
                  <button
                    onClick={() => {
                      if (config.kind === "confirm") respond(false);
                      else respond(null);
                    }}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    {config.kind === "confirm"
                      ? (config.cancelLabel ?? "Cancel")
                      : (config.cancelLabel ?? "Cancel")}
                  </button>
                )}
                {config.kind === "share" ? (
                  <button
                    ref={primaryBtnRef}
                    onClick={() => respond(undefined)}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Done
                  </button>
                ) : (
                  <button
                    ref={primaryBtnRef}
                    onClick={() => {
                      if (config.kind === "alert") respond(undefined);
                      else if (config.kind === "confirm") respond(true);
                      else respond(promptValue.trim() || null);
                    }}
                    className={`px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors ${
                      isDestructive
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-primary hover:bg-primary/90"
                    }`}
                  >
                    {config.kind === "alert"
                      ? (config.confirmLabel ?? "OK")
                      : config.kind === "confirm"
                        ? (config.confirmLabel ?? "Confirm")
                        : (config.confirmLabel ?? "OK")}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
