import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLocation } from 'react-router-dom';
import termsContent from '../policies/terms.md?raw';

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const components = {
  h2: ({ children }: { children?: React.ReactNode }) => {
    const id = slugify(String(children ?? ''));
    return <h2 id={id}>{children}</h2>;
  },
};

const TermsAndConditions: React.FC = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash]);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm px-8 py-10 sm:px-12 sm:py-14">
          <p className="text-xs text-text-light uppercase tracking-widest mb-6">
            Last updated: 2025
          </p>
          <article className="policy-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
              {termsContent}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
