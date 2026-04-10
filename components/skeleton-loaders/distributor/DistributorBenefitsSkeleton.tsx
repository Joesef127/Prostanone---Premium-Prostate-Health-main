import React from 'react';
import Skeleton from '../Skeleton';

const DistributorBenefitsSkeleton: React.FC = () => (
  <section className="py-20 bg-gray-50">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <Skeleton className="h-9 w-64 mx-auto mb-3" />
        <Skeleton className="h-5 w-80 mx-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <Skeleton className="w-12 h-12 rounded-xl mb-4" />
            <Skeleton className="h-5 w-36 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-5/6 mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default DistributorBenefitsSkeleton;
