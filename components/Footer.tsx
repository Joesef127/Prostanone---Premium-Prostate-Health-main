import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../lib/constants.ts';
import { Twitter, Facebook, Instagram, Phone, Mail, Youtube } from 'lucide-react';
import { images } from '@/lib';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-6">
              <img src={images.logo} alt="Prostanone Logo" className="h-10 w-auto brightness-0 invert" />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              NAFDAC-certified herbal prostate health supplement. Restoring vitality and confidence for Nigerian men naturally.
            </p>
            <div className="flex space-x-4">
              {/* <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a> */}
              <a href="https://youtube.com/@prostanone?si=g5r9czALpAdS3WIJ" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Youtube size={24} /></a>
              <a href="https://instagram.com/prostanone" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Quick Links</h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-300 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li><Link to="/quiz" className="text-gray-300 hover:text-white text-sm transition-colors">Check Prostate Health</Link></li>
              <li><Link to="/distributor" className="text-gray-300 hover:text-white text-sm transition-colors">Become a Distributor</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-300 text-sm">
                <Phone className="w-4 h-4 mr-3" />
                <a href="https://wa.me/2348155931140" target="_blank" rel="noopener noreferrer" className="hover:text-green-400">08155931140</a>
              </li>
              <li className="flex items-center text-gray-300 text-sm">
                <Mail className="w-4 h-4 mr-3" />
                <a href="mailto:support@holisbotanicals.com" className="hover:text-green-400 transition-colors">support@holisbotanicals.com</a>
              </li>
              <li className="text-gray-300 text-sm ml-7">
                Mon-Sat, 9AM-6PM WAT
              </li>
              <li className="text-gray-300 text-sm pt-4 border-t border-white/10 mt-2">
                <strong>Holis Botanical Gardens</strong><br />
                {/* Km 35 Ikorodu-Itoikin Ijebu-Ode Road,<br />
                Ikosi, Ejirin LCDA, Epe Local Government,<br /> */}
                Lagos State, Nigeria
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/terms#4-privacy-policy" className="text-gray-300 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms#1-legal-terms-of-use" className="text-gray-300 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
              <li><Link to="/terms#3-refund-return-policy" className="text-gray-300 hover:text-white text-sm transition-colors">Refund Policy</Link></li>
              <li><Link to="/terms#2-shipping-policy" className="text-gray-300 hover:text-white text-sm transition-colors">Shipping Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-8 text-center max-w-4xl mx-auto">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Prostanone. NAFDAC Certified. All rights reserved. Distributed by Holis Botanical Gardens.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;