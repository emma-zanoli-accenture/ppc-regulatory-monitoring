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
 * Low-level status tag — a crisp small-radius rectangle (not a pill). Prefer
 * StatusBadge / RiskBadge / Tag which inject the correct muted semantic colors.
 */
export function Badge({ className, dotClassName, size = 'md', children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border font-medium whitespace-nowrap',
        size === 'sm' ? 'h-[18px] px-1.5 text-[11px] gap-1' : 'h-6 px-2 text-xs gap-1.5',
        className,
      )}
    >
      {dotClassName && (
        <span
          className={cn(
            'inline-block rounded-full bg-current',
            size === 'sm' ? 'h-1.5 w-1.5' : 'h-[7px] w-[7px]',
            dotClassName,
          )}
        />
      )}
      {children}
    </span>
  );
}
