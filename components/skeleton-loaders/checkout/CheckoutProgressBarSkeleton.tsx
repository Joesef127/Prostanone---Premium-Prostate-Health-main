import React from 'react';
import Skeleton from '../Skeleton';

const CheckoutProgressBarSkeleton: React.FC = () => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {Array.from({ length: 4 }).map((_, i) => (
      <React.Fragment key={i}>
        <Skeleton className="w-8 h-8 rounded-full" />
        {i < 3 && <Skeleton className="h-1 w-12" />}
      </React.Fragment>
    ))}
  </div>
);

export default CheckoutProgressBarSkeleton;
