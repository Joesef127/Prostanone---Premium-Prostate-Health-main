import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { images } from '@/lib';
import Button from '../Button';
import { STATS } from '../../lib/data.ts';

const HeroSection: React.FC = () => (
  <section className="relative min-h-screen bg-linear-to-br from-secondary via-primary to-[#3d0f2b] flex items-center overflow-hidden">
    {/* dot-grid texture */}
    <div
      aria-hidden
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }}
    />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">

      {/* ── Left: copy ── */}
      <div className="text-white">
        {/* NAFDAC pill */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
        >
          <img src={images.nafdac_approved_badge} alt="NAFDAC" className="h-5 w-5 rounded-full object-cover" />
          <span className="text-xs font-bold tracking-wider uppercase text-accent">
            NAFDAC Approved — Reg. No. A7-4976L
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6"
        >
          Reclaim Control of Your{' '}
          <span className="text-accent">Prostate Health</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-base md:text-lg text-white/75 leading-relaxed mb-8 max-w-xl"
        >
          Struggling with weak flow or incomplete emptying? <br/>
          Prostanone's NAFDAC-certified herbal formula targets the root cause, not just the symptoms.
          Supporting vitality and confidence for Nigerian men naturally.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <a href="#pricing">
            <Button size="md" variant="secondary" className="gap-2 font-bold">
              Order Now <ArrowRight size={18} />
            </Button>
          </a>
          <a href="/quiz">
            <Button
              size="md"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 focus:ring-white/20"
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
          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
        >
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <div className="text-xl font-bold text-accent">{value}</div>
              <div className="text-xs text-white/55 uppercase tracking-wide mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Right: product ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex items-center justify-center"
      >
        {/* ambient glow */}
        <div aria-hidden className="absolute w-96 h-96 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative">
          <img
            src={images.prostanone}
            alt="Prostanone — Premium Prostate Health"
            className="relative z-10 w-full max-w-sm lg:max-w-md xl:max-w-lg mx-auto drop-shadow-2xl"
            loading="eager"
          />
          {/* floating NAFDAC badge */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="absolute -top-6 -right-4 z-20 p-2.5 rounded-full bg-white"
          >
            <img src={images.nafdac_approved_badge} alt="NAFDAC Approved" className="w-20 h-20 drop-shadow-xl" />
          </motion.div>
        </div>
      </motion.div>
    </div>

    {/* scroll nudge */}
    <motion.div
      animate={{ y: [0, 8, 0] }}
      transition={{ repeat: Infinity, duration: 1.6 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 z-10"
    >
      <ChevronDown size={28} />
    </motion.div>
  </section>
);

export default HeroSection;
