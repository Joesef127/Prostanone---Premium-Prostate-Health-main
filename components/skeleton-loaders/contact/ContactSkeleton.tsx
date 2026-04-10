import React from 'react';
import Skeleton from '../Skeleton';
import ContactInfoSkeleton from './ContactInfoSkeleton';
import ContactFormSkeleton from './ContactFormSkeleton';

const ContactSkeleton: React.FC = () => (
  <div className="pt-20 bg-background min-h-screen">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Page heading */}
      <div className="text-center mb-16">
        <Skeleton className="h-10 w-48 mx-auto mb-4" />
        <Skeleton className="h-6 w-72 mx-auto" />
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <ContactInfoSkeleton />
        <ContactFormSkeleton />
      </div>
    </div>
  </div>
);

export default ContactSkeleton;
