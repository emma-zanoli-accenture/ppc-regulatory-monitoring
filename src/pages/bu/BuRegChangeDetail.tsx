import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Download,
  Eye,
  FileCheck2,
  FileText,
  HelpCircle,
  LifeBuoy,
  ListChecks,
  MessageSquare,
  Send,
  Sparkles,
  Target,
} from 'lucide-react';
import {
  Button,
  Card,
  Modal,
  PageHeader,
  SectionCard,
  Select,
  SlideOver,
  StatusBadge,
  Tag,
} from '../../components';
import { useDemoStore } from '../../store/DemoStore';
import { useToast } from '../../context/ToastContext';
import { DEMO_BUSINESS_UNIT } from '../../config/navigation';
import { buildReportContent } from '../../lib/report';
import type { ReportContent } from '../../lib/report';
import { addDays, formatDate, relativeDueLabel, daysBetween } from '../../lib/format';
import type { ChatMessage, RiskPriority } from '../../types';
import { AdvisoryChatbot } from './AdvisoryChatbot';

const SECTION_OPTIONS = [
  'What is changing',
  'Why it matters',
  'What you need to do',
  'Key Dates',
  'Obligations & Requirements',
  'Evidence required for audit',
  'Support & Escalation',
];

function QuestionCard({
  icon: Icon,
  eyebrow,
  title,
  children,
}: {
  icon: typeof FileText;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <Icon size={18} />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-600">
            {eyebrow}
          </p>
          <h2 className="text-base font-bold tracking-tight text-slate-900">{title}</h2>
        </div>
      </div>
      {children}
    </Card>
  );
}

