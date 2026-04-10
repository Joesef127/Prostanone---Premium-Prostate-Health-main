import React from 'react';
import Skeleton from '../Skeleton';

const AboutStorySkeleton: React.FC = () => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* Text side */}
        <div>
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-3/4 mb-6" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-5/6 mb-8" />
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-100 p-4 rounded-xl">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5 mt-1" />
            </div>
            <div className="bg-gray-100 p-4 rounded-xl">
              <Skeleton className="h-5 w-28 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
          </div>
        </div>

        {/* Image side */}
        <Skeleton className="w-full min-h-125 rounded-3xl" />
      </div>
    </div>
  </section>
);

export default AboutStorySkeleton;
