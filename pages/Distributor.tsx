import React from 'react';
import { useDynamicTitle } from '../hooks/useDynamicTitle';
import DistributorHeroSection from '../components/distributor/DistributorHeroSection';
import DistributorBenefitsSection from '../components/distributor/DistributorBenefitsSection';
import DistributorApplicationForm from '../components/distributor/DistributorApplicationForm';

const Distributor: React.FC = () => {
  useDynamicTitle('Become a Distributor');

  return (
    <div className="bg-white min-h-screen">
      <DistributorHeroSection />
      <DistributorBenefitsSection />
      <DistributorApplicationForm />
    </div>
  );
};

export default Distributor;
