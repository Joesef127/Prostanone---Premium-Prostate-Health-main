import React from 'react';
import Skeleton from '../Skeleton';

const QuizSkeleton: React.FC = () => (
  <div className="min-h-screen pt-20 bg-background flex flex-col items-center justify-center px-4">
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden min-h-125 flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-100">
        <Skeleton className="h-1.5 w-1/3 rounded-none" />
      </div>

      <div className="p-8 flex-1 flex flex-col">
        {/* Question counter */}
        <Skeleton className="h-4 w-24 mb-6" />
        {/* Question text */}
        <Skeleton className="h-7 w-full mb-2" />
        <Skeleton className="h-7 w-4/5 mb-8" />

        {/* Answer options */}
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-2xl" />
          ))}
        </div>

        {/* Back button */}
        <div className="mt-auto pt-6">
          <Skeleton className="h-9 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

export default QuizSkeleton;
