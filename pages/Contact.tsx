import React from 'react';
import Button from '../components/Button';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
   return (
      <div className="pt-20 bg-background min-h-screen">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center mb-16">
               <h1 className="text-4xl font-bold text-primary mb-4">Get in Touch</h1>
               <p className="text-text-muted text-lg">Questions about Prostanone? Our team is here to help.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
               {/* Contact Info */}
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
                              <a href="https://wa.me/2348155931140" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 font-bold mb-1 block">
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
                              <p className="text-text-muted">support@holisbotanicals.com</p>
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
                              Address:<br />
                              Km 35 Ikorodu-Itoikin Ijebu-Ode Road,<br />
                              Ikosi, Ejirin LCDA, Epe Local Government,<br />
                              Lagos State, Nigeria
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Form */}
               <div className="bg-white p-8 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-bold text-primary mb-6">Send us a Message</h3>
                  <form className="space-y-6">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none bg-white" placeholder="Your Name" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none bg-white" placeholder="john@example.com" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none bg-white" placeholder="How can we help?"></textarea>
                     </div>
                     <Button fullWidth size="lg">Send Message</Button>
                  </form>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Contact;