import React, { useRef, useEffect, useState } from 'react';
import { MoreVertical, Pencil, Trash2, PlusCircle } from 'lucide-react';
import { FadeIn, SectionHeader, StarRating } from './shared';
import { useTestimonials } from '../../hooks/useTestimonials';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import { Testimonial } from '../../types';
import { API_BASE } from '../../lib/constants';
import TestimonialEditModal from './TestimonialEditModal';

/* ── Per-card admin menu ── */
const TestimonialMenu: React.FC<{
  onEdit: () => void;
  onDelete: () => void;
}> = ({ onEdit, onDelete }) => {
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

/* ── Main Section ── */
const TestimonialsSection: React.FC = () => {
  const { testimonials, refetch } = useTestimonials();
  const { isAdmin, token } = useAuth();
  const { showConfirm } = useModal();
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openEdit = (t: Testimonial) => { setEditing(t); setModalOpen(true); };
  const openAdd  = () => { setEditing(null); setModalOpen(true); };

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
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex items-start justify-between gap-4 mb-2">
            <SectionHeader
              eyebrow="Real Results"
              title="What Nigerian Men Are Saying"
              subtitle="Unsolicited reviews from real customers across Nigeria"
            />
          </div>
        </FadeIn>

        
        <div className="flex justify-center items-center mb-10">
            {isAdmin && (
              <button
                type="button"
                onClick={openAdd}
                className="shrink-0 mt-1 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                Add Review
              </button>
            )}
        </div>

        {/* Masonry-style using CSS columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {testimonials.map((t, i) => (
            <FadeIn key={t.id} delay={(i % 3) * 0.09} className="break-inside-avoid">
              <div className="relative bg-background rounded-2xl border border-gray-100 p-6 shadow-sm">
                {isAdmin && (
                  <TestimonialMenu
                    onEdit={() => openEdit(t)}
                    onDelete={() => handleDelete(t.id)}
                  />
                )}
                <StarRating rating={t.rating} />
                <p className="text-sm leading-relaxed text-text mt-3 mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-secondary">{t.name}</p>
                    {(t.age || t.location) && (
                      <p className="text-xs text-text-muted">
                        {[t.age ? `Age ${t.age}` : null, t.location].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {modalOpen && (
        <TestimonialEditModal
          testimonial={editing}
          onClose={() => setModalOpen(false)}
          onSaved={() => { setModalOpen(false); refetch(); }}
        />
      )}
    </section>
  );
};

export default TestimonialsSection;

