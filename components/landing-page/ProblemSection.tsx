import React from 'react';
import { FadeIn, SectionHeader } from './shared';
import { SYMPTOMS } from './data';

const ProblemSection: React.FC = () => (
  <section className="py-24 bg-background" id="product">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <FadeIn>
        <SectionHeader
          eyebrow="The Silent Struggle"
          title="Are These Symptoms Running Your Life?"
          subtitle="Millions of Nigerian men over 40 live with prostate problems — but most suffer in silence. You don't have to."
        />
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {SYMPTOMS.map(({ icon, text }, i) => (
          <FadeIn key={text} delay={i * 0.07}>
            <div className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-full">
              <span className="text-2xl shrink-0">{icon}</span>
              <p className="text-base font-medium text-secondary leading-snug">{text}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn className="flex justify-center">
        <div className="bg-primary/5 border border-primary/10 rounded-2xl px-8 py-7 max-w-2xl text-center">
          <p className="text-xl font-semibold text-primary leading-relaxed">
            These aren't just inconveniences — they are signs that your prostate needs attention.{' '}
            <span className="text-secondary">Prostanone was formulated specifically for you.</span>
          </p>
        </div>
      </FadeIn>
    </div>
  </section>
);

export default ProblemSection;
