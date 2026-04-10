import React from 'react';
import Skeleton from '../Skeleton';

/** Mirrors the symptoms symptom-card grid section */
const HomeSymptomsSkeleton: React.FC = () => (
  <section className="py-20 px-4">
    <div className="max-w-6xl mx-auto">
      {/* section heading */}
      <div className="flex flex-col items-center gap-3 mb-12">
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      {/* symptom cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 p-5 border border-gray-100 rounded-2xl">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HomeSymptomsSkeleton;
