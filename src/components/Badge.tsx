import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  /** Tailwind classes for bg/text/border. */
  className?: string;
  /** Optional dot color class (e.g. "text-emerald-500"). Omit to hide the dot. */
  dotClassName?: string;
  size?: BadgeSize;
  children: ReactNode;
}

/**
 * Low-level pill. Not used directly in most screens — prefer StatusBadge /
 * RiskBadge which inject the correct semantic colors. Exposed so one-off
 * labels share the exact same shape.
 */
export function Badge({ className, dotClassName, size = 'md', children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border rounded-full whitespace-nowrap',
        size === 'sm' ? 'h-5 px-2 text-[11px] gap-1' : 'h-6 px-2.5 text-xs gap-1.5',
        className,
      )}
    >
      {dotClassName && (
        <span
          className={cn(
            'inline-block rounded-full bg-current',
            size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2',
            dotClassName,
          )}
        />
      )}
      {children}
    </span>
  );
}
