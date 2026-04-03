import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, ArrowRight, Truck, ShieldCheck, Phone } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import { useDynamicTitle } from '../hooks/useDynamicTitle';

const ThankYou: React.FC = () => {
  useDynamicTitle('Order Confirmed');
  const { clearCart } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentMethod, phone } = (location.state ?? {}) as { paymentMethod?: string; phone?: string };
  const isCOD = paymentMethod === 'cod';

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-background px-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center">
        <div className={`w-20 h-20 ${isCOD ? 'bg-green-100 text-green-600' : 'bg-green-100 text-green-600'} rounded-full flex items-center justify-center mx-auto mb-8`}>
          <CheckCircle className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-bold text-primary mb-3">
          {isCOD ? 'Order Received!' : 'Order Confirmed!'}
        </h1>
        <p className="text-text-muted mb-6">
          {isCOD
            ? 'Your order has been submitted successfully. Our team will be in touch with you shortly to confirm delivery.'
            : 'Thank you for choosing Prostanone. Your journey to better prostate health starts now. You will receive an email confirmation shortly.'}
        </p>

        {isCOD ? (
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
        ) : (
          <div className="bg-background rounded-xl p-6 mb-8 text-left">
            <h3 className="font-bold text-primary mb-2">Next Steps:</h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>1. Check your email for tracking info.</li>
              <li>2. Delivery expected in 3-5 business days.</li>
              <li>3. Take 1 tablet, 3 times daily with meals.</li>
            </ul>
          </div>
        )}

        {isCOD && (
          <p className="text-center text-xs text-gray-400 mb-5 flex items-center justify-center gap-1">
            <Phone size={11} /> Watch out for our call or WhatsApp message
          </p>
        )}

        <Button fullWidth onClick={() => {
          navigate('/', { replace: true });
          window.location.hash = '/';
        }}>
          Return Home <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ThankYou;