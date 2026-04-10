import React from 'react';
import HomeHeroSkeleton          from './HomeHeroSkeleton';
import HomeSymptomsSkeleton      from './HomeSymptomsSkeleton';
import HomeHowItWorksSkeleton    from './HomeHowItWorksSkeleton';
import HomeTestimonialsSkeleton  from './HomeTestimonialsSkeleton';
import HomePricingSkeleton       from './HomePricingSkeleton';
import HomeQuizCTASkeleton       from './HomeQuizCTASkeleton';

/** Full-page skeleton for the Home page — used as React.lazy Suspense fallback */
const HomeSkeleton: React.FC = () => (
  <div className="overflow-x-hidden">
    <HomeHeroSkeleton />
    <HomeSymptomsSkeleton />
    <HomeHowItWorksSkeleton />
    <HomeTestimonialsSkeleton />
    <HomePricingSkeleton />
    <HomeQuizCTASkeleton />
  </div>
);

export default HomeSkeleton;
