import { useNavigate, useParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  ArrowLeft,
  Building2,
  Download,
  FileText,
  Layers,
  ListChecks,
  Send,
  ShieldCheck,
} from 'lucide-react';
import {
  Button,
  Card,
  DataTable,
  PageHeader,
  RiskBadge,
  SectionCard,
  Tag,
} from '../../components';
import type { Column, TagTone } from '../../components';
import { useDemoStore } from '../../store/DemoStore';
import { useToast } from '../../context/ToastContext';
import type {
  AuditStatus,
  BusinessUnitImpact,
  CommunicationStatus,
  ImplementationStatus,
} from '../../types';
import { formatDate } from '../../lib/format';

const COMMUNICATION_TONE: Record<CommunicationStatus, TagTone> = {
  'Not Started': 'neutral',
  Draft: 'neutral',
  'Partially Sent': 'info',
  Sent: 'success',
};
const IMPLEMENTATION_TONE: Record<ImplementationStatus, TagTone> = {
  'Not Started': 'neutral',
  'In Progress': 'info',
  Completed: 'success',
};
const AUDIT_TONE: Record<AuditStatus, TagTone> = {
  'Not Ready': 'neutral',
  'Ready for Audit': 'success',
  Reported: 'accent',
};

/** Mock document set surfaced for any regulatory change. */
const DOCUMENTS = [
  { name: 'REMIT II — Full Regulation Text (ACER).pdf', size: '1.8 MB' },
  { name: 'ACER Transaction Reporting Guidance v2.pdf', size: '920 KB' },
  { name: 'Internal Impact Assessment.docx', size: '340 KB' },
  { name: 'RRM Onboarding Checklist.pdf', size: '210 KB' },
];

function DefRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </dt>
      <dd className="text-sm font-medium text-slate-800">{children}</dd>
    </div>
  );
}

export default function LegalRegChangeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { regulatoryChanges, obligations, businessUnitImpacts } = useDemoStore();

  const change = regulatoryChanges.find((c) => c.id === id);
  const changeObligations = obligations.filter((o) => o.regChangeId === id);
  const impacts = businessUnitImpacts.filter((i) => i.regChangeId === id);

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
      align: 'right',
      render: (r) => <span className="font-mono text-xs text-slate-500">{formatDate(r.dueDate)}</span>,
    },
  ];

  const handleDownload = (name: string) =>
    toast({ title: 'Download started', description: name, variant: 'info' });

  const handleGenerateReport = () =>
    navigate(`/legal/regulatory-change/${change.id}/communicate`);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        crumbs={[
          { label: 'Legal / Compliance' },
          { label: 'Impact Overview', to: '/legal/impact-overview' },
          { label: change.id },
        ]}
        title={change.title}
        description={change.regulatorySource}
        meta={<RiskBadge level={change.riskPriority} size="sm" suffix="Risk" />}
        actions={
          <Button icon={Send} size="lg" onClick={handleGenerateReport}>
            Generate Communication Report
          </Button>
        }
      />

      {/* Regulatory Overview */}
      <SectionCard title="Regulatory Overview" icon={FileText}>
        <p className="text-sm leading-relaxed text-slate-600">{change.description}</p>
        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
          <DefRow label="Source">{change.regulatorySource}</DefRow>
          <DefRow label="Regulatory Area">{change.regulatoryArea}</DefRow>
          <DefRow label="Risk / Priority">
            <RiskBadge level={change.riskPriority} size="sm" />
          </DefRow>
          <DefRow label="Publication">{formatDate(change.publicationDate)}</DefRow>
          <DefRow label="Effective Date">{formatDate(change.effectiveDate)}</DefRow>
          <DefRow label="Implementation Due">{formatDate(change.implementationDueDate)}</DefRow>
          <DefRow label="Communication">
            <Tag tone={COMMUNICATION_TONE[change.communicationStatus]} size="sm">
              {change.communicationStatus}
            </Tag>
          </DefRow>
          <DefRow label="Implementation">
            <Tag tone={IMPLEMENTATION_TONE[change.implementationStatus]} size="sm">
              {change.implementationStatus}
            </Tag>
          </DefRow>
          <DefRow label="Audit">
            <Tag tone={AUDIT_TONE[change.auditStatus]} size="sm">
              {change.auditStatus}
            </Tag>
          </DefRow>
        </dl>
      </SectionCard>

      {/* Obligation Mapping */}
      <SectionCard
        title="Obligation Mapping"
        icon={ListChecks}
        description={`${changeObligations.length} obligation${changeObligations.length === 1 ? '' : 's'} mapped`}
      >
        {changeObligations.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">
            No obligations have been mapped for this regulatory change yet.
          </p>
        ) : (
          <ol className="space-y-3">
            {changeObligations.map((o, idx) => (
              <li key={o.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-700 font-mono text-xs font-semibold text-white">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1 space-y-3">
                    <p className="text-sm font-semibold text-slate-900">{o.text}</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <DefRow label="Requirement">
                        <span className="font-normal text-slate-600">{o.requirement}</span>
                      </DefRow>
                      <DefRow label="Interpretation">
                        <span className="font-normal text-slate-600">{o.interpretation}</span>
                      </DefRow>
                      <DefRow label="Scope">
                        <span className="font-normal text-slate-600">{o.scope}</span>
                      </DefRow>
                      <DefRow label="Linked Internal Process">
                        <Tag tone="brand" size="sm">
                          {o.linkedProcess}
                        </Tag>
                      </DefRow>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </SectionCard>

      {/* Impact Assessment */}
      <SectionCard
        title="Impact Assessment"
        icon={Building2}
        description={`${impacts.length} impacted Business Unit${impacts.length === 1 ? '' : 's'}`}
        flushBody
      >
        <DataTable
          columns={impactColumns}
          data={impacts}
          getRowId={(r) => r.id}
          emptyMessage="No Business Unit impact has been assessed for this change yet."
          dense
        />
      </SectionCard>

      {/* Documentation */}
      <SectionCard title="Documentation" icon={Layers} flushBody>
        <ul className="divide-y divide-slate-100">
          {DOCUMENTS.map((doc) => (
            <li
              key={doc.name}
              className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-slate-50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <FileText size={18} className="shrink-0 text-slate-400" />
                <span className="truncate text-sm font-medium text-slate-700">{doc.name}</span>
                <span className="shrink-0 font-mono text-xs text-slate-400">{doc.size}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                icon={Download}
                onClick={() => handleDownload(doc.name)}
              >
                Download
              </Button>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Footer action */}
      <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <ShieldCheck size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Ready to communicate?</p>
            <p className="text-sm text-slate-500">
              Generate a communication report and notify the impacted Business Units.
            </p>
          </div>
        </div>
        <Button icon={Send} size="lg" onClick={handleGenerateReport}>
          Generate Communication Report
        </Button>
      </Card>
    </div>
  );
}
