import React from 'react';
import DistributorHeroSkeleton from './DistributorHeroSkeleton';
import DistributorBenefitsSkeleton from './DistributorBenefitsSkeleton';
import DistributorFormSkeleton from './DistributorFormSkeleton';

const DistributorSkeleton: React.FC = () => (
  <div className="bg-white min-h-screen">
    <DistributorHeroSkeleton />
    <DistributorBenefitsSkeleton />
    <DistributorFormSkeleton />
  </div>
);

export default DistributorSkeleton;
