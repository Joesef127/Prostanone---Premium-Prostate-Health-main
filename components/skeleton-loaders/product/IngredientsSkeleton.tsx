import React from 'react';
import Skeleton from '../Skeleton';

/** Mirrors the ingredients list/table section */
const IngredientsSkeleton: React.FC = () => (
  <section className="py-20 px-4 bg-gray-50">
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col items-center gap-3 mb-12">
        <Skeleton className="h-4 w-28 rounded-full" />
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100">
            <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default IngredientsSkeleton;
