import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PACKAGES } from '../constants';
import Button from '../components/Button';
import { Lock, CheckCircle, MapPin, User, CreditCard, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  interface Window {
    Korapay: any;
  }
}

const Checkout: React.FC = () => {
  const { cart } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Lagos',
    notes: ''
  });

  // Calculate totals
  const subtotal = cart.reduce((acc, item) => {
    const pkg = PACKAGES.find(p => p.id === item.packageId);
    return acc + (pkg ? pkg.price * item.quantity : 0);
  }, 0);
  // Delivery fee logic: Free for Lagos (excluding Badagry and Epe), otherwise 3000
  const isLagos = formData.state?.toLowerCase() === 'lagos';
  const isExcludedLagosArea = formData.address.toLowerCase().includes('badagry')
    || formData.city.toLowerCase().includes('badagry')
    || formData.address.toLowerCase().includes('epe')
    || formData.city.toLowerCase().includes('epe');

  const finalDeliveryFee = (isLagos && !isExcludedLagosArea) ? 0 : 3000;
  const total = subtotal + finalDeliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/;
    if (!emailRegex.test(email)) return false;

    const [local, domain] = email.split('@');
    // Block common "garbage" patterns
    if (local.length < 3 || domain.length < 4 || !domain.includes('.')) return false;
    if (/(\w)\1{4,}/.test(local)) return false; // Block repeated characters like aaaaaa@...

    return true;
  };
  const validatePhone = (phone: string) => {
    const clean = phone.replace(/[\s-]/g, '');
    // Match common Nigerian patterns: 070, 080, 081, 090, 091, 01 or +234 followed by the same
    return /^(\+234|0)[789][01]\d{8}$/.test(clean);
  };

  const [reference] = useState(`PR-${Date.now()}-${Math.floor(Math.random() * 1000)}`);

  const sendCheckoutProgress = (checkoutStep: number, status: string, paymentData?: any) => {
    const ORDERS_WEBHOOK_URL = import.meta.env.VITE_ORDERS_WEBHOOK_URL || 'https://n8n.metrohyp.com/webhook/prostanone-orders';
    const orderSummary = cart.map(item => {
      const pkg = PACKAGES.find(p => p.id === item.packageId);
      return `${item.quantity}x ${pkg?.name} (₦${pkg?.price.toLocaleString()})`;
    }).join(', ');

    fetch(ORDERS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name.trim() || '',
        email: formData.email.trim().toLowerCase() || '',
        phone: formData.phone.trim() || '',
        shipping_address: formData.address.trim()
          ? `${formData.address.trim()}, ${formData.city.trim()}, ${formData.state}`
          : '',
        items_ordered: orderSummary,
        notes: formData.notes.trim(),
        payment_reference: paymentData?.reference || reference,
        payment_status: checkoutStep === 3 ? (paymentData?.status || status) : '',
        total_amount: total,
        checkout_step: status,
        date: new Date(new Date().getTime() + (1 * 60 * 60 * 1000)).toISOString().replace('Z', '+01:00')
      })
    }).catch(err => console.error('Checkout progress webhook error:', err));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      // Even stricter validation for Step 1
      const name = formData.name.trim();
      const nameParts = name.split(/\s+/);
      const nameRegex = /^[a-zA-Z\s.-]+$/;

      if (nameParts.length < 2 || nameParts.some(p => p.length < 2) || !nameRegex.test(name)) {
        alert("Please enter a valid full name (e.g., John Doe). No numbers or symbols allowed.");
        return;
      }
      if (!validateEmail(formData.email)) {
        alert("Please enter a valid email address.");
        return;
      }
      if (!validatePhone(formData.phone) || formData.phone.trim().length < 10) {
        alert("Please enter a valid 10-15 digit phone number.");
        return;
      }

      // Track checkout progress for abandoned cart recovery
      // This sends the data specifically captured in Step 1
      sendCheckoutProgress(1, 'contact_info_entered');
    }

    if (step === 2) {
      if (formData.address.trim().length < 10) {
        alert("Please enter a more detailed delivery address (street, house number, etc).");
        return;
      }
      if (formData.city.trim().length < 3) {
        alert("Please enter a valid city or local government area.");
        return;
      }

      // Track checkout progress for shipping step
      sendCheckoutProgress(2, 'shipping_entered');
    }

    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!window.Korapay) {
      alert("Payment gateway is loading. Please try again in a moment.");
      setLoading(false);
      return;
    }

    const checkoutData = {
      key: import.meta.env.VITE_KORAPAY_PUBLIC_KEY || "pk_test_qPwbCqQCurnRJCuhoQZTZxstUvpjsGqBbBq44bKZ",
      amount: total,
      currency: "NGN",
      reference: reference,
      customer: {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
      },
      notification_url: "", // Not used in this frontend-only flow
      onClose: () => {
        sendCheckoutProgress(3, 'payment_abandoned');
        setLoading(false);
      },
      onSuccess: async (data: any) => {
        try {
          // Send formSubmit email natively
          const orderSummary = cart.map(item => {
            const pkg = PACKAGES.find(p => p.id === item.packageId);
            return `${item.quantity}x ${pkg?.name} (₦${pkg?.price.toLocaleString()})`;
          }).join(", ");

          await fetch("https://formsubmit.co/ajax/sales@holisbotanicals.com", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              _subject: "New Prostanone Order Confirmed",
              customer_name: formData.name.trim(),
              customer_email: formData.email.trim().toLowerCase(),
              customer_phone: formData.phone.trim(),
              shipping_address: `${formData.address.trim()}, ${formData.city.trim()}, ${formData.state}`,
              order_summary: orderSummary,
              subtotal_amount: `₦${subtotal.toLocaleString()}`,
              delivery_fee: `₦${finalDeliveryFee.toLocaleString()}`,
              total_amount: `₦${total.toLocaleString()}`,
              notes: formData.notes.trim(),
              _cc: formData.email.trim().toLowerCase(), // Send confirmation to user too
              _template: "table"
            })
          });

          // Report final checkout step to n8n Webhook
          sendCheckoutProgress(3, 'payment_completed', data);

          navigate('/thank-you');
        } catch (error) {
          console.error("Post-payment error:", error);
          // Redirect anyway since payment succeeded
          navigate('/thank-you');
        } finally {
          setLoading(false);
        }
      },
      onFailed: (data: any) => {
        sendCheckoutProgress(3, 'payment_failed', data);
        alert("Payment failed. Please try again.");
        setLoading(false);
      }
    };

    window.Korapay.initialize(checkoutData);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }

  const steps = [
    { id: 1, title: "Contact", icon: User },
    { id: 2, title: "Shipping", icon: MapPin },
    { id: 3, title: "Payment", icon: CreditCard }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
            <div
              className="absolute top-1/2 left-0 h-1 bg-primary -z-10 rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>

            {steps.map((s) => {
              const isActive = step >= s.id;
              const isCurrent = step === s.id;
              return (
                <div key={s.id} className="flex flex-col items-center bg-background px-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {isActive ? <CheckCircle className="w-5 h-5" /> : s.id}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-primary' : 'text-gray-500'}`}>{s.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <form onSubmit={handleNext} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input required name="name" value={formData.name} onChange={handleInputChange} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none bg-gray-50 focus:bg-white transition-colors" placeholder="e.g. John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none bg-gray-50 focus:bg-white transition-colors" placeholder="e.g. john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none bg-gray-50 focus:bg-white transition-colors" placeholder="e.g. 08012345678" />
                  </div>
                  <div className="pt-4">
                    <Button type="submit" fullWidth size="lg">Continue to Shipping <ChevronRight className="ml-2 w-4 h-4" /></Button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <button type="button" onClick={handleBack} className="p-1 hover:bg-gray-100 rounded-full text-gray-500"><ChevronLeft /></button>
                  <h2 className="text-2xl font-bold">Shipping Address</h2>
                </div>
                <form onSubmit={handleNext} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input required name="address" value={formData.address} onChange={handleInputChange} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none bg-gray-50 focus:bg-white transition-colors" placeholder="e.g. 123 Lagos Way" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <select name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none bg-gray-50 focus:bg-white transition-colors">
                        <option>Lagos</option>
                        <option>Abuja</option>
                        <option>Rivers</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input required name="city" value={formData.city} onChange={handleInputChange} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none bg-gray-50 focus:bg-white transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                    <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none bg-gray-50 focus:bg-white transition-colors" placeholder="Gate code, landmarks, etc." rows={2} />
                  </div>
                  <div className="pt-4">
                    <Button type="submit" fullWidth size="lg">Continue to Payment <ChevronRight className="ml-2 w-4 h-4" /></Button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <button type="button" onClick={handleBack} className="p-1 hover:bg-gray-100 rounded-full text-gray-500"><ChevronLeft /></button>
                  <h2 className="text-2xl font-bold">Review & Pay</h2>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl mb-6">
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-800">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 text-sm border-b pb-4 border-gray-200">
                    <span className="text-gray-600">Delivery Fee ({formData.state})</span>
                    <span className="font-medium text-gray-800">
                      {finalDeliveryFee === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₦${finalDeliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-gray-800 text-lg">Total Amount</span>
                    <span className="text-2xl font-extrabold text-primary">₦{total.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Includes taxes and shipping</p>
                </div>

                <div className="mb-8">
                  <h3 className="font-semibold mb-4">Payment Method</h3>
                  <div className="p-4 border-2 border-primary bg-primary/5 rounded-xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-xs">Kora</div>
                    <div>
                      <p className="font-bold text-sm">Pay with Korapay</p>
                      <p className="text-xs text-gray-500">Cards, Transfer, USSD</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                  </div>
                </div>

                <form onSubmit={handlePayment}>
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    disabled={loading}
                    className="shadow-xl shadow-primary/20"
                  >
                    {loading ? 'Initializing Gateway...' : `Pay Securely ₦${total.toLocaleString()}`}
                  </Button>

                  <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1 mt-4">
                    <Lock className="w-3 h-3" /> Secure 256-bit SSL Encrypted Payment
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Checkout;