import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  ListChecks,
  Plus,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import {
  Button,
  Card,
  PageHeader,
  RiskBadge,
  SectionCard,
  Select,
  StatusBadge,
  Tag,
} from '../../components';
import { useDemoStore } from '../../store/DemoStore';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../lib/format';
import { COMPLETED_STATES } from '../../lib/metrics';
import type { RiskPriority } from '../../types';

const EXAMPLE_MEASURE = {
  description:
    'Configured trade capture system to generate REMIT II-compliant transaction reports with all mandatory fields (contract type, counterparty LEI, delivery point, price and volume). Reports are submitted automatically to ACER\'s ARIS portal by 08:00 on T+1 for all standard contracts and orders.',
  process: 'Transaction reporting — wholesale energy trades',
  control: 'Automated T+1 REMIT II submission pipeline with pre-submission validation rules',
  owner: 'Head of Wholesale Market Operations',
  comments: 'UAT completed against 30 days of historical transactions. All validation checks passed.',
};

const EVIDENCE_PRESETS = [
  'RRM_Connectivity_Test.pdf',
  'T1_Reporting_Runbook.docx',
  'Transaction_Reconciliation_Log.xlsx',
  'Reporting_Process_Screenshot.png',
  'Training_Completion.xlsx',
];

const CHECKLIST = [
  { key: 'controls', label: 'Controls implemented and operating' },
  { key: 'evidenceCollected', label: 'Supporting evidence collected' },
  { key: 'reviewed', label: 'Reviewed with the process owner' },
] as const;
type ChecklistKey = (typeof CHECKLIST)[number]['key'];

function FieldLabel({ children }: { children: string }) {
  return (
    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </span>
  );
}

