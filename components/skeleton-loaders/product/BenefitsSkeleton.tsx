import React from 'react';
import Skeleton from '../Skeleton';

/** Mirrors the benefits icon-card grid section */
const BenefitsSkeleton: React.FC = () => (
  <section className="py-20 px-4">
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col items-center gap-3 mb-12">
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 p-6 rounded-2xl border border-gray-100">
            <Skeleton className="h-11 w-11 rounded-xl" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSkeleton;
