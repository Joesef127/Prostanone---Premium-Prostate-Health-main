import React from 'react';
import Skeleton from '../Skeleton';

const AdminTabsSkeleton: React.FC = () => (
  <div className="flex gap-2 border-b border-gray-100 mb-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={i} className="h-10 w-28 rounded-t-lg" />
    ))}
  </div>
);

export default AdminTabsSkeleton;
