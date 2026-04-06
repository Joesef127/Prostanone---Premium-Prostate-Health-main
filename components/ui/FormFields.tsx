import React from 'react';
import CustomDropdown from './CustomDropdown';
import type { DropdownOption, DropdownGroup } from './CustomDropdown';

const INPUT_BASE =
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white focus:border-primary transition-colors';

/* ─── FormLabel ──────────────────────────────────────────────────── */
interface FormLabelProps {
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}

export const FormLabel: React.FC<FormLabelProps> = ({ htmlFor, required, optional, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
    {required && <span className="text-red-500"> *</span>}
    {optional && <span className="text-gray-400 font-normal"> (optional)</span>}
  </label>
);

/* ─── FormInput ──────────────────────────────────────────────────── */
export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  optional?: boolean;
  wrapperClassName?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  optional,
  wrapperClassName,
  id,
  name,
  required,
  className,
  ...rest
}) => {
  const fieldId = id ?? name;
  return (
    <div className={wrapperClassName}>
      <FormLabel htmlFor={fieldId} required={required} optional={optional}>
        {label}
      </FormLabel>
      <input
        id={fieldId}
        name={name}
        required={required}
        className={`${INPUT_BASE} ${className ?? ''}`}
        {...rest}
      />
    </div>
  );
};

/* ─── FormSelect ─────────────────────────────────────────────────── */
export interface FormSelectProps {
  label: string;
  name?: string;
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  /** Flat list — each item may be a plain string or { value, label }. */
  options?: (string | DropdownOption)[];
  /** Grouped list (mutually exclusive with `options`). */
  groups?: DropdownGroup[];
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  wrapperClassName?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  id,
  value = '',
  onChange,
  options,
  groups,
  placeholder,
  required,
  optional,
  wrapperClassName,
}) => {
  const fieldId = id ?? name;
  return (
    <div className={wrapperClassName}>
      <FormLabel htmlFor={fieldId} required={required} optional={optional}>
        {label}
      </FormLabel>
      <CustomDropdown
        value={value}
        onChange={onChange ?? (() => {})}
        options={options}
        groups={groups}
        placeholder={placeholder ?? 'Select…'}
      />
    </div>
  );
};

/* ─── FormTextarea ───────────────────────────────────────────────── */
export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  optional?: boolean;
  wrapperClassName?: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  optional,
  wrapperClassName,
  id,
  name,
  className,
  ...rest
}) => {
  const fieldId = id ?? name;
  return (
    <div className={wrapperClassName}>
      <FormLabel htmlFor={fieldId} optional={optional}>
        {label}
      </FormLabel>
      <textarea
        id={fieldId}
        name={name}
        className={`${INPUT_BASE} resize-none ${className ?? ''}`}
        {...rest}
      />
    </div>
  );
};
