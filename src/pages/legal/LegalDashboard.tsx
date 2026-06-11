import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BadgeCheck,
  Bell,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  Layers,
  MessageSquare,
} from 'lucide-react';
import { KpiWidget, SectionCard, StatusBadge } from '../../components';
import { useDemoStore } from '../../store/DemoStore';
import {
  countActiveChanges,
  countAuditReady,
  countCompleted,
  countOpenSupportRequests,
  countOverdue,
  countPendingAcknowledgements,
} from '../../lib/metrics';
import { daysBetween, formatDate, relativeDueLabel } from '../../lib/format';
import { cn } from '../../lib/cn';
import { SourceMonitoringPanel } from './SourceMonitoringPanel';

export default function LegalDashboard() {
  const navigate = useNavigate();
  const {
    regulatoryChanges,
    tickets,
    supportRequests,
    currentDate,
  } = useDemoStore();

  const kpis = useMemo(
    () => ({
      active: countActiveChanges(regulatoryChanges),
      pendingAck: countPendingAcknowledgements(tickets),
      support: countOpenSupportRequests(supportRequests),
      overdue: countOverdue(tickets),
      completed: countCompleted(tickets),
      auditReady: countAuditReady(tickets),
    }),
    [regulatoryChanges, tickets, supportRequests],
  );

  // Items by Business Unit — each communication ticket and its current state.
  const byBusinessUnit = useMemo(
    () =>
      tickets
        .map((t) => ({ id: t.id, businessUnit: t.businessUnit, status: t.status }))
        .sort((a, b) => a.businessUnit.localeCompare(b.businessUnit)),
    [tickets],
  );

  // Upcoming implementation due dates — reg changes sorted by due date.
  const upcoming = useMemo(
    () =>
      [...regulatoryChanges]
        .sort((a, b) => a.implementationDueDate.localeCompare(b.implementationDueDate))
        .map((c) => ({
          id: c.id,
          title: c.title,
          dueDate: c.implementationDueDate,
          days: daysBetween(currentDate, c.implementationDueDate),
        })),
    [regulatoryChanges, currentDate],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Legal / Compliance
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Compliance Dashboard
          </h1>
          <p className="mt-1 text-slate-500">
            Control-tower view of monitored regulatory changes and their status.
          </p>
        </div>
        <p className="hidden text-sm text-slate-400 sm:block">
          As of <span className="font-mono text-slate-500">{formatDate(currentDate)}</span>
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KpiWidget label="Active Changes" value={kpis.active} icon={Layers} tone="brand" />
        <KpiWidget
          label="Pending Acks"
          value={kpis.pendingAck}
          hint="awaiting BU view"
          icon={Bell}
          tone={kpis.pendingAck > 0 ? 'warning' : 'success'}
        />
        <KpiWidget
          label="Support Requests"
          value={kpis.support}
          hint="2nd-level, open"
          icon={MessageSquare}
          tone={kpis.support > 0 ? 'warning' : 'neutral'}
        />
        <KpiWidget
          label="Overdue Actions"
          value={kpis.overdue}
          hint={kpis.overdue === 0 ? 'all within SLA' : 'needs attention'}
          icon={CircleAlert}
          tone={kpis.overdue > 0 ? 'danger' : 'success'}
        />
        <KpiWidget
          label="Completed Actions"
          value={kpis.completed}
          icon={CheckCircle2}
          tone="success"
        />
        <KpiWidget
          label="Audit-Ready"
          value={kpis.auditReady}
          icon={BadgeCheck}
          tone="accent"
        />
      </div>

      {/* Agentic source monitoring */}
      <SourceMonitoringPanel />

      {/* Lists */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Items by Business Unit" icon={Layers} flushBody>
          <ul className="divide-y divide-slate-100">
            {byBusinessUnit.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-slate-50"
              >
                <span className="text-sm font-medium text-slate-800">{item.businessUnit}</span>
                <StatusBadge state={item.status} size="sm" />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Upcoming Implementation Due Dates" icon={CalendarClock} flushBody>
          <ul className="divide-y divide-slate-100">
            {upcoming.map((item) => {
              const soon = item.days <= 30;
              return (
                <li
                  key={item.id}
                  onClick={() => navigate(`/legal/regulatory-change/${item.id}`)}
                  className="flex cursor-pointer items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-slate-50"
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
                    {item.title}
                  </span>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-xs text-slate-600">{formatDate(item.dueDate)}</p>
                    <p
                      className={cn(
                        'text-xs',
                        item.days < 0
                          ? 'text-red-500'
                          : soon
                            ? 'text-amber-600'
                            : 'text-slate-400',
                      )}
                    >
                      {relativeDueLabel(item.days)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
