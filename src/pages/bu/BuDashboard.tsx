import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  MessageSquare,
  Upload,
} from 'lucide-react';
import { KpiWidget, PageHeader, SectionCard, StatusBadge, Tag } from '../../components';
import { useDemoStore } from '../../store/DemoStore';
import { DEMO_BUSINESS_UNIT } from '../../config/navigation';
import { COMPLETED_STATES } from '../../lib/metrics';
import { daysBetween, formatDate, relativeDueLabel } from '../../lib/format';
import { cn } from '../../lib/cn';

export default function BuDashboard() {
  const navigate = useNavigate();
  const { tickets, regulatoryChanges, businessUnitImpacts, supportRequests, currentDate } =
    useDemoStore();
  const bu = DEMO_BUSINESS_UNIT;

  const myTickets = useMemo(
    () => tickets.filter((t) => t.businessUnit === bu),
    [tickets, bu],
  );

  const dueDateFor = (regChangeId: string) =>
    businessUnitImpacts.find((i) => i.regChangeId === regChangeId && i.businessUnit === bu)
      ?.dueDate ??
    regulatoryChanges.find((c) => c.id === regChangeId)?.implementationDueDate ??
    currentDate;

  const isOpen = (status: string) => !COMPLETED_STATES.includes(status as never);

  const kpis = useMemo(() => {
    const open = myTickets.filter((t) => isOpen(t.status));
    return {
      newNotifications: myTickets.filter((t) => t.status === 'Notification Sent' || !t.viewed)
        .length,
      actionsRequired: open.length,
      dueSoon: open.filter((t) => daysBetween(currentDate, dueDateFor(t.regChangeId)) <= 30)
        .length,
      clarifications: supportRequests.filter(
        (s) => s.businessUnit === bu && s.status === 'Open',
      ).length,
      evidencePending: open.filter((t) => !t.evidenceUploaded).length,
      completed: myTickets.filter((t) => COMPLETED_STATES.includes(t.status)).length,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myTickets, supportRequests, currentDate, bu]);

  const notifications = useMemo(
    () =>
      myTickets
        .map((t) => {
          const change = regulatoryChanges.find((c) => c.id === t.regChangeId);
          return change ? { ticket: t, change } : null;
        })
        .filter((x): x is NonNullable<typeof x> => Boolean(x)),
    [myTickets, regulatoryChanges],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        crumbs={[{ label: `Business Unit · ${bu}` }, { label: 'Dashboard' }]}
        title="My Dashboard"
        description={`Regulatory notifications assigned to ${bu} and the actions you need to take.`}
      />

      {/* Widgets */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KpiWidget
          label="New Notifications"
          value={kpis.newNotifications}
          icon={Bell}
          tone={kpis.newNotifications > 0 ? 'brand' : 'neutral'}
        />
        <KpiWidget
          label="Actions Required"
          value={kpis.actionsRequired}
          icon={ClipboardList}
          tone={kpis.actionsRequired > 0 ? 'warning' : 'success'}
        />
        <KpiWidget label="Due Soon" value={kpis.dueSoon} hint="within 30 days" icon={CalendarClock} tone={kpis.dueSoon > 0 ? 'warning' : 'neutral'} />
        <KpiWidget
          label="Clarifications"
          value={kpis.clarifications}
          hint="open"
          icon={MessageSquare}
          tone={kpis.clarifications > 0 ? 'brand' : 'neutral'}
        />
        <KpiWidget
          label="Evidence Pending"
          value={kpis.evidencePending}
          icon={Upload}
          tone={kpis.evidencePending > 0 ? 'warning' : 'success'}
        />
        <KpiWidget label="Completed" value={kpis.completed} icon={CheckCircle2} tone="success" />
      </div>

      {/* Notifications */}
      <SectionCard title="Legal Notifications" icon={Bell} flushBody>
        {notifications.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-400">
            No regulatory notifications assigned to your Business Unit.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {notifications.map(({ ticket, change }) => {
              const unread = ticket.status === 'Notification Sent' || !ticket.viewed;
              const days = daysBetween(currentDate, dueDateFor(change.id));
              return (
                <li
                  key={ticket.id}
                  onClick={() => navigate(`/bu/regulatory-change/${change.id}`)}
                  className={cn(
                    'group flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50',
                    unread && 'bg-brand-50/40',
                  )}
                >
                  {/* unread dot */}
                  <span className="flex w-2 justify-center">
                    {unread && <span className="h-2 w-2 rounded-full bg-brand-600" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className={cn(
                          'truncate text-sm',
                          unread ? 'font-bold text-slate-900' : 'font-medium text-slate-700',
                        )}
                      >
                        {change.title}
                      </p>
                      {unread && (
                        <Tag tone="brand" size="sm">
                          New
                        </Tag>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {change.regulatorySource} · due {formatDate(dueDateFor(change.id))} ·{' '}
                      <span className={days <= 30 ? 'text-amber-600' : ''}>
                        {relativeDueLabel(days)}
                      </span>
                    </p>
                  </div>
                  <StatusBadge state={ticket.status} size="sm" />
                  <ArrowRight
                    size={16}
                    className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500"
                  />
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
