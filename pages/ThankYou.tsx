import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { useSendOrderNotification } from '../hooks/useSendOrderNotification';
import { API_BASE } from '../lib/constants';
import OrderHeader from '../components/thank-you/OrderHeader';
import OrderInfoSection from '../components/thank-you/OrderInfoSection';
import OrderActionButtons from '../components/thank-you/OrderActionButtons';
import ThankYouSkeleton from '../components/skeleton-loaders/thank-you/ThankYouSkeleton';

const ThankYou: React.FC = () => {
  useSeoMeta({
    title: "Order Confirmed - Thank You | Prostanone",
    description: "Thank you for your order! Your Prostanone supplement is being prepared. Track your order status.",
    url: "/thank-you",
    robots: "noindex",
  });

  const { clearCart } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const { sendNotification } = useSendOrderNotification();
  const { paymentMethod: stateMethod, phone } = (location.state ?? {}) as { paymentMethod?: string; phone?: string };

  // Payaza redirects here with ?paymentMethod=online&reference=PR-xxx — verify before showing success
  const queryMethod = new URLSearchParams(location.search).get('paymentMethod') ?? undefined;
  const reference = new URLSearchParams(location.search).get('reference') ?? undefined;
  const paymentMethod = stateMethod ?? queryMethod;
  const isCOD = paymentMethod === 'cod';

  const [verifying, setVerifying] = React.useState(
    paymentMethod === 'online' && !!reference && !stateMethod,
  );

  useEffect(() => {
    if (paymentMethod === 'online' && reference && !stateMethod) {
      // Payaza redirect — verify before treating as success
      fetch(`${API_BASE}/api/verify-payaza-transaction?reference=${encodeURIComponent(reference)}`)
        .then(res => {
          if (!res.ok) throw new Error(`${res.status}`);
          return res.json();
        })
        .then(data => {
          if (data.status === 'success') {
            // Send notification on successful payment verification
            sendNotification({
              orderId: data.orderId,
              name: data.name,
              email: data.email,
              phone: data.phone,
              shippingAddress: data.shippingAddress,
              itemsOrdered: data.itemsOrdered,
              subtotal: data.subtotal,
              deliveryFee: data.deliveryFee,
              total: data.total,
            }).catch(err => console.error('Notification error after Payaza verification:', err));
            clearCart();
            setVerifying(false);
          } else {
            // Not a success — send to payment status page with the actual status
            const status = data.status === 'failed' || data.status === 'pending' ? data.status : 'error';
            navigate(`/payment-status?status=${status}&reference=${encodeURIComponent(reference)}`, { replace: true });
          }
        })
        .catch((err) => {
          console.error('Payment verification failed:', err);
          navigate(`/payment-status?status=error&reference=${encodeURIComponent(reference)}`, { replace: true });
        });
    } else {
      // KoraPay (stateMethod) or COD — already confirmed on client side
      clearCart();
    }
  }, [paymentMethod, reference, stateMethod, clearCart, navigate, sendNotification]);

  if (verifying) return <ThankYouSkeleton />;

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-background px-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center">
        <OrderHeader paymentStatus={null} isCOD={isCOD} />
        <OrderInfoSection paymentStatus={null} isCOD={isCOD} phone={phone} />
        <OrderActionButtons paymentStatus={null} />
      </div>
    </div>
  );
};

export default ThankYou;