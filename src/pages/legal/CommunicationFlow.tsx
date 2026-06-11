import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Activity,
  BadgeCheck,
  Building2,
  CalendarClock,
  CheckCircle2,
  FileCheck2,
  FileText,
  ListChecks,
  MessageSquare,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import {
  AIThinkingIndicator,
  Button,
  Card,
  DataTable,
  RiskBadge,
  SectionCard,
  Tag,
} from '../../components';
import type { Column } from '../../components';
import { useDemoStore } from '../../store/DemoStore';
import { useToast } from '../../context/ToastContext';
import { buildReportContent } from '../../lib/report';
import { delay } from '../../lib/delay';
import { formatDate } from '../../lib/format';
import { cn } from '../../lib/cn';
import type {
  BusinessUnit,
  BusinessUnitImpact,
  CommunicationReport,
  Obligation,
  RegulatoryChange,
} from '../../types';

type Step = 'generating' | 'preview' | 'select' | 'sending' | 'sent';

const GENERATION_CAPTIONS = [
  'Reading obligation mapping…',
  'Drafting executive summary…',
  'Generating FAQ…',
  'Identifying required evidence…',
];

/* ----------------------------- small helpers ----------------------------- */

function Stepper({ step }: { step: Step }) {
  const stage = step === 'generating' || step === 'preview' ? 0 : step === 'select' ? 1 : 2;
  const labels = ['Report', 'Business Units', 'Send'];
  return (
    <div className="flex items-center gap-2">
      {labels.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <span
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
              i < stage && 'bg-accent-500 text-white',
              i === stage && 'bg-brand-700 text-white',
              i > stage && 'bg-slate-200 text-slate-500',
            )}
          >
            {i < stage ? <CheckCircle2 size={14} /> : i + 1}
          </span>
          <span
            className={cn(
              'text-sm font-medium',
              i === stage ? 'text-slate-900' : 'text-slate-400',
            )}
          >
            {label}
          </span>
          {i < labels.length - 1 && <span className="mx-1 h-px w-6 bg-slate-200" />}
        </div>
      ))}
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
        <span className="rounded bg-slate-100 px-1 text-[9px] font-medium normal-case tracking-normal text-slate-400">
          editable
        </span>
      </span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-slate-700 shadow-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      />
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function Subsection({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof FileText;
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
        <Icon size={16} className="text-brand-600" />
        {title}
      </h3>
      {children}
    </div>
  );
}

/* ------------------------------ main wizard ------------------------------ */

interface WizardProps {
  change: RegulatoryChange;
  obligations: Obligation[];
  impacts: BusinessUnitImpact[];
}

