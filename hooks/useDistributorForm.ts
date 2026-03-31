import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

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

const FORMSUBMIT_EMAIL = 'sales@holisbotanicals.com';

export function useDistributorForm() {
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
      const firstName = form.fullName.trim().split(' ')[0];
      const res = await fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: 'New Distributor Application — Prostanone',
          _autoresponse: `Dear ${firstName}, thank you for applying to become a Prostanone distributor. Our team will review your application and reach out within 2–3 business days. — Holis Botanical Gardens`,
          _template: 'table',
          'Full Name': form.fullName.trim(),
          'Phone Number': form.phone.trim(),
          'Email Address': form.email.trim(),
          'State / Location': form.state,
          'Business Type': form.businessType,
          'Expected Monthly Order': form.orderQuantity,
          'Additional Message': form.message.trim() || '—',
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setStatus('success');
      setForm(INITIAL_FORM);
    } catch {
      setStatus('error');
    }
  };

  return { form, errors, status, handleChange, handleSubmit };
}
