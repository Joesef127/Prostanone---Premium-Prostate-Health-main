import React from 'react';
import Skeleton from '../Skeleton';
import ReviewCardSkeleton from './ReviewCardSkeleton';

const ReviewsSkeleton: React.FC = () => (
  <div className="pt-20 bg-background min-h-screen">
    {/* Hero banner */}
    <section className="bg-gray-200 py-20 text-center animate-pulse">
      <div className="max-w-4xl mx-auto px-4">
        <Skeleton className="h-10 w-72 mx-auto mb-4 bg-gray-300" />
        <Skeleton className="h-6 w-96 mx-auto bg-gray-300" />
      </div>
    </section>

    {/* Cards grid */}
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <ReviewCardSkeleton key={i} />
        ))}
      </div>
    </section>
  </div>
);

export default ReviewsSkeleton;
