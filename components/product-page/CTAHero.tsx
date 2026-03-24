import React from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck } from 'lucide-react';
import { images } from '@/lib';
import { FadeIn } from './shared';

const CTAHero: React.FC = () => (
  <FadeIn className="text-center mb-12">
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
      className="inline-block mb-7 p-3.5 bg-white rounded-full"
    >
      <img
        src={images.nafdac_approved_badge}
        alt="NAFDAC Approved"
        className="h-20 mx-auto drop-shadow-xl"
      />
    </motion.div>

    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-5 leading-[1.1]">
      Your Prostate&apos;s Recovery Starts Here.
      <br />
      Start Healing <span className="text-accent">Today.</span>
    </h2>

    <div className="text-white text-center px-6">
      <div className="inline-block bg-red-600 text-white text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
        Limited Stock Available
      </div>
      <h2 className="text-2xl md:text-3xl font-extrabold">Place Your Order Now!</h2>
      <div className="flex justify-center gap-6 mt-3 text-sm font-medium text-white/80 flex-wrap">
        <span className="flex items-center gap-1.5">
          <Truck size={14} className="text-green-400" /> FREE delivery in Lagos (except for Epe and
          Badagry)
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-green-400" /> Payment on Delivery
        </span>
      </div>
    </div>
  </FadeIn>
);

export default CTAHero;
