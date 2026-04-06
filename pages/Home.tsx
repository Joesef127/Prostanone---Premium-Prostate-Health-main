import React from 'react';
import { useDynamicTitle } from '../hooks/useDynamicTitle';
import HomeHeroSection from '../components/home/HomeHeroSection';
import HomeSymptomsSection from '../components/home/HomeSymptomsSection';
import HomeHowItWorksSection from '../components/home/HomeHowItWorksSection';
import HomeTestimonialsSection from '../components/home/HomeTestimonialsSection';
import HomePricingSection from '../components/home/HomePricingSection';
import HomeQuizCTASection from '../components/home/HomeQuizCTASection';
import FAQ from '../components/FAQ';

const Home: React.FC = () => {
  useDynamicTitle('Premium Prostate Health');
  return (
    <div className="overflow-x-hidden">
      <HomeHeroSection />
      <HomeSymptomsSection />
      <HomeHowItWorksSection />
      <HomeTestimonialsSection />
      <HomePricingSection />
      <FAQ />
      <HomeQuizCTASection />
    </div>
  );
};

export default Home;
