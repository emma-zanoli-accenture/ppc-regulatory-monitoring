import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Network } from 'lucide-react';
import {
  DataTable,
  RiskBadge,
  SectionCard,
  Select,
  Tag,
} from '../../components';
import type { Column, TagTone } from '../../components';
import { useDemoStore } from '../../store/DemoStore';
import { BUSINESS_UNITS } from '../../types';
import type {
  AuditStatus,
  CommunicationStatus,
  ImplementationStatus,
  RegulatoryChange,
} from '../../types';
import { formatDate } from '../../lib/format';

/* ---- summary-status → tone maps (reused on the monitoring screen later) ---- */
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

const ALL = '__all__';

/** Scripted precedent reuse — conveys the agent learning from prior mappings. */
const MAPPING_HISTORY = [
  {
    id: 'h1',
    regulation: 'REMIT I — Wholesale Market Transaction Reporting (2015)',
    requirement: 'Reporting of standard supply contracts & orders to ACER',
    reuse: 'Reused contract-type taxonomy and ACER reporting categories for Obligation 1.',
  },
  {
    id: 'h2',
    regulation: 'EMIR — Derivatives Reporting',
    requirement: 'Registered Reporting Mechanism (RRM) connectivity & data quality',
    reuse: 'Reused RRM onboarding controls and data-quality validations for Obligation 3.',
  },
  {
    id: 'h3',
    regulation: 'MiFID II — Transaction Reporting',
    requirement: 'T+1 reporting timeliness and lifecycle event handling',
    reuse: 'Reused next-working-day reporting controls and monitoring for Obligation 2.',
  },
];

