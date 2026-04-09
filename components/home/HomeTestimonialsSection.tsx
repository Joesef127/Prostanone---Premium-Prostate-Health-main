import React, { useState, useEffect } from 'react';
import { ShieldCheck, MoreVertical, Pencil, Trash2, PlusCircle } from 'lucide-react';
import { useTestimonials } from '../../hooks/useTestimonials';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import { Testimonial } from '../../types';
import { API_BASE } from '../../lib/constants';
import TestimonialEditModal from '../product-page/TestimonialEditModal';

const HomeTestimonialsSection: React.FC = () => {
  const { testimonials, refetch } = useTestimonials();
  const { isAdmin, token } = useAuth();
  const { showConfirm } = useModal();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingT, setEditingT] = useState<Testimonial | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (openMenuId === null) return;
    const handler = () => setOpenMenuId(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [openMenuId]);

  const openAdd = () => { setEditingT(null); setModalOpen(true); };
  const openEdit = (t: Testimonial) => { setEditingT(t); setModalOpen(true); };

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
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    setOpenMenuId(null);
    refetch();
  };

  return (
    <section className="py-24 bg-primary text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h2 className="text-3xl font-bold">Trusted by Nigerian Men</h2>
          {isAdmin && (
            <button
              onClick={openAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-white/20 border border-white/30 text-white hover:bg-white/30 transition-colors"
            >
              <PlusCircle size={15} />
              Add Review
            </button>
          )}
        </div>
        <div className="flex justify-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map(i => <ShieldCheck key={i} className="text-accent" fill="currentColor" />)}
        </div>
        <p className="text-white/80">4.9/5 Average Rating based on 1,200+ reviews</p>
      </div>

      <div className="flex overflow-x-auto pb-8 gap-6 px-4 no-scrollbar snap-x">
        {testimonials.map((t) => (
          <div key={t.id} className="relative shrink-0 w-80 md:w-96 bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 snap-center">
            {isAdmin && (
              <div className="absolute top-3 right-3">
                <button
                  onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === t.id ? null : t.id); }}
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  <MoreVertical size={15} />
                </button>
                {openMenuId === t.id && (
                  <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg py-1 z-10 text-gray-700 text-sm">
                    <button
                      onClick={() => { openEdit(t); setOpenMenuId(null); }}
                      className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="flex items-center gap-2 w-full px-3 py-2 hover:bg-rose-50 text-rose-600"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-1 mb-4 text-accent">
              {[...Array(t.rating ?? 5)].map((_, i) => <span key={i}>★</span>)}
            </div>
            <p className="text-lg italic mb-6">"{t.text}"</p>
            <div>
              <p className="font-bold">{t.name}</p>
              <p className="text-sm text-white/60">
                {t.age ? `${t.age} years old` : ''}
                {t.age && t.location ? ' • ' : ''}
                {t.location ?? ''}
              </p>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <TestimonialEditModal
          testimonial={editingT}
          onClose={() => setModalOpen(false)}
          onSaved={() => { setModalOpen(false); refetch(); }}
        />
      )}
    </section>
  );
};

export default HomeTestimonialsSection;
