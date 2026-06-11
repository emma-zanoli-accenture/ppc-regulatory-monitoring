import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  /** Small label rendered above the control. */
  label?: string;
  className?: string;
  'aria-label'?: string;
}

/** Lightweight styled native select — robust for demo filter bars. */
export function Select({
  value,
  onChange,
  options,
  label,
  className,
  'aria-label': ariaLabel,
}: SelectProps) {
  return (
    <label className={cn('block', className)}>
      {label && (
        <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
      )}
      <div className="relative">
        <select
          aria-label={ariaLabel ?? label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'h-9 w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-9 text-sm font-medium text-slate-700',
            'shadow-sm transition-colors hover:border-slate-400',
            'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30',
          )}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </label>
  );
}
