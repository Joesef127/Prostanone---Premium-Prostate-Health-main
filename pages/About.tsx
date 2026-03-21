import React from 'react';
import { motion } from 'framer-motion';
import { IMAGES } from '../constants';
import { CheckCircle } from 'lucide-react';

const About: React.FC = () => {
   return (
      <div className="pt-20">
         <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid md:grid-cols-2 gap-16 items-center">
                  <motion.div
                     initial={{ opacity: 0, x: -50 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                  >
                     <span className="text-accent font-bold uppercase tracking-wider text-sm mb-2 block">Our Story</span>
                     <h1 className="text-4xl font-bold text-primary mb-6">Science-Backed Prostate Support for Nigerian Men</h1>
                     <p className="text-lg text-text-muted mb-6 leading-relaxed">
                        Prostanone was created to give Nigerian men access to premium, clinically-backed prostate health support without relying on synthetic pharmaceuticals. We believe in the power of nature combined with rigorous scientific validation.
                     </p>
                     <div className="grid grid-cols-2 gap-6">
                        <div className="bg-background p-4 rounded-xl">
                           <h4 className="font-bold text-primary mb-2">Bhargava Phytolab</h4>
                           <p className="text-sm text-text-muted">Established 1920. A century of excellence in natural medicine.</p>
                        </div>
                        <div className="bg-background p-4 rounded-xl">
                           <h4 className="font-bold text-primary mb-2">Holis Botanical</h4>
                           <p className="text-sm text-text-muted">Local manufacturing partner in Lagos, ensuring freshness.</p>
                        </div>
                     </div>
                  </motion.div>

                  <motion.div
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     className="relative h-full min-h-[500px] rounded-3xl overflow-hidden shadow-2xl"
                  >
                     <img src="/prostanone-about.jpg" alt="Manufacturing Facility" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                        <div className="text-white">
                           <p className="font-bold text-xl">GMP Certified Facility</p>
                           <p className="text-sm opacity-80">Highest standards of production quality.</p>
                        </div>
                     </div>
                  </motion.div>
               </div>
            </div>
         </section>

         <section className="py-24 bg-background">
            <div className="max-w-4xl mx-auto px-4 text-center">
               <h2 className="text-3xl font-bold text-primary mb-12">Certified Excellence</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {['NAFDAC Certified', 'GMP Compliant', 'Lab Tested', '100% Herbal'].map((cert, idx) => (
                     <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                           <CheckCircle />
                        </div>
                        <span className="font-semibold text-text">{cert}</span>
                     </div>
                  ))}
               </div>
            </div>
         </section>
      </div >
   );
};

export default About;