import React from 'react';
import { images } from '@/lib';
import { FadeIn } from './shared';
import { INGREDIENTS } from '../../lib/data.ts';

const IngredientsSection: React.FC = () => (
  <section className="py-24 bg-background">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Ingredient cards */}
        <FadeIn>
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-primary mb-3">
            Active Ingredients
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 leading-tight">
            Four Proven Herbal Actives
          </h2>
          <p className="text-text-muted text-lg leading-relaxed mb-10">
            Every ingredient has centuries of traditional use backed by modern research.
            No fillers, no artificial colours, no starch.
          </p>
          <div className="space-y-4">
            {INGREDIENTS.map(({ name, dose, desc }, i) => (
              <FadeIn key={name} delay={i * 0.1}>
                <div className="flex gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="shrink-0 w-16 h-16 rounded-xl bg-primary/5 border border-primary/10 flex flex-col items-center justify-center gap-0.5">
                    <span className="text-[9px] font-bold text-primary/50 uppercase tracking-wider">Dose</span>
                    <span className="text-sm font-bold text-primary leading-none">{dose}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary mb-1">{name}</h4>
                    <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>

        {/* Hero product photo */}
        <FadeIn delay={0.2} className="flex items-center justify-center">
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 rounded-3xl bg-linear-to-br from-primary/10 to-accent/10 blur-2xl scale-110"
            />
            <img
              src={images.prostanone3}
              alt="Prostanone tablets blister pack"
              className="relative z-10 rounded-3xl shadow-xl max-w-md w-full object-cover"
              loading="lazy"
            />
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

export default IngredientsSection;
