import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronUp, ListChecks, MapPin, X } from 'lucide-react';
import { cn } from '../lib/cn';

interface GuideStep {
  n: number;
  role: 'legal' | 'bu';
  text: string;
  /** One line of presenter context for this step. */
  detail: string;
  /** First step of a "switch role" phase — renders a divider above. */
  phaseStart?: string;
}

const STEPS: GuideStep[] = [
  {
    n: 1,
    role: 'legal',
    text: 'Dashboard — run source scan + update catalogue (agentic)',
    detail:
      'On the Legal dashboard, click "Run source scan" to show the AI detecting REMIT II across the ACER, ENTSO-E and RAE feeds, then "Update source catalogue" to track it.',
    phaseStart: 'Legal / Compliance',
  },
  {
    n: 2,
    role: 'legal',
    text: 'Impact Overview',
    detail:
      'Open Impact Overview: every tracked regulation, its obligation-mapping status, impacted-BU count, and the "precedent reuse" history.',
  },
  {
    n: 3,
    role: 'legal',
    text: 'Regulatory Change detail',
    detail:
      'Click REMIT II for the analytical view — overview, the mapped obligations with interpretation, and the per-BU impact assessment.',
  },
  {
    n: 4,
    role: 'legal',
    text: 'Generate Communication Report (agentic)',
    detail:
      'Hit "Generate Communication Report" — the agent drafts the full report (summary, required actions, FAQ, evidence) from the obligation mapping. Edit any field.',
  },
  {
    n: 5,
    role: 'legal',
    text: 'Select Business Units',
    detail:
      'Approve & Send, then review the Business Units the system suggests based on the mapping; toggle any on or off.',
  },
  {
    n: 6,
    role: 'legal',
    text: 'Send Notification',
    detail:
      'Send — a ticket is created for each BU and tracking plus the audit trail are activated.',
  },
  {
    n: 7,
    role: 'bu',
    text: 'See notification',
    detail:
      'Switch to the Business Unit role (top-right). REMIT II appears as a new, unread notification on the BU dashboard.',
    phaseStart: 'Switch → Business Unit',
  },
  {
    n: 8,
    role: 'bu',
    text: 'Open detail (4 questions)',
    detail:
      'Open it to show the operational view: What is changing / Why it matters / What you need to do / Key dates.',
  },
  {
    n: 9,
    role: 'bu',
    text: 'View & download report',
    detail:
      'View and download the report — this marks the ticket Viewed and Downloaded, visible back in the Legal monitoring view.',
  },
  {
    n: 10,
    role: 'bu',
    text: 'AI chatbot (agentic advisory)',
    detail:
      'Open the AI Advisory Assistant and click a suggested question; the answer streams in and cites the report section it came from.',
  },
  {
    n: 11,
    role: 'bu',
    text: 'Request Legal Support',
    detail:
      'Raise a Legal support request (optionally attaching the chatbot transcript); the ticket moves to "Clarification Requested".',
  },
  {
    n: 12,
    role: 'legal',
    text: 'Receive & answer support request',
    detail:
      'Switch to Legal → Support Requests. Open the new request, read the transcript, and send a response back to the BU.',
    phaseStart: 'Switch → Legal',
  },
  {
    n: 13,
    role: 'legal',
    text: 'Simulate T‑30 reminder',
    detail:
      'Open Demo Controls (top bar) and jump to T‑30 to fire reminders to both roles and shift every countdown.',
  },
  {
    n: 14,
    role: 'bu',
    text: 'Enter compliance measures',
    detail:
      'Back as the BU, open the ticket and record the compliance measures — control implemented, affected process, owner, residual risk.',
    phaseStart: 'Switch → Business Unit',
  },
  {
    n: 15,
    role: 'bu',
    text: 'Upload evidence',
    detail:
      'Attach evidence files, each linked to a specific obligation, to support audit readiness.',
  },
  {
    n: 16,
    role: 'bu',
    text: 'Submit & Close',
    detail:
      'Complete the sign-off and Submit & Close — the ticket becomes "Ready for Audit" and Legal is notified automatically.',
  },
  {
    n: 17,
    role: 'legal',
    text: 'Monitoring shows Completed',
    detail:
      'Switch to Legal → Monitoring to see the BU\'s status update to completed live, with no escalations.',
    phaseStart: 'Switch → Legal',
  },
  {
    n: 18,
    role: 'legal',
    text: 'Audit & Regulatory Reporting + export',
    detail:
      'Open Audit for the end-to-end timeline and evidence repository, then generate and export the consolidated compliance & audit report.',
  },
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex items-center gap-2 rounded px-2.5 py-1.5 text-[13px] font-semibold transition-colors',
          open
            ? 'bg-slate-900 text-white'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
        )}
      >
        <ListChecks size={15} />
        Demo Guide
      </button>

      {open &&
        createPortal(
          <div className="fixed bottom-5 left-5 z-[60] flex max-h-[calc(100vh-5rem)] w-80 flex-col overflow-hidden rounded-md border border-slate-300 bg-white shadow-overlay animate-fade-in">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-700 bg-slate-900 px-4 py-2.5 text-white">
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
          <div className="shrink-0 border-b border-slate-200 px-4 py-3">
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-brand-700 font-mono text-sm font-bold text-white">
                {step.n}
              </span>
              <p className="min-w-0 flex-1 pt-0.5 text-sm font-semibold text-slate-900">
                {step.text}
              </p>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => setCurrent((c) => Math.max(1, c - 1))}
                  disabled={current === 1}
                  className="rounded border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  onClick={() => setCurrent((c) => Math.min(18, c + 1))}
                  disabled={current === 18}
                  className="rounded bg-brand-700 px-2 py-1 text-xs font-semibold text-white hover:bg-brand-800 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{step.detail}</p>
          </div>

          {/* Full list */}
          {expanded && (
            <ol className="min-h-0 flex-1 space-y-0.5 overflow-y-auto scrollbar-slim p-2">
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
          </div>,
          document.body,
        )}
    </>
  );
}
