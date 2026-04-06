import React from 'react';
import { useDynamicTitle } from '../hooks/useDynamicTitle';
import ContactInfoSection from '../components/contact/ContactInfoSection';
import ContactFormSection from '../components/contact/ContactFormSection';

const Contact: React.FC = () => {
  useDynamicTitle('Contact Us');

  return (
    <div className="pt-20 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-primary mb-4">Get in Touch</h1>
          <p className="text-text-muted text-lg">
            Questions about Prostanone? Our team is here to help.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <ContactInfoSection />
          <ContactFormSection />
        </div>
      </div>
    </div>
  );
};

export default Contact;
