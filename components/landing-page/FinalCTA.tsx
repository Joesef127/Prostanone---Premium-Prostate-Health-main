import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { images } from '@/lib';
import Button from '../Button';
import { FadeIn } from './shared';

const FinalCTA: React.FC = () => (
  <section className="py-28 bg-linear-to-br from-secondary via-primary to-[#3d0f2b] relative overflow-hidden">
    <div
      aria-hidden
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }}
    />
    <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
      <FadeIn>
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
          className="inline-block mb-7"
        >
          <img src={images.nafdac_approved_badge} alt="NAFDAC Approved" className="h-20 mx-auto drop-shadow-xl" />
        </motion.div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-[1.1]">
          Your Prostate Can't Wait.
          <br />
          Start Healing <span className="text-accent">Today.</span>
        </h2>

        <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
          Join thousands of Nigerian men who took back control of their health with Prostanone —
          natural, certified, and proven.
        </p>

        <a href="#pricing">
          <Button size="lg" variant="secondary" className="gap-2 text-lg px-10 font-bold shadow-xl">
            Order Prostanone Now <ArrowRight size={20} />
          </Button>
        </a>

        <p className="text-white/35 text-sm mt-6">
          Nationwide delivery · Secure payment · NAFDAC Reg. No. A7-4976L
        </p>
      </FadeIn>
    </div>
  </section>
);

export default FinalCTA;