export default function BuTicket() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    tickets,
    regulatoryChanges,
    obligations,
    businessUnitImpacts,
    evidence,
    currentDate,
    addComplianceMeasure,
    addEvidence,
    submitCompliance,
  } = useDemoStore();

  const ticket = tickets.find((t) => t.id === id);
  const change = regulatoryChanges.find((c) => c.id === ticket?.regChangeId);
  const changeObligations = useMemo(
    () => obligations.filter((o) => o.regChangeId === ticket?.regChangeId),
    [obligations, ticket?.regChangeId],
  );
  const myImpact = businessUnitImpacts.find(
    (i) => i.regChangeId === ticket?.regChangeId && i.businessUnit === ticket?.businessUnit,
  );
  const myEvidence = useMemo(
    () => evidence.filter((e) => e.ticketId === id),
    [evidence, id],
  );

  // Compliance measure form
  const [mDescription, setMDescription] = useState('');
  const [mProcess, setMProcess] = useState(myImpact?.impactedProcess ?? '');
  const [mControl, setMControl] = useState('');
  const [mDate, setMDate] = useState(currentDate);
  const [mOwner, setMOwner] = useState(myImpact?.owner ?? '');
  const [mComments, setMComments] = useState('');
  const [mObligation, setMObligation] = useState(changeObligations[0]?.id ?? '');

  // Sign-off
  const [residualRisk, setResidualRisk] = useState<RiskPriority | ''>('');
  const [checklist, setChecklist] = useState<Record<ChecklistKey, boolean>>({
    controls: false,
    evidenceCollected: false,
    reviewed: false,
  });
  const [ownerConfirmed, setOwnerConfirmed] = useState(false);

  // Evidence form
  const [evPreset, setEvPreset] = useState(EVIDENCE_PRESETS[0]);
  const [evCustom, setEvCustom] = useState('');
  const [evObligation, setEvObligation] = useState(changeObligations[0]?.id ?? '');

  if (!ticket || !change) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/bu/dashboard')}>
          Back to Dashboard
        </Button>
        <Card className="p-10 text-center">
          <p className="text-sm font-semibold text-slate-700">Ticket not found</p>
          <p className="mt-1 text-sm text-slate-400">No record exists for id “{id}”.</p>
        </Card>
      </div>
    );
  }

  const isCompleted = COMPLETED_STATES.includes(ticket.status);
  const obligationOptions = changeObligations.map((o) => ({
    label: `${o.text.slice(0, 48)}${o.text.length > 48 ? '…' : ''}`,
    value: o.id,
  }));

  const addMeasure = () => {
    if (!mDescription.trim()) return;
    addComplianceMeasure(ticket.id, {
      text: mDescription.trim(),
      affectedProcess: mProcess.trim() || undefined,
      controlIntroduced: mControl.trim() || undefined,
      implementationDate: mDate,
      owner: mOwner.trim() || undefined,
      comments: mComments.trim() || undefined,
      linkedObligationId: mObligation || undefined,
    });
    setMDescription('');
    setMControl('');
    setMComments('');
    setChecklist((c) => ({ ...c, controls: true }));
    toast({ title: 'Compliance measure added', variant: 'success' });
  };

  const uploadEvidence = () => {
    const fileName = evCustom.trim() || evPreset;
    addEvidence({
      ticketId: ticket.id,
      fileName,
      linkedObligationId: evObligation,
      uploadedBy: myImpact?.owner ?? ticket.businessUnit,
    });
    setEvCustom('');
    setChecklist((c) => ({ ...c, evidenceCollected: true }));
    toast({ title: 'Evidence uploaded', description: fileName, variant: 'success' });
  };

  const measures = ticket.complianceMeasures;
  const allChecked = CHECKLIST.every((c) => checklist[c.key]);
  const missing: string[] = [];
  if (measures.length === 0) missing.push('Add at least one compliance measure');
  if (myEvidence.length === 0) missing.push('Upload at least one evidence item');
  if (!residualRisk) missing.push('Select a residual risk rating');
  if (!allChecked) missing.push('Complete the completion checklist');
  if (!ownerConfirmed) missing.push('Confirm as Business Owner');
  const canSubmit = missing.length === 0;

  const handleSubmit = () => {
    if (!canSubmit || !residualRisk) return;
    submitCompliance(ticket.id, residualRisk);
    toast({
      title: 'Compliance action submitted',
      description: 'Legal has been notified. Now available for audit review.',
      variant: 'success',
    });
  };

  /* ----------------------------- completed view ----------------------------- */
  if (isCompleted) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          icon={ArrowLeft}
          onClick={() => navigate(`/bu/regulatory-change/${change.id}`)}
        >
          Back to {change.title}
        </Button>
        <Card className="overflow-hidden">
          <div className="flex flex-col items-center border-b border-emerald-200 bg-emerald-50/50 px-6 py-9 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-md border border-emerald-300 bg-white text-emerald-600">
              <CheckCircle2 size={26} />
            </span>
            <h2 className="mt-3 text-base font-semibold text-slate-900">
              Compliance action submitted successfully
            </h2>
            <p className="mt-1 max-w-md text-sm text-slate-600">
              Legal has been notified. This item is now available for audit review.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <StatusBadge state={ticket.status} />
              {ticket.residualRisk && <RiskBadge level={ticket.residualRisk} size="sm" suffix="residual" />}
            </div>
          </div>
        </Card>

        <SectionCard title="Submitted Compliance Measures" icon={ListChecks}>
          {measures.length === 0 ? (
            <p className="text-sm text-slate-400">No measures recorded.</p>
          ) : (
            <ul className="space-y-2">
              {measures.map((m) => (
                <li key={m.id} className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                  <p className="text-sm font-semibold text-slate-800">{m.text}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {[m.affectedProcess, m.controlIntroduced, m.implementationDate && formatDate(m.implementationDate), m.owner]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Evidence" icon={FileCheck2} flushBody>
          <ul className="divide-y divide-slate-100">
            {myEvidence.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <FileCheck2 size={16} className="shrink-0 text-accent-500" />
                  <span className="truncate text-sm font-medium text-slate-700">{e.fileName}</span>
                  <Tag tone="neutral" size="sm">
                    {e.fileType}
                  </Tag>
                </div>
                <span className="shrink-0 font-mono text-xs text-slate-400">
                  {formatDate(e.uploadedOn)}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    );
  }

  /* ------------------------------- active view ------------------------------- */
  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[
          { label: `Business Unit · ${ticket.businessUnit}`, to: '/bu/dashboard' },
          { label: 'Notification', to: `/bu/regulatory-change/${change.id}` },
          { label: 'Compliance Ticket' },
        ]}
        title="Compliance Ticket"
        description={change.title}
        meta={<StatusBadge state={ticket.status} />}
      />

      {/* Compliance measures */}
      <SectionCard
        title="Compliance Measures"
        icon={ListChecks}
        description={`${measures.length} recorded`}
      >
        {measures.length > 0 && (
          <ul className="mb-5 space-y-2">
            {measures.map((m) => (
              <li key={m.id} className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-800">{m.text}</p>
                  {m.linkedObligationId && (
                    <Tag tone="brand" size="sm">
                      {m.linkedObligationId}
                    </Tag>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-slate-400">
                  {[m.affectedProcess, m.controlIntroduced, m.implementationDate && formatDate(m.implementationDate), m.owner]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
                {m.comments && <p className="mt-1 text-xs text-slate-500">{m.comments}</p>}
              </li>
            ))}
          </ul>
        )}

        <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">Add a compliance measure</p>
            <button
              type="button"
              onClick={() => {
                setMDescription(EXAMPLE_MEASURE.description);
                setMProcess(EXAMPLE_MEASURE.process);
                setMControl(EXAMPLE_MEASURE.control);
                setMOwner(EXAMPLE_MEASURE.owner);
                setMComments(EXAMPLE_MEASURE.comments);
              }}
              className="rounded-md border border-dashed border-slate-300 px-2 py-0.5 text-[11px] font-medium text-slate-500 transition-colors hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
            >
              Use example
            </button>
          </div>
          <div className="space-y-3">
            <label className="block">
              <FieldLabel>Implemented control description</FieldLabel>
              <textarea
                value={mDescription}
                rows={2}
                onChange={(e) => setMDescription(e.target.value)}
                placeholder="Describe the control you implemented…"
                className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <FieldLabel>Affected process</FieldLabel>
                <input
                  value={mProcess}
                  onChange={(e) => setMProcess(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </label>
              <label className="block">
                <FieldLabel>Control introduced</FieldLabel>
                <input
                  value={mControl}
                  onChange={(e) => setMControl(e.target.value)}
                  placeholder="e.g. Automated T+1 submission check"
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </label>
              <label className="block">
                <FieldLabel>Implementation date</FieldLabel>
                <input
                  type="date"
                  value={mDate}
                  onChange={(e) => setMDate(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </label>
              <label className="block">
                <FieldLabel>Owner</FieldLabel>
                <input
                  value={mOwner}
                  onChange={(e) => setMOwner(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </label>
              {obligationOptions.length > 0 && (
                <Select
                  label="Linked obligation"
                  value={mObligation}
                  onChange={setMObligation}
                  options={obligationOptions}
                />
              )}
              <label className="block">
                <FieldLabel>Comments</FieldLabel>
                <input
                  value={mComments}
                  onChange={(e) => setMComments(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </label>
            </div>
            <Button icon={Plus} disabled={!mDescription.trim()} onClick={addMeasure}>
              Add measure
            </Button>
          </div>
        </div>
      </SectionCard>

      {/* Evidence */}
      <SectionCard title="Upload Evidence" icon={Upload} description={`${myEvidence.length} uploaded`}>
        {myEvidence.length > 0 && (
          <ul className="mb-4 divide-y divide-slate-100 rounded-lg border border-slate-100">
            {myEvidence.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <FileCheck2 size={16} className="shrink-0 text-accent-500" />
                  <span className="truncate text-sm font-medium text-slate-700">{e.fileName}</span>
                  <Tag tone="neutral" size="sm">
                    {e.fileType}
                  </Tag>
                  {e.linkedObligationId && (
                    <Tag tone="brand" size="sm">
                      {e.linkedObligationId}
                    </Tag>
                  )}
                </div>
                <span className="shrink-0 font-mono text-xs text-slate-400">
                  {e.uploadedBy}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-4 sm:grid-cols-3">
          <Select
            label="Choose a file"
            value={evPreset}
            onChange={setEvPreset}
            options={EVIDENCE_PRESETS.map((f) => ({ label: f, value: f }))}
          />
          <label className="block">
            <FieldLabel>…or type a file name</FieldLabel>
            <input
              value={evCustom}
              onChange={(e) => setEvCustom(e.target.value)}
              placeholder="Custom_Evidence.pdf"
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </label>
          {obligationOptions.length > 0 && (
            <Select
              label="Link to obligation"
              value={evObligation}
              onChange={setEvObligation}
              options={obligationOptions}
            />
          )}
        </div>
        <div className="mt-3">
          <Button variant="secondary" icon={Upload} onClick={uploadEvidence}>
            Upload evidence
          </Button>
        </div>
      </SectionCard>

      {/* Sign-off */}
      <SectionCard title="Sign-off" icon={ShieldCheck} iconTone="accent">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-4">
            <Select
              label="Residual risk"
              value={residualRisk}
              onChange={(v) => setResidualRisk(v as RiskPriority)}
              options={[
                { label: 'Select…', value: '' },
                { label: 'Low', value: 'Low' },
                { label: 'Medium', value: 'Medium' },
                { label: 'High', value: 'High' },
              ]}
            />
            <div>
              <FieldLabel>Completion checklist</FieldLabel>
              <div className="space-y-2">
                {CHECKLIST.map((c) => (
                  <label key={c.key} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={checklist[c.key]}
                      onChange={(e) =>
                        setChecklist((prev) => ({ ...prev, [c.key]: e.target.checked }))
                      }
                      className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500"
                    />
                    {c.label}
                  </label>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={ownerConfirmed}
                onChange={(e) => setOwnerConfirmed(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500"
              />
              I confirm, as Business Owner, that these measures are accurate and complete.
            </label>
          </div>

          {/* Validation + submit */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/40 p-4">
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <ClipboardList size={13} /> Before you submit
              </p>
              {missing.length === 0 ? (
                <p className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                  <CheckCircle2 size={16} /> All requirements met — ready to submit.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {missing.map((m) => (
                    <li key={m} className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                      {m}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Button
              icon={BadgeCheck}
              size="lg"
              fullWidth
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="mt-4"
            >
              Submit &amp; Close
            </Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
