import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  AlertTriangle,
  Bell,
  Building2,
  CheckCircle2,
  Clock,
  Database,
  Download,
  FileText,
  ListChecks,
  MessageSquare,
  Plus,
  Radar,
  ScanSearch,
  Send,
  ShieldCheck,
} from 'lucide-react';
import {
  AIThinkingIndicator,
  Button,
  Card,
  DataTable,
  KpiWidget,
  Modal,
  PriorityBadge,
  RiskBadge,
  SectionCard,
  SlideOver,
  StatusBadge,
  Timeline,
} from '../components';
import type { Column, TimelineItem } from '../components';
import { WORKFLOW_STATES } from '../types';
import type { RiskPriority } from '../types';
import { BRAND } from '../config/brand';
import { businessUnitImpacts } from '../data/businessUnitImpacts';
import { tickets } from '../data/tickets';
import { auditTrail } from '../data/auditTrail';
import type { BusinessUnitImpact, AuditTrailEntry } from '../types';

/** A labelled section wrapper for the styleguide. */
function Block({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
      </div>
      {children}
    </section>
  );
}

const RISK_LEVELS: RiskPriority[] = ['Low', 'Medium', 'High'];

const AUDIT_TONE: Record<string, TimelineItem['tone']> = {
  'at-1': 'accent',
  'at-2': 'accent',
  'at-3': 'brand',
  'at-4': 'neutral',
  'at-5': 'warning',
  'at-6': 'success',
};
const AUDIT_ICON: Record<string, TimelineItem['icon']> = {
  'at-1': Radar,
  'at-2': Database,
  'at-3': Send,
  'at-4': FileText,
  'at-5': MessageSquare,
  'at-6': CheckCircle2,
};

