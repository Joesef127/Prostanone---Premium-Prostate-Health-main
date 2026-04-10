import React from 'lucide-react';
import { AlertCircle, Clock } from 'lucide-react';

interface Props {
  status: 'pending-check' | 'success' | 'pending' | 'failed' | null;
}

const PaymentStatusBadge: React.FC<Props> = ({ status }) => {
  if (!status || status === 'success') return null;

  return (
    <div
      className={`mb-6 p-3 rounded-lg flex items-center gap-2 text-sm ${
        status === 'failed'
          ? 'bg-red-50 border border-red-200 text-red-800'
          : 'bg-blue-50 border border-blue-200 text-blue-800'
      }`}
    >
      {status === 'failed' ? (
        <AlertCircle size={16} className="shrink-0" />
      ) : (
        <Clock size={16} className="animate-spin shrink-0" />
      )}
      <span className="text-xs font-semibold">
        {status === 'failed' && 'Payment Failed'}
        {status === 'pending' && 'Payment Processing...'}
        {status === 'pending-check' && 'Verifying Payment...'}
      </span>
    </div>
  );
};

export default PaymentStatusBadge;
