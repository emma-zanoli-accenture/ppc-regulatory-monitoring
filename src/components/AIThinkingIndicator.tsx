import { Cpu } from 'lucide-react';
import { cn } from '../lib/cn';

export type ThinkingVariant = 'dots' | 'inline' | 'panel';

export interface AIThinkingIndicatorProps {
  variant?: ThinkingVariant;
  /** Primary line, e.g. "Scanning regulatory sources…". */
  label?: string;
  /** Secondary line shown in the panel variant. */
  sublabel?: string;
  className?: string;
}

/** Three dots fading in sequence — understated, no bounce. */
function Dots({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1 w-1 rounded-full bg-current animate-pulse-soft"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </span>
  );
}

/** A thin determinate-looking progress track with a sweeping head. */
function SweepBar({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-0.5 overflow-hidden rounded-full bg-slate-200', className)}>
      <div className="absolute inset-y-0 left-0 w-1/4 animate-sweep rounded-full bg-accent-500" />
    </div>
  );
}

/** A shimmering placeholder line — reads as "content is being generated". */
function ShimmerBar({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-sm bg-slate-100', className)}>
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer"
        style={{
          background: 'linear-gradient(90deg, transparent, rgb(255 255 255 / 0.85), transparent)',
        }}
      />
    </div>
  );
}

/**
 * "Agent working" indicator — engineered, not flashy.
 * - `dots`   : sequence-fading dots, inline within text.
 * - `inline` : a small bordered chip with a processor mark, label, and dots.
 * - `panel`  : a hairline tile with a mono status line, a thin sweep bar, and
 *              shimmer placeholder lines.
 */
export function AIThinkingIndicator({
  variant = 'inline',
  label = 'AI is working',
  sublabel,
  className,
}: AIThinkingIndicatorProps) {
  if (variant === 'dots') {
    return <Dots className={cn('text-brand-600', className)} />;
  }

  if (variant === 'inline') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-2 rounded border border-slate-300 bg-white px-2.5 py-1 text-[13px] font-medium text-slate-700',
          className,
        )}
      >
        <Cpu size={14} className="text-accent-600" />
        {label}
        <Dots className="text-accent-500" />
      </span>
    );
  }

  // panel
  return (
    <div className={cn('rounded-md border border-slate-300 bg-white', className)}>
      <div className="flex items-center gap-3 px-4 py-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-brand-200 bg-brand-50 text-brand-700">
          <Cpu size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-mono text-[13px] font-medium text-slate-900">{label}</p>
            <Dots className="text-accent-500" />
          </div>
          {sublabel && <p className="mt-0.5 text-xs text-slate-500">{sublabel}</p>}
        </div>
      </div>
      <SweepBar />
      <div className="space-y-1.5 px-4 py-3">
        <ShimmerBar className="h-2 w-full" />
        <ShimmerBar className="h-2 w-3/4" />
      </div>
    </div>
  );
}
