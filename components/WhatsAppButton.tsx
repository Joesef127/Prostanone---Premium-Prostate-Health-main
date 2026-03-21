import React from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WhatsAppButton: React.FC = () => {
    const location = useLocation();

    // Hide the button on checkout and quiz pages
    if (location.pathname === '/checkout' || location.pathname === '/quiz') {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.a
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="https://wa.me/2348155931140"
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
