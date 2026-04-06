import { useState, useMemo } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PACKAGES } from '../lib/constants';
import { calcDeliveryFee } from '../utils/delivery';
import { useModal } from '../context/ModalContext';

declare global {
  interface Window {
    Korapay: any;
  }
}

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  altPhone: string;
  address: string;
  notes: string;
  city: string;
  state: string;
}

const INITIAL_FORM: CheckoutFormData = {
  name: '',
  email: '',
  phone: '',
  altPhone: '',
  address: '',
  notes: '',
  city: '',
  state: 'Lagos',
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/;
  if (!emailRegex.test(email)) return false;
  const [local, domain] = email.split('@');
  if (local.length < 3 || domain.length < 4 || !domain.includes('.')) return false;
  if (/(\w)\1{4,}/.test(local)) return false;
  return true;
};

const validatePhone = (phone: string): boolean => {
  const clean = phone.replace(/[\s-]/g, '');
  return /^(\+234|0)[789][01]\d{8}$/.test(clean);
};

export function useCheckout() {
  const { cart, paymentMethod, setPaymentMethod } = useApp();
  const navigate = useNavigate();
  const { showAlert } = useModal();

  const [formData, setFormData] = useState<CheckoutFormData>(INITIAL_FORM);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [reference] = useState(`PR-${Date.now()}-${Math.floor(Math.random() * 1000)}`);

  const subtotal = useMemo(
    () =>
      cart.reduce((acc, item) => {
        const pkg = PACKAGES.find(p => p.id === item.packageId);
        return acc + (pkg ? pkg.price * item.quantity : 0);
      }, 0),
    [cart],
  );

  const totalPacks = useMemo(
    () =>
      cart.reduce((acc, item) => {
        const pkg = PACKAGES.find(p => p.id === item.packageId);
        return acc + (pkg ? pkg.containers * item.quantity : 0);
      }, 0),
    [cart],
  );

  const finalDeliveryFee = useMemo(
    () => calcDeliveryFee(formData.state, `${formData.address} ${formData.city}`, totalPacks),
    [formData.state, formData.address, formData.city, totalPacks],
  );

  const total = subtotal + finalDeliveryFee;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const buildOrderSummary = () =>
    cart
      .map(item => {
        const pkg = PACKAGES.find(p => p.id === item.packageId);
        return `${item.quantity}x ${pkg?.name} (₦${pkg?.price.toLocaleString()})`;
      })
      .join(', ');

  const sendCheckoutProgress = (checkoutStep: number, status: string, paymentData?: any) => {
    const SHEETS_URL = import.meta.env.VITE_SHEETS_WEBHOOK_URL;

    fetch(SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        source: 'order',
        name: formData.name.trim() || '',
        email: formData.email.trim().toLowerCase() || '',
        phone: formData.phone.trim() || '',
        alt_phone: formData.altPhone.trim() || '',
        shipping_address: formData.address.trim()
          ? `${formData.address.trim()}, ${formData.city.trim()}, ${formData.state}`
          : '',
        notes: formData.notes.trim(),
        items_ordered: buildOrderSummary(),
        delivery_fee: finalDeliveryFee,
        total_amount: total,
        payment_method: 'Online (Korapay)',
        payment_reference: paymentData?.reference || reference,
        payment_status: checkoutStep === 4 ? (paymentData?.status || status) : '',
        checkout_step: status,
      }),
    }).catch(err => console.error('Checkout progress error:', err));
  };

  const handleNext = (e: FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      const name = formData.name.trim();
      const nameParts = name.split(/\s+/);
      const nameRegex = /^[a-zA-Z\s.-]+$/;

      if (nameParts.length < 2 || nameParts.some(p => p.length < 2) || !nameRegex.test(name)) {
        showAlert({ title: 'Invalid name', message: 'Please enter a valid full name (e.g., John Doe). No numbers or symbols allowed.' });
        return;
      }
      if (!validateEmail(formData.email)) {
        showAlert({ title: 'Invalid email', message: 'Please enter a valid email address.' });
        return;
      }
      if (!validatePhone(formData.phone) || formData.phone.trim().length < 10) {
        showAlert({ title: 'Invalid phone number', message: 'Please enter a valid 10-15 digit phone number.' });
        return;
      }

      // Capture contact info immediately for abandoned cart recovery
      sendCheckoutProgress(1, 'contact_info_entered');
    }

    if (step === 2) {
      if (formData.address.trim().length < 10) {
        showAlert({ title: 'Incomplete address', message: 'Please enter a more detailed delivery address (street, house number, etc).' });
        return;
      }
      if (formData.city.trim().length < 3) {
        showAlert({ title: 'City required', message: 'Please enter a valid city or local government area.' });
        return;
      }
    }

    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handlePayment = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!window.Korapay) {
      showAlert({ title: 'Payment loading', message: 'Payment gateway is loading. Please try again in a moment.' });
      setLoading(false);
      return;
    }

    window.Korapay.initialize({
      key: import.meta.env.VITE_KORAPAY_PUBLIC_KEY,
      amount: total,
      currency: 'NGN',
      reference,
      customer: {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
      },
      notification_url: '',
      onClose: () => {
        sendCheckoutProgress(4, 'payment_abandoned');
        setLoading(false);
      },
      onSuccess: async (data: any) => {
        try {
          const orderSummary = cart
            .map(item => {
              const pkg = PACKAGES.find(p => p.id === item.packageId);
              return `${item.quantity}x ${pkg?.name} (₦${pkg?.price.toLocaleString()})`;
            })
            .join(', ');

          await fetch('https://formsubmit.co/ajax/sales@holisbotanicals.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              _subject: 'New Prostanone Order Confirmed',
              customer_name: formData.name.trim(),
              customer_email: formData.email.trim().toLowerCase(),
              customer_phone: formData.phone.trim(),
              shipping_address: `${formData.address.trim()}, ${formData.city.trim()}, ${formData.state}`,
              notes: formData.notes.trim(),
              order_summary: orderSummary,
              subtotal_amount: `₦${subtotal.toLocaleString()}`,
              delivery_fee: `₦${finalDeliveryFee.toLocaleString()}`,
              total_amount: `₦${total.toLocaleString()}`,
              _cc: formData.email.trim().toLowerCase(),
              _template: 'table',
            }),
          });

          sendCheckoutProgress(4, 'payment_completed', data);

          // Log the confirmed order to the backend
          fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.name.trim(),
              email: formData.email.trim().toLowerCase(),
              phone: formData.phone.trim(),
              altPhone: formData.altPhone.trim(),
              shippingAddress: `${formData.address.trim()}, ${formData.city.trim()}, ${formData.state}`,
              notes: formData.notes.trim(),
              itemsOrdered: orderSummary,
              deliveryFee: finalDeliveryFee,
              totalAmount: total,
              paymentMethod: 'Online (Korapay)',
              paymentReference: data?.reference || reference,
              paymentStatus: data?.status || 'success',
              checkoutStep: 'payment_completed',
            }),
          }).catch(err => console.error('Order log error:', err));

          navigate('/thank-you', { state: { paymentMethod: 'online' } });
        } catch (error) {
          console.error('Post-payment error:', error);
          navigate('/thank-you', { state: { paymentMethod: 'online' } });
        } finally {
          setLoading(false);
        }
      },
      onFailed: (data: any) => {
        sendCheckoutProgress(4, 'payment_failed', data);
        showAlert({ title: 'Payment failed', message: 'Payment failed. Please try again.' });
        setLoading(false);
      },
    });
  };

  const handleCODSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const SHEETS_URL = import.meta.env.VITE_SHEETS_WEBHOOK_URL;
    const shippingAddress = `${formData.address.trim()}, ${formData.city.trim()}, ${formData.state}`;

    Promise.allSettled([
      fetch(SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          source: 'order',
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          alt_phone: formData.altPhone.trim(),
          shipping_address: shippingAddress,
          notes: formData.notes.trim(),
          items_ordered: buildOrderSummary(),
          delivery_fee: finalDeliveryFee,
          total_amount: total,
          payment_method: 'Cash on Delivery (COD)',
          checkout_step: 'cod_order_placed',
        }),
      }),
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          altPhone: formData.altPhone.trim(),
          shippingAddress,
          notes: formData.notes.trim(),
          itemsOrdered: buildOrderSummary(),
          deliveryFee: finalDeliveryFee,
          totalAmount: total,
          paymentMethod: 'Cash on Delivery (COD)',
          checkoutStep: 'cod_order_placed',
        }),
      }),
    ]).catch(err => console.error('COD order error:', err));

    navigate('/thank-you', { state: { paymentMethod: 'cod', phone: formData.phone.trim() } });
  };

  return {
    // state
    cart,
    formData,
    step,
    setStep,
    loading,
    paymentMethod,
    setPaymentMethod,
    // computed
    subtotal,
    finalDeliveryFee,
    total,
    // handlers
    handleInputChange,
    handleNext,
    handleBack,
    handlePayment,
    handleCODSubmit,
  };
}
