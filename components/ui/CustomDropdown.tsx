import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';
import type { DropdownOption, DeliveryZoneGroup } from '../../utils/delivery';

export type { DropdownOption };
export type DropdownGroup = DeliveryZoneGroup;

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  /** Flat list of options. Each item may be a plain string or { value, label }. */
  options?: (string | DropdownOption)[];
  /** Grouped options (mutually exclusive with `options`). Groups are expanded by default. */
  groups?: DropdownGroup[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  onChange,
  options,
  groups,
  placeholder = 'Select…',
  disabled,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  /* normalise flat options */
  const flatOptions: DropdownOption[] = (options ?? []).map(o =>
    typeof o === 'string' ? { value: o, label: o } : o,
  );

  /* close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  /* find label for the currently selected value */
  const selectedLabel = (() => {
    if (groups) {
      for (const g of groups) {
        const found = g.options.find(o => o.value === value);
        if (found) return found.label;
      }
      return null;
    }
    const found = flatOptions.find(o => o.value === value);
    return found?.label ?? null;
  })();

  const toggleGroup = (label: string) =>
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });

  const handleSelect = (val: string) => { onChange(val); setOpen(false); };

  const triggerBase =
    'w-full flex items-center justify-between px-4 py-3 rounded-xl border bg-gray-50 ' +
    'text-sm text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary ' +
    'focus:bg-white focus:border-primary';

  return (
    <div ref={ref} className={`relative ${className ?? ''}`}>
      {/* ── Trigger ── */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(v => !v)}
        className={
          triggerBase +
          (open ? ' border-primary ring-2 ring-primary bg-white' : ' border-gray-200') +
          (disabled ? ' opacity-50 cursor-not-allowed' : ' cursor-pointer hover:border-gray-300')
        }
      >
        <span className={selectedLabel ? 'text-gray-900' : 'text-gray-400'}>
          {selectedLabel ?? placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* ── Panel ── */}
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl max-h-72 overflow-y-auto">
          {groups ? (
            groups.map(group => (
              <div key={group.label}>
                {/* Group header */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wide transition-colors sticky top-0 z-10"
                >
                  {group.label}
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${collapsedGroups.has(group.label) ? '' : 'rotate-90'}`}
                  />
                </button>

                {/* Group options */}
                {!collapsedGroups.has(group.label) &&
                  group.options.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={
                        'w-full flex items-center justify-between px-5 py-2.5 text-sm text-left transition-colors ' +
                        (opt.value === value
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-gray-50 text-gray-700')
                      }
                    >
                      {opt.label}
                      {opt.value === value && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                    </button>
                  ))}
              </div>
            ))
          ) : (
            flatOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={
                  'w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors ' +
                  (opt.value === value
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-gray-50 text-gray-700') +
                  (!opt.value ? ' text-gray-400 italic' : '')
                }
              >
                <span>{opt.label || placeholder}</span>
                {opt.value && opt.value === value && (
                  <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
