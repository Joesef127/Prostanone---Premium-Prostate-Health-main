import React from 'react';
import { Truck, ShieldCheck } from 'lucide-react';

interface Props {
  paymentStatus: 'pending-check' | 'success' | 'pending' | 'failed' | 'error' | null;
  isCOD: boolean;
  phone?: string;
}

const OrderInfoSection: React.FC<Props> = ({ paymentStatus, isCOD, phone }) => {
  // Only show order info if payment succeeded or is not yet verified
  if (paymentStatus === 'failed' || paymentStatus === 'pending' || paymentStatus === 'error') return null;

  if (isCOD) {
    return (
      <>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-4 flex gap-4 items-start text-left">
          <div className="w-11 h-11 bg-green-100 rounded-full flex items-center justify-center shrink-0">
            <Truck size={20} className="text-green-600" />
          </div>
          <div>
            <p className="font-bold text-green-800 mb-1">Pay on Delivery Selected</p>
            <p className="text-sm text-green-700 leading-relaxed">
              Our team will call or WhatsApp you{phone ? <> on <strong>{phone}</strong></> : null} within 24 hours to confirm your order and arrange delivery.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={15} className="text-amber-600" />
            <p className="font-semibold text-amber-800 text-sm">Important Reminders</p>
          </div>
          <ul className="text-xs text-amber-700 space-y-1.5 list-disc list-inside leading-relaxed">
            <li>Our team will call you within 24 hours to confirm your order.</li>
            <li>Please ensure you are available to receive delivery and make full payment.</li>
            <li>Only proceed if you are ready and able to pay on delivery.</li>
            <li>Delivery timelines vary by state; our team will give you an accurate estimate.</li>
          </ul>
        </div>
      </>
    );
  }

  return (
    <div className="bg-background rounded-xl p-6 mb-8 text-left">
      <h3 className="font-bold text-primary mb-2">Next Steps:</h3>
      <ul className="space-y-2 text-sm text-text-muted">
        <li>1. Check your email for tracking info.</li>
        <li>2. Delivery expected in 3-5 business days.</li>
        <li>3. Take 1 tablet, 3 times daily</li>
      </ul>
    </div>
  );
};

export default OrderInfoSection;
