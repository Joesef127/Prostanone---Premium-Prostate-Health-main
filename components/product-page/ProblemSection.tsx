import React from 'react';
import { FadeIn, SectionHeader } from './shared';
import { SYMPTOMS } from '../../lib/data.ts';

const ProblemSection: React.FC = () => (
  <section className="py-24 bg-background" id="product">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <FadeIn>
        <SectionHeader
          eyebrow="The Silent Struggle"
          title="Are These Symptoms Affecting You?"
          subtitle="Millions of Nigerian men over 40 live with prostate problems, but most suffer in silence. You don't have to."
        />
      </FadeIn>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-16">
        {SYMPTOMS.map(({ icon: Icon, text }, i) => (
          <FadeIn key={text} delay={i * 0.07}>
            <div className="flex flex-col sm:flex-row items-start gap-4 bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-5 border border-gray-100 shadow-sm h-full">
              <span className="shrink-0 mt-0.5 text-primary"><Icon size={22} /></span>
              <p className="text-sm sm:text-base font-medium text-secondary leading-snug">{text}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn className="flex justify-center">
        <div className="bg-primary/5 border border-primary/10 rounded-2xl px-8 py-7 max-w-2xl text-center">
          <p className="text-base sm:text-xl font-semibold text-primary leading-relaxed">
            These aren't just inconveniences, they are signs that your prostate needs attention.{' '}
            <span className="text-secondary">Prostanone was formulated specifically for you.</span>
          </p>
        </div>
      </FadeIn>
    </div>
  </section>
);

export default ProblemSection;
