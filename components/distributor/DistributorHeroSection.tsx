import React from 'react';
import FadeIn from '../ui/FadeIn';

const DistributorHeroSection: React.FC = () => (
  <section className="relative bg-secondary text-white overflow-hidden">
    <div className="absolute inset-0 opacity-10 bg-linear-to-br from-accent to-primary" />
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <FadeIn>
        <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent text-xs font-bold rounded-full uppercase tracking-widest mb-6">
          Distributor Programme
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
          Become a Prostanone<br />
          <span className="text-accent">Authorised Distributor</span>
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Partner with Holis Botanical Gardens and bring Nigeria's leading NAFDAC-certified
          prostate health supplement to your community. Grow your business while helping men
          reclaim their health.
        </p>
      </FadeIn>
    </div>
  </section>
);

export default DistributorHeroSection;
