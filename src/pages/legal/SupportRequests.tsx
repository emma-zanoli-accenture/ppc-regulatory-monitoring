import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  MessageSquare,
  Send,
} from 'lucide-react';
import { Button, RiskBadge, SectionCard, SlideOver, Tag } from '../../components';
import type { TagTone } from '../../components';
import { useDemoStore } from '../../store/DemoStore';
import { useToast } from '../../context/ToastContext';
import { formatDateTime } from '../../lib/format';
import type { SupportRequestStatus } from '../../types';

const STATUS_TONE: Record<SupportRequestStatus, TagTone> = {
  Open: 'warning',
  Answered: 'success',
  Closed: 'neutral',
};

export default function SupportRequests() {
  const { toast } = useToast();
  const { supportRequests, tickets, regulatoryChanges, answerSupportRequest } = useDemoStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const selected = supportRequests.find((s) => s.id === selectedId) ?? null;

  const changeTitleFor = (ticketId: string) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    return regulatoryChanges.find((c) => c.id === ticket?.regChangeId)?.title ?? '—';
  };

  const openCount = useMemo(
    () => supportRequests.filter((s) => s.status === 'Open').length,
    [supportRequests],
  );

  const sorted = useMemo(
    () =>
      [...supportRequests].sort(
        (a, b) => (a.status === 'Open' ? 0 : 1) - (b.status === 'Open' ? 0 : 1),
      ),
    [supportRequests],
  );

  const submitResponse = () => {
    if (!selected || !draft.trim()) return;
    answerSupportRequest(selected.id, draft.trim());
    setDraft('');
    toast({
      title: 'Response sent',
      description: `${selected.businessUnit} has been notified.`,
      variant: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-600">
          Legal / Compliance
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Support Requests</h1>
        <p className="mt-1 text-slate-500">
          Second-level clarifications raised by Business Units.{' '}
          <span className="font-medium text-slate-700">{openCount} open</span>.
        </p>
      </div>

      <SectionCard title="Clarifications" icon={MessageSquare} flushBody>
        {sorted.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-400">
            No support requests have been raised.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {sorted.map((sr) => (
              <li
                key={sr.id}
                onClick={() => {
                  setSelectedId(sr.id);
                  setDraft('');
                }}
                className="group flex cursor-pointer items-start gap-4 px-5 py-4 transition-colors hover:bg-slate-50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      {sr.businessUnit}
                    </span>
                    <Tag tone={STATUS_TONE[sr.status]} size="sm" withDot>
                      {sr.status}
                    </Tag>
                    <RiskBadge level={sr.priority} size="sm" />
                    {sr.chatbotTranscript && (
                      <Tag tone="accent" size="sm">
                        <Bot size={11} className="-ml-0.5" /> transcript
                      </Tag>
                    )}
                  </div>
                  <p className="mt-1 truncate text-sm text-slate-600">{sr.question}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {changeTitleFor(sr.ticketId)}
                    {sr.reportSection && ` · ${sr.reportSection}`}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="mt-1 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500"
                />
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      {/* Detail + answer */}
      <SlideOver
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title="Support Request"
        description={selected ? selected.businessUnit : undefined}
        width="lg"
        footer={
          selected && selected.status === 'Open' ? (
            <Button fullWidth icon={Send} disabled={!draft.trim()} onClick={submitResponse}>
              Send response
            </Button>
          ) : undefined
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Tag tone={STATUS_TONE[selected.status]} withDot>
                {selected.status}
              </Tag>
              <RiskBadge level={selected.priority} size="sm" suffix="priority" />
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Question
              </p>
              <p className="mt-1 text-sm text-slate-700">{selected.question}</p>
            </div>

            {selected.reportSection && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Reference report section
                </p>
                <p className="mt-1 text-sm text-slate-700">{selected.reportSection}</p>
              </div>
            )}

            {selected.chatbotTranscript && selected.chatbotTranscript.length > 0 && (
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Attached chatbot transcript
                </p>
                <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  {selected.chatbotTranscript.map((m) => (
                    <div
                      key={m.id}
                      className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                    >
                      <div
                        className={
                          m.role === 'user'
                            ? 'max-w-[85%] rounded-xl rounded-br-sm bg-brand-700 px-3 py-1.5 text-xs text-white'
                            : 'max-w-[85%] rounded-xl rounded-tl-sm bg-white px-3 py-1.5 text-xs text-slate-700 ring-1 ring-slate-200'
                        }
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selected.legalResponse ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                  <CheckCircle2 size={13} /> Legal response
                </p>
                <p className="mt-1.5 text-sm text-slate-700">{selected.legalResponse}</p>
              </div>
            ) : (
              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Your response
                </p>
                <textarea
                  value={draft}
                  rows={5}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write a response to the Business Unit…"
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>
            )}

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                History
              </p>
              <ul className="space-y-1.5">
                {selected.history.map((h, i) => (
                  <li key={i} className="flex items-baseline justify-between gap-3 text-xs">
                    <span className="text-slate-600">
                      <span className="font-medium text-slate-700">{h.actor}</span> — {h.note}
                    </span>
                    <span className="shrink-0 font-mono text-slate-400">
                      {formatDateTime(h.timestamp)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  );
}
