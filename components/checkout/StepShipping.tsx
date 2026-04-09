import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../Button';
import { FormInput, FormSelect, FormTextarea } from '../ui/FormFields';
import { STATE_DELIVERY_ZONES } from '../../utils/delivery';
import type { CheckoutFormData } from '../../hooks/useCheckout';

interface Props {
  formData: CheckoutFormData;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
  onSubmit: React.FormEventHandler;
  onBack: () => void;
}

const StepShipping: React.FC<Props> = ({ formData, onChange, onSubmit, onBack }) => (
  <>
    <div className="flex items-center gap-2 mb-6">
      <button
        type="button"
        onClick={onBack}
        className="p-1 hover:bg-gray-100 rounded-full text-gray-500"
      >
        <ChevronLeft />
      </button>
      <h2 className="text-xl sm:text-2xl font-bold">Shipping Address</h2>
    </div>

    <form onSubmit={onSubmit} className="space-y-4">
      <FormInput
        label="Street Address"
        name="address"
        value={formData.address}
        onChange={onChange}
        type="text"
        required
        placeholder="e.g. 123 Lagos Way"
      />

      <div className="grid grid-cols-2 gap-4">
        <FormSelect
          label="State"
          name="state"
          value={formData.state}
          onChange={(v) => onChange({ target: { name: 'state', value: v } } as React.ChangeEvent<HTMLSelectElement>)}
          groups={STATE_DELIVERY_ZONES}
          required
        />
        <FormInput
          label="City"
          name="city"
          value={formData.city}
          onChange={onChange}
          type="text"
          required
        />
      </div>

      <FormTextarea
        label="Additional Notes"
        name="notes"
        value={formData.notes}
        onChange={onChange}
        optional
        placeholder="Gate code, landmarks, etc."
        rows={2}
      />

      <div className="pt-4">
        <Button type="submit" fullWidth size="md">
          Continue to Payment <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </form>
  </>
);

export default StepShipping;
