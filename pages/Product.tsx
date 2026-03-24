import React from 'react';
import HeroSection from '@/components/product-page/HeroSection';
import TrustBar from '@/components/product-page/TrustBar';
import ProblemSection from '@/components/product-page/ProblemSection';
import ProductSection from '@/components/product-page/ProductSection';
import BenefitsSection from '@/components/product-page/BenefitsSection';
import IngredientsSection from '@/components/product-page/IngredientsSection';
import TestimonialsSection from '@/components/product-page/TestimonialsSection';
import PricingSection from '@/components/product-page/PricingSection';
import FAQSection from '@/components/product-page/FAQSection';
import FinalCTA from '@/components/product-page/FinalCTA';

const Product: React.FC = () => (
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

export default Product;
