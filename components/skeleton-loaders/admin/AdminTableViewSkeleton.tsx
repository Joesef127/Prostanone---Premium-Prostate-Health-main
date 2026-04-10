import React from 'react';
import Skeleton from '../Skeleton';

const AdminTableViewSkeleton: React.FC = () => (
  <div className="overflow-x-auto rounded-xl border border-gray-100">
    {/* Header */}
    <div className="flex gap-4 bg-gray-50 border-b border-gray-100 px-4 py-3">
      <Skeleton className="w-5 h-5 rounded" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-24" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="flex gap-4 items-center px-4 py-3 border-b border-gray-50 last:border-0">
        <Skeleton className="w-5 h-5 rounded" />
        {Array.from({ length: 5 }).map((_, j) => (
          <Skeleton key={j} className="h-4 w-24" />
        ))}
      </div>
    ))}
  </div>
);

export default AdminTableViewSkeleton;
