import React, { useState, useEffect, useCallback } from 'react';
import { images } from '@/lib';
import { FadeIn, CheckItem } from './shared';
import { ProductCarousel } from '../ProductCarousel';
import { NAFDAC_REG_NO } from '../../lib/constants';

const CAROUSEL_IMAGES = [
  { src: images.prostanone_closeup,      alt: 'Prostanone single box' },
  { src: images.prostanone_showcase, alt: 'Prostanone with tablet blister packs' },
  { src: images.prostanone,     alt: 'Prostanone product view' },
  { src: images.prostanone_tablets,   alt: 'Prostanone full pack contents' },
  // { src: images.boxed_up,        alt: 'Prostanone boxed up' },
];


const ProductSection: React.FC = () => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Image carousel */}
        <ProductCarousel images={CAROUSEL_IMAGES} />

        {/* Product details */}
        <FadeIn delay={0.15}>
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-primary mb-3">The Product</span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 leading-tight">
            Prostanone Herbal Prostate Tablets
          </h2>
          <p className="text-text-muted text-base sm:text-lg leading-relaxed mb-6">
            A scientifically formulated herbal supplement combining four powerful plant extracts to support
            prostate health, reduce inflammation, and restore healthy urinary function, without synthetic
            chemicals.
          </p>
          <ul className="space-y-2.5 mb-8">
            {[
              '60 tablets per box, approximately 1 month supply',
              'Dosage: 1 tablet three times daily',
              // 'No artificial colour, flavour, preservatives, starch, yeast, fat or wheat',
              'Manufactured by Bhargava in collaboration with Alpha Organics, Great Britain',
              'Distributed exclusively by Holis Botanical Gardens',
              `NAFDAC Reg. No. ${NAFDAC_REG_NO}`,
            ].map(item => (
              <CheckItem key={item} text={item} />
            ))}
          </ul>

          <div className="flex items-center gap-4 bg-success/5 border border-success/20 rounded-2xl p-4">
            <img src={images.nafdac_approved_badge} alt="NAFDAC Approved" className="h-14 w-14 shrink-0" loading="lazy" />
            <div>
              <p className="font-bold text-secondary">NAFDAC Approved</p>
              <p className="text-sm text-text-muted">
                Reg. No. {NAFDAC_REG_NO}, Certified safe for Nigerian consumers by the National Agency for
                Food and Drug Administration and Control.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

export default ProductSection;
