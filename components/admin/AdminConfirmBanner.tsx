import React from 'react';

interface AdminConfirmBannerProps {
  confirmClear: 'all' | 'selected';
  rowCount: number;
  selectedSize: number;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const AdminConfirmBanner: React.FC<AdminConfirmBannerProps> = ({
  confirmClear, rowCount, selectedSize, deleting, onCancel, onConfirm,
}) => (
  <div className="flex items-center justify-between gap-4 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 mb-4 text-sm">
    <span className="text-rose-700 font-medium">
      {confirmClear === 'all'
        ? `Delete all ${rowCount} records in this tab? This cannot be undone.`
        : `Delete ${selectedSize} selected record(s)? This cannot be undone.`}
    </span>
    <div className="flex gap-2 shrink-0">
      <button
        onClick={onCancel}
        className="px-3 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-100 transition-colors"
      >
        Cancel
      </button>
      <button
        disabled={deleting}
        onClick={onConfirm}
        className="px-3 py-1 rounded-lg bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 transition-colors"
      >
        {deleting ? 'Deleting…' : 'Confirm'}
      </button>
    </div>
  </div>
);

export default AdminConfirmBanner;
