import React from 'react';
import Skeleton from '../Skeleton';

/** Mirrors the product page pricing section with package cards */
const ProductPricingSkeleton: React.FC = () => (
  <section className="py-20 px-4">
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col items-center gap-3 mb-12">
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="h-9 w-56" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4 p-6 border border-gray-200 rounded-2xl bg-white">
            <Skeleton className="h-5 w-28 rounded-full" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-8 w-20" />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((__, j) => (
                <div key={j} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-3.5 w-full" />
                </div>
              ))}
            </div>
            <Skeleton className="h-11 w-full rounded-xl mt-2" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductPricingSkeleton;
