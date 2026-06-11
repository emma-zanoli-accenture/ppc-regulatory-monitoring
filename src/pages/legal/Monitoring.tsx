import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, Check, Minus } from 'lucide-react';
import {
  DataTable,
  KpiWidget,
  PageHeader,
  SectionCard,
  Select,
  StatusBadge,
  Tag,
} from '../../components';
import type { Column } from '../../components';
import { useDemoStore } from '../../store/DemoStore';
import { REMIT_II_ID } from '../../data';
import { COMPLETED_STATES } from '../../lib/metrics';
import { daysBetween, formatDate } from '../../lib/format';
import { cn } from '../../lib/cn';
import type { Ticket } from '../../types';

const ALL = '__all__';

function YesNo({ value }: { value: boolean }) {
  return value ? (
    <Check size={16} className="mx-auto text-emerald-500" />
  ) : (
    <Minus size={15} className="mx-auto text-slate-300" />
  );
}

export default function Monitoring() {
  const navigate = useNavigate();
  const { tickets, regulatoryChanges, businessUnitImpacts, currentDate } = useDemoStore();

  const change = regulatoryChanges.find((c) => c.id === REMIT_II_ID);
  const myTickets = useMemo(
    () => tickets.filter((t) => t.regChangeId === REMIT_II_ID),
    [tickets],
  );

  const [statusFilter, setStatusFilter] = useState(ALL);

  const dueDateFor = (bu: string) =>
    businessUnitImpacts.find((i) => i.regChangeId === REMIT_II_ID && i.businessUnit === bu)
      ?.dueDate ??
    change?.implementationDueDate ??
    currentDate;

  const presentStatuses = useMemo(
    () => Array.from(new Set(myTickets.map((t) => t.status))),
    [myTickets],
  );

  const filtered = useMemo(
    () => myTickets.filter((t) => statusFilter === ALL || t.status === statusFilter),
    [myTickets, statusFilter],
  );

  const stats = useMemo(
    () => ({
      notified: myTickets.length,
      viewed: myTickets.filter((t) => t.viewed).length,
      downloaded: myTickets.filter((t) => t.downloaded).length,
      completed: myTickets.filter((t) => COMPLETED_STATES.includes(t.status)).length,
      escalated: myTickets.filter((t) => t.status === 'Escalated').length,
    }),
    [myTickets],
  );

  const dueDays = change ? daysBetween(currentDate, change.implementationDueDate) : 0;

  const columns: Column<Ticket>[] = [
    {
      key: 'businessUnit',
      header: 'Business Unit',
      render: (r) => <span className="font-semibold text-slate-900">{r.businessUnit}</span>,
    },
    {
      key: 'notification',
      header: 'Notification',
      render: () => (
        <Tag tone="success" size="sm">
          Sent
        </Tag>
      ),
    },
    { key: 'viewed', header: 'Viewed', align: 'center', render: (r) => <YesNo value={r.viewed} /> },
    {
      key: 'downloaded',
      header: 'Downloaded',
      align: 'center',
      render: (r) => <YesNo value={r.downloaded} />,
    },
    {
      key: 'action',
      header: 'Action Status',
      render: (r) => <StatusBadge state={r.status} size="sm" />,
    },
    {
      key: 'days',
      header: 'Days to Due',
      align: 'right',
      render: (r) => {
        const d = daysBetween(currentDate, dueDateFor(r.businessUnit));
        const done = COMPLETED_STATES.includes(r.status);
        return (
          <span
            className={cn(
              'font-mono text-sm font-semibold',
              done ? 'text-slate-400' : d < 0 ? 'text-red-600' : d <= 14 ? 'text-amber-600' : 'text-slate-600',
            )}
          >
            {done ? '—' : d}
          </span>
        );
      },
    },
    {
      key: 'escalation',
      header: 'Escalation',
      align: 'center',
      render: (r) => {
        const d = daysBetween(currentDate, dueDateFor(r.businessUnit));
        const done = COMPLETED_STATES.includes(r.status);
        if (r.status === 'Escalated')
          return (
            <Tag tone="danger" size="sm" withDot>
              Escalated
            </Tag>
          );
        if (!done && d < 0)
          return (
            <Tag tone="danger" size="sm">
              Overdue
            </Tag>
          );
        if (!done && d <= 14)
          return (
            <Tag tone="warning" size="sm">
              Due soon
            </Tag>
          );
        return <Minus size={15} className="mx-auto text-slate-300" />;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[{ label: 'Legal / Compliance' }, { label: 'Monitoring' }]}
        title="Communication & Follow-up Monitoring"
        description={`Live status of ${change?.title ?? 'the regulatory change'} across Business Units.`}
        actions={
          change ? (
            <div className="rounded border border-slate-200 bg-white px-3 py-1.5 text-right">
              <p className="label-eyebrow">Implementation due</p>
              <p className="font-mono text-sm font-semibold text-slate-800">
                {formatDate(change.implementationDueDate)}
              </p>
              <p
                className={cn(
                  'text-2xs',
                  dueDays < 0 ? 'text-red-600' : dueDays <= 14 ? 'text-amber-600' : 'text-slate-400',
                )}
              >
                {dueDays < 0 ? `${Math.abs(dueDays)} days overdue` : `${dueDays} days remaining`}
              </p>
            </div>
          ) : undefined
        }
      />

      {/* Progress strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <KpiWidget label="Notified" value={`${stats.notified}/${myTickets.length}`} tone="brand" />
        <KpiWidget label="Viewed" value={`${stats.viewed}/${myTickets.length}`} tone="brand" />
        <KpiWidget label="Downloaded" value={`${stats.downloaded}/${myTickets.length}`} tone="brand" />
        <KpiWidget label="Completed" value={`${stats.completed}/${myTickets.length}`} tone="success" />
        <KpiWidget
          label="Escalated"
          value={stats.escalated}
          tone={stats.escalated > 0 ? 'danger' : 'neutral'}
        />
      </div>

      <SectionCard
        title="Per-Business-Unit Status"
        icon={Activity}
        description={`${filtered.length} of ${myTickets.length} shown`}
        flushBody
        actions={
          <Select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: 'All statuses', value: ALL },
              ...presentStatuses.map((s) => ({ label: s, value: s })),
            ]}
          />
        }
      >
        <DataTable
          columns={columns}
          data={filtered}
          getRowId={(r) => r.id}
          onRowClick={(r) => navigate(`/legal/regulatory-change/${r.regChangeId}`)}
          emptyMessage="No tickets match the selected status."
          dense
        />
      </SectionCard>

      {stats.escalated > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50/60 px-4 py-3">
          <AlertTriangle size={18} className="shrink-0 text-red-500" />
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-red-700">{stats.escalated} ticket(s) escalated.</span>{' '}
            Incomplete at the implementation deadline — see the audit trail for details.
          </p>
        </div>
      )}
    </div>
  );
}
