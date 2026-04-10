import React from 'react';
import Skeleton from '../Skeleton';

/** Mirrors the how-it-works 3-step section */
const HomeHowItWorksSkeleton: React.FC = () => (
  <section className="py-20 px-4 bg-gray-50">
    <div className="max-w-5xl mx-auto">
      {/* heading */}
      <div className="flex flex-col items-center gap-3 mb-14">
        <Skeleton className="h-4 w-20 rounded-full" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </div>
      {/* steps */}
      <div className="grid md:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-4 text-center">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HomeHowItWorksSkeleton;
