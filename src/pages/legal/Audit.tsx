import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Database,
  Download,
  FileCheck2,
  FileText,
  History,
  ListChecks,
  MessageSquare,
  Minus,
  Radar,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  AIThinkingIndicator,
  Button,
  Card,
  DataTable,
  PageHeader,
  SectionCard,
  Tag,
  Timeline,
} from '../../components';
import type { Column, TimelineItem, TimelineTone } from '../../components';
import { useDemoStore } from '../../store/DemoStore';
import { useToast } from '../../context/ToastContext';
import { REMIT_II_ID } from '../../data';
import { AUDIT_READY_STATES, COMPLETED_STATES } from '../../lib/metrics';
import { formatDate, formatDateTime } from '../../lib/format';
import type { Evidence, Ticket } from '../../types';

const AUDIT_CAPTIONS = [
  'Compiling audit trail…',
  'Aggregating evidence…',
  'Assessing obligation coverage…',
  'Finalising compliance status…',
];

function actionMeta(action: string): { tone: TimelineTone; icon: TimelineItem['icon'] } {
  const a = action.toLowerCase();
  if (a.includes('detected')) return { tone: 'accent', icon: Radar };
  if (a.includes('catalogue')) return { tone: 'accent', icon: Database };
  if (a.includes('communication')) return { tone: 'brand', icon: Send };
  if (a.includes('viewed')) return { tone: 'neutral', icon: FileText };
  if (a.includes('download')) return { tone: 'neutral', icon: Download };
  if (a.includes('clarification') || a.includes('support')) return { tone: 'warning', icon: MessageSquare };
  if (a.includes('evidence')) return { tone: 'success', icon: FileCheck2 };
  if (a.includes('submitted') || a.includes('compliance action')) return { tone: 'success', icon: CheckCircle2 };
  if (a.includes('reminder')) return { tone: 'warning', icon: Clock };
  if (a.includes('escalat') || a.includes('deadline')) return { tone: 'danger', icon: AlertTriangle };
  return { tone: 'brand', icon: undefined };
}

function YesNo({ value }: { value: boolean }) {
  return value ? (
    <Check size={16} className="mx-auto text-emerald-500" />
  ) : (
    <Minus size={15} className="mx-auto text-slate-300" />
  );
}

function ReportBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </p>
      <div className="text-sm text-slate-600">{children}</div>
    </div>
  );
}

