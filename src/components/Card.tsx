import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../lib/cn';

export interface CardProps {
  className?: string;
  children: ReactNode;
  /** Lift slightly on hover (for clickable cards). */
  interactive?: boolean;
}

/** Flat surface defined by a hairline border — no resting shadow. */
export function Card({ className, children, interactive }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-md border border-slate-200 bg-white',
        interactive &&
          'cursor-pointer transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50/40',
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface SectionCardProps {
  title?: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  /** Right-aligned header content (buttons, filters, badges). */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Remove body padding (e.g. when embedding a full-bleed DataTable). */
  flushBody?: boolean;
  /** Tone of the icon chip. */
  iconTone?: 'brand' | 'accent' | 'neutral';
}

const ICON_TONE = {
  brand: 'bg-brand-50 text-brand-700',
  accent: 'bg-accent-50 text-accent-700',
  neutral: 'bg-slate-100 text-slate-600',
} as const;

/** Card with a titled header row (icon + title + description on the left, actions right). */
export function SectionCard({
  title,
  description,
  icon: Icon,
  actions,
  children,
  className,
  flushBody = false,
  iconTone = 'brand',
}: SectionCardProps) {
  const hasHeader = title || description || actions || Icon;
  return (
    <Card className={cn('overflow-hidden', className)}>
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            {Icon && (
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded border',
                  iconTone === 'brand' && 'border-brand-200/70',
                  iconTone === 'accent' && 'border-accent-200/70',
                  iconTone === 'neutral' && 'border-slate-200',
                  ICON_TONE[iconTone],
                )}
              >
                <Icon size={15} />
              </span>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="truncate text-sm font-semibold tracking-tight text-slate-900">
                  {title}
                </h3>
              )}
              {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
            </div>
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn(!flushBody && 'p-4')}>{children}</div>
    </Card>
  );
}
