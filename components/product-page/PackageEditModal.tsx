import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { ProductPackage } from '../../types';
import { API_BASE } from '../../lib/constants';

interface Props {
  pkg: ProductPackage;
  onClose: () => void;
  onSaved: (updated: ProductPackage) => void;
}

const PackageEditModal: React.FC<Props> = ({ pkg, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name: pkg.name,
    price: String(pkg.price),
    originalPrice: String(pkg.originalPrice ?? pkg.price),
    description: pkg.description,
    savingsText: pkg.savingsText ?? '',
    deliveryText: pkg.deliveryText ?? '',
    usageNote: pkg.usageNote ?? '',
    badge: pkg.badge ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async () => {
    setError('');
    setSaving(true);
    const body = {
      name: form.name.trim(),
      price: parseInt(form.price, 10),
      originalPrice: form.originalPrice ? parseInt(form.originalPrice, 10) : undefined,
      description: form.description.trim(),
      savingsText: form.savingsText.trim() || null,
      deliveryText: form.deliveryText.trim(),
      usageNote: form.usageNote.trim(),
      badge: form.badge.trim() || null,
    };

    const res = await fetch(`${API_BASE}/api/packages/${pkg.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });
    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Failed to save');
      return;
    }

    const updated = await res.json();
    onSaved(updated);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-surface w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-bold text-text">Edit Package</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[70vh]">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          {[
            { label: 'Package Name', field: 'name' },
            { label: 'Description', field: 'description' },
            { label: 'Price (₦)', field: 'price', type: 'number' },
            { label: 'Original Price (₦)', field: 'originalPrice', type: 'number' },
            { label: 'Savings Text', field: 'savingsText', hint: 'e.g. Save ₦6,000' },
            { label: 'Delivery Text', field: 'deliveryText' },
            { label: 'Usage Note', field: 'usageNote' },
            { label: 'Badge', field: 'badge', hint: 'e.g. RECOMMENDED' },
          ].map(({ label, field, type, hint }) => (
            <div key={field}>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                {label}
                {hint && <span className="font-normal normal-case ml-1 opacity-60">({hint})</span>}
              </label>
              <input
                type={type ?? 'text'}
                value={form[field as keyof typeof form]}
                onChange={set(field)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-border bg-surface/50">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-border text-text-muted text-sm hover:text-text transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageEditModal;
