import React from 'react';
import Skeleton from '../Skeleton';

const AdminStatCardsSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col gap-2">
        <Skeleton className="w-9 h-9 rounded-lg" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
    ))}
  </div>
);

export default AdminStatCardsSkeleton;