export default function ImpactOverview() {
  const navigate = useNavigate();
  const { regulatoryChanges, obligations, businessUnitImpacts } = useDemoStore();

  const [buFilter, setBuFilter] = useState(ALL);
  const [sourceFilter, setSourceFilter] = useState(ALL);
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [riskFilter, setRiskFilter] = useState(ALL);

  // Per-change derived counts.
  const obligationCount = (id: string) =>
    obligations.filter((o) => o.regChangeId === id).length;
  const impactedBus = (id: string) =>
    businessUnitImpacts.filter((i) => i.regChangeId === id);

  const sourceOptions = useMemo(() => {
    const sources = Array.from(new Set(regulatoryChanges.map((c) => c.regulatorySource)));
    return [{ label: 'All sources', value: ALL }, ...sources.map((s) => ({ label: s, value: s }))];
  }, [regulatoryChanges]);

  const filtered = useMemo(
    () =>
      regulatoryChanges.filter((c) => {
        if (sourceFilter !== ALL && c.regulatorySource !== sourceFilter) return false;
        if (statusFilter !== ALL && c.implementationStatus !== statusFilter) return false;
        if (riskFilter !== ALL && c.riskPriority !== riskFilter) return false;
        if (buFilter !== ALL) {
          const buImpacted = businessUnitImpacts.some(
            (i) => i.regChangeId === c.id && i.businessUnit === buFilter,
          );
          if (!buImpacted) return false;
        }
        return true;
      }),
    [regulatoryChanges, businessUnitImpacts, buFilter, sourceFilter, statusFilter, riskFilter],
  );

  const columns: Column<RegulatoryChange>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (r) => <span className="font-mono text-xs text-slate-400">{r.id}</span>,
    },
    {
      key: 'title',
      header: 'Title',
      width: '22%',
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">{r.title}</p>
          <p className="truncate text-xs text-slate-400">{r.regulatoryArea}</p>
        </div>
      ),
    },
    { key: 'regulatorySource', header: 'Source' },
    {
      key: 'effectiveDate',
      header: 'Effective',
      render: (r) => <span className="font-mono text-xs">{formatDate(r.effectiveDate)}</span>,
    },
    {
      key: 'implementationDueDate',
      header: 'Due',
      render: (r) => (
        <span className="font-mono text-xs">{formatDate(r.implementationDueDate)}</span>
      ),
    },
    {
      key: 'mapping',
      header: 'Obligation Mapping',
      render: (r) => {
        const n = obligationCount(r.id);
        return n > 0 ? (
          <Tag tone="success" size="sm">
            Mapped · {n}
          </Tag>
        ) : (
          <Tag tone="neutral" size="sm">
            Not mapped
          </Tag>
        );
      },
    },
    {
      key: 'bus',
      header: 'Impacted BUs',
      align: 'center',
      render: (r) => {
        const n = impactedBus(r.id).length;
        return (
          <span className="font-mono text-sm font-semibold text-slate-700">{n}</span>
        );
      },
    },
    {
      key: 'risk',
      header: 'Risk',
      render: (r) => <RiskBadge level={r.riskPriority} size="sm" />,
    },
    {
      key: 'communicationStatus',
      header: 'Communication',
      render: (r) => (
        <Tag tone={COMMUNICATION_TONE[r.communicationStatus]} size="sm">
          {r.communicationStatus}
        </Tag>
      ),
    },
    {
      key: 'implementationStatus',
      header: 'Implementation',
      render: (r) => (
        <Tag tone={IMPLEMENTATION_TONE[r.implementationStatus]} size="sm">
          {r.implementationStatus}
        </Tag>
      ),
    },
    {
      key: 'auditStatus',
      header: 'Audit',
      render: (r) => (
        <Tag tone={AUDIT_TONE[r.auditStatus]} size="sm">
          {r.auditStatus}
        </Tag>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-600">
          Legal / Compliance
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Impact Overview</h1>
        <p className="mt-1 text-slate-500">
          All monitored regulatory changes, their obligation mapping, and impact across Business
          Units.
        </p>
      </div>

      <SectionCard
        title="Regulatory Changes"
        icon={Network}
        description={`${filtered.length} of ${regulatoryChanges.length} shown`}
        flushBody
        actions={
          <div className="flex flex-wrap items-end gap-2">
            <Select
              aria-label="Filter by business unit"
              value={buFilter}
              onChange={setBuFilter}
              options={[
                { label: 'All business units', value: ALL },
                ...BUSINESS_UNITS.map((b) => ({ label: b, value: b })),
              ]}
            />
            <Select
              aria-label="Filter by source"
              value={sourceFilter}
              onChange={setSourceFilter}
              options={sourceOptions}
            />
            <Select
              aria-label="Filter by implementation status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: 'All statuses', value: ALL },
                { label: 'Not Started', value: 'Not Started' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Completed', value: 'Completed' },
              ]}
            />
            <Select
              aria-label="Filter by risk"
              value={riskFilter}
              onChange={setRiskFilter}
              options={[
                { label: 'All risk', value: ALL },
                { label: 'High', value: 'High' },
                { label: 'Medium', value: 'Medium' },
                { label: 'Low', value: 'Low' },
              ]}
            />
          </div>
        }
      >
        <DataTable
          columns={columns}
          data={filtered}
          getRowId={(r) => r.id}
          onRowClick={(r) => navigate(`/legal/regulatory-change/${r.id}`)}
          emptyMessage="No regulatory changes match the current filters."
          dense
        />
      </SectionCard>

      {/* Obligation Mapping History */}
      <SectionCard
        title="Obligation Mapping History"
        description="Prior and similar regulations the agent reused when mapping obligations."
        icon={History}
        iconTone="accent"
      >
        <ul className="space-y-3">
          {MAPPING_HISTORY.map((h) => (
            <li
              key={h.id}
              className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{h.regulation}</p>
                <Tag tone="accent" size="sm" withDot>
                  Precedent reused
                </Tag>
              </div>
              <p className="mt-1.5 text-sm text-slate-600">
                <span className="font-medium text-slate-500">Mapped requirement: </span>
                {h.requirement}
              </p>
              <p className="mt-1 text-sm text-slate-500">{h.reuse}</p>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
