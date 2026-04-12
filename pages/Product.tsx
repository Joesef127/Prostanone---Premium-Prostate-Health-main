import React from 'react';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { PAGE_URLS, generateProductSchema, SITE_CONFIG } from '../lib/seo';
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

const Product: React.FC = () => {
  // SEO configuration for product page
  useSeoMeta(
    {
      title: 'Prostanone Supplement - Natural Prostate Health Formula',
      description: 'Prostanone - NAFDAC certified natural prostate supplement with proven ingredients. Improve urinary flow, reduce nighttime bathroom visits, and support prostate wellness. ₦15,000 - ₦115,000.',
      keywords: [
        'Prostanone supplement',
        'prostate health formula',
        'natural prostate treatment',
        'NAFDAC certified supplement',
        'urinary health supplement',
        'prostate ingredients',
        'buy prostate supplement',
      ],
      url: PAGE_URLS.product,
      image: SITE_CONFIG.logo,
      imageAlt: 'Prostanone Premium Prostate Health Formula',
      type: 'product',
    },
    {
      schema: generateProductSchema({
        name: 'Prostanone Premium Prostate Health Formula',
        description: 'NAFDAC certified 100% natural herbal supplement designed to improve prostate health and urinary function.',
        brand: 'Prostanone',
        manufacturer: 'Holis Botanical Gardens',
        image: SITE_CONFIG.logo,
        price: 39000,
        currency: 'NGN',
        availability: 'https://schema.org/InStock',
      }),
    },
  );

  return (
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
};

export default Product;