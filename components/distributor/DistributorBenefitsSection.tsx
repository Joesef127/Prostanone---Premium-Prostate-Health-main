import React from 'react';
import { TrendingUp, Users, Package, HeartHandshake } from 'lucide-react';
import FadeIn from '../ui/FadeIn';

const BENEFITS = [
  {
    icon: TrendingUp,
    title: 'Attractive Margins',
    desc: 'Earn competitive wholesale discounts on every pack. The more you order, the more you save.',
  },
  {
    icon: Users,
    title: 'Massive Market Demand',
    desc: 'Prostate problems affect 1 in 3 Nigerian men over 50. The market is large and largely untapped.',
  },
  {
    icon: Package,
    title: 'Marketing Support',
    desc: 'Receive branded materials, social media assets, and full product training to drive your sales.',
  },
  {
    icon: HeartHandshake,
    title: 'NAFDAC-Backed Product',
    desc: 'Sell with full confidence. Prostanone is NAFDAC-certified, making it easy for customers to trust.',
  },
];

const DistributorBenefitsSection: React.FC = () => (
  <section className="py-20 bg-gray-50">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <FadeIn>
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-secondary mb-3">Why Distribute Prostanone?</h2>
          <p className="text-text-muted">
            Join a growing network of distributors across Nigeria earning real income.
          </p>
        </div>
      </FadeIn>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {BENEFITS.map(({ icon: Icon, title, desc }, i) => (
          <FadeIn key={title} delay={i * 0.1}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-secondary mb-2">{title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

export default DistributorBenefitsSection;
