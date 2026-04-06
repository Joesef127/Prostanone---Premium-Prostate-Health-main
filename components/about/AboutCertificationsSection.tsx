import React from 'react';
import { CheckCircle } from 'lucide-react';

const CERTIFICATIONS = ['NAFDAC Certified', 'GMP Compliant', 'Lab Tested', '100% Herbal'];

const AboutCertificationsSection: React.FC = () => (
  <section className="py-24 bg-background">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold text-primary mb-12">Certified Excellence</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {CERTIFICATIONS.map((cert, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <CheckCircle />
            </div>
            <span className="font-semibold text-text">{cert}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutCertificationsSection;
