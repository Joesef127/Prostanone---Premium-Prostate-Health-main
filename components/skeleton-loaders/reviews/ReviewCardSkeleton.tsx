import React from 'react';
import Skeleton from '../Skeleton';

const ReviewCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
    {/* Stars */}
    <div className="flex gap-1 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="w-4 h-4 rounded-sm" />
      ))}
    </div>
    {/* Review text */}
    <Skeleton className="h-4 w-full mb-1.5" />
    <Skeleton className="h-4 w-5/6 mb-1.5" />
    <Skeleton className="h-4 w-4/5 mb-4" />
    {/* Author */}
    <div className="flex items-center gap-3 mt-4">
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <div>
        <Skeleton className="h-4 w-28 mb-1" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  </div>
);

export default ReviewCardSkeleton;
