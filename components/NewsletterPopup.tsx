import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail } from 'lucide-react';
import Button from './Button';
import { useModal } from '../context/ModalContext';

const NewsletterPopup: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const { showAlert } = useModal();

    useEffect(() => {
        // Check if the user has already seen the popup
        const hasSeenPopup = localStorage.getItem('prostanone_newsletter_seen');

        if (!hasSeenPopup) {
            // Show popup after 5 seconds
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('prostanone_newsletter_seen', 'true');
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/;
        if (!emailRegex.test(email)) return false;

        const [local, domain] = email.split('@');
        // Block obvious garbage data
        if (local.length < 3 || domain.length < 4 || !domain.includes('.')) return false;
        if (/(\w)\1{4,}/.test(local)) return false; // Block repeated characters like aaaaaa@...

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || name.trim().length < 3 || /[^a-zA-Z\s.-]/.test(name)) {
            showAlert({ title: 'Invalid name', message: 'Please enter a valid name (at least 3 characters, no numbers or symbols).' });
            return;
        }

        if (!validateEmail(email)) {
            showAlert({ title: 'Invalid email', message: 'Please enter a valid email address.' });
            return;
        }

        setStatus('loading');

        try {
            const SHEETS_URL = import.meta.env.VITE_SHEETS_WEBHOOK_URL;

            await fetch(SHEETS_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    source: 'Newsletter Popup',
                    message: '',
                }),
            });

            // no-cors returns an opaque response — treat resolved fetch as success
            setStatus('success');
            setTimeout(handleClose, 3000);
        } catch (error) {
            console.error('Error submitting newsletter:', error);
            setStatus('error');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <React.Fragment>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />

                    {/* Popup Modal Container for centering */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto max-h-[90vh] overflow-y-auto"
                        >
                            <div className="relative">
                                {/* Close Button */}
                                <button
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors z-10"
                                >
                                    <X size={20} />
                                </button>

                                <div className="p-6 sm:p-8 text-center pt-10 sm:pt-12">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                        <Mail size={32} />
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Health Tips & Offers</h2>
                                    <p className="text-gray-500 mb-8">
                                        Subscribe to our newsletter and join thousands of men taking charge of their prostate health.
                                    </p>

                                    {status === 'success' ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center justify-center gap-2"
                                        >
                                            <span className="font-bold">Thanks for subscribing!</span>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <input
                                                    type="text"
                                                    required
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="Enter your first name"
                                                    className="w-full px-4 py-3 mb-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none bg-gray-50 focus:bg-white transition-colors text-left"
                                                />
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Enter your email address"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none bg-gray-50 focus:bg-white transition-colors text-left"
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                disabled={status === 'loading'}
                                            >
                                                {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
                                            </Button>
                                            {status === 'error' && (
                                                <p className="text-red-500 text-sm mt-2">Something went wrong. Please try again.</p>
                                            )}
                                        </form>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </React.Fragment>
            )}
        </AnimatePresence>
    );
};

export default NewsletterPopup;
