import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { images } from '@/lib';
import Button from '../Button';
import { NAFDAC_REG_NO } from '../../lib/constants';
import { STATS } from '../../lib/data.ts';

const HeroSection: React.FC = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ['0%', '20%']);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background image with parallax */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 -top-20 -bottom-20 z-0"
      >
        <img
          src={images.prostanone_showcase}
          alt="Prostanone Hero"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
      </motion.div>

      {/* Layered overlays */}
      <div className="absolute inset-0 z-10 bg-linear-to-t from-black/90 via-black/70 to-black/55" />
      <div className="absolute inset-0 z-10 bg-linear-to-r from-secondary/40 via-transparent to-transparent" />

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-36 flex flex-col items-center text-center"
      >
        {/* NAFDAC pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
        >
          <img src={images.nafdac_approved_badge} alt="NAFDAC" className="h-5 w-5 rounded-full object-cover bg-white p-0.5" />
          <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-accent">
            NAFDAC Approved — Reg. No. {NAFDAC_REG_NO}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight tracking-tight mb-6"
        >
          Reclaim Control of Your{' '}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-amber-300">
            Prostate Health
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-sm sm:text-base md:text-lg text-white/75 max-w-2xl mb-10 leading-relaxed"
        >
          Prostanone's NAFDAC-certified herbal formula targets the root cause, not just the symptoms.
          Supporting vitality and confidence for Nigerian men naturally.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-14 justify-center"
        >
          <a href="#pricing">
            <Button size="md" variant="secondary" className="gap-2 font-bold w-full sm:w-auto shadow-lg shadow-secondary/40">
              Order Now <ArrowRight size={18} />
            </Button>
          </a>
          <a href="/quiz">
            <Button
              size="md"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm w-full sm:w-auto"
            >
              Take Free Prostate Check
            </Button>
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex flex-wrap justify-center gap-8 sm:gap-12"
        >
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <div className="text-xl sm:text-2xl font-bold text-accent">{value}</div>
              <div className="text-[10px] sm:text-xs text-white/55 uppercase tracking-wide mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll nudge */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 z-20"
      >
        <ChevronDown size={28} />
      </motion.div>

    </section>
  );
};

export default HeroSection;