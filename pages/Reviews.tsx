import React, { useRef, useEffect, useState } from 'react';
import { ShieldCheck, Star, MoreVertical, Pencil, Trash2, PlusCircle } from 'lucide-react';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { PAGE_URLS, SITE_CONFIG } from '../lib/seo';
import { useTestimonials } from '../hooks/useTestimonials';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { Testimonial } from '../types';
import { API_BASE } from '../lib/constants';
import TestimonialEditModal from '../components/product-page/TestimonialEditModal';
import ReviewsSkeleton from '../components/skeleton-loaders/reviews/ReviewsSkeleton';

/* ── Per-card admin menu ── */
const TestimonialMenu: React.FC<{ onEdit: () => void; onDelete: () => void }> = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="absolute top-3 right-3 z-10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow text-gray-400 hover:text-gray-700 transition-colors"
        title="Review options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-100 rounded-xl shadow-xl py-1 z-20">
          <button
            type="button"
            onClick={() => { onEdit(); setOpen(false); }}
            className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5 text-primary" /> Edit
          </button>
          <button
            type="button"
            onClick={() => { onDelete(); setOpen(false); }}
            className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

/* ── Reviews Page ── */
const Reviews: React.FC = () => {
  // SEO configuration for reviews page
  useSeoMeta({
    title: "Customer Reviews - Prostanone Prostate Supplement",
    description: "Read real customer reviews and testimonials about Prostanone. See how our natural prostate health supplement has helped thousands improve their wellness.",
    keywords: [
      "Prostanone reviews",
      "customer testimonials",
      "prostate supplement reviews",
      "user feedback",
      "Prostanone results",
    ],
    url: PAGE_URLS.reviews,
    image: SITE_CONFIG.defaultImage,
    imageAlt: "Prostanone Customer Reviews",
    type: "website",
  });

  const { testimonials, loading, refetch } = useTestimonials();
  const { isAdmin, token } = useAuth();
  const { showConfirm } = useModal();
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openEdit = (t: Testimonial) => { setEditing(t); setModalOpen(true); };
  const openAdd  = () => { setEditing(null); setModalOpen(true); };

  if (loading) return <ReviewsSkeleton />;

  const handleDelete = async (id: number) => {
    const confirmed = await showConfirm({
      title: 'Delete Review',
      message: 'Remove this review permanently? This cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      destructive: true,
    });
    if (!confirmed) return;
    await fetch(`${API_BASE}/api/testimonials/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    refetch();
  };

  return (
    <div className="pt-20 bg-background min-h-screen">
      <section className="bg-primary text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Real Men. Real Results.</h1>
          <p className="text-xl text-white/80">
            See how Prostanone has helped thousands of Nigerian men reclaim their nights.
          </p>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isAdmin && (
          <div className="flex justify-center mb-10">
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Add Review
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow"
            >
              {isAdmin && (
                <TestimonialMenu
                  onEdit={() => openEdit(t)}
                  onDelete={() => handleDelete(t.id)}
                />
              )}
              <div className="flex gap-1 mb-4 text-accent">
                {[...Array(t.rating ?? 5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-text leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-bold text-primary">{t.name}</p>
                  <p className="text-xs text-text-muted flex items-center gap-1">
                    <ShieldCheck size={12} className="text-green-500" />
                    Verified Purchase{t.location ? ` • ${t.location}` : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {modalOpen && (
        <TestimonialEditModal
          testimonial={editing}
          onClose={() => setModalOpen(false)}
          onSaved={() => { setModalOpen(false); refetch(); }}
        />
      )}
    </div>
  );
};

export default Reviews;
