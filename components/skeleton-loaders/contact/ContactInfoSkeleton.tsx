import React from 'react';
import Skeleton from '../Skeleton';

const ContactInfoSkeleton: React.FC = () => (
  <div className="space-y-8">
    {/* Contact Channels panel */}
    <div className="bg-white p-8 rounded-2xl shadow-sm">
      <Skeleton className="h-6 w-40 mb-6" />
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-start gap-4">
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Distributor Info panel */}
    <div className="bg-white p-8 rounded-2xl shadow-sm">
      <Skeleton className="h-6 w-36 mb-6" />
      <div className="flex items-start gap-4">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-5 w-44 mb-2" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-40 mt-1" />
        </div>
      </div>
    </div>
  </div>
);

export default ContactInfoSkeleton;
