import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useModal } from '../context/ModalContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDynamicTitle } from '../hooks/useDynamicTitle';
import { API_BASE } from '../lib/constants';
import PaymentStatusBadge from '../components/thank-you/PaymentStatusBadge';
import OrderHeader from '../components/thank-you/OrderHeader';
import PaymentStatusSection from '../components/thank-you/PaymentStatusSection';
import OrderInfoSection from '../components/thank-you/OrderInfoSection';
import OrderActionButtons from '../components/thank-you/OrderActionButtons';

const ThankYou: React.FC = () => {
  useDynamicTitle('Order Confirmed');
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
  const [paymentStatus, setPaymentStatus] = useState<'pending-check' | 'success' | 'pending' | 'failed' | null>(null);

  useEffect(() => {
    clearCart();

    // If redirected from Payaza with a reference, verify transaction status
    if (paymentMethod === 'online' && reference && !stateMethod) {
      setPaymentStatus('pending-check');
      const verifyPayment = async () => {
        try {
          const res = await fetch(`${API_BASE}/api/verify-payaza-transaction?reference=${encodeURIComponent(reference)}`);
          const data = await res.json();

          if (data.status === 'success') {
            setPaymentStatus('success');
            showAlert({
              title: 'Payment Successful!',
              message: 'Your payment has been received and confirmed. Your order will be processed shortly.',
            });
          } else if (data.status === 'failed') {
            setPaymentStatus('failed');
            showAlert({
              title: 'Payment Failed',
              message: 'Your payment could not be processed. Please try again or contact support.',
            });
          } else if (data.status === 'pending') {
            setPaymentStatus('pending');
            showAlert({
              title: 'Payment Pending',
              message: 'Your payment is still being processed. This may take a few minutes. Please check your email for updates.',
            });
          }
        } catch (err) {
          console.error('Payment verification error:', err);
          setPaymentStatus(null);
          showAlert({
            title: 'Verification Error',
            message: 'Could not verify payment status. Please contact support with your reference.',
          });
        }
      };

      verifyPayment();
    }
  }, [clearCart, paymentMethod, reference, stateMethod, showAlert, navigate]);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-background px-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center">
        <PaymentStatusBadge paymentMethod={paymentMethod} reference={reference} paymentStatus={paymentStatus} />
        <OrderHeader paymentStatus={paymentStatus} isCOD={isCOD} />
        <PaymentStatusSection paymentStatus={paymentStatus} />
        <OrderInfoSection paymentStatus={paymentStatus} isCOD={isCOD} phone={phone} />
        <OrderActionButtons paymentStatus={paymentStatus} isCOD={isCOD} />
      </div>
    </div>
  );
};

export default ThankYou;