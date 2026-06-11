import { Sparkles } from 'lucide-react';
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

/** Three staggered bouncing dots (shared by all variants). */
function Dots({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-current animate-thinking-bounce"
          style={{ animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </span>
  );
}

/** A shimmering placeholder bar — reads as "content is being generated". */
function ShimmerBar({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-full bg-slate-100', className)}>
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgb(255 255 255 / 0.9), transparent)',
        }}
      />
    </div>
  );
}

/**
 * Animated "agent is working" indicator used to make scripted AI moments feel live.
 * - `dots`   : just the bouncing dots (inline within text).
 * - `inline` : a sparkle icon + label + dots on one row (buttons, headers).
 * - `panel`  : a full card with a pulsing AI orb, label, and shimmer lines.
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
          'inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700',
          className,
        )}
      >
        <Sparkles size={15} className="text-accent-600" />
        {label}
        <Dots className="text-brand-500" />
      </span>
    );
  }

  // panel
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-5',
        className,
      )}
    >
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-accent-400/40 animate-pulse-ring" />
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-md">
          <Sparkles size={20} />
        </span>
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <Dots className="text-brand-500" />
        </div>
        {sublabel && <p className="mt-0.5 text-xs text-slate-500">{sublabel}</p>}
        <div className="mt-3 space-y-1.5">
          <ShimmerBar className="h-2 w-full" />
          <ShimmerBar className="h-2 w-4/5" />
        </div>
      </div>
    </div>
  );
}
