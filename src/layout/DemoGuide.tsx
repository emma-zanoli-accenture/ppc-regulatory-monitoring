import { useState } from 'react';
import { ChevronDown, ChevronUp, ListChecks, MapPin, X } from 'lucide-react';
import { cn } from '../lib/cn';

interface GuideStep {
  n: number;
  role: 'legal' | 'bu';
  text: string;
  /** First step of a "switch role" phase — renders a divider above. */
  phaseStart?: string;
}

const STEPS: GuideStep[] = [
  { n: 1, role: 'legal', text: 'Dashboard — run source scan + update catalogue (agentic)', phaseStart: 'Legal / Compliance' },
  { n: 2, role: 'legal', text: 'Impact Overview' },
  { n: 3, role: 'legal', text: 'Regulatory Change detail' },
  { n: 4, role: 'legal', text: 'Generate Communication Report (agentic)' },
  { n: 5, role: 'legal', text: 'Select Business Units' },
  { n: 6, role: 'legal', text: 'Send Notification' },
  { n: 7, role: 'bu', text: 'See notification', phaseStart: 'Switch → Business Unit' },
  { n: 8, role: 'bu', text: 'Open detail (4 questions)' },
  { n: 9, role: 'bu', text: 'View & download report' },
  { n: 10, role: 'bu', text: 'AI chatbot (agentic advisory)' },
  { n: 11, role: 'bu', text: 'Request Legal Support' },
  { n: 12, role: 'legal', text: 'Receive & answer support request', phaseStart: 'Switch → Legal' },
  { n: 13, role: 'legal', text: 'Simulate T‑30 reminder' },
  { n: 14, role: 'bu', text: 'Enter compliance measures', phaseStart: 'Switch → Business Unit' },
  { n: 15, role: 'bu', text: 'Upload evidence' },
  { n: 16, role: 'bu', text: 'Submit & Close' },
  { n: 17, role: 'legal', text: 'Monitoring shows Completed', phaseStart: 'Switch → Legal' },
  { n: 18, role: 'legal', text: 'Audit & Regulatory Reporting + export' },
];

const ROLE_CHIP = {
  legal: 'bg-brand-50 text-brand-700',
  bu: 'bg-accent-50 text-accent-700',
} as const;

/**
 * Presenter place-keeper. Off by default; the top-bar button toggles a small
 * floating checklist of the 18-step narrative. Purely a navigation aid — it
 * does not drive the app.
 */
export function DemoGuide() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [current, setCurrent] = useState(1);

  const step = STEPS.find((s) => s.n === current) ?? STEPS[0];

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
          open
            ? 'bg-slate-900 text-white'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
        )}
      >
        <ListChecks size={15} />
        Demo Guide
      </button>

      {open && (
        <div className="fixed bottom-6 left-6 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-overlay animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-900 px-4 py-2.5 text-white">
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-accent-400" />
              <span className="text-sm font-semibold">Demo Guide</span>
              <span className="rounded bg-white/15 px-1.5 py-0.5 font-mono text-[11px]">
                {current}/18
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setExpanded((e) => !e)}
                className="rounded p-1 text-white/70 hover:bg-white/10 hover:text-white"
                aria-label={expanded ? 'Collapse' : 'Expand'}
              >
                {expanded ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded p-1 text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Close demo guide"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Current step + controls */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-700 font-mono text-sm font-bold text-white">
              {step.n}
            </span>
            <p className="min-w-0 flex-1 text-sm font-semibold text-slate-900">{step.text}</p>
            <div className="flex shrink-0 gap-1">
              <button
                onClick={() => setCurrent((c) => Math.max(1, c - 1))}
                disabled={current === 1}
                className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                onClick={() => setCurrent((c) => Math.min(18, c + 1))}
                disabled={current === 18}
                className="rounded-md bg-brand-700 px-2 py-1 text-xs font-semibold text-white hover:bg-brand-800 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>

          {/* Full list */}
          {expanded && (
            <ol className="max-h-72 space-y-0.5 overflow-y-auto scrollbar-slim p-2">
              {STEPS.map((s) => (
                <li key={s.n}>
                  {s.phaseStart && (
                    <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {s.phaseStart}
                    </p>
                  )}
                  <button
                    onClick={() => setCurrent(s.n)}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors',
                      s.n === current
                        ? 'bg-brand-50 font-semibold text-brand-800'
                        : s.n < current
                          ? 'text-slate-400 hover:bg-slate-50'
                          : 'text-slate-600 hover:bg-slate-50',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-[11px]',
                        s.n === current ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-500',
                      )}
                    >
                      {s.n}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{s.text}</span>
                    <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-semibold', ROLE_CHIP[s.role])}>
                      {s.role === 'legal' ? 'Legal' : 'BU'}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </>
  );
}
