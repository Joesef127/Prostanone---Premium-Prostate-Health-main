import React from 'react';
import { FadeIn, SectionHeader } from './shared';
import { BENEFITS } from './data';

const BenefitsSection: React.FC = () => (
  <section className="py-24 bg-linear-to-br from-secondary via-primary to-[#3d0f2b]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <FadeIn>
        <SectionHeader eyebrow="Why It Works" title="Six Reasons Men Choose Prostanone" light />
      </FadeIn>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {BENEFITS.map(({ icon: Icon, title, desc }, i) => (
          <FadeIn key={title} delay={i * 0.08}>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors h-full">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                <Icon size={22} className="text-accent" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-white/65 text-sm leading-relaxed">{desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;
