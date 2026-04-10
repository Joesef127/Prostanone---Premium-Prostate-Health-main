import React from 'react';
import Skeleton from '../Skeleton';

const AdminControlsBarSkeleton: React.FC = () => (
  <div className="flex flex-wrap items-center gap-3 mb-5">
    {/* Search */}
    <Skeleton className="h-9 flex-1 min-w-48 rounded-lg" />
    {/* Time range dropdown */}
    <Skeleton className="h-9 w-40 rounded-lg" />
    {/* Layout toggle */}
    <Skeleton className="h-9 w-20 rounded-lg" />
    {/* Refresh */}
    <Skeleton className="h-9 w-9 rounded-lg" />
  </div>
);

export default AdminControlsBarSkeleton;
