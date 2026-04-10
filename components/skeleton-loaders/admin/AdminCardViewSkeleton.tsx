import React from 'react';
import Skeleton from '../Skeleton';

const AdminCardViewSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-5 w-36 mb-1" />
            <Skeleton className="h-4 w-44" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, j) => (
            <div key={j} className="flex justify-between">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3.5 w-24" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default AdminCardViewSkeleton;
