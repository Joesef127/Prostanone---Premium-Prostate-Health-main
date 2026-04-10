import React from 'react';
import CheckoutProgressBarSkeleton from './CheckoutProgressBarSkeleton';
import CheckoutStepSkeleton from './CheckoutStepSkeleton';

const CheckoutSkeleton: React.FC = () => (
  <div className="min-h-screen pt-24 pb-12 bg-background px-4">
    <div className="max-w-3xl mx-auto">
      <CheckoutProgressBarSkeleton />
      <CheckoutStepSkeleton />
    </div>
  </div>
);

export default CheckoutSkeleton;
