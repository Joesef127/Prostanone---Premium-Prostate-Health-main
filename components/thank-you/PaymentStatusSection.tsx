import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';

interface Props {
  paymentStatus: 'pending-check' | 'success' | 'pending' | 'failed' | 'error' | null;
}

const PaymentStatusSection: React.FC<Props> = ({ paymentStatus }) => {
  if (!paymentStatus || paymentStatus === 'success' || paymentStatus === 'pending-check') return null;

  if (paymentStatus === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-left">
        <div className="flex items-center gap-2 mb-3 w-fit">
          <AlertCircle size={16} className="text-red-600" />
          <p className="font-semibold text-red-800 text-base sm:text-lg">Could Not Verify Payment</p>
        </div>
        <p className="text-sm sm:text-base text-red-700 mb-2">
          We were unable to confirm your payment status. Please do not attempt to pay again yet.
        </p>
        <ul className="text-sm sm:text-base text-red-700 space-y-1.5 list-disc list-inside">
          <li>Try clicking "Retry Verification" in a moment</li>
          <li>Contact our support team at <strong>sales@holisbotanicals.com</strong></li>
          <li>Have your payment reference and any relevant details ready when reaching out</li>
        </ul>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-left">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={16} className="text-red-600" />
          <p className="font-semibold text-red-800 text-sm">What Now?</p>
        </div>
        <ul className="text-sm sm:text-base text-red-700 space-y-1.5 list-disc list-inside">
          <li>Verify your payment details and try again</li>
          <li>Try a different payment method</li>
          <li>Contact our support team if the issue persists</li>
        </ul>
      </div>
    );
  }

  if (paymentStatus === 'pending') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} className="text-amber-600" />
          <p className="font-semibold text-amber-800 text-sm">Payment is Processing</p>
        </div>
        <p className="text-sm sm:text-base text-amber-700">
          Your payment is still being verified. Please check your email for confirmation. If you have any concerns, feel free to contact our support team.
        </p>
      </div>
    );
  }

  return null;
};

export default PaymentStatusSection;
