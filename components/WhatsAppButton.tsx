import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { PACKAGES } from '../lib/constants';

const WHATSAPP_NUMBER = '2348155931140';

const WhatsAppButton: React.FC = () => {
    const { cart } = useApp();

    const buildMessage = () => {
        if (cart.length > 0) {
            const pkg = PACKAGES.find(p => p.id === cart[0].packageId);
            const name = pkg ? pkg.name : cart[0].packageId;
            return `Hi, I'd like to order Prostanone — ${name}. Please assist me.`;
        }
        return "Hi, I'd like to order Prostanone. Please assist me.";
    };

    const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`;

    return (
        <AnimatePresence>
            <motion.a
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg shadow-green-500/30 hover:bg-green-600 transition-colors"
                aria-label="Chat on WhatsApp"
            >
                <MessageCircle size={32} />
            </motion.a>
        </AnimatePresence>
    );
};

export default WhatsAppButton;
