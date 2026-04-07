import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { API_BASE } from '../lib/constants';

export interface DistributorFormState {
  fullName: string;
  phone: string;
  email: string;
  state: string;
  businessType: string;
  orderQuantity: string;
  message: string;
}

type FieldErrors = Partial<Record<keyof Omit<DistributorFormState, 'message'>, string>>;
type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

const INITIAL_FORM: DistributorFormState = {
  fullName: '',
  phone: '',
  email: '',
  state: '',
  businessType: '',
  orderQuantity: '',
  message: '',
};

export function useDistributorForm() {
  const SHEETS_URL = import.meta.env.SHEETS_WEBHOOK_URL;
  const [form, setForm] = useState<DistributorFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validatePhone = (phone: string) =>
    /^(\+234|0)[789][01]\d{8}$/.test(phone.replace(/[\s-]/g, ''));

  const validate = (): boolean => {
    const errs: FieldErrors = {};
    if (form.fullName.trim().length < 2) errs.fullName = 'Enter your full name';
    if (!validatePhone(form.phone)) errs.phone = 'Enter a valid Nigerian number (e.g. 08012345678)';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errs.email = 'Enter a valid email address';
    if (!form.state) errs.state = 'Select your state';
    if (!form.businessType) errs.businessType = 'Select a business type';
    if (!form.orderQuantity) errs.orderQuantity = 'Select expected order quantity';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate() || status === 'loading') return;
    setStatus('loading');
    try {
      const gasPayload = {
        source: 'distributor',
        full_name: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        state: form.state,
        business_type: form.businessType,
        order_quantity: form.orderQuantity,
        message: form.message.trim(),
      };

      await Promise.allSettled([
        fetch(SHEETS_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(gasPayload),
        }),
        fetch(`${API_BASE}/api/distributors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: form.fullName.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),
            state: form.state,
            businessType: form.businessType,
            expectedMonthlyOrder: form.orderQuantity,
            message: form.message.trim(),
          }),
        }),
      ]);

      // no-cors responses are always opaque (status 0) — treat any non-thrown fetch as success
      setStatus('success');
      setForm(INITIAL_FORM);
    } catch {
      setStatus('error');
    }
  };

  return { form, errors, status, handleChange, handleSubmit };
}
