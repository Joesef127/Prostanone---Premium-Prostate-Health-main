import React from 'react';
import Skeleton from '../Skeleton';

const DistributorHeroSkeleton: React.FC = () => (
  <section className="bg-gray-800 overflow-hidden">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <Skeleton className="h-6 w-40 mx-auto mb-6 bg-gray-600" />
      <Skeleton className="h-12 w-3/4 mx-auto mb-3 bg-gray-600" />
      <Skeleton className="h-12 w-1/2 mx-auto mb-6 bg-gray-600" />
      <Skeleton className="h-5 w-2/3 mx-auto mb-1 bg-gray-600" />
      <Skeleton className="h-5 w-1/2 mx-auto bg-gray-600" />
    </div>
  </section>
);

export default DistributorHeroSkeleton;
