import React from 'react';
import HeroSection from '../components/landing-page/HeroSection';
import TrustBar from '../components/landing-page/TrustBar';
import ProblemSection from '../components/landing-page/ProblemSection';
import ProductSection from '../components/landing-page/ProductSection';
import BenefitsSection from '../components/landing-page/BenefitsSection';
import IngredientsSection from '../components/landing-page/IngredientsSection';
import TestimonialsSection from '../components/landing-page/TestimonialsSection';
import PricingSection from '../components/landing-page/PricingSection';
import FAQSection from '../components/landing-page/FAQSection';
import FinalCTA from '../components/landing-page/FinalCTA';

const LandingPage: React.FC = () => (
  <div className="overflow-x-hidden">
    <HeroSection />
    <TrustBar />
    <ProblemSection />
    <ProductSection />
    <BenefitsSection />
    <IngredientsSection />
    <TestimonialsSection />
    <PricingSection />
    <FAQSection />
    <FinalCTA />
  </div>
);

export default LandingPage;
