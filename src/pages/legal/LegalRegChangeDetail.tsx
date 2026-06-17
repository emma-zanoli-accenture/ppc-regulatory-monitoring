import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  ArrowLeft,
  Building2,
  Download,
  Eye,
  FileDown,
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
  SlideOver,
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
import { exportObligationMapping } from '../../lib/exportObligations';

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

const DOCUMENT_PREVIEWS: Record<string, { title: string; sections: { heading: string; body: string }[] }> = {
  'REMIT II — Full Regulation Text (ACER).pdf': {
    title: 'REGULATION (EU) 2024/1106 — REMIT II',
    sections: [
      {
        heading: 'Recital (4)',
        body: 'Wholesale energy market integrity and transparency are essential for the functioning of well-integrated, competitive and efficient electricity and gas markets in the Union. Enhanced transaction reporting obligations are necessary to enable ACER to detect and investigate potential cases of market manipulation and insider trading.',
      },
      {
        heading: 'Article 9 — Reporting obligation',
        body: 'Market participants shall report to the Agency, or through a Registered Reporting Mechanism, details of wholesale energy market transactions, including orders to trade, concluded in wholesale energy markets. Reports shall be submitted no later than the working day following the conclusion of the transaction (T+1). Lifecycle events — including modifications and cancellations — shall be reported without undue delay.',
      },
      {
        heading: 'Article 9a — Data quality',
        body: 'Market participants shall ensure that the data submitted is complete, accurate and submitted in a timely manner. Where errors or omissions are identified, corrected reports shall be submitted as soon as practicable. ACER may impose administrative measures on market participants that persistently submit incomplete or inaccurate data.',
      },
      {
        heading: 'Article 10 — Registered Reporting Mechanisms',
        body: 'Market participants may fulfil their reporting obligation by delegating to a Registered Reporting Mechanism (RRM) registered with ACER. Delegation does not relieve the market participant of responsibility for the accuracy and completeness of the reported data. RRMs must maintain connectivity to the ACER ARIS portal and comply with applicable technical standards.',
      },
    ],
  },
  'ACER Transaction Reporting Guidance v2.pdf': {
    title: 'ACER Guidance on Transaction Reporting under REMIT II — v2.0, March 2026',
    sections: [
      {
        heading: '1. Scope of reporting',
        body: 'This guidance applies to all market participants active in EU wholesale energy markets, including electricity and natural gas. Intragroup transactions between entities within the same corporate group are not exempt and must be reported unless a specific exemption has been granted by the relevant National Regulatory Authority.',
      },
      {
        heading: '2. Reportable fields — standard contracts',
        body: 'Reports for standard supply contracts must include: contract type, trade ID, trading venue, execution timestamp, counterparty LEI (Legal Entity Identifier), delivery point or hub, delivery period start/end, price (in EUR/MWh), volume (in MWh or MW), and currency. Missing or invalid LEIs will result in report rejection.',
      },
      {
        heading: '3. T+1 reporting timeline',
        body: 'Standard contracts and orders must be submitted to ACER ARIS by 23:59 on the working day following execution. For lifecycle events (amendments, cancellations, early terminations), reports are due without undue delay and in all cases no later than two working days after the event.',
      },
      {
        heading: '4. Connectivity and testing',
        body: 'Market participants or their delegated RRMs must complete connectivity testing via the ACER ARIS UAT environment prior to go-live. ACER recommends a minimum 30-day parallel run period. Test results must be retained for audit purposes for a minimum of five years.',
      },
    ],
  },
  'Internal Impact Assessment.docx': {
    title: 'PPC Internal Impact Assessment — REMIT II (March 2026)',
    sections: [
      {
        heading: 'Executive Summary',
        body: 'REMIT II introduces enhanced transaction reporting requirements effective 30 September 2026. This assessment identifies five impacted Business Units and concludes that the primary operational impact falls on Energy Trading and Wholesale Market Operations, which will require system reconfiguration to support automated T+1 reporting to ACER ARIS. Estimated implementation effort: 14 weeks.',
      },
      {
        heading: 'Impacted processes',
        body: 'Transaction capture and reporting (Energy Trading), RRM connectivity management (Wholesale Market Operations), contract lifecycle management (Procurement), regulatory submission oversight (Regulatory Affairs), and ESG data reporting alignment (Sustainability). All five processes require updated procedures and staff training by Q3 2026.',
      },
      {
        heading: 'Key risks',
        body: 'High: Failure to meet T+1 reporting deadline due to manual submission processes — mitigation: automate via RRM pipeline by 31 August 2026. Medium: Incomplete LEI coverage for counterparties — mitigation: LEI enrichment project initiated. Low: Staff awareness gap — mitigation: training programme scheduled for September 2026.',
      },
      {
        heading: 'Recommended actions',
        body: '1. Engage RRM provider to configure REMIT II data feed by 30 June 2026. 2. Complete UAT of ARIS connectivity by 31 July 2026. 3. Conduct 30-day parallel run August–September 2026. 4. Update internal reporting procedures and sign-off with process owners by 15 September 2026.',
      },
    ],
  },
  'RRM Onboarding Checklist.pdf': {
    title: 'RRM Onboarding Checklist — REMIT II Readiness',
    sections: [
      {
        heading: 'Phase 1 — Registration (by 30 June 2026)',
        body: '☐ Confirm RRM provider selection and execute service agreement.\n☐ Register as REMIT II market participant with ACER ARIS portal.\n☐ Obtain and validate Legal Entity Identifier (LEI) for all reporting entities.\n☐ Complete data mapping: internal trade fields → ACER schema fields.',
      },
      {
        heading: 'Phase 2 — Technical integration (by 31 July 2026)',
        body: '☐ Configure trade capture system to export REMIT II-compliant data feed.\n☐ Complete RRM connectivity testing in ACER ARIS UAT environment.\n☐ Validate all mandatory fields: contract type, LEI, delivery point, price, volume.\n☐ Test lifecycle event reporting (amendments, cancellations).\n☐ Confirm T+1 submission timing in automated pipeline.',
      },
      {
        heading: 'Phase 3 — Parallel run (August–September 2026)',
        body: '☐ Run parallel submission against ACER ARIS for 30 days.\n☐ Review rejection and error reports daily; resolve within 48 hours.\n☐ Document evidence of successful parallel run for audit file.\n☐ Obtain sign-off from Head of Wholesale Market Operations.',
      },
      {
        heading: 'Phase 4 — Go-live (by 30 September 2026)',
        body: '☐ Switch to live ACER ARIS endpoint.\n☐ Confirm first live T+1 submission received and accepted.\n☐ Retain connectivity test logs and parallel run evidence (5-year retention).\n☐ Brief Legal/Compliance on go-live status and residual risks.',
      },
    ],
  },
};

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
  const { regulatoryChanges, obligations, businessUnitImpacts, tickets } = useDemoStore();

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

  const [previewDoc, setPreviewDoc] = useState<string | null>(null);
  const preview = previewDoc ? DOCUMENT_PREVIEWS[previewDoc] : null;

  const handleDownload = (name: string) =>
    toast({ title: 'Download started', description: name, variant: 'info' });

  const handleGenerateReport = () =>
    navigate(`/legal/regulatory-change/${change.id}/communicate`);

  const handleExportObligations = () => {
    exportObligationMapping(change, changeObligations, impacts, tickets);
    toast({
      title: 'Export complete',
      description: `Obligation-Mapping_${change.id}.csv downloaded.`,
      variant: 'success',
    });
  };

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
        actions={
          <Button size="sm" variant="outline" icon={FileDown} onClick={handleExportObligations}>
            Export Excel
          </Button>
        }
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
              <div className="flex shrink-0 gap-1.5">
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Eye}
                  onClick={() => setPreviewDoc(doc.name)}
                >
                  Preview
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Download}
                  onClick={() => handleDownload(doc.name)}
                >
                  Download
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Document preview */}
      <SlideOver
        open={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc ?? ''}
        description={preview?.title}
        width="xl"
        footer={
          <Button icon={Download} onClick={() => { if (previewDoc) handleDownload(previewDoc); setPreviewDoc(null); }}>
            Download
          </Button>
        }
      >
        {preview && (
          <div className="space-y-6">
            {preview.sections.map((s) => (
              <div key={s.heading}>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {s.heading}
                </p>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </SlideOver>

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
