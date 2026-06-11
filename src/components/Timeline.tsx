import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../lib/cn';

export type TimelineTone = 'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral';

export interface TimelineItem {
  id: string;
  title: ReactNode;
  detail?: ReactNode;
  /** Meta line: actor and/or timestamp. */
  actor?: string;
  timestamp?: string;
  icon?: LucideIcon;
  tone?: TimelineTone;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const TONE_DOT: Record<TimelineTone, string> = {
  brand: 'bg-brand-600 ring-brand-100',
  accent: 'bg-accent-500 ring-accent-100',
  success: 'bg-emerald-500 ring-emerald-100',
  warning: 'bg-amber-500 ring-amber-100',
  danger: 'bg-red-500 ring-red-100',
  neutral: 'bg-slate-400 ring-slate-100',
};

export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cn('relative', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const tone = item.tone ?? 'brand';
        const Icon = item.icon;
        return (
          <li key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
            {/* connector line */}
            {!isLast && (
              <span
                className="absolute left-[15px] top-8 bottom-0 w-px bg-slate-200"
                aria-hidden
              />
            )}
            {/* node */}
            <span
              className={cn(
                'relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ring-4',
                TONE_DOT[tone],
              )}
            >
              {Icon ? <Icon size={15} /> : <span className="h-2 w-2 rounded-full bg-white" />}
            </span>
            {/* content */}
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                {item.timestamp && (
                  <time className="font-mono text-xs text-slate-400">{item.timestamp}</time>
                )}
              </div>
              {item.detail && <p className="mt-0.5 text-sm text-slate-600">{item.detail}</p>}
              {item.actor && (
                <p className="mt-1 text-xs font-medium text-slate-500">{item.actor}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
