import React from 'react';
import { FadeIn, SectionHeader } from './shared';
import LandingFAQItem from './LandingFAQItem';
import { FAQS } from '../../lib/constants.ts';

const FAQSection: React.FC = () => (
  <section className="py-24 bg-white">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <FadeIn>
        <SectionHeader
          eyebrow="Got Questions?"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know before placing your order."
        />
      </FadeIn>
      <FadeIn
        delay={0.1}
        className="bg-background rounded-3xl border border-gray-100 shadow-sm overflow-hidden px-6 md:px-8"
      >
        {FAQS.map(faq => (
          <LandingFAQItem key={faq.question} question={faq.question} answer={faq.answer} />
        ))}
      </FadeIn>
    </div>
  </section>
);

export default FAQSection;
