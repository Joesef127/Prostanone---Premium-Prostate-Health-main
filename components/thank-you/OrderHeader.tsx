import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Props {
  paymentStatus: 'pending-check' | 'success' | 'pending' | 'failed' | 'error' | null;
  isCOD: boolean;
}

const OrderHeader: React.FC<Props> = ({ paymentStatus, isCOD }) => {
  const getIcon = () => {
    if (paymentStatus === 'failed' || paymentStatus === 'error') {
      return <AlertCircle className="w-10 h-10" />;
    }
    if (paymentStatus === 'pending' || paymentStatus === 'pending-check') {
      return <Clock className={`w-10 h-10 ${paymentStatus === 'pending-check' ? 'animate-spin' : ''}`} />;
    }
    return <CheckCircle className="w-10 h-10" />;
  };

  const getTitle = () => {
    if (paymentStatus === 'failed') return 'Payment Failed';
    if (paymentStatus === 'error') return 'Order Unconfirmed';
    if (paymentStatus === 'pending') return 'Payment Processing';
    if (paymentStatus === 'pending-check') return 'Verifying Payment...';
    return isCOD ? 'Order Received!' : 'Order Confirmed!';
  };

  const getDescription = () => {
    if (paymentStatus === 'failed') {
      return 'Unfortunately, your payment could not be processed. Please try again with a different payment method or contact our support team.';
    }
    if (paymentStatus === 'error') {
      return 'We could not verify your payment status. Please do not place a new order — contact our support team with your payment reference and we will confirm your order manually.';
    }
    if (paymentStatus === 'pending') {
      return 'Your payment is being processed. This usually takes a few minutes. We\'ll send you a confirmation email once it\'s complete.';
    }
    if (paymentStatus === 'pending-check') {
      return 'Please wait while we verify your payment...';
    }
    if (isCOD) {
      return 'Your order has been submitted successfully. Our team will be in touch with you shortly to confirm delivery.';
    }
    return 'Thank you for choosing Prostanone. Your journey to better prostate health starts now. You will receive an email confirmation shortly.';
  };

  const getBgColor = () => {
    if (paymentStatus === 'failed' || paymentStatus === 'error') return 'bg-red-100 text-red-600';
    if (paymentStatus === 'pending' || paymentStatus === 'pending-check') return 'bg-amber-100 text-amber-600';
    return 'bg-green-100 text-green-600';
  };

  return (
    <>
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 ${getBgColor()}`}>
        {getIcon()}
      </div>
      <h1 className="text-3xl font-bold text-primary mb-3">{getTitle()}</h1>
      <p className="text-text-muted mb-6">{getDescription()}</p>
    </>
  );
};

export default OrderHeader;
