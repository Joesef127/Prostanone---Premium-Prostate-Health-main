import React from 'react';
import { FadeIn, SectionHeader, StarRating } from './shared';
import { TESTIMONIALS } from '../../lib/constants.ts';

const TestimonialsSection: React.FC = () => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <FadeIn>
        <SectionHeader
          eyebrow="Real Results"
          title="What Nigerian Men Are Saying"
          subtitle="Unsolicited reviews from real customers across Nigeria"
        />
      </FadeIn>

      {/* Masonry-style using CSS columns */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
        {TESTIMONIALS.map((t, i) => (
          <FadeIn key={t.id} delay={(i % 3) * 0.09} className="break-inside-avoid">
            <div className="bg-background rounded-2xl border border-gray-100 p-6 shadow-sm">
              <StarRating rating={t.rating} />
              <p className="text-sm leading-relaxed text-text mt-3 mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-secondary">{t.name}</p>
                  {(t.age || t.location) && (
                    <p className="text-xs text-text-muted">
                      {[t.age ? `Age ${t.age}` : null, t.location].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
