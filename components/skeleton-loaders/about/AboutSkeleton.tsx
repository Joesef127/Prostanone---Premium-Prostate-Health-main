import React from 'react';
import AboutStorySkeleton from './AboutStorySkeleton';
import AboutCertificationsSkeleton from './AboutCertificationsSkeleton';

const AboutSkeleton: React.FC = () => (
  <div className="pt-20">
    <AboutStorySkeleton />
    <AboutCertificationsSkeleton />
  </div>
);

export default AboutSkeleton;
