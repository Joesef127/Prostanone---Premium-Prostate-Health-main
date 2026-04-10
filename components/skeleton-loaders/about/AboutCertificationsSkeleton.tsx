import React from 'react';
import Skeleton from '../Skeleton';

const AboutCertificationsSkeleton: React.FC = () => (
  <section className="py-24 bg-background">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <Skeleton className="h-9 w-56 mx-auto mb-12" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutCertificationsSkeleton;
