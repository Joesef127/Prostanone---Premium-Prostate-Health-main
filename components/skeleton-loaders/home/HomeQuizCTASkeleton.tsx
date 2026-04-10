import React from 'react';
import Skeleton from '../Skeleton';

/** Mirrors the quiz CTA banner at the bottom of the home page */
const HomeQuizCTASkeleton: React.FC = () => (
  <section className="py-20 px-4">
    <div className="max-w-3xl mx-auto flex flex-col items-center gap-5 text-center">
      <Skeleton className="h-6 w-48 rounded-full" />
      <Skeleton className="h-10 w-80 max-w-full" />
      <Skeleton className="h-5 w-96 max-w-full" />
      <Skeleton className="h-5 w-72 max-w-full" />
      <Skeleton className="h-12 w-52 rounded-full" />
    </div>
  </section>
);

export default HomeQuizCTASkeleton;
