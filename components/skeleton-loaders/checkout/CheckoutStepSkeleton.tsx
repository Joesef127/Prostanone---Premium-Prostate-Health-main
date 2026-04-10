import React from 'react';
import Skeleton from '../Skeleton';

const CheckoutStepSkeleton: React.FC = () => (
  <div className="bg-white rounded-3xl shadow-sm p-8 space-y-6">
    <Skeleton className="h-7 w-48 mb-2" />
    {/* Two-column row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div>
        <Skeleton className="h-4 w-20 mb-1" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      <div>
        <Skeleton className="h-4 w-20 mb-1" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
    {/* Full-width fields */}
    {[1, 2].map((i) => (
      <div key={i}>
        <Skeleton className="h-4 w-24 mb-1" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    ))}
    {/* Action buttons */}
    <div className="flex justify-between items-center pt-2">
      <Skeleton className="h-10 w-24 rounded-xl" />
      <Skeleton className="h-12 w-36 rounded-xl" />
    </div>
  </div>
);

export default CheckoutStepSkeleton;
