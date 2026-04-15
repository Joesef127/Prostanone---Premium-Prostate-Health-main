import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useModal } from '../context/ModalContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { API_BASE } from '../lib/constants';
import PaymentStatusBadge from '../components/thank-you/PaymentStatusBadge';
import OrderHeader from '../components/thank-you/OrderHeader';
import PaymentStatusSection from '../components/thank-you/PaymentStatusSection';
import OrderInfoSection from '../components/thank-you/OrderInfoSection';
import OrderActionButtons from '../components/thank-you/OrderActionButtons';
import ThankYouSkeleton from '../components/skeleton-loaders/thank-you/ThankYouSkeleton';

const ThankYou: React.FC = () => {
  // SEO configuration for thank you page (noindex as it's order-specific)
  useSeoMeta({
    title: "Order Confirmed - Thank You | Prostanone",
    description: "Thank you for your order! Your Prostanone supplement is being prepared. Track your order status.",
    url: "/thank-you",
    robots: "noindex",
  });

  const { clearCart } = useApp();
  const { showAlert } = useModal();
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentMethod: stateMethod, phone } = (location.state ?? {}) as { paymentMethod?: string; phone?: string };
  // Payaza redirect lands with ?paymentMethod=online&reference=PR-xxx in the URL (no router state)
  const queryMethod = new URLSearchParams(location.search).get('paymentMethod') ?? undefined;
  const reference = new URLSearchParams(location.search).get('reference') ?? undefined;
  const paymentMethod = stateMethod ?? queryMethod;
  const isCOD = paymentMethod === 'cod';

  // Track payment verification status for Payaza payments
  const [paymentStatus, setPaymentStatus] = useState<'pending-check' | 'success' | 'pending' | 'failed' | 'error' | null>(null);

  const verifyPayment = React.useCallback(async () => {
    if (paymentMethod !== 'online' || !reference) return;
    setPaymentStatus('pending-check');
    try {
      const res = await fetch(`${API_BASE}/api/verify-payaza-transaction?reference=${encodeURIComponent(reference)}`);

      if (!res.ok) {
        throw new Error(`Payment verification request failed with status ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();

      if (data.status === 'success') {
        setPaymentStatus('success');
        clearCart();
        showAlert({ title: 'Payment Successful!', message: 'Your payment has been received and confirmed. Your order will be processed shortly.' });
      } else if (data.status === 'failed') {
        setPaymentStatus('failed');
        showAlert({ title: 'Payment Failed', message: 'Your payment could not be processed. Please try again or contact support.' });
        navigate('/checkout');
      } else if (data.status === 'pending') {
        setPaymentStatus('pending');
        showAlert({ title: 'Payment Pending', message: 'Your payment is still being processed. This may take a few minutes. Please check your email for updates.' });
      } else {
        setPaymentStatus('pending');
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setPaymentStatus('error');
      showAlert({ title: 'Verification Error', message: 'Could not verify payment status. Please contact support with your reference.' });
    }
  }, [paymentMethod, reference, clearCart, navigate, showAlert]);

  useEffect(() => {
    // Clear cart immediately for KoraPay (state-based nav, no reference) and COD.
    // For Payaza, clearCart() is called inside verifyPayment() only on success.
    if ((stateMethod === 'online' && !reference) || paymentMethod === 'cod') {
      clearCart();
    }

    // If redirected from Payaza with a reference, verify transaction status
    if (paymentMethod === 'online' && reference && !stateMethod) {
      verifyPayment();
    }
  }, [clearCart, paymentMethod, reference, stateMethod, verifyPayment]);

  return (
    paymentStatus === 'pending-check' ? <ThankYouSkeleton /> :
    <div className="min-h-screen pt-20 flex items-center justify-center bg-background px-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center">
        <PaymentStatusBadge paymentStatus={paymentStatus} />
        <OrderHeader paymentStatus={paymentStatus} isCOD={isCOD} />
        <PaymentStatusSection paymentStatus={paymentStatus} />
        <OrderInfoSection paymentStatus={paymentStatus} isCOD={isCOD} phone={phone} />
        <OrderActionButtons paymentStatus={paymentStatus} onRetryVerification={verifyPayment} />
      </div>
    </div>
  );
};

export default ThankYou;