import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';

interface Props {
  paymentStatus: 'pending-check' | 'success' | 'pending' | 'failed' | 'error' | null;
}

const PaymentStatusBadge: React.FC<Props> = ({ paymentStatus }) => {
  if (!paymentStatus || paymentStatus === 'success' || paymentStatus === 'pending-check') return null;

  return (
    <div
      className={`mb-6 p-3 rounded-lg flex items-center gap-2 text-sm ${
        paymentStatus === 'failed' || paymentStatus === 'error'
          ? 'bg-red-50 border border-red-200 text-red-800'
          : 'bg-blue-50 border border-blue-200 text-blue-800'
      }`}
    >
      {paymentStatus === 'failed' || paymentStatus === 'error' ? (
        <AlertCircle size={16} className="shrink-0" />
      ) : (
        <Clock size={16} className="animate-spin shrink-0" />
      )}
      <span className="text-xs font-semibold">
        {paymentStatus === 'failed' && 'Payment Failed'}
        {paymentStatus === 'error' && 'Verification Error'}
        {paymentStatus === 'pending' && 'Payment Processing...'}
      </span>
    </div>
  );
};

export default PaymentStatusBadge;
