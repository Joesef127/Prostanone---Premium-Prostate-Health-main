import React from 'react';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { PAGE_URLS, generateSchema, SITE_CONFIG, getFullUrl } from '../lib/seo';
import HomeHeroSection from '../components/home/HomeHeroSection';
import HomeSymptomsSection from '../components/home/HomeSymptomsSection';
import HomeHowItWorksSection from '../components/home/HomeHowItWorksSection';
import HomeTestimonialsSection from '../components/home/HomeTestimonialsSection';
import HomePricingSection from '../components/home/HomePricingSection';
import HomeQuizCTASection from '../components/home/HomeQuizCTASection';
import FAQ from '../components/FAQ';
import FAQSection from '@/components/product-page/FAQSection';

const Home: React.FC = () => {
  // SEO configuration for home page
  useSeoMeta(
    {
      title: 'Prostanone | Premium Prostate Health Supplement',
      description: 'Discover Prostanone - NAFDAC certified, 100% natural herbal supplement for prostate health. Improve urinary function, reduce nighttime urgency, and boost wellness.',
      keywords: [
        'prostate health',
        'prostate supplement',
        'natural remedy',
        'urinary health',
        'NAFDAC certified',
        'herbal supplement',
        'prostate problem solution',
      ],
      url: PAGE_URLS.home,
      image: SITE_CONFIG.defaultImage,
      imageAlt: 'Prostanone Premium Prostate Health Supplement',
      type: 'website',
    },
    {
      schema: generateSchema('WebSite', {
        name: 'Prostanone',
        url: SITE_CONFIG.domain,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: getFullUrl('/?q={search_term_string}'),
          },
          'query-input': 'required name=search_term_string',
        },
      }),
    },
  );

  return (
    <div className="overflow-x-hidden">
      <HomeHeroSection />
      <HomeSymptomsSection />
      <HomeHowItWorksSection />
      <HomeTestimonialsSection />
      <HomePricingSection />
      <FAQSection />
      <HomeQuizCTASection />
    </div>
  );
};

export default Home;
