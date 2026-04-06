import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { TESTIMONIALS } from '../../lib/constants';

const HomeTestimonialsSection: React.FC = () => (
  <section className="py-24 bg-primary text-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
      <h2 className="text-3xl font-bold mb-4">Trusted by Nigerian Men</h2>
      <div className="flex justify-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map(i => <ShieldCheck key={i} className="text-accent" fill="currentColor" />)}
      </div>
      <p className="text-white/80">4.9/5 Average Rating based on 1,200+ reviews</p>
    </div>

    <div className="flex overflow-x-auto pb-8 gap-6 px-4 no-scrollbar snap-x">
      {TESTIMONIALS.map((t) => (
        <div key={t.id} className="shrink-0 w-80 md:w-96 bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 snap-center">
          <div className="flex gap-1 mb-4 text-accent">
            {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
          </div>
          <p className="text-lg italic mb-6">"{t.text}"</p>
          <div>
            <p className="font-bold">{t.name}</p>
            <p className="text-sm text-white/60">{t.age} years old • {t.location}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default HomeTestimonialsSection;
