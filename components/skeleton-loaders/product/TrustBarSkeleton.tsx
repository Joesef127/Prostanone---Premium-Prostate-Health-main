import React from 'react';
import Skeleton from '../Skeleton';

/** Mirrors the horizontal trust-badge bar */
const TrustBarSkeleton: React.FC = () => (
  <div className="py-5 px-4 border-y border-gray-100">
    <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
      ))}
    </div>
  </div>
);

export default TrustBarSkeleton;
