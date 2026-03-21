import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const ThankYou: React.FC = () => {
  const { clearCart } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-background px-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-8">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-primary mb-4">Order Confirmed!</h1>
        <p className="text-text-muted mb-8">
          Thank you for choosing Prostanone. Your journey to better prostate health starts now. You will receive an email confirmation shortly.
        </p>

        <div className="bg-background rounded-xl p-6 mb-8 text-left">
          <h3 className="font-bold text-primary mb-2">Next Steps:</h3>
          <ul className="space-y-2 text-sm text-text-muted">
            <li>1. Check your email for tracking info.</li>
            <li>2. Delivery expected in 3-5 business days.</li>
            <li>3. Take 1 tablet, 3 times daily with meals.</li>
          </ul>
        </div>

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