import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PACKAGES } from '../lib/constants.ts';
import { calcDeliveryFee, NIGERIAN_STATES } from '../utils/delivery';
import Button from '../components/Button';
import { Lock, CheckCircle, MapPin, User, CreditCard, ChevronRight, ChevronLeft, Truck, ShieldCheck, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  interface Window {
    Korapay: any;
  }
}

const Checkout: React.FC = () => {
  const { cart, paymentMethod, setPaymentMethod } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    altPhone: '',
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
  // Total packs in cart (used for weight-based delivery pricing)
  const totalPacks = cart.reduce((acc, item) => {
    const pkg = PACKAGES.find(p => p.id === item.packageId);
    return acc + (pkg ? pkg.containers * item.quantity : 0);
  }, 0);

  const finalDeliveryFee = calcDeliveryFee(
    formData.state,
    `${formData.address} ${formData.city}`,
    totalPacks,
  );
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
        payment_status: checkoutStep === 4 ? (paymentData?.status || status) : '',
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
        sendCheckoutProgress(4, 'payment_abandoned');
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
          sendCheckoutProgress(4, 'payment_completed', data);

          navigate('/thank-you', { state: { paymentMethod: 'online' } });
        } catch (error) {
          console.error("Post-payment error:", error);
          // Redirect anyway since payment succeeded
          navigate('/thank-you', { state: { paymentMethod: 'online' } });
        } finally {
          setLoading(false);
        }
      },
      onFailed: (data: any) => {
        sendCheckoutProgress(4, 'payment_failed', data);
        alert("Payment failed. Please try again.");
        setLoading(false);
      }
    };

    window.Korapay.initialize(checkoutData);
  };

  const handleCODSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const WEBHOOK_URL = import.meta.env.VITE_ORDERS_WEBHOOK_URL || 'https://n8n.metrohyp.com/webhook/prostanone-orders';
    const orderSummary = cart.map(item => {
      const pkg = PACKAGES.find(p => p.id === item.packageId);
      return `${item.quantity}x ${pkg?.name} (₦${pkg?.price.toLocaleString()})`;
    }).join(', ');
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          alt_phone: formData.altPhone.trim(),
          shipping_address: `${formData.address.trim()}, ${formData.city.trim()}, ${formData.state}`,
          items_ordered: orderSummary,
          delivery_fee: finalDeliveryFee,
          total_amount: total,
          payment_method: 'Cash on Delivery (COD)',
          checkout_step: 'cod_order_placed',
          date: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().replace('Z', '+01:00'),
        }),
      });
      navigate('/thank-you', { state: { paymentMethod: 'cod', phone: formData.phone.trim() } });
    } catch {
      alert('Order submission failed. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
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
    { id: 3, title: "Method", icon: Truck },
    { id: 4, title: "Review", icon: CreditCard },
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
              style={{ width: `${((step - 1) / 3) * 100}%` }}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alt / WhatsApp Number <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input name="altPhone" value={formData.altPhone} onChange={handleInputChange} type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none bg-gray-50 focus:bg-white transition-colors" placeholder="Optional" />
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
                        {NIGERIAN_STATES.map(s => <option key={s}>{s}</option>)}
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
                  <h2 className="text-2xl font-bold">Select Payment Method</h2>
                </div>

                <p className="text-gray-500 text-sm mb-6">Choose how you'd like to pay for your order.</p>

                <div className="space-y-4 mb-8">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('online')}
                    className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all text-left ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0">Kora</div>
                    <div>
                      <p className="font-bold text-sm">Pay Online</p>
                      <p className="text-xs text-gray-500">Card, Bank Transfer, USSD — instant confirmation</p>
                    </div>
                    {paymentMethod === 'online' && <CheckCircle className="w-5 h-5 text-primary ml-auto shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all text-left ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white shrink-0">
                      <Truck size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Pay on Delivery</p>
                      <p className="text-xs text-gray-500">Pay cash when your order arrives at your door</p>
                    </div>
                    {paymentMethod === 'cod' && <CheckCircle className="w-5 h-5 text-primary ml-auto shrink-0" />}
                  </button>
                </div>

                <Button
                  type="button"
                  fullWidth
                  size="lg"
                  disabled={!paymentMethod}
                  onClick={() => {
                    if (!paymentMethod) return;
                    sendCheckoutProgress(3, `payment_method_selected_${paymentMethod}`);
                    setStep(4);
                    window.scrollTo(0, 0);
                  }}
                >
                  Continue <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {step === 4 && paymentMethod === 'online' && (
              <motion.div
                key="step4-online"
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
                  <h3 className="font-semibold mb-4">Payment via Korapay</h3>
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

            {step === 4 && paymentMethod === 'cod' && (
              <motion.div
                key="step4-cod"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <button type="button" onClick={handleBack} className="p-1 hover:bg-gray-100 rounded-full text-gray-500"><ChevronLeft /></button>
                  <h2 className="text-2xl font-bold">Confirm Your Order</h2>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-5 flex gap-4 items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <Truck size={22} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-green-800 mb-1">Pay on Delivery Selected</p>
                    <p className="text-sm text-green-700 leading-relaxed">
                      Once you confirm, our team will call you on <strong>{formData.phone}</strong> to
                      discuss delivery details and arrange a convenient delivery time.
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={16} className="text-amber-600" />
                    <p className="font-semibold text-amber-800 text-sm">Delivery Terms & Conditions</p>
                  </div>
                  <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside leading-relaxed">
                    <li>Our team will call you within 24 hours to confirm your order.</li>
                    <li>Please ensure you are available to receive delivery and make full payment.</li>
                    <li>Only place an order if you are ready and able to pay on delivery.</li>
                    <li>Delivery timelines vary by state; our team will provide an accurate estimate.</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl mb-6">
                  <h3 className="font-semibold text-sm mb-3 text-gray-700">Order Summary</h3>
                  {cart.map(item => {
                    const pkg = PACKAGES.find(p => p.id === item.packageId);
                    return pkg ? (
                      <div key={item.packageId} className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{item.quantity}× {pkg.name}</span>
                        <span className="font-medium">₦{(pkg.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ) : null;
                  })}
                  <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
                    <span className="text-gray-600 text-sm">Delivery ({formData.state})</span>
                    <span className="text-sm font-medium">
                      {finalDeliveryFee === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₦${finalDeliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-extrabold text-primary text-lg">₦{total.toLocaleString()}</span>
                  </div>
                </div>

                <form onSubmit={handleCODSubmit}>
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    disabled={loading}
                    className="shadow-xl shadow-primary/20"
                  >
                    {loading ? 'Submitting Order...' : 'Confirm Order — Pay on Delivery'}
                  </Button>
                  <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                    <Phone size={11} /> We'll call you to confirm delivery
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