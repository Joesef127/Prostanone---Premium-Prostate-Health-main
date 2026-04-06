import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

// ─── types ────────────────────────────────────────────────────────────────────

export type CardRowType = 'order' | 'distributor' | 'contact' | 'subscriber';
export type StatusVariant = 'success' | 'warning' | 'error' | 'neutral';

// ─── helpers ──────────────────────────────────────────────────────────────────

export function formatDate(raw: unknown): string {
  if (!raw) return '—';
  const d = new Date(String(raw));
  return isNaN(d.getTime())
    ? String(raw)
    : d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatCurrency(val: unknown): string {
  const n = Number(val);
  if (isNaN(n)) return String(val);
  return `₦${n.toLocaleString()}`;
}

export function detectType(row: Record<string, unknown>): CardRowType {
  if ('total_amount' in row || 'totalAmount' in row || 'payment_status' in row) return 'order';
  if ('business_type' in row || 'businessType' in row || 'expected_monthly_order' in row) return 'distributor';
  if ('message' in row) return 'contact';
  return 'subscriber';
}

export function paymentStatusVariant(status: unknown): StatusVariant {
  const s = String(status ?? '').toLowerCase();
  if (s === 'paid') return 'success';
  if (s === 'cod' || s === 'pending') return 'warning';
  if (s === 'failed' || s === 'cancelled') return 'error';
  return 'neutral';
}

export const statusStyles: Record<StatusVariant, string> = {
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  error:   'bg-rose-50 text-rose-700 border-rose-200',
  neutral: 'bg-surface text-text-muted border-border',
};

export const statusIcons: Record<StatusVariant, React.ReactNode> = {
  success: React.createElement(CheckCircle2, { className: 'w-3 h-3' }),
  warning: React.createElement(Clock,        { className: 'w-3 h-3' }),
  error:   React.createElement(XCircle,      { className: 'w-3 h-3' }),
  neutral: React.createElement(Clock,        { className: 'w-3 h-3' }),
};
