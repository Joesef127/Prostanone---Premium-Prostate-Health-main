import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../Button';
import { NAFDAC_REG_NO } from '../../lib/constants';
import { images } from '../../lib';

const HomeHeroSection: React.FC = () => {
  const { scrollY } = useScroll();
  const rotation = useTransform(scrollY, [0, 500], [0, 25]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-linear-to-br from-background to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid md:grid-cols-2 gap-12 items-center">

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-200 uppercase tracking-wide">NAFDAC Certified</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full border border-blue-200 uppercase tracking-wide">Clinically Backed</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary leading-tight">
            Transform Your <br />
            <span className="text-secondary">Prostate Health</span>
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-lg">
            NAFDAC-certified herbal prostate health supplement. Supporting vitality and confidence for Nigerian men naturally. Distributed Only by Holis Botanical Gardens.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/quiz">
              <Button size="lg" className="w-full sm:w-auto">Take Free Prostate Check</Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Pricing
            </Button>
          </div>
        </motion.div>

        <motion.div style={{ rotate: rotation, opacity }} className="relative flex justify-center items-center">
          {/* Abstract Background Blob */}
          <div className="absolute w-125 h-125 bg-primary/10 rounded-full blur-3xl -z-10" />

          {/* Product Card */}
          <div className="relative w-64 h-80 md:w-80 md:h-112.5 bg-white rounded-3xl shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-500 overflow-hidden flex flex-col items-center">

            <div className="h-2/3 w-full bg-linear-to-b from-primary to-secondary p-6 flex flex-col justify-between">
              <span className="text-white font-bold text-2xl tracking-widest uppercase text-center border-b border-white/20 pb-2">
                Prostanone
              </span>
              <img
                src={images.prostanone}
                alt="Prostanone Bottle"
                className="w-28 h-28 object-contain mx-auto my-2 drop-shadow-xl"
              />
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
        </motion.div>
      </div>
    </section>
  );
};

export default HomeHeroSection;