export default function Audit() {
  const { toast } = useToast();
  const {
    regulatoryChanges,
    obligations,
    businessUnitImpacts,
    tickets,
    evidence,
    supportRequests,
    auditTrail,
    currentDate,
  } = useDemoStore();

  const change = regulatoryChanges.find((c) => c.id === REMIT_II_ID);
  const changeObligations = obligations.filter((o) => o.regChangeId === REMIT_II_ID);
  const impacts = businessUnitImpacts.filter((i) => i.regChangeId === REMIT_II_ID);
  const myTickets = useMemo(
    () => tickets.filter((t) => t.regChangeId === REMIT_II_ID),
    [tickets],
  );
  const myEvidence = useMemo(
    () => evidence.filter((e) => myTickets.some((t) => t.id === e.ticketId)),
    [evidence, myTickets],
  );
  const myRequests = supportRequests.filter((s) =>
    myTickets.some((t) => t.id === s.ticketId),
  );
  const escalated = myTickets.filter((t) => t.status === 'Escalated');

  const timelineItems: TimelineItem[] = useMemo(
    () =>
      auditTrail
        .filter((e) => e.regChangeId === REMIT_II_ID)
        .slice()
        .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
        .map((e) => {
          const meta = actionMeta(e.action);
          return {
            id: e.id,
            title: e.action,
            detail: e.detail,
            actor: e.actor,
            timestamp: formatDateTime(e.timestamp),
            tone: meta.tone,
            icon: meta.icon,
          };
        }),
    [auditTrail],
  );

  const finalStatus = useMemo(() => {
    if (myTickets.length === 0) return { label: 'No tickets', tone: 'neutral' as const };
    if (escalated.length > 0)
      return { label: 'Action required — escalations', tone: 'danger' as const };
    if (myTickets.every((t) => AUDIT_READY_STATES.includes(t.status)))
      return { label: 'Audit ready', tone: 'success' as const };
    if (myTickets.every((t) => COMPLETED_STATES.includes(t.status)))
      return { label: 'Completed', tone: 'success' as const };
    return { label: 'In progress', tone: 'warning' as const };
  }, [myTickets, escalated]);

  const dueDateFor = (bu: string) =>
    impacts.find((i) => i.businessUnit === bu)?.dueDate ??
    change?.implementationDueDate ??
    currentDate;

  // Report generation state machine
  const [reportState, setReportState] = useState<'idle' | 'generating' | 'ready'>('idle');
  const [cap, setCap] = useState(0);
  useEffect(() => {
    if (reportState !== 'generating') return;
    setCap(0);
    const iv = setInterval(() => setCap((c) => Math.min(c + 1, AUDIT_CAPTIONS.length - 1)), 625);
    const to = setTimeout(() => {
      clearInterval(iv);
      setReportState('ready');
    }, 2500);
    return () => {
      clearInterval(iv);
      clearTimeout(to);
    };
  }, [reportState]);

  if (!change) {
    return (
      <Card className="p-10 text-center">
        <p className="text-sm font-semibold text-slate-700">No regulatory change to audit.</p>
      </Card>
    );
  }

  const auditColumns: Column<Ticket>[] = [
    {
      key: 'businessUnit',
      header: 'Business Unit',
      render: (r) => <span className="font-semibold text-slate-900">{r.businessUnit}</span>,
    },
    { key: 'comm', header: 'Comm. Sent', align: 'center', render: () => <YesNo value /> },
    { key: 'viewed', header: 'Viewed', align: 'center', render: (r) => <YesNo value={r.viewed} /> },
    {
      key: 'evidence',
      header: 'Evidence',
      align: 'center',
      render: (r) => <YesNo value={r.evidenceUploaded} />,
    },
    {
      key: 'completedOn',
      header: 'Completed On',
      render: (r) => <span className="font-mono text-xs">{formatDate(r.completedOn)}</span>,
    },
    {
      key: 'due',
      header: 'Due',
      render: (r) => (
        <span className="font-mono text-xs">{formatDate(dueDateFor(r.businessUnit))}</span>
      ),
    },
    {
      key: 'auditStatus',
      header: 'Audit Status',
      render: (r) =>
        r.status === 'Escalated' ? (
          <Tag tone="danger" size="sm" withDot>
            Escalated
          </Tag>
        ) : AUDIT_READY_STATES.includes(r.status) ? (
          <Tag tone="success" size="sm">
            Ready for Audit
          </Tag>
        ) : (
          <Tag tone="neutral" size="sm">
            Pending
          </Tag>
        ),
    },
  ];

  const evidenceColumns: Column<Evidence>[] = [
    {
      key: 'fileName',
      header: 'File',
      render: (r) => (
        <div className="flex items-center gap-2">
          <FileCheck2 size={15} className="shrink-0 text-accent-500" />
          <span className="font-medium text-slate-800">{r.fileName}</span>
          <Tag tone="neutral" size="sm">
            {r.fileType}
          </Tag>
        </div>
      ),
    },
    {
      key: 'bu',
      header: 'Business Unit',
      render: (r) => tickets.find((t) => t.id === r.ticketId)?.businessUnit ?? '—',
    },
    {
      key: 'obligation',
      header: 'Linked Obligation',
      render: (r) => {
        const o = obligations.find((ob) => ob.id === r.linkedObligationId);
        return (
          <span className="text-xs text-slate-500">
            {r.linkedObligationId}
            {o ? ` · ${o.text.slice(0, 40)}${o.text.length > 40 ? '…' : ''}` : ''}
          </span>
        );
      },
    },
    { key: 'uploadedBy', header: 'Uploaded By' },
    {
      key: 'uploadedOn',
      header: 'On',
      align: 'right',
      render: (r) => <span className="font-mono text-xs text-slate-500">{formatDate(r.uploadedOn)}</span>,
    },
  ];

  const exportReport = () =>
    toast({
      title: 'Audit report exported',
      description: 'Regulatory Action Plan Report saved (demo).',
      variant: 'success',
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        crumbs={[{ label: 'Legal / Compliance' }, { label: 'Audit & Reporting' }]}
        title="Audit & Regulatory Reporting"
        description={`End-to-end evidence and audit readiness for ${change.title}.`}
        meta={
          <Tag tone={finalStatus.tone} withDot>
            {finalStatus.label}
          </Tag>
        }
      />

      {/* Per-BU audit table */}
      <SectionCard title="Per-Business-Unit Audit View" icon={Building2} flushBody>
        <DataTable columns={auditColumns} data={myTickets} getRowId={(r) => r.id} dense />
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Timeline */}
        <SectionCard title="End-to-End Timeline" icon={History}>
          <Timeline items={timelineItems} />
        </SectionCard>

        {/* Evidence repository */}
        <SectionCard
          title="Evidence Repository"
          icon={FileCheck2}
          description={`${myEvidence.length} item${myEvidence.length === 1 ? '' : 's'}`}
          flushBody
        >
          <DataTable
            columns={evidenceColumns}
            data={myEvidence}
            getRowId={(r) => r.id}
            emptyMessage="No evidence has been collected yet."
            dense
          />
        </SectionCard>
      </div>

      {/* Report generation */}
      <SectionCard
        title="Regulatory Action Plan Report"
        icon={ShieldCheck}
        iconTone="accent"
        actions={
          reportState === 'ready' ? (
            <div className="flex gap-2">
              <Button variant="secondary" icon={Sparkles} onClick={() => setReportState('generating')}>
                Regenerate
              </Button>
              <Button icon={Download} onClick={exportReport}>
                Export
              </Button>
            </div>
          ) : (
            <Button
              icon={ShieldCheck}
              loading={reportState === 'generating'}
              disabled={reportState === 'generating'}
              onClick={() => setReportState('generating')}
            >
              Generate Report
            </Button>
          )
        }
      >
        {reportState === 'idle' && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-6 py-12 text-center">
            <ShieldCheck size={24} className="text-slate-300" />
            <p className="mt-2 text-sm text-slate-400">
              Generate a consolidated regulatory action plan report from the live store data.
            </p>
          </div>
        )}

        {reportState === 'generating' && (
          <div className="space-y-4">
            <AIThinkingIndicator
              variant="panel"
              label={AUDIT_CAPTIONS[cap]}
              sublabel="Consolidating obligations, evidence, communications and the audit trail"
            />
            <div className="grid gap-2 sm:grid-cols-2">
              {AUDIT_CAPTIONS.map((c, i) => (
                <div
                  key={c}
                  className={
                    i <= cap
                      ? 'flex items-center gap-2 rounded-lg border border-accent-200 bg-accent-50/50 px-3 py-2 text-sm text-slate-700'
                      : 'flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/40 px-3 py-2 text-sm text-slate-400'
                  }
                >
                  {i < cap ? (
                    <CheckCircle2 size={15} className="text-accent-600" />
                  ) : (
                    <Sparkles size={15} className={i === cap ? 'text-brand-600' : 'text-slate-300'} />
                  )}
                  {c}
                </div>
              ))}
            </div>
          </div>
        )}

        {reportState === 'ready' && (
          <div className="space-y-6 animate-fade-in">
            {/* Summary */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-base font-bold text-slate-900">{change.title}</p>
                <Tag tone={finalStatus.tone} withDot>
                  {finalStatus.label}
                </Tag>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {change.regulatorySource} · due {formatDate(change.implementationDueDate)} · report as
                of {formatDate(currentDate)}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <ReportBlock title="Obligations">
                <ul className="list-disc space-y-1 pl-5">
                  {changeObligations.map((o) => (
                    <li key={o.id}>{o.text}</li>
                  ))}
                </ul>
              </ReportBlock>

              <ReportBlock title="Impacted Business Units & Implementation Status">
                <ul className="space-y-1">
                  {myTickets.map((t) => (
                    <li key={t.id} className="flex items-center justify-between gap-2">
                      <span>{t.businessUnit}</span>
                      <Tag
                        tone={
                          t.status === 'Escalated'
                            ? 'danger'
                            : AUDIT_READY_STATES.includes(t.status)
                              ? 'success'
                              : 'neutral'
                        }
                        size="sm"
                      >
                        {t.status}
                      </Tag>
                    </li>
                  ))}
                </ul>
              </ReportBlock>

              <ReportBlock title={`Evidence Collected (${myEvidence.length})`}>
                {myEvidence.length === 0 ? (
                  <span className="text-slate-400">None yet.</span>
                ) : (
                  <ul className="list-disc space-y-1 pl-5">
                    {myEvidence.map((e) => (
                      <li key={e.id}>
                        {e.fileName}{' '}
                        <span className="text-slate-400">({e.linkedObligationId})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </ReportBlock>

              <ReportBlock title="Communications">
                <p>
                  Communication status:{' '}
                  <span className="font-medium text-slate-700">{change.communicationStatus}</span>.
                  Notified {myTickets.length} Business Units.
                </p>
              </ReportBlock>

              <ReportBlock title={`Clarifications (${myRequests.length})`}>
                {myRequests.length === 0 ? (
                  <span className="text-slate-400">None.</span>
                ) : (
                  <ul className="list-disc space-y-1 pl-5">
                    {myRequests.map((r) => (
                      <li key={r.id}>
                        {r.businessUnit}: {r.question.slice(0, 70)}
                        {r.question.length > 70 ? '…' : ''}{' '}
                        <span className="text-slate-400">({r.status})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </ReportBlock>

              <ReportBlock title={`Escalations (${escalated.length})`}>
                {escalated.length === 0 ? (
                  <span className="text-slate-400">No escalations.</span>
                ) : (
                  <ul className="list-disc space-y-1 pl-5">
                    {escalated.map((t) => (
                      <li key={t.id}>{t.businessUnit} — escalated at deadline</li>
                    ))}
                  </ul>
                )}
              </ReportBlock>
            </div>

            <ReportBlock title="Audit Trail">
              <ol className="space-y-1.5">
                {timelineItems.map((e) => (
                  <li key={e.id} className="flex items-baseline justify-between gap-3">
                    <span>
                      <span className="font-medium text-slate-700">{e.title}</span>
                      {e.actor ? ` — ${e.actor}` : ''}
                    </span>
                    <span className="shrink-0 font-mono text-xs text-slate-400">
                      {e.timestamp}
                    </span>
                  </li>
                ))}
              </ol>
            </ReportBlock>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                  <BadgeCheck size={20} />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Final compliance status
                  </p>
                  <p className="text-sm font-bold text-slate-900">{finalStatus.label}</p>
                </div>
              </div>
              <Button icon={Download} onClick={exportReport}>
                Export
              </Button>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Quick obligation reference (always visible) */}
      <SectionCard title="Obligations Reference" icon={ListChecks} flushBody>
        <ul className="divide-y divide-slate-100">
          {changeObligations.map((o, i) => (
            <li key={o.id} className="flex items-start gap-3 px-5 py-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-700 font-mono text-xs font-semibold text-white">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-800">{o.text}</p>
                <p className="text-xs text-slate-400">{o.linkedProcess}</p>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
