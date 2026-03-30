import React from 'react';
import { ChevronRight } from 'lucide-react';
import Button from '../Button';
import { FormInput } from '../ui/FormFields';
import type { CheckoutFormData } from '../../hooks/useCheckout';

interface Props {
  formData: CheckoutFormData;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
  onSubmit: React.FormEventHandler;
}

const StepContact: React.FC<Props> = ({ formData, onChange, onSubmit }) => (
  <>
    <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
    <form onSubmit={onSubmit} className="space-y-4">
      <FormInput
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={onChange}
        type="text"
        required
        placeholder="e.g. John Doe"
      />
      <FormInput
        label="Email Address"
        name="email"
        value={formData.email}
        onChange={onChange}
        type="email"
        required
        placeholder="e.g. john@example.com"
      />
      <FormInput
        label="Phone Number"
        name="phone"
        value={formData.phone}
        onChange={onChange}
        type="tel"
        required
        placeholder="e.g. 08012345678"
      />
      <FormInput
        label="Alt / WhatsApp Number"
        name="altPhone"
        value={formData.altPhone}
        onChange={onChange}
        type="tel"
        optional
        placeholder="Optional"
      />
      <div className="pt-4">
        <Button type="submit" fullWidth size="lg">
          Continue to Shipping <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </form>
  </>
);

export default StepContact;