export default function BuRegChangeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    regulatoryChanges,
    obligations,
    businessUnitImpacts,
    tickets,
    communicationReports,
    currentDate,
    markTicketViewed,
    markTicketDownloaded,
    createSupportRequest,
  } = useDemoStore();

  const bu = DEMO_BUSINESS_UNIT;
  const change = regulatoryChanges.find((c) => c.id === id);
  const changeObligations = useMemo(
    () => obligations.filter((o) => o.regChangeId === id),
    [obligations, id],
  );
  const impacts = useMemo(
    () => businessUnitImpacts.filter((i) => i.regChangeId === id),
    [businessUnitImpacts, id],
  );
  const myImpact = impacts.find((i) => i.businessUnit === bu);
  const ticket = tickets.find((t) => t.regChangeId === id && t.businessUnit === bu);

  // Mark viewed when the BU opens the notification (idempotent in the store).
  useEffect(() => {
    if (ticket) markTicketViewed(ticket.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket?.id]);

  const [chatOpen, setChatOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [transcript, setTranscript] = useState<ChatMessage[]>([]);

  // Support form state
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [section, setSection] = useState(SECTION_OPTIONS[0]);
  const [priority, setPriority] = useState<RiskPriority>('Medium');
  const [attachTranscript, setAttachTranscript] = useState(false);

  if (!change) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/bu/dashboard')}>
          Back to Dashboard
        </Button>
        <Card className="p-10 text-center">
          <p className="text-sm font-semibold text-slate-700">Regulatory change not found</p>
          <p className="mt-1 text-sm text-slate-400">No record exists for id “{id}”.</p>
        </Card>
      </div>
    );
  }

  const base = buildReportContent(change, changeObligations, impacts);
  const stored = communicationReports[change.id];
  const content: ReportContent = stored
    ? {
        ...base,
        executiveSummary: stored.executiveSummary,
        whatIsChanging: stored.whatIsChanging,
        whyItMatters: stored.whyItMatters,
        requiredActions: stored.requiredActions,
      }
    : base;
  const legalNotes = stored?.legalNotes ?? [];

  const dueDate = myImpact?.dueDate ?? change.implementationDueDate;
  const nextReminder = addDays(change.implementationDueDate, -30);
  const daysToDue = daysBetween(currentDate, dueDate);

  const handleDownload = () => {
    if (ticket) markTicketDownloaded(ticket.id);
    toast({
      title: 'Report downloaded',
      description: `${change.title} — Communication Report`,
      variant: 'info',
    });
  };

  const submitSupport = () => {
    if (!ticket || !subject.trim()) return;
    createSupportRequest({
      ticketId: ticket.id,
      businessUnit: bu,
      subject: subject.trim(),
      description: description.trim(),
      reportSection: section,
      priority,
      chatbotTranscript: attachTranscript && transcript.length > 0 ? transcript : undefined,
    });
    setSupportOpen(false);
    setSubject('');
    setDescription('');
    setAttachTranscript(false);
    toast({
      title: 'Support request sent to Legal',
      description: 'Your ticket is now marked “Clarification Requested”.',
      variant: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        crumbs={[
          { label: `Business Unit · ${bu}`, to: '/bu/dashboard' },
          { label: 'Notification' },
        ]}
        title={change.title}
        description={change.regulatorySource}
        meta={ticket ? <StatusBadge state={ticket.status} /> : undefined}
      />

      {/* Four questions */}
      <div className="grid gap-4 lg:grid-cols-2">
        <QuestionCard icon={FileText} eyebrow="Question 1" title="What is changing">
          <p className="text-sm leading-relaxed text-slate-600">{content.whatIsChanging}</p>
        </QuestionCard>

        <QuestionCard icon={Target} eyebrow="Question 2" title="Why it matters">
          {myImpact && (
            <p className="mb-3 rounded-lg bg-brand-50/60 p-3 text-sm text-slate-700">
              <span className="font-semibold">Impact on {bu}: </span>
              {myImpact.impactReason}
            </p>
          )}
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Key risks
          </p>
          <ul className="space-y-1.5">
            {content.risks.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-600">
                <AlertTriangle size={15} className="mt-0.5 shrink-0 text-red-400" />
                {r}
              </li>
            ))}
          </ul>
        </QuestionCard>
      </div>

      <QuestionCard icon={ListChecks} eyebrow="Question 3" title="What you need to do">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Required actions
            </p>
            <ul className="space-y-2">
              {content.requiredActions.map((a, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 font-mono text-[11px] font-semibold text-brand-700">
                    {i + 1}
                  </span>
                  {a}
                </li>
              ))}
            </ul>
            <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Required evidence
            </p>
            <ul className="space-y-1.5">
              {content.evidenceRequired.map((e, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-600">
                  <FileCheck2 size={15} className="mt-0.5 shrink-0 text-accent-500" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <div>
              <p className="text-xs text-slate-400">Owner</p>
              <p className="text-sm font-semibold text-slate-800">{myImpact?.owner ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Deadline</p>
              <p className="font-mono text-sm font-semibold text-slate-800">{formatDate(dueDate)}</p>
              <p className={daysToDue <= 30 ? 'text-xs text-amber-600' : 'text-xs text-slate-400'}>
                {relativeDueLabel(daysToDue)}
              </p>
            </div>
            {ticket && (
              <Button
                fullWidth
                icon={ArrowRight}
                onClick={() => navigate(`/bu/tickets/${ticket.id}`)}
              >
                Open my ticket
              </Button>
            )}
          </div>
        </div>
      </QuestionCard>

      {/* Key dates + documents */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Key Dates" icon={CalendarClock}>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs text-slate-400">Publication</dt>
              <dd className="font-mono text-sm font-semibold text-slate-800">
                {formatDate(change.publicationDate)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Effective</dt>
              <dd className="font-mono text-sm font-semibold text-slate-800">
                {formatDate(change.effectiveDate)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Implementation due</dt>
              <dd className="font-mono text-sm font-semibold text-slate-800">
                {formatDate(change.implementationDueDate)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Next reminder</dt>
              <dd className="font-mono text-sm font-semibold text-amber-600">
                {formatDate(nextReminder)}
              </dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard title="Documents" icon={FileText} flushBody>
          <div className="flex items-center justify-between gap-3 px-5 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <FileText size={20} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  REMIT II — Communication Report
                </p>
                <p className="text-xs text-slate-400">
                  {stored ? `Issued by Legal · ${formatDate(stored.generatedOn)}` : 'Generated from obligation mapping'}
                  {ticket?.downloaded && ' · downloaded'}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="secondary" size="sm" icon={Eye} onClick={() => setReportOpen(true)}>
                View
              </Button>
              <Button size="sm" icon={Download} onClick={handleDownload}>
                Download
              </Button>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Support panel */}
      <SectionCard
        title="Support"
        icon={LifeBuoy}
        iconTone="accent"
        description="Get help interpreting or implementing this change."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <button
            onClick={() => setChatOpen(true)}
            className="group flex items-center gap-3 rounded border border-accent-200 bg-accent-50/50 p-3.5 text-left transition-colors hover:bg-accent-50"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded bg-brand-700 text-white">
              <Sparkles size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                AI Advisory Assistant
                <Tag tone="accent" size="sm">
                  Agentic
                </Tag>
              </p>
              <p className="text-xs text-slate-500">
                Ask questions about this change — answered from the report.
              </p>
            </div>
            <ArrowRight size={16} className="text-accent-600 transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            onClick={() => setSupportOpen(true)}
            disabled={!ticket}
            className="group flex items-center gap-3 rounded border border-slate-200 bg-white p-3.5 text-left transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded bg-slate-100 text-slate-600">
              <MessageSquare size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">Request Legal Support</p>
              <p className="text-xs text-slate-500">
                Raise a second-level clarification to Legal/Compliance.
              </p>
            </div>
            <ArrowRight size={16} className="text-slate-400 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* FAQ */}
        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <HelpCircle size={13} /> Frequently asked questions
          </p>
          <div className="space-y-2">
            {content.faq.map((f, i) => (
              <details key={i} className="group rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800 marker:hidden">
                  {f.q}
                </summary>
                <p className="mt-1.5 text-sm text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Chatbot SlideOver */}
      <SlideOver
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        title="AI Advisory Assistant"
        description={change.title}
        width="lg"
      >
        <AdvisoryChatbot
          change={change}
          content={content}
          obligations={changeObligations}
          impact={myImpact}
          currentDate={currentDate}
          onTranscriptChange={setTranscript}
        />
      </SlideOver>

      {/* Support request Modal */}
      <Modal
        open={supportOpen}
        onClose={() => setSupportOpen(false)}
        title="Request Legal Support"
        description="Raise a second-level clarification to Legal/Compliance."
        footer={
          <>
            <Button variant="ghost" onClick={() => setSupportOpen(false)}>
              Cancel
            </Button>
            <Button icon={Send} disabled={!subject.trim()} onClick={submitSupport}>
              Submit request
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Subject
            </span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Scope of intragroup supply contracts"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Description
            </span>
            <textarea
              value={description}
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you need clarified…"
              className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Reference report section"
              value={section}
              onChange={setSection}
              options={SECTION_OPTIONS.map((s) => ({ label: s, value: s }))}
            />
            <Select
              label="Priority"
              value={priority}
              onChange={(v) => setPriority(v as RiskPriority)}
              options={[
                { label: 'High', value: 'High' },
                { label: 'Medium', value: 'Medium' },
                { label: 'Low', value: 'Low' },
              ]}
            />
          </div>
          <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2.5">
            <input
              type="checkbox"
              checked={attachTranscript}
              disabled={transcript.length === 0}
              onChange={(e) => setAttachTranscript(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500 disabled:opacity-50"
            />
            <span className="text-sm text-slate-600">
              Attach AI chatbot transcript
              {transcript.length === 0 ? (
                <span className="text-slate-400"> (no conversation yet)</span>
              ) : (
                <span className="text-slate-400"> ({transcript.length} messages)</span>
              )}
            </span>
          </label>
        </div>
      </Modal>

      {/* Report view Modal */}
      <Modal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Communication Report"
        description={change.title}
        size="lg"
        footer={
          <Button icon={Download} onClick={() => { handleDownload(); setReportOpen(false); }}>
            Download
          </Button>
        }
      >
        <div className="space-y-5 text-sm text-slate-600">
          <ReportSection title="Executive Summary">{content.executiveSummary}</ReportSection>
          <ReportSection title="What is changing">{content.whatIsChanging}</ReportSection>
          <ReportSection title="Why it matters">{content.whyItMatters}</ReportSection>
          <ReportSection title="What you need to do">
            <ul className="list-disc space-y-1 pl-5">
              {content.requiredActions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </ReportSection>
          <ReportSection title="Key Dates">
            <div className="flex flex-wrap gap-2">
              {content.keyDates.map((d) => (
                <span key={d.label} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs">
                  <span className="text-slate-400">{d.label}: </span>
                  <span className="font-mono font-semibold text-slate-700">{d.date}</span>
                </span>
              ))}
            </div>
          </ReportSection>
          <ReportSection title="Evidence required for audit">
            <ul className="list-disc space-y-1 pl-5">
              {content.evidenceRequired.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </ReportSection>
          {legalNotes.length > 0 && (
            <ReportSection title="Legal Notes">
              <ul className="list-disc space-y-1 pl-5">
                {legalNotes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </ReportSection>
          )}
        </div>
      </Modal>
    </div>
  );
}

function ReportSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </p>
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
