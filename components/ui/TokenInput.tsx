import React, { useRef, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface TokenInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string | null;
  autoFocus?: boolean;
}

const TokenInput: React.FC<TokenInputProps> = ({
  value,
  onChange,
  disabled = false,
  error,
  autoFocus = true,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleInput = (index: number, digit: string) => {
    // Only allow digits
    if (!/^\d*$/.test(digit)) return;

    const newValue = value.split('');
    newValue[index] = digit;
    const joined = newValue.join('').slice(0, 6);

    onChange(joined);

    // Auto-focus next field
    if (digit && index < 5) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newValue = value.split('');
      newValue[index] = '';
      onChange(newValue.join('').slice(0, 6));

      // Auto-focus previous field on backspace
      if (index > 0) {
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
        }
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 justify-center">
        {Array.from({ length: 6 }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              if (el) {
                inputRefs.current[index] = el;
              }
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleInput(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={disabled}
            className={`max-w-9 sm:max-w-14 h-12 sm:h-14 text-center text-base sm:text-2xl font-bold rounded-lg border-2 transition-all ${
              error
                ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20'
                : 'border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary'
            } disabled:opacity-50 disabled:cursor-not-allowed font-mono`}
            placeholder="•"
          />
        ))}
      </div>

      {error && (
        <div className="flex gap-2 text-xs sm:text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default TokenInput;