import React from 'react';
import { TESTIMONIALS } from '../lib/constants.ts';
import { ShieldCheck, Star } from 'lucide-react';
import { useDynamicTitle } from '../hooks/useDynamicTitle';

const Reviews: React.FC = () => {
  useDynamicTitle('Customer Reviews');
  return (
    <div className="pt-20 bg-background min-h-screen">
       <section className="bg-primary text-white py-20 text-center">
          <div className="max-w-4xl mx-auto px-4">
             <h1 className="text-4xl font-bold mb-4">Real Men. Real Results.</h1>
             <p className="text-xl text-white/80">See how Prostanone has helped thousands of Nigerian men reclaim their nights.</p>
          </div>
       </section>

       <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {TESTIMONIALS.concat(TESTIMONIALS).map((t, idx) => (
               <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex gap-1 mb-4 text-accent">
                     {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-text leading-relaxed mb-6 italic">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                        {t.name[0]}
                     </div>
                     <div>
                        <p className="font-bold text-primary">{t.name}</p>
                        <p className="text-xs text-text-muted flex items-center gap-1">
                           <ShieldCheck size={12} className="text-green-500" /> Verified Purchase • {t.location}
                        </p>
                     </div>
                  </div>
               </div>
             ))}
          </div>
       </section>
    </div>
  );
};

export default Reviews;