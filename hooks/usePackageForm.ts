import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { ProductPackage } from '../types';
import { API_BASE } from '../lib/constants';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';

interface Options {
  pkg: ProductPackage | null;
  onSaved: (pkg: ProductPackage) => void;
  onDeleted?: (id: string) => void;
  onClose: () => void;
}

export interface PackageForm {
  id: string;
  name: string;
  containers: string;
  price: string;
  originalPrice: string;
  description: string;
  savingsText: string;
  deliveryText: string;
  usageNote: string;
  badge: string;
}

export function usePackageForm({ pkg, onSaved, onDeleted, onClose }: Options) {
  const { token } = useAuth();
  const { showConfirm } = useModal();
  const isEdit = pkg !== null;

  const [form, setForm] = useState<PackageForm>({
    id:            pkg?.id            ?? '',
    name:          pkg?.name          ?? '',
    containers:    String(pkg?.containers ?? 1),
    price:         String(pkg?.price  ?? ''),
    originalPrice: String(pkg?.originalPrice ?? pkg?.price ?? ''),
    description:   pkg?.description   ?? '',
    savingsText:   pkg?.savingsText   ?? '',
    deliveryText:  pkg?.deliveryText  ?? '',
    usageNote:     pkg?.usageNote     ?? '',
    badge:         pkg?.badge         ?? '',
  });

  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error,    setError]    = useState('');

  const set = (field: keyof PackageForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const save = async () => {
    setError('');
    if (!form.name.trim())              { setError('Package name is required.'); return; }
    if (!form.price)                    { setError('Price is required.');        return; }
    if (!isEdit && !form.id.trim())     { setError('Package ID is required.');   return; }

    setSaving(true);
    const body = {
      ...(!isEdit && { id: form.id.trim(), containers: parseInt(form.containers, 10) || 1 }),
      name:          form.name.trim(),
      price:         parseInt(form.price, 10),
      originalPrice: form.originalPrice ? parseInt(form.originalPrice, 10) : undefined,
      description:   form.description.trim(),
      savingsText:   form.savingsText.trim()  || null,
      deliveryText:  form.deliveryText.trim(),
      usageNote:     form.usageNote.trim(),
      badge:         form.badge.trim()        || null,
    };

    const url = isEdit
      ? `${API_BASE}/api/packages/${pkg!.id}`
      : `${API_BASE}/api/packages`;

    const res = await fetch(url, {
      method:  isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      credentials: 'include',
      body: JSON.stringify(body),
    });
    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Failed to save');
      return;
    }

    const saved: ProductPackage = await res.json();
    onSaved(saved);
    onClose();
  };

  const remove = async () => {
    if (!pkg) return;
    const confirmed = await showConfirm({
      title: 'Delete Package',
      message: `Delete "${pkg.name}"? This cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      destructive: true,
    });
    if (!confirmed) return;
    setDeleting(true);
    await fetch(`${API_BASE}/api/packages/${pkg.id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    setDeleting(false);
    onDeleted?.(pkg.id);
    onClose();
  };

  return { form, set, isEdit, saving, deleting, error, save, remove };
}
