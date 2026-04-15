import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../Button';

interface Props {
  paymentStatus: 'pending-check' | 'success' | 'pending' | 'failed' | 'error' | null;
  onRetryVerification?: () => void;
}

const OrderActionButtons: React.FC<Props> = ({ paymentStatus, onRetryVerification }) => {
  const navigate = useNavigate();

  if (paymentStatus === 'error') {
    return (
      <div className="space-y-2">
        <Button fullWidth onClick={() => onRetryVerification?.()} className="bg-amber-600 hover:bg-amber-700">
          Retry Verification <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        <Button fullWidth variant="outline" onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="space-y-2">
        <Button fullWidth onClick={() => navigate('/checkout')} className="bg-primary hover:bg-primary/90">
          Try Payment Again <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        <Button fullWidth variant="outline" onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
    );
  }

  if (paymentStatus === 'pending') {
    return (
      <div className="space-y-2">
        <Button fullWidth onClick={() => onRetryVerification?.()} className="bg-amber-600 hover:bg-amber-700">
          Check Status Again <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        <Button fullWidth variant="outline" onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <Button
      fullWidth
      onClick={() => {
        navigate('/', { replace: true });
        window.location.hash = '/';
      }}
    >
      Return Home <ArrowRight className="ml-2 w-4 h-4" />
    </Button>
  );
};

export default OrderActionButtons;
