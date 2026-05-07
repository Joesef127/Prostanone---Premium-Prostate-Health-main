import React, { useState } from 'react';
import { Phone, AlertCircle } from 'lucide-react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
}

const E164_RE = /^\+[1-9]\d{7,14}$/;

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  error,
  disabled = false,
  placeholder = '+234 801 234 5678',
  required = false,
}) => {
  const [touched, setTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    // Allow only digits and + sign
    input = input.replace(/[^\d+]/g, '');

    // Limit to max length (E.164: +[1-9] + up to 14 digits = 16 chars)
    if (input.length > 15) {
      input = input.slice(0, 15);
    }

    onChange(input);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const isValid = value ? E164_RE.test(value) : !required;
  const showError = touched && error;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text">
        Phone Number
        {required && <span className="text-red-500"> *</span>}
      </label>

      <div className="relative">
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="tel"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all ${
            showError
              ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200'
              : 'border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary'
          } placeholder:text-text-muted disabled:opacity-50 disabled:cursor-not-allowed text-sm`}
        />
      </div>

      {showError && (
        <div className="flex gap-2 text-xs sm:text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {value && !showError && !isValid && touched && (
        <div className="flex gap-2 text-xs sm:text-sm text-amber-600 dark:text-amber-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Phone number must be in E.164 format (e.g., +2348012345678)</span>
        </div>
      )}

      <p className="text-xs text-text-muted">
        Format: +[country code][number] (e.g., +234 for Nigeria)
      </p>
    </div>
  );
};

export default PhoneInput;