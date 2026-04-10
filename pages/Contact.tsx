import React from 'react';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { PAGE_URLS, generateSchema } from '../lib/seo';
import ContactInfoSection from '../components/contact/ContactInfoSection';
import ContactFormSection from '../components/contact/ContactFormSection';

const Contact: React.FC = () => {
  // SEO configuration for contact page
  useSeoMeta(
    {
      title: "Contact Prostanone - Get in Touch",
      description: "Have questions about Prostanone? Contact our customer support team. We're here to help with any inquiries about our premium prostate health supplements.",
      keywords: [
        "contact Prostanone",
        "customer support",
        "get in touch",
        "contact form",
        "Prostanone support",
      ],
      url: PAGE_URLS.contact,
      type: "website",
    },
    {
      schema: generateSchema('ContactPoint', {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        email: 'sales@holisbotanicals.com',
        availableLanguage: 'English',
        contactOption: 'TollFree',
      }),
    },
  );

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
