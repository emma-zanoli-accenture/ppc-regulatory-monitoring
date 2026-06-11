import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { cn } from '../lib/cn';

export type KpiTone = 'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral';
export type TrendDirection = 'up' | 'down' | 'flat';

export interface KpiTrend {
  direction: TrendDirection;
  value: string;
  /** When true, a "down" trend is good (e.g. overdue items falling) → render green. */
  invert?: boolean;
}

export interface KpiWidgetProps {
  label: string;
  value: string | number;
  /** Small qualifier under the value, e.g. "of 5 business units". */
  hint?: string;
  icon?: LucideIcon;
  tone?: KpiTone;
  trend?: KpiTrend;
  className?: string;
}

const ICON_TONE: Record<KpiTone, string> = {
  brand: 'bg-brand-50 text-brand-700',
  accent: 'bg-accent-50 text-accent-700',
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  danger: 'bg-red-50 text-red-600',
  neutral: 'bg-slate-100 text-slate-600',
};

const TREND_ICON = { up: ArrowUpRight, down: ArrowDownRight, flat: Minus } as const;

function trendColor(trend: KpiTrend): string {
  if (trend.direction === 'flat') return 'text-slate-500 bg-slate-100';
  const isPositive =
    trend.direction === 'up' ? !trend.invert : trend.invert === true;
  return isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50';
}

/** Dashboard stat tile: label, big number, optional icon + trend. */
export function KpiWidget({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'brand',
  trend,
  className,
}: KpiWidgetProps) {
  const TrendIcon = trend ? TREND_ICON[trend.direction] : null;
  return (
    <div
      className={cn(
        'rounded-md border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="label-eyebrow">{label}</p>
        {Icon && (
          <span
            className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded',
              ICON_TONE[tone],
            )}
          >
            <Icon size={15} />
          </span>
        )}
      </div>
      <div className="mt-2.5 flex items-end gap-2">
        <span className="font-mono text-[26px] font-semibold leading-none tracking-tight text-slate-900">
          {value}
        </span>
        {trend && TrendIcon && (
          <span
            className={cn(
              'mb-0.5 inline-flex items-center gap-0.5 rounded-sm px-1.5 py-0.5 text-2xs font-semibold',
              trendColor(trend),
            )}
          >
            <TrendIcon size={11} />
            {trend.value}
          </span>
        )}
      </div>
      {hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
