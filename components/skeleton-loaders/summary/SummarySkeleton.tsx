import React from 'react';
import Skeleton from '../Skeleton';

const SummarySkeleton: React.FC = () => (
  <div className="min-h-screen pt-24 pb-12 bg-background px-4">
    <div className="max-w-4xl mx-auto">
      {/* Page heading */}
      <div className="text-center mb-10">
        <Skeleton className="h-9 w-44 mx-auto mb-2" />
        <Skeleton className="h-5 w-64 mx-auto" />
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-8">
          {/* Cart item */}
          <div className="flex flex-col md:flex-row gap-6 items-center pb-8 border-b border-gray-100">
            <Skeleton className="w-32 h-32 rounded-xl shrink-0" />
            <div className="flex-1 w-full">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32 mb-4" />
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-8 h-6" />
                <Skeleton className="w-8 h-8 rounded-lg" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-7 w-24 mb-1" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>

        {/* Totals */}
        <div className="bg-background px-8 py-6 space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
          <div className="flex justify-between pt-3 border-t border-gray-200">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-28" />
          </div>
        </div>

        {/* CTA */}
        <div className="px-8 py-6">
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  </div>
);

export default SummarySkeleton;
