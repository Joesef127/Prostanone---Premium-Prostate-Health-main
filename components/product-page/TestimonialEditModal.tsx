import React, { useState, useEffect } from 'react';
import { X, Save, Star, UserRound } from 'lucide-react';
import { Testimonial } from '../../types';
import { API_BASE } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button';

interface Props {
  testimonial: Testimonial | null; // null = create mode
  onClose: () => void;
  onSaved: (t: Testimonial) => void;
}

const StarPicker: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        className="focus:outline-none transition-transform hover:scale-125"
      >
        <Star
          className={`w-5 h-5 transition-colors ${n <= value ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
        />
      </button>
    ))}
  </div>
);

const Field: React.FC<{
  label: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, hint, children }) => (
  <div>
    <label className="block text-[10px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
      {label}
      {hint && <span className="normal-case font-normal ml-1 opacity-60">({hint})</span>}
    </label>
    {children}
  </div>
);

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-text text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors placeholder:text-text-muted';

const TestimonialEditModal: React.FC<Props> = ({ testimonial, onClose, onSaved }) => {
  const { token } = useAuth();
  const isEdit = testimonial !== null;

  const [form, setForm] = useState({
    name: testimonial?.name ?? '',
    age: testimonial?.age != null ? String(testimonial.age) : '',
    location: testimonial?.location ?? '',
    text: testimonial?.text ?? '',
    rating: testimonial?.rating ?? 5,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async () => {
    setError('');
    if (!form.name.trim()) { setError('Name is required.'); return; }
    if (!form.text.trim()) { setError('Review text is required.'); return; }

    setSaving(true);
    const body = {
      name: form.name.trim(),
      age: form.age ? parseInt(form.age, 10) : null,
      location: form.location.trim() || null,
      text: form.text.trim(),
      rating: form.rating,
    };

    const url = isEdit
      ? `${API_BASE}/api/testimonials/${testimonial!.id}`
      : `${API_BASE}/api/testimonials`;

    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      credentials: 'include',
      body: JSON.stringify(body),
    });
    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Failed to save. Please try again.');
      return;
    }

    const saved: Testimonial = await res.json();
    onSaved(saved);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full sm:max-w-lg rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] mx-3 mb-5">

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border shrink-0">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <UserRound className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-text text-base leading-tight">
              {isEdit ? 'Edit Review' : 'Add New Review'}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {isEdit ? `Editing "${testimonial!.name}"` : 'Add a customer testimonial'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text hover:bg-background transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <Field label="Customer Name">
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              placeholder="e.g. Chidi A."
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Age" hint="optional">
              <input
                type="number"
                value={form.age}
                onChange={set('age')}
                placeholder="e.g. 52"
                min={18}
                max={100}
                className={inputClass}
              />
            </Field>
            <Field label="Location" hint="optional">
              <input
                type="text"
                value={form.location}
                onChange={set('location')}
                placeholder="e.g. Lagos"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Review Text">
            <textarea
              value={form.text}
              onChange={set('text')}
              rows={4}
              placeholder="What did the customer say about Prostanone?"
              className={`${inputClass} resize-none`}
            />
          </Field>

          <Field label="Rating">
            <StarPicker value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
          </Field>
        </div>

        {/* Footer */}
        <div className="grid sm:grid-cols-2 sm:flex-row gap-3 px-6 py-4 border-t border-border bg-background shrink-0">
          <Button
          size='md'
          variant='outline'
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-text-muted text-sm font-medium hover:text-text hover:border-gray-400 transition-colors"
          >
            Cancel
          </Button>
          <Button
          size='md'
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Review'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialEditModal;
