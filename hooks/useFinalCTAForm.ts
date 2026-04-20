import { useState, useMemo } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { PACKAGES, API_BASE } from '../lib/constants.ts';
import { calcDeliveryFee } from '../utils/delivery';
import { useApp } from '../context/AppContext';
import { useModal } from '../context/ModalContext';

declare global {
  interface Window {
    Korapay: any;
  }
}

export interface FormState {
  firstName: string;
  lastName: string;
  phone: string;
  altPhone: string;
  email: string;
  packageId: string;
  state: string;
  address: string;
}

const defaultPackageId = PACKAGES.find(p => p.badge === 'RECOMMENDED')?.id ?? PACKAGES[0].id;

export const INITIAL_FORM: FormState = {
  firstName: '',
  lastName: '',
  phone: '',
  altPhone: '',
  email: '',
  packageId: defaultPackageId,
  state: 'Lagos',
  address: '',
};

const INPUT_BASE =
  'w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors';

export function useFinalCTAForm() {
  const navigate = useNavigate();
  const { paymentMethod, setPaymentMethod, gatewayChoice, setGatewayChoice } = useApp();
  const { showAlert } = useModal();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [reference] = useState(() => `PR-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const selectedPkg = PACKAGES.find(p => p.id === form.packageId) ?? PACKAGES[0];

  const deliveryFee = useMemo(
    () => calcDeliveryFee(form.state, form.address, selectedPkg.containers),
    [form.state, form.address, selectedPkg.containers],
  );
  const total = selectedPkg.price + deliveryFee;

  const inputClass = (field: keyof FormState) =>
    fieldErrors[field]
      ? `${INPUT_BASE} border-red-400 bg-red-50 focus:ring-red-200`
      : `${INPUT_BASE} border-gray-200 bg-gray-50 focus:bg-white focus:ring-primary/30 focus:border-primary`;

  const deliveryLabel =
    deliveryFee === 0
      ? 'FREE delivery in your area!'
      : `Delivery fee: ₦${deliveryFee.toLocaleString()} (2–5 working days)`;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validatePhone = (phone: string) =>
    /^(\+234|0)[789][01]\d{8}$/.test(phone.replace(/[\s-]/g, ''));

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (form.firstName.trim().length < 2) errs.firstName = 'Enter your first name';
    if (form.lastName.trim().length < 2) errs.lastName = 'Enter your last name';
    if (!validatePhone(form.phone)) errs.phone = 'Enter a valid Nigerian number (e.g. 08012345678)';
    if (form.address.trim().length < 10) errs.address = 'Enter a more detailed delivery address';
    setFieldErrors(errs);
    if (!paymentMethod) {
      showAlert({ title: 'Payment method required', message: 'Please select a payment method before placing your order.' });
      return false;
    }
    if (paymentMethod === 'online' && !gatewayChoice) {
      showAlert({ title: 'Payment gateway required', message: 'Please select a payment gateway to continue.' });
      return false;
    }
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate() || loading) return;
    setLoading(true);

    const SHEETS_URL = import.meta.env.VITE_SHEETS_WEBHOOK_URL;
    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`;
    const _now = new Date();
    const _ddmm = `${String(_now.getDate()).padStart(2, '0')}${String(_now.getMonth() + 1).padStart(2, '0')}`;
    const orderId = `CTA-${_ddmm}-${crypto.randomUUID()}`;
    const shippingAddress = `${form.address.trim()}, ${form.state}`;
    const itemsOrdered = `1x ${selectedPkg.name} (₦${selectedPkg.price.toLocaleString()})`;

    if (paymentMethod === 'online') {
      const checkoutStep = gatewayChoice === 'payaza' ? 'payaza_payment_initiated' : 'korapay_payment_initiated';

      // Fire-and-forget order log before payment redirect/modal
      fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          name: fullName,
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          altPhone: form.altPhone.trim(),
          shippingAddress,
          itemsOrdered,
          deliveryFee,
          totalAmount: total,
          paymentMethod: `Online (${gatewayChoice === 'payaza' ? 'Payaza' : 'KoraPay'})`,
          paymentReference: reference,
          paymentStatus: 'initiated',
          checkoutStep,
        }),
      }).catch(err => console.error('[useFinalCTAForm] Failed to log initiated order:', err));

      if (gatewayChoice === 'payaza') {
        const [firstName, ...rest] = fullName.split(' ');
        const lastName = rest.join(' ') || firstName;
        const redirectUrl = `${window.location.origin}/thank-you?paymentMethod=online&reference=${encodeURIComponent(reference)}`;

        const payazaUrl =
          `https://business.payaza.africa/payment-page` +
          `?merchant_key=${encodeURIComponent(import.meta.env.VITE_PAYAZA_PUBLIC_KEY)}` +
          `&connection_mode=Live` +
          `&checkout_amount=${encodeURIComponent(total)}` +
          `&currency_code=NGN` +
          `&email_address=${encodeURIComponent(form.email.trim().toLowerCase() || 'noreply@holisbotanicals.com')}` +
          `&first_name=${encodeURIComponent(firstName)}` +
          `&last_name=${encodeURIComponent(lastName)}` +
          `&phone_number=${encodeURIComponent(form.phone.trim())}` +
          `&transaction_reference=${encodeURIComponent(reference)}` +
          `&redirect_url=${encodeURIComponent(redirectUrl)}`;

        window.location.href = payazaUrl;
        return;
      }

      if (!window.Korapay) {
        showAlert({ title: 'Payment loading', message: 'Payment gateway is loading. Please try again in a moment.' });
        setLoading(false);
        return;
      }
      const korapayPublicKey = import.meta.env.VITE_KORAPAY_PUBLIC_KEY;
      if (!korapayPublicKey) {
        showAlert({ title: 'Payment unavailable', message: 'Online payment is temporarily unavailable. Please try again later.' });
        setLoading(false);
        return;
      }
      window.Korapay.initialize({
          email: form.email.trim().toLowerCase() || 'noreply@holisbotanicals.com',
        amount: total,
        currency: 'NGN',
        reference,
        customer: {
          name: fullName,
          email: form.email.trim().toLowerCase() || 'noreply@holisbotanicals.com',
        },
        onClose: () => setLoading(false),
        onSuccess: (data: any) => {
          const successRequests: Promise<unknown>[] = [
            fetch(`${API_BASE}/api/orders`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId,
                name: fullName,
                email: form.email.trim().toLowerCase() || 'noreply@holisbotanicals.com',
                phone: form.phone.trim(),
                altPhone: form.altPhone.trim(),
                shippingAddress,
                itemsOrdered,
                deliveryFee,
                totalAmount: total,
                paymentMethod: 'Online (KoraPay)',
                paymentReference: data?.reference || reference,
                paymentStatus: data?.status || 'success',
                checkoutStep: 'payment_completed',
              }),
            }),
          ];
          if (SHEETS_URL) {
            successRequests.push(
              fetch(SHEETS_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({
                  source: 'order',
                  order_id: orderId,
                  name: fullName,
                  email: form.email.trim().toLowerCase(),
                  phone: form.phone.trim(),
                  alt_phone: form.altPhone.trim(),
                  shipping_address: shippingAddress,
                  items_ordered: itemsOrdered,
                  delivery_fee: deliveryFee,
                  total_amount: total,
                  payment_method: 'Online (KoraPay)',
                  checkout_step: 'payment_completed',
                }),
              }),
            );
          }
          Promise.allSettled(successRequests).catch(err => console.error('[useFinalCTAForm] Failed to log completed order:', err));
          navigate('/thank-you', { state: { paymentMethod: 'online' } });
        },
        onFailed: (_data: unknown) => {
          showAlert({ title: 'Payment failed', message: 'Payment failed. Please try again.' });
          setLoading(false);
        },
      });
      return;
    }

    // COD — fire-and-forget both backend and Sheet, navigate immediately
    const requests: Promise<unknown>[] = [
      fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          name: fullName,
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          altPhone: form.altPhone.trim(),
          shippingAddress,
          itemsOrdered,
          deliveryFee,
          totalAmount: total,
          paymentMethod: 'Cash on Delivery (COD)',
          checkoutStep: 'cod_order_placed',
        }),
      }),
    ];

    if (SHEETS_URL) {
      requests.push(
        fetch(SHEETS_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            source: 'order',
            order_id: orderId,
            name: fullName,
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
            alt_phone: form.altPhone.trim(),
            shipping_address: shippingAddress,
            items_ordered: itemsOrdered,
            delivery_fee: deliveryFee,
            total_amount: total,
            payment_method: 'Cash on Delivery (COD)',
            checkout_step: 'cod_order_placed',
          }),
        }),
      );
    }

    Promise.allSettled(requests).catch(err => console.error('COD order error:', err));

    navigate('/thank-you', { state: { paymentMethod: 'cod', phone: form.phone.trim() } });
  };

  return {
    form,
    fieldErrors,
    loading,
    paymentMethod,
    setPaymentMethod,
    gatewayChoice,
    setGatewayChoice,
    selectedPkg,
    deliveryFee,
    total,
    deliveryLabel,
    handleChange,
    handleSubmit,
    inputClass,
  };
}
