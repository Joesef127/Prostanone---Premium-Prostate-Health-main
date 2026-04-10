import React from 'react';
import Skeleton from '../Skeleton';

const DistributorFormSkeleton: React.FC = () => (
  <section className="py-20">
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Heading */}
      <div className="text-center mb-10">
        <Skeleton className="h-9 w-32 mx-auto mb-3" />
        <Skeleton className="h-5 w-72 mx-auto" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
        {/* Full name */}
        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
        {/* Phone + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Skeleton className="h-4 w-28 mb-1" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>
        {/* State + Business type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-4 w-28 mb-1" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>
        {/* Monthly order */}
        <div>
          <Skeleton className="h-4 w-40 mb-1" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
        {/* Message */}
        <div>
          <Skeleton className="h-4 w-40 mb-1" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
        {/* Submit */}
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  </section>
);

export default DistributorFormSkeleton;
