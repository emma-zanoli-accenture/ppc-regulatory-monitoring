import { useEffect, useRef, useState } from 'react';
import { CalendarClock, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../components';
import { useDemoStore, TIME_JUMPS } from '../store/DemoStore';
import type { TimeJumpKey } from '../store/DemoStore';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../lib/format';
import { COMPLETED_STATES } from '../lib/metrics';
import { REMIT_II_ID } from '../data';
import { cn } from '../lib/cn';

/**
 * Presenter-only control. Deliberately styled apart from the product UI (amber,
 * dashed) so it reads as a demo device, not a real feature.
 */
export function DemoControls() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const { currentDate, activeJump, tickets, simulateTime, reset } = useDemoStore();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const jump = (key: TimeJumpKey) => {
    simulateTime(key);
    if (key === 'T+1') {
      const incomplete = tickets.filter(
        (t) => t.regChangeId === REMIT_II_ID && !COMPLETED_STATES.includes(t.status),
      ).length;
      toast({
        title: 'Implementation deadline passed (T+1)',
        description: `${incomplete} incomplete ticket${incomplete === 1 ? '' : 's'} escalated. Legal and Business Units notified.`,
        variant: 'error',
      });
    } else {
      toast({
        title: `${key} reminder fired`,
        description: 'Reminders sent to impacted Business Units and Legal/Compliance.',
        variant: 'info',
      });
    }
  };

  const handleReset = () => {
    reset();
    setOpen(false);
    toast({ title: 'Demo reset', description: 'All state restored to the seed.', variant: 'info' });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex items-center gap-2 rounded-lg border border-dashed px-3 py-1.5 text-sm font-semibold transition-colors',
          open
            ? 'border-amber-400 bg-amber-100 text-amber-800'
            : 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100',
        )}
      >
        <SlidersHorizontal size={15} />
        Demo Controls
        {activeJump && (
          <span className="rounded bg-amber-200 px-1.5 py-0.5 font-mono text-[10px] text-amber-800">
            {activeJump}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-amber-200 bg-white p-4 shadow-overlay animate-fade-in">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <SlidersHorizontal size={15} />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold text-slate-900">Demo Controls</p>
                <p className="text-[11px] text-slate-400">Presenter only</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <CalendarClock size={12} /> Simulated date
            </p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-slate-800">
              {formatDate(currentDate)}
              {activeJump && <span className="ml-2 text-amber-600">({activeJump})</span>}
            </p>
          </div>

          <p className="mb-1.5 mt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Simulate time — jump to
          </p>
          <div className="grid grid-cols-2 gap-2">
            {TIME_JUMPS.map((j) => (
              <button
                key={j.key}
                onClick={() => jump(j.key)}
                className={cn(
                  'rounded-lg border px-3 py-2 text-sm font-semibold transition-colors',
                  activeJump === j.key
                    ? 'border-amber-400 bg-amber-100 text-amber-800'
                    : j.key === 'T+1'
                      ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
                )}
              >
                {j.label}
              </button>
            ))}
          </div>

          <div className="mt-3 border-t border-slate-100 pt-3">
            <Button variant="secondary" icon={RotateCcw} fullWidth onClick={handleReset}>
              Reset Demo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
