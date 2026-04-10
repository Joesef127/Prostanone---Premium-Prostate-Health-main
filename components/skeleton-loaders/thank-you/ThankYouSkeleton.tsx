import React from 'react';
import Skeleton from '../Skeleton';

const ThankYouSkeleton: React.FC = () => (
  <div className="min-h-screen pt-20 flex items-center justify-center bg-background px-4">
    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center">
      {/* Status icon */}
      <Skeleton className="w-20 h-20 rounded-full mx-auto mb-6" />
      {/* Heading */}
      <Skeleton className="h-8 w-56 mx-auto mb-3" />
      <Skeleton className="h-5 w-72 mx-auto mb-8" />

      {/* Info rows */}
      <div className="space-y-4 text-left mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <Skeleton className="h-12 flex-1 rounded-xl" />
      </div>
    </div>
  </div>
);

export default ThankYouSkeleton;
