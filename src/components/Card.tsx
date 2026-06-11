import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../lib/cn';

export interface CardProps {
  className?: string;
  children: ReactNode;
  /** Lift slightly on hover (for clickable cards). */
  interactive?: boolean;
}

/** Clean surface container. */
export function Card({ className, children, interactive }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white shadow-card',
        interactive &&
          'transition-shadow duration-200 hover:shadow-card-hover cursor-pointer',
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
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-100">
          <div className="flex items-start gap-3 min-w-0">
            {Icon && (
              <span
                className={cn(
                  'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                  ICON_TONE[iconTone],
                )}
              >
                <Icon size={18} />
              </span>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="text-[15px] font-semibold tracking-tight text-slate-900 truncate">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-0.5 text-sm text-slate-500">{description}</p>
              )}
            </div>
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn(!flushBody && 'p-5')}>{children}</div>
    </Card>
  );
}