function CommunicationWizard({ change, obligations, impacts }: WizardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentDate, sendCommunication } = useDemoStore();

  const content = useMemo(
    () => buildReportContent(change, obligations, impacts),
    [change, obligations, impacts],
  );

  const [step, setStep] = useState<Step>('generating');
  const [captionIndex, setCaptionIndex] = useState(0);

  // Editable report fields (seeded from the generated content).
  const [executiveSummary, setExecutiveSummary] = useState(content.executiveSummary);
  const [whatIsChanging, setWhatIsChanging] = useState(content.whatIsChanging);
  const [whyItMatters, setWhyItMatters] = useState(content.whyItMatters);
  const [actionsText, setActionsText] = useState(content.requiredActions.join('\n'));
  const [legalNotes, setLegalNotes] = useState<string[]>([]);
  const [noteDraft, setNoteDraft] = useState('');

  // BU selection — pre-checked for system-suggested (impacted) BUs.
  const [selectedBUs, setSelectedBUs] = useState<Set<BusinessUnit>>(
    () => new Set(impacts.filter((i) => i.selected).map((i) => i.businessUnit)),
  );

  // Scripted generation sequence (~2.5s) with rotating captions.
  useEffect(() => {
    const interval = setInterval(() => {
      setCaptionIndex((i) => Math.min(i + 1, GENERATION_CAPTIONS.length - 1));
    }, 625);
    const timer = setTimeout(() => {
      clearInterval(interval);
      setStep('preview');
    }, 2500);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const addNote = () => {
    const text = noteDraft.trim();
    if (!text) return;
    setLegalNotes((prev) => [...prev, text]);
    setNoteDraft('');
  };

  const selectedImpactIds = impacts
    .filter((i) => selectedBUs.has(i.businessUnit))
    .map((i) => i.id);

  const toggleRow = (impactId: string) => {
    const impact = impacts.find((i) => i.id === impactId);
    if (!impact) return;
    setSelectedBUs((prev) => {
      const next = new Set(prev);
      if (next.has(impact.businessUnit)) next.delete(impact.businessUnit);
      else next.add(impact.businessUnit);
      return next;
    });
  };
  const toggleAll = () =>
    setSelectedBUs((prev) =>
      prev.size === impacts.length ? new Set() : new Set(impacts.map((i) => i.businessUnit)),
    );

  const sentTo = impacts
    .filter((i) => selectedBUs.has(i.businessUnit))
    .map((i) => i.businessUnit);

  const handleSend = async () => {
    setStep('sending');
    await delay(1500);
    const report: CommunicationReport = {
      regChangeId: change.id,
      title: change.title,
      executiveSummary,
      whatIsChanging,
      whyItMatters,
      requiredActions: actionsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      legalNotes,
      generatedOn: currentDate,
      sentTo,
    };
    sendCommunication(report);
    setStep('sent');
    toast({
      title: 'Communication sent',
      description: `Notified ${sentTo.length} Business Units. Tracking activated.`,
      variant: 'success',
    });
  };

  const impactColumns: Column<BusinessUnitImpact>[] = [
    {
      key: 'businessUnit',
      header: 'Business Unit',
      render: (r) => <span className="font-semibold text-slate-900">{r.businessUnit}</span>,
    },
    { key: 'impactedProcess', header: 'Impacted Process' },
    {
      key: 'impactLevel',
      header: 'Impact',
      render: (r) => <RiskBadge level={r.impactLevel} size="sm" />,
    },
    { key: 'owner', header: 'Owner' },
    {
      key: 'dueDate',
      header: 'Due',
      render: (r) => <span className="font-mono text-xs text-slate-500">{formatDate(r.dueDate)}</span>,
    },
    {
      key: 'impactReason',
      header: 'Impact Reason',
      width: '28%',
      render: (r) => <span className="text-xs text-slate-500">{r.impactReason}</span>,
    },
  ];

  /* --------------------------------- views --------------------------------- */

  const header = (
    <div className="space-y-4">
      <Button
        variant="ghost"
        icon={ArrowLeft}
        onClick={() => navigate(`/legal/regulatory-change/${change.id}`)}
      >
        Back to detail
      </Button>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Communication Report
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{change.title}</h1>
        </div>
        <Stepper step={step} />
      </div>
    </div>
  );

  if (step === 'generating') {
    return (
      <div className="space-y-6">
        {header}
        <AIThinkingIndicator
          variant="panel"
          label={GENERATION_CAPTIONS[captionIndex]}
          sublabel="Composing the communication report from the REMIT II obligation mapping"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {GENERATION_CAPTIONS.map((cap, i) => (
            <div
              key={cap}
              className={cn(
                'flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm transition-colors',
                i <= captionIndex
                  ? 'border-accent-200 bg-accent-50/50 text-slate-700'
                  : 'border-slate-100 bg-slate-50/40 text-slate-400',
              )}
            >
              {i < captionIndex ? (
                <CheckCircle2 size={16} className="text-accent-600" />
              ) : (
                <Sparkles size={16} className={i === captionIndex ? 'text-brand-600' : 'text-slate-300'} />
              )}
              {cap}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'sending') {
    return (
      <div className="space-y-6">
        {header}
        <AIThinkingIndicator
          variant="panel"
          label="Sending communication…"
          sublabel="Creating tickets and activating tracking for the selected Business Units"
        />
      </div>
    );
  }

  if (step === 'sent') {
    return (
      <div className="space-y-6">
        {header}
        <Card className="overflow-hidden">
          <div className="flex flex-col items-center bg-gradient-to-br from-accent-50 to-white px-6 py-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-500 text-white shadow-md">
              <CheckCircle2 size={28} />
            </span>
            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Communication successfully sent
            </h2>
            <p className="mt-1 max-w-md text-sm text-slate-600">
              Communication successfully sent to the selected Business Units. Tracking and audit
              trail have been activated.
            </p>
          </div>
          <div className="grid gap-px bg-slate-100 sm:grid-cols-3">
            <div className="bg-white px-5 py-4 text-center">
              <p className="font-mono text-2xl font-semibold text-slate-900">{sentTo.length}</p>
              <p className="text-xs text-slate-400">Business Units notified</p>
            </div>
            <div className="bg-white px-5 py-4 text-center">
              <p className="font-mono text-2xl font-semibold text-slate-900">
                {obligations.length}
              </p>
              <p className="text-xs text-slate-400">Obligations communicated</p>
            </div>
            <div className="bg-white px-5 py-4 text-center">
              <p className="font-mono text-2xl font-semibold text-slate-900">
                {formatDate(change.implementationDueDate)}
              </p>
              <p className="text-xs text-slate-400">Implementation due</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
            <p className="text-sm text-slate-500">
              Sent to: <span className="font-medium text-slate-700">{sentTo.join(', ')}</span>
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => navigate('/legal/dashboard')}>
                Back to Dashboard
              </Button>
              <Button icon={Activity} iconRight={ArrowRight} onClick={() => navigate('/legal/monitoring')}>
                Go to Monitoring
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (step === 'select') {
    return (
      <div className="space-y-6">
        {header}
        <SectionCard
          title="Select Business Units"
          icon={Building2}
          description="Confirm which Business Units receive this communication."
          flushBody
          actions={
            <Tag tone="accent" size="sm" withDot>
              <Sparkles size={11} className="-ml-0.5" /> Suggested by the system
            </Tag>
          }
        >
          <div className="border-b border-slate-100 bg-accent-50/40 px-5 py-3 text-sm text-slate-600">
            The selection below was suggested by the system based on the obligation mapping. You
            can adjust it before sending.
          </div>
          <DataTable
            columns={impactColumns}
            data={impacts}
            getRowId={(r) => r.id}
            selectable
            selectedIds={selectedImpactIds}
            onToggleRow={toggleRow}
            onToggleAll={toggleAll}
            emptyMessage="No impacted Business Units mapped for this change."
            dense
          />
        </SectionCard>

        <Card className="flex flex-wrap items-center justify-between gap-3 p-5">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">{selectedBUs.size}</span> of{' '}
            {impacts.length} Business Units selected
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" icon={ArrowLeft} onClick={() => setStep('preview')}>
              Back to report
            </Button>
            <Button icon={Send} size="lg" disabled={selectedBUs.size === 0} onClick={handleSend}>
              Send Notification
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // step === 'preview'
  return (
    <div className="space-y-6">
      {header}

      <div className="flex items-center gap-2 rounded-xl border border-accent-200 bg-accent-50/50 px-4 py-3">
        <Sparkles size={16} className="text-accent-600" />
        <p className="text-sm text-slate-600">
          Draft report generated from the REMIT II obligation mapping. Review and edit the key
          fields, then approve.
        </p>
      </div>

      <SectionCard title="Report Preview" icon={FileText}>
        <div className="space-y-6">
          {/* Title */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Title
            </p>
            <p className="mt-0.5 text-lg font-bold text-slate-900">{content.title}</p>
          </div>

          <EditableField
            label="Executive Summary"
            value={executiveSummary}
            onChange={setExecutiveSummary}
            rows={4}
          />
          <EditableField
            label="What is changing"
            value={whatIsChanging}
            onChange={setWhatIsChanging}
            rows={3}
          />
          <EditableField
            label="Why it matters"
            value={whyItMatters}
            onChange={setWhyItMatters}
            rows={3}
          />
          <EditableField
            label="What you need to do (required actions)"
            value={actionsText}
            onChange={setActionsText}
            rows={5}
            hint="One action per line."
          />

          {/* Obligations & requirements */}
          <Subsection icon={ListChecks} title="Obligations & Requirements">
            <ol className="space-y-2">
              {obligations.map((o, idx) => (
                <li key={o.id} className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                  <p className="text-sm font-semibold text-slate-800">
                    {idx + 1}. {o.text}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{o.requirement}</p>
                </li>
              ))}
            </ol>
          </Subsection>

          {/* Impacted BUs */}
          <Subsection icon={Building2} title="Impacted Business Units">
            <div className="flex flex-wrap gap-2">
              {impacts.map((i) => (
                <span
                  key={i.id}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm"
                >
                  <span className="font-medium text-slate-700">{i.businessUnit}</span>
                  <RiskBadge level={i.impactLevel} size="sm" withDot={false} />
                </span>
              ))}
            </div>
          </Subsection>

          {/* Key dates */}
          <Subsection icon={CalendarClock} title="Key Dates">
            <div className="grid gap-3 sm:grid-cols-3">
              {content.keyDates.map((d) => (
                <div key={d.label} className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                  <p className="text-xs text-slate-400">{d.label}</p>
                  <p className="font-mono text-sm font-semibold text-slate-800">{d.date}</p>
                </div>
              ))}
            </div>
          </Subsection>

          {/* Risks */}
          <Subsection icon={AlertTriangle} title="Risks if not implemented">
            <ul className="space-y-1.5">
              {content.risks.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-600">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0 text-red-400" />
                  {r}
                </li>
              ))}
            </ul>
          </Subsection>

          {/* Support & escalation */}
          <Subsection icon={ShieldCheck} title="Support & Escalation">
            <p className="text-sm text-slate-600">{content.supportEscalation}</p>
          </Subsection>

          {/* Evidence */}
          <Subsection icon={FileCheck2} title="Evidence required for audit">
            <ul className="space-y-1.5">
              {content.evidenceRequired.map((e, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-600">
                  <FileCheck2 size={15} className="mt-0.5 shrink-0 text-accent-500" />
                  {e}
                </li>
              ))}
            </ul>
          </Subsection>

          {/* FAQ */}
          <Subsection icon={MessageSquare} title="Frequently Asked Questions">
            <div className="space-y-2">
              {content.faq.map((f, i) => (
                <div key={i} className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                  <p className="text-sm font-semibold text-slate-800">{f.q}</p>
                  <p className="mt-1 text-sm text-slate-600">{f.a}</p>
                </div>
              ))}
            </div>
          </Subsection>

          {/* Legal notes */}
          <Subsection icon={Plus} title="Legal Notes">
            {legalNotes.length > 0 && (
              <ul className="mb-3 space-y-1.5">
                {legalNotes.map((note, i) => (
                  <li
                    key={i}
                    className="flex items-start justify-between gap-2 rounded-lg border border-brand-100 bg-brand-50/50 px-3 py-2 text-sm text-slate-700"
                  >
                    <span>{note}</span>
                    <button
                      onClick={() => setLegalNotes((prev) => prev.filter((_, j) => j !== i))}
                      className="shrink-0 rounded p-0.5 text-slate-400 hover:bg-white hover:text-slate-600"
                      aria-label="Remove note"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <input
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addNote();
                }}
                placeholder="Add a Legal note for the Business Units…"
                className="h-9 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
              <Button variant="secondary" icon={Plus} onClick={addNote}>
                Add Legal note
              </Button>
            </div>
          </Subsection>
        </div>
      </SectionCard>

      <Card className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
            <BadgeCheck size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Approve this report</p>
            <p className="text-sm text-slate-500">Next, choose which Business Units to notify.</p>
          </div>
        </div>
        <Button icon={ArrowRight} size="lg" onClick={() => setStep('select')}>
          Approve &amp; Send
        </Button>
      </Card>
    </div>
  );
}

export default function CommunicationFlow() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { regulatoryChanges, obligations, businessUnitImpacts } = useDemoStore();

  const change = regulatoryChanges.find((c) => c.id === id);

  if (!change) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/legal/impact-overview')}>
          Back to Impact Overview
        </Button>
        <Card className="p-10 text-center">
          <p className="text-sm font-semibold text-slate-700">Regulatory change not found</p>
          <p className="mt-1 text-sm text-slate-400">No record exists for id “{id}”.</p>
        </Card>
      </div>
    );
  }

  return (
    <CommunicationWizard
      change={change}
      obligations={obligations.filter((o) => o.regChangeId === change.id)}
      impacts={businessUnitImpacts.filter((i) => i.regChangeId === change.id)}
    />
  );
}
