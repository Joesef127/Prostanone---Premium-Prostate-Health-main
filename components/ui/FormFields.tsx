import React from 'react';

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
export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  wrapperClassName?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  wrapperClassName,
  id,
  name,
  className,
  ...rest
}) => {
  const fieldId = id ?? name;
  return (
    <div className={wrapperClassName}>
      <FormLabel htmlFor={fieldId}>{label}</FormLabel>
      <select
        id={fieldId}
        name={name}
        className={`${INPUT_BASE} ${className ?? ''}`}
        {...rest}
      >
        {options.map(opt => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
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
