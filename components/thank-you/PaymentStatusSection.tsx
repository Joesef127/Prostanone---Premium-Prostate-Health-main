import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';

interface Props {
  status: 'pending-check' | 'success' | 'pending' | 'failed' | null;
}

const PaymentStatusSection: React.FC<Props> = ({ status }) => {
  if (!status || status === 'success' || status === 'pending-check') return null;

  if (status === 'failed') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-left">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={16} className="text-red-600" />
          <p className="font-semibold text-red-800 text-sm">What Now?</p>
        </div>
        <ul className="text-xs text-red-700 space-y-1.5 list-disc list-inside">
          <li>Verify your payment details and try again</li>
          <li>Try a different payment method</li>
          <li>Contact our support team if the issue persists</li>
        </ul>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} className="text-amber-600" />
          <p className="font-semibold text-amber-800 text-sm">Payment is Processing</p>
        </div>
        <p className="text-xs text-amber-700">
          Your payment is still being verified. Please check your email for confirmation. If you have any concerns, feel free to contact our support team.
        </p>
      </div>
    );
  }

  return null;
};

export default PaymentStatusSection;
