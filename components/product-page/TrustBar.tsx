import React from 'react';
import { TRUST_BADGES } from '../../lib/data.ts';

const TrustBar: React.FC = () => (
  <section className="bg-white border-y border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
        {TRUST_BADGES.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-sm font-semibold text-secondary">
            <Icon size={15} className="text-primary" />
            {label}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustBar;