export default function StyleGuide() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['imp-trading', 'imp-wmo']);
  const [modalOpen, setModalOpen] = useState(false);
  const [slideOpen, setSlideOpen] = useState(false);

  const toggleRow = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  const toggleAll = () =>
    setSelectedIds((prev) =>
      prev.length === businessUnitImpacts.length
        ? []
        : businessUnitImpacts.map((i) => i.id),
    );

  // Impact table columns (selectable + risk badge column).
  const impactColumns: Column<BusinessUnitImpact>[] = [
    {
      key: 'businessUnit',
      header: 'Business Unit',
      render: (r) => <span className="font-medium text-slate-900">{r.businessUnit}</span>,
    },
    { key: 'impactedProcess', header: 'Impacted Process' },
    { key: 'owner', header: 'Owner' },
    {
      key: 'impactLevel',
      header: 'Impact',
      render: (r) => <RiskBadge level={r.impactLevel} size="sm" />,
    },
    {
      key: 'dueDate',
      header: 'Due',
      align: 'right',
      render: (r) => <span className="font-mono text-xs text-slate-500">{r.dueDate}</span>,
    },
  ];

  // Ticket table columns (status badge column).
  type TicketRow = (typeof tickets)[number];
  const ticketColumns: Column<TicketRow>[] = [
    {
      key: 'businessUnit',
      header: 'Business Unit',
      render: (r) => <span className="font-medium text-slate-900">{r.businessUnit}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge state={r.status} size="sm" />,
    },
    {
      key: 'viewed',
      header: 'Viewed',
      align: 'center',
      render: (r) =>
        r.viewed ? (
          <CheckCircle2 size={16} className="mx-auto text-emerald-500" />
        ) : (
          <span className="text-slate-300">—</span>
        ),
    },
    {
      key: 'completedOn',
      header: 'Completed',
      align: 'right',
      render: (r) => (
        <span className="font-mono text-xs text-slate-500">{r.completedOn ?? '—'}</span>
      ),
    },
  ];

  const timelineItems: TimelineItem[] = auditTrail.map((e: AuditTrailEntry) => ({
    id: e.id,
    title: e.action,
    detail: e.detail,
    actor: e.actor,
    timestamp: e.timestamp.replace('T', ' ').slice(0, 16),
    tone: AUDIT_TONE[e.id] ?? 'brand',
    icon: AUDIT_ICON[e.id],
  }));

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm"
              style={{ backgroundColor: BRAND.primaryColor }}
            >
              {BRAND.shortName}
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight text-slate-900">
                {BRAND.name}
              </p>
              <p className="text-xs text-slate-400">Component Styleguide</p>
            </div>
          </div>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            Internal · temporary review page
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-6 py-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Shared UI Layer
          </h1>
          <p className="mt-1 max-w-2xl text-slate-500">
            Every reusable component for the Regulatory Change Management demo, rendered with
            sample props. The palette spine is {BRAND.name}'s brand blue and teal accent over
            cool neutral surfaces.
          </p>
        </div>

        {/* KPI widgets */}
        <Block title="KPI Widgets" description="Dashboard stat tiles with optional trend + icon.">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KpiWidget
              label="Active Changes"
              value={4}
              hint="1 high priority"
              icon={ScanSearch}
              tone="brand"
              trend={{ direction: 'up', value: '+2' }}
            />
            <KpiWidget
              label="BUs Notified"
              value="5 / 5"
              hint="REMIT II communication"
              icon={Bell}
              tone="accent"
            />
            <KpiWidget
              label="Overdue Items"
              value={0}
              hint="all within SLA"
              icon={AlertTriangle}
              tone="success"
              trend={{ direction: 'down', value: '-1', invert: true }}
            />
            <KpiWidget
              label="Days to Deadline"
              value={112}
              hint="due 30/09/2026"
              icon={Clock}
              tone="warning"
            />
          </div>
        </Block>

        {/* Buttons */}
        <Block title="Buttons" description="Variants, sizes, icons, loading & disabled states.">
          <Card className="p-6">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" icon={Send}>
                  Send Communication
                </Button>
                <Button variant="secondary" icon={Download}>
                  Download Report
                </Button>
                <Button variant="ghost" icon={MessageSquare}>
                  Ask AI
                </Button>
                <Button variant="danger" icon={AlertTriangle}>
                  Escalate
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" icon={Plus}>
                  Small
                </Button>
                <Button size="md">Medium</Button>
                <Button size="lg" iconRight={Send}>
                  Large
                </Button>
                <Button loading>Processing</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </Card>
        </Block>

        {/* Status badges */}
        <Block
          title="Status Badges"
          description="Every workflow state — colors come from the central WORKFLOW_STATE_CONFIG."
        >
          <Card className="p-6">
            <div className="flex flex-wrap gap-2.5">
              {WORKFLOW_STATES.map((state) => (
                <StatusBadge key={state} state={state} />
              ))}
            </div>
          </Card>
        </Block>

        {/* Risk / priority badges */}
        <Block title="Risk & Priority Badges" description="Shared Low / Medium / High language.">
          <Card className="p-6">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">Risk</span>
                {RISK_LEVELS.map((l) => (
                  <RiskBadge key={l} level={l} suffix="Risk" />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">Priority</span>
                {RISK_LEVELS.map((l) => (
                  <PriorityBadge key={l} level={l} />
                ))}
              </div>
            </div>
          </Card>
        </Block>

        {/* Cards */}
        <Block title="Cards" description="Plain Card and titled SectionCard with icon + actions.">
          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard
              title="REMIT II — Transaction Reporting"
              description="ACER / EU REMIT framework"
              icon={ShieldCheck}
              actions={<Button size="sm" variant="secondary">View</Button>}
            >
              <p className="text-sm text-slate-600">
                Enhanced wholesale energy market transaction reporting obligations. This is the
                titled SectionCard pattern used across detail screens.
              </p>
            </SectionCard>
            <Card interactive className="p-5">
              <p className="text-sm font-semibold text-slate-900">Plain interactive Card</p>
              <p className="mt-1 text-sm text-slate-600">
                A bare surface that lifts on hover — used for clickable list items.
              </p>
            </Card>
          </div>
        </Block>

        {/* DataTables */}
        <Block
          title="Data Tables"
          description="Generic typed table — selection column (left) and status-badge column (right)."
        >
          <div className="space-y-4">
            <SectionCard
              title="Business Unit Impact"
              icon={Building2}
              flushBody
              actions={
                <span className="text-xs font-medium text-slate-500">
                  {selectedIds.length} selected
                </span>
              }
            >
              <DataTable
                columns={impactColumns}
                data={businessUnitImpacts}
                getRowId={(r) => r.id}
                selectable
                selectedIds={selectedIds}
                onToggleRow={toggleRow}
                onToggleAll={toggleAll}
              />
            </SectionCard>
            <SectionCard title="Communication Tickets" icon={ListChecks} flushBody>
              <DataTable
                columns={ticketColumns}
                data={tickets}
                getRowId={(r) => r.id}
                onRowClick={() => setSlideOpen(true)}
              />
            </SectionCard>
          </div>
        </Block>

        {/* AI thinking indicators */}
        <Block
          title="AI Thinking Indicator"
          description="Fakes 'agent is working' for scripted AI moments — three variants."
        >
          <div className="space-y-4">
            <AIThinkingIndicator
              variant="panel"
              label="Scanning regulatory sources…"
              sublabel="Analysing ACER / EU REMIT publications for changes"
            />
            <Card className="flex flex-wrap items-center gap-6 p-6">
              <AIThinkingIndicator variant="inline" label="Generating report" />
              <div className="flex items-center gap-2 text-sm text-slate-600">
                Thinking
                <AIThinkingIndicator variant="dots" />
              </div>
            </Card>
          </div>
        </Block>

        {/* Timeline */}
        <Block title="Timeline" description="Vertical audit trail — seeded from REMIT II events.">
          <SectionCard title="Audit Trail" icon={Clock}>
            <Timeline items={timelineItems} />
          </SectionCard>
        </Block>

        {/* Overlays */}
        <Block title="Modal & Slide-Over" description="Centered dialog and right-side drawer.">
          <Card className="flex flex-wrap gap-3 p-6">
            <Button variant="secondary" onClick={() => setModalOpen(true)}>
              Open Modal
            </Button>
            <Button variant="secondary" icon={MessageSquare} onClick={() => setSlideOpen(true)}>
              Open Slide-Over
            </Button>
          </Card>
        </Block>

        <footer className="border-t border-slate-200 pt-6 text-xs text-slate-400">
          {BRAND.name} · Regulatory Change Management demo · styleguide route is temporary.
        </footer>
      </main>

      {/* Modal instance */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm communication"
        description="Send the REMIT II notification to the selected Business Units?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon={Send} onClick={() => setModalOpen(false)}>
              Send to {selectedIds.length} BUs
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          This is the centered Modal pattern. It closes on the ✕ button, the overlay, or the
          Escape key, and locks background scroll while open.
        </p>
      </Modal>

      {/* SlideOver instance */}
      <SlideOver
        open={slideOpen}
        onClose={() => setSlideOpen(false)}
        title="Advisory Assistant"
        description="Interpretation & implementation support"
        footer={
          <Button fullWidth icon={Send}>
            Send message
          </Button>
        }
      >
        <div className="space-y-4">
          <AIThinkingIndicator variant="inline" label="Assistant is typing" />
          <div className="rounded-2xl rounded-tl-sm bg-slate-100 p-3 text-sm text-slate-700">
            Intragroup transactions are not automatically exempt under REMIT II — scope depends
            on whether the contract relates to wholesale energy products delivered in the Union.
          </div>
          <p className="text-xs text-slate-400">
            This drawer hosts the chatbot panel and detail views in the live demo.
          </p>
        </div>
      </SlideOver>
    </div>
  );
}
