import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, FlaskConical, ChevronDown } from 'lucide-react';
import Button from '../Button';
import { images } from '../../lib';

const HomeHeroSection: React.FC = () => {
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
          src={images.prostanone_man}
          alt="Prostanone Hero"
          className="w-full h-full object-cover object-center sm:object-top"
        />
      </motion.div>

      {/* Layered gradient overlays for depth */}
      <div className="absolute inset-0 z-10 bg-linear-to-t from-black/85 via-black/45 to-black/30" />
      <div className="absolute inset-0 z-10 bg-linear-to-r from-primary/30 via-transparent to-transparent" />

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-32 flex flex-col items-center text-center"
      >
        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          <span className="flex items-center gap-1.5 px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-[10px] sm:text-[12px] xl:text-[14px] font-semibold rounded-full border border-white/20 uppercase tracking-wider">
            <ShieldCheck size={13} className="text-green-400" />
            NAFDAC Certified
          </span>
          <span className="flex items-center gap-1.5 px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-[10px] sm:text-[12px] md:text-[14px] font-semibold rounded-full border border-white/20 uppercase tracking-wider">
            <FlaskConical size={13} className="text-blue-400" />
            Clinically Backed
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white leading-tight tracking-tight mb-6"
        >
          Transform Your <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary to-amber-300">
            Prostate Health
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-sm sm:text-base lg:text-lg md:text-xl text-white/75 max-w-2xl mb-10 leading-relaxed"
        >
          NAFDAC-certified herbal prostate supplement supporting vitality and confidence for Nigerian men naturally. Distributed only by Holis Botanical Gardens.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/quiz">
            <Button size="md" className="w-full sm:w-auto shadow-lg shadow-primary/40">
              Take Free Prostate Check
            </Button>
          </Link>
          <Button
            variant="outline"
            size="md"
            className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 backdrop-blur-sm"
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Pricing
          </Button>
        </motion.div>

        {/* Scroll nudge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* RHS — Product Card (commented out) */}
      {/* <motion.div style={{ rotate: rotation, opacity }} className="relative flex justify-center items-center">
          <div className="absolute w-125 h-125 bg-primary/10 rounded-full blur-3xl -z-10" />
          <div className="relative w-64 h-80 md:w-80 md:h-112.5 bg-white rounded-3xl shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-500 overflow-hidden flex flex-col items-center">
            <div className="h-2/3 w-full bg-linear-to-b from-primary to-secondary p-6 flex flex-col justify-between">
              <span className="text-white font-bold text-2xl tracking-widest uppercase text-center border-b border-white/20 pb-2">Prostanone</span>
              <img src={images.prostanone} alt="Prostanone Bottle" className="w-28 h-28 object-contain mx-auto my-2 drop-shadow-xl" />
              <div className="text-center text-white/90">
                <p className="text-4xl font-bold">60</p>
                <p className="text-sm uppercase tracking-wide">Tablets</p>
              </div>
            </div>
            <div className="h-1/3 w-full bg-white p-6 flex flex-col items-center justify-center space-y-2">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <p className="text-xs text-gray-500 font-medium">Herbal Supplement</p>
              <p className="text-[10px] text-gray-400">NAFDAC Reg No: {NAFDAC_REG_NO}</p>
            </div>
          </div>
        </motion.div> */}

    </section>
  );
};

export default HomeHeroSection;
