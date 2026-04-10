import React from 'react';
import Skeleton from '../Skeleton';

const AdminHeaderSkeleton: React.FC = () => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
    <div className="flex items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-full shrink-0" />
      <div>
        <Skeleton className="h-5 w-40 mb-1.5" />
        <Skeleton className="h-4 w-52" />
      </div>
    </div>
    <Skeleton className="h-9 w-24 rounded-lg" />
  </div>
);

export default AdminHeaderSkeleton;
