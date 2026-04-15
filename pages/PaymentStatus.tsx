import React, { useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { API_BASE } from '../lib/constants';
import { useModal } from '../context/ModalContext';
import PaymentStatusBadge from '../components/thank-you/PaymentStatusBadge';
import OrderHeader from '../components/thank-you/OrderHeader';
import PaymentStatusSection from '../components/thank-you/PaymentStatusSection';
import OrderActionButtons from '../components/thank-you/OrderActionButtons';
import ThankYouSkeleton from '../components/skeleton-loaders/thank-you/ThankYouSkeleton';

type PaymentStatusValue = 'pending-check' | 'success' | 'pending' | 'failed' | 'error';

const PaymentStatus: React.FC = () => {
  useSeoMeta({
    title: 'Payment Status | Prostanone',
    description: 'Check the status of your payment.',
    url: '/payment-status',
    robots: 'noindex',
  });

  const { showAlert } = useModal();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialStatus = (params.get('status') as PaymentStatusValue) ?? 'error';
  const reference = params.get('reference') ?? undefined;

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusValue>(initialStatus);
  const [isRetrying, setIsRetrying] = useState(false);

  const verifyPayment = useCallback(async () => {
    if (!reference) return;
    setIsRetrying(true);
    setPaymentStatus('pending-check');
    try {
      const res = await fetch(
        `${API_BASE}/api/verify-payaza-transaction?reference=${encodeURIComponent(reference)}`,
      );
      if (!res.ok) {
        throw new Error(`Verification failed: ${res.status}`);
      }
      const data = await res.json();

      if (data.status === 'success') {
        // Payment actually succeeded on retry — send to thank-you
        navigate('/thank-you', { state: { paymentMethod: 'online' } });
      } else if (data.status === 'failed') {
        setPaymentStatus('failed');
        showAlert({ title: 'Payment Failed', message: 'Your payment could not be processed. Please try again.' });
      } else if (data.status === 'pending') {
        setPaymentStatus('pending');
        showAlert({ title: 'Payment Pending', message: 'Your payment is still being processed. Please check your email for updates.' });
      } else {
        setPaymentStatus('pending');
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setPaymentStatus('error');
      showAlert({ title: 'Verification Error', message: 'Could not verify payment status. Please contact support with your reference.' });
    } finally {
      setIsRetrying(false);
    }
  }, [reference, navigate, showAlert]);

  return (
    paymentStatus === 'pending-check' ? <ThankYouSkeleton /> :
    <div className="min-h-screen pt-20 flex items-center justify-center bg-background px-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center">
        <PaymentStatusBadge paymentStatus={paymentStatus} />
        <OrderHeader paymentStatus={paymentStatus} isCOD={false} />
        <PaymentStatusSection paymentStatus={paymentStatus} />
        <OrderActionButtons paymentStatus={paymentStatus} onRetryVerification={verifyPayment} isRetrying={isRetrying} />
      </div>
    </div>
  );
};

export default PaymentStatus;
