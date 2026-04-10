import React from 'react';
import AdminHeaderSkeleton from './AdminHeaderSkeleton';
import AdminStatCardsSkeleton from './AdminStatCardsSkeleton';
import AdminTabsSkeleton from './AdminTabsSkeleton';
import AdminControlsBarSkeleton from './AdminControlsBarSkeleton';
import AdminDataViewSkeleton from './AdminDataViewSkeleton';

const AdminSkeleton: React.FC = () => (
  <div className="min-h-screen bg-background">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <AdminHeaderSkeleton />
      <AdminStatCardsSkeleton />
      <AdminTabsSkeleton />
      <AdminControlsBarSkeleton />
      <AdminDataViewSkeleton />
    </div>
  </div>
);

export default AdminSkeleton;
