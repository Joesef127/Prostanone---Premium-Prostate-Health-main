import React from 'react';
import Skeleton from '../Skeleton';

const ContactFormSkeleton: React.FC = () => (
  <div className="bg-white p-8 rounded-2xl shadow-sm">
    <Skeleton className="h-6 w-44 mb-6" />
    <div className="space-y-6">
      {/* Name */}
      <div>
        <Skeleton className="h-4 w-12 mb-1" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      {/* Email */}
      <div>
        <Skeleton className="h-4 w-12 mb-1" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      {/* Message */}
      <div>
        <Skeleton className="h-4 w-16 mb-1" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
      {/* Submit */}
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  </div>
);

export default ContactFormSkeleton;
