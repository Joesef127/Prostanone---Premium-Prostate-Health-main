import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { images } from '@/lib';
import { FadeIn, CheckItem } from './shared';

const CAROUSEL_IMAGES = [
  { src: images.single_box,      alt: 'Prostanone single box' },
  { src: images.box_and_satchet, alt: 'Prostanone with tablet blister packs' },
  { src: images.prostanone,     alt: 'Prostanone product view' },
  { src: images.box_and_nylon,   alt: 'Prostanone full pack contents' },
  { src: images.boxed_up,        alt: 'Prostanone boxed up' },
];

const ProductCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = useCallback((dir: number) => {
    setDirection(dir);
    setIndex(prev => (prev + dir + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => go(1), 5000);
    return () => clearInterval(timer);
  }, [go]);

  const variants = {
    enter:  (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <FadeIn className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg group">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          src={CAROUSEL_IMAGES[index].src}
          alt={CAROUSEL_IMAGES[index].alt}
          className="absolute inset-0 w-full h-[90%] object-contain p-4"
          draggable={false}
        />
      </AnimatePresence>

      {/* Nav buttons */}
      <button
        onClick={() => go(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-secondary rounded-full p-2 shadow opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Previous image"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-secondary rounded-full p-2 shadow opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Next image"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {CAROUSEL_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? 'bg-white w-4' : 'bg-white/50'}`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </FadeIn>
  );
};

const ProductSection: React.FC = () => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Image carousel */}
        <ProductCarousel />

        {/* Product details */}
        <FadeIn delay={0.15}>
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-primary mb-3">The Product</span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 leading-tight">
            Prostanone Herbal Prostate Tablets
          </h2>
          <p className="text-text-muted text-lg leading-relaxed mb-6">
            A scientifically formulated herbal supplement combining four powerful plant extracts to support
            prostate health, reduce inflammation, and restore healthy urinary function, without synthetic
            chemicals or sexual side effects.
          </p>
          <ul className="space-y-2.5 mb-8">
            {[
              '60 tablets per box, approximately 1 month supply',
              'Dosage: 1 tablet three times daily',
              // 'No artificial colour, flavour, preservatives, starch, yeast, fat or wheat',
              'Manufactured by Bhargava in collaboration with Alpha Organics, Great Britain',
              'Distributed exclusively by Holis Botanical Gardens',
              'NAFDAC Reg. No. A7-4976L',
            ].map(item => (
              <CheckItem key={item} text={item} />
            ))}
          </ul>

          <div className="flex items-center gap-4 bg-success/5 border border-success/20 rounded-2xl p-4">
            <img src={images.nafdac_approved_badge} alt="NAFDAC Approved" className="h-14 w-14 shrink-0" />
            <div>
              <p className="font-bold text-secondary">NAFDAC Approved</p>
              <p className="text-sm text-text-muted">
                Reg. No. A7-4976L, Certified safe for Nigerian consumers by the National Agency for
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
