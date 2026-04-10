import React from 'react';
import Skeleton from '../Skeleton';

/** Mirrors the problem/symptoms intro section split layout */
const ProblemSectionSkeleton: React.FC = () => (
  <section className="py-20 px-4">
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      {/* text side */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-80 max-w-full" />
        <div className="flex flex-col gap-3 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-5 w-5 rounded-full mt-0.5 shrink-0" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
      {/* image side */}
      <Skeleton className="h-80 w-full rounded-2xl" />
    </div>
  </section>
);

export default ProblemSectionSkeleton;
