import React from 'react';
import Skeleton from '../Skeleton';

const ResultsSkeleton: React.FC = () => (
  <div className="min-h-screen pt-24 pb-12 bg-background px-4">
    <div className="max-w-5xl mx-auto">
      {/* Banner */}
      <div className="text-center mb-12">
        <Skeleton className="h-7 w-44 mx-auto mb-4 rounded-full" />
        <Skeleton className="h-12 w-3/4 mx-auto mb-3" />
        <Skeleton className="h-12 w-1/2 mx-auto mb-6" />
        <Skeleton className="h-5 w-2/3 mx-auto mb-1" />
        <Skeleton className="h-5 w-1/2 mx-auto" />
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Analysis card */}
        <div className="bg-white rounded-3xl shadow-sm p-8">
          <Skeleton className="h-6 w-40 mb-6" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>

        {/* Recommendation card */}
        <div className="bg-white rounded-3xl shadow-sm p-8">
          <Skeleton className="h-6 w-48 mb-6" />
          <Skeleton className="w-24 h-32 mx-auto mb-4 rounded-xl" />
          <Skeleton className="h-6 w-40 mx-auto mb-2" />
          <Skeleton className="h-5 w-24 mx-auto mb-6" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6 mb-6" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

export default ResultsSkeleton;
