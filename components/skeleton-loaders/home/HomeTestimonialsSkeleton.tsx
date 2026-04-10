import React from 'react';
import Skeleton from '../Skeleton';

/** Mirrors the testimonials carousel / grid section */
const HomeTestimonialsSkeleton: React.FC = () => (
  <section className="py-20 px-4">
    <div className="max-w-6xl mx-auto">
      {/* heading */}
      <div className="flex flex-col items-center gap-3 mb-12">
        <Skeleton className="h-4 w-28 rounded-full" />
        <Skeleton className="h-9 w-60" />
      </div>
      {/* cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4 p-6 border border-gray-100 rounded-2xl">
            {/* stars */}
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((__, j) => (
                <Skeleton key={j} className="h-4 w-4 rounded-sm" />
              ))}
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <div className="flex items-center gap-3 mt-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HomeTestimonialsSkeleton;
