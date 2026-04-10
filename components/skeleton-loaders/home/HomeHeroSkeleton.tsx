import React from 'react';
import Skeleton from '../Skeleton';

/** Mirrors the full-screen parallax hero with centered headline + badges */
const HomeHeroSkeleton: React.FC = () => (
  <div className="relative w-full h-screen bg-gray-900 flex flex-col items-center justify-center gap-6 px-4">
    {/* badges row */}
    <div className="flex gap-3">
      <Skeleton className="h-8 w-36 rounded-full" />
      <Skeleton className="h-8 w-40 rounded-full" />
    </div>
    {/* headline */}
    <div className="flex flex-col items-center gap-3 w-full max-w-2xl">
      <Skeleton className="h-12 w-4/5 bg-gray-700" />
      <Skeleton className="h-12 w-3/5 bg-gray-700" />
    </div>
    {/* sub-text */}
    <Skeleton className="h-5 w-96 max-w-full bg-gray-700" />
    {/* CTA buttons */}
    <div className="flex gap-4">
      <Skeleton className="h-12 w-40 rounded-full bg-gray-600" />
      <Skeleton className="h-12 w-32 rounded-full bg-gray-700" />
    </div>
    {/* scroll nudge */}
    <Skeleton className="absolute bottom-8 h-8 w-8 rounded-full bg-gray-700" />
  </div>
);

export default HomeHeroSkeleton;
