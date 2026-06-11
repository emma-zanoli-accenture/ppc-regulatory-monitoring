import type { ReactNode } from 'react';
import { Badge } from './Badge';
import type { BadgeSize } from './Badge';

export type TagTone =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'brand'
  | 'accent';

// Muted, restrained tones (kept in step with the workflow tone tokens).
const TONE_STYLES: Record<TagTone, { badge: string; dot: string }> = {
  neutral: { badge: 'bg-slate-100 text-slate-600 border-slate-300/70', dot: 'text-slate-400' },
  info: { badge: 'bg-brand-50 text-brand-700 border-brand-200', dot: 'text-brand-500' },
  success: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'text-emerald-600' },
  warning: { badge: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'text-amber-500' },
  danger: { badge: 'bg-red-50 text-red-700 border-red-200', dot: 'text-red-500' },
  brand: { badge: 'bg-brand-50 text-brand-700 border-brand-200', dot: 'text-brand-500' },
  accent: { badge: 'bg-accent-50 text-accent-700 border-accent-200', dot: 'text-accent-600' },
};

export interface TagProps {
  tone?: TagTone;
  size?: BadgeSize;
  withDot?: boolean;
  children: ReactNode;
}

/** Semantic pill for summary statuses (communication / implementation / audit, etc.). */
export function Tag({ tone = 'neutral', size = 'md', withDot = false, children }: TagProps) {
  const style = TONE_STYLES[tone];
  return (
    <Badge size={size} className={style.badge} dotClassName={withDot ? style.dot : undefined}>
      {children}
    </Badge>
  );
}
