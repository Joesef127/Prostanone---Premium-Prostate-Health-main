import React from 'react';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { PAGE_URLS } from '../lib/seo';
import DistributorHeroSection from '../components/distributor/DistributorHeroSection';
import DistributorBenefitsSection from '../components/distributor/DistributorBenefitsSection';
import DistributorApplicationForm from '../components/distributor/DistributorApplicationForm';

const Distributor: React.FC = () => {
  // SEO configuration for distributor page
  useSeoMeta({
    title: "Become a Prostanone Distributor - Business Partnership",
    description: "Join us as a Prostanone distributor. Build a profitable business with our premium natural health products. Competitive margins, marketing support, and training provided.",
    keywords: [
      "Prostanone distributor",
      "business partnership",
      "distributor application",
      "health product distribution",
      "supplement distributor",
    ],
    url: PAGE_URLS.distributor,
    type: "website",
  });

  return (
    <div className="bg-white min-h-screen">
      <DistributorHeroSection />
      <DistributorBenefitsSection />
      <DistributorApplicationForm />
    </div>
  );
};

export default Distributor;
