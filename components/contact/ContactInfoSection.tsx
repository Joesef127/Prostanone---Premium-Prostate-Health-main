import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactInfoSection: React.FC = () => (
  <div className="space-y-8">
    <div className="bg-white p-8 rounded-2xl shadow-sm">
      <h3 className="text-xl font-bold text-primary mb-6">Contact Channels</h3>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-accent shrink-0">
            <Phone size={20} />
          </div>
          <div>
            <p className="font-bold text-text">WhatsApp & Phone Support</p>
            <a
              href="https://wa.me/2348155931140"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 font-bold mb-1 block"
            >
              08155931140
            </a>
            <p className="text-xs text-gray-400">Mon-Sat, 9AM-6PM WAT</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-accent shrink-0">
            <Mail size={20} />
          </div>
          <div>
            <p className="font-bold text-text">Email</p>
            <p className="text-text-muted">
              <a href="mailto:support@holisbotanicals.com" className="hover:text-primary transition-colors">
                support@holisbotanicals.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white p-8 rounded-2xl shadow-sm">
      <h3 className="text-xl font-bold text-primary mb-6">Distributor Info</h3>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-accent shrink-0">
          <MapPin size={20} />
        </div>
        <div>
          <p className="font-bold text-text mb-2">Holis Botanical Gardens</p>
          <p className="text-text-muted text-sm leading-relaxed">
            Distributed by Holis Botanical Gardens <br />
            Lagos State, Nigeria
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default ContactInfoSection;
