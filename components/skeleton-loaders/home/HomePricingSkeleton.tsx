import React from 'react';
import Skeleton from '../Skeleton';

/** Mirrors the pricing package cards section */
const HomePricingSkeleton: React.FC = () => (
  <section className="py-20 px-4 bg-gray-50">
    <div className="max-w-5xl mx-auto">
      {/* heading */}
      <div className="flex flex-col items-center gap-3 mb-12">
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </div>
      {/* package cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4 p-6 border border-gray-200 rounded-2xl bg-white">
            <Skeleton className="h-5 w-32 rounded-full" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="flex flex-col gap-2 my-2">
              {Array.from({ length: 4 }).map((__, j) => (
                <div key={j} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-3.5 w-full" />
                </div>
              ))}
            </div>
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HomePricingSkeleton;
