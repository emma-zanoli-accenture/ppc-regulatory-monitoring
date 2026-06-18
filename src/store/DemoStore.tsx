import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  auditTrail as seedAuditTrail,
  businessUnitImpacts as seedImpacts,
  evidence as seedEvidence,
  obligations as seedObligations,
  regulatoryChanges as seedRegulatoryChanges,
  supportRequests as seedSupportRequests,
  tickets as seedTickets,
  REMIT_II_ID,
} from '../data';
import { addDays } from '../lib/format';
import type {
  AuditTrailEntry,
  BusinessUnit,
  BusinessUnitImpact,
  ChatMessage,
  CommunicationReport,
  ComplianceMeasure,
  Evidence,
  Obligation,
  RegulatoryChange,
  RiskPriority,
  SupportRequest,
  Ticket,
  WorkflowState,
} from '../types';

/** A regulatory source watched by the monitoring agent. */
export interface MonitoredSource {
  id: string;
  name: string;
  authority: string;
}

/** Static list of sources the agent monitors (shown in the dashboard panel). */
export const MONITORED_SOURCES: MonitoredSource[] = [
  { id: 'src-acer', name: 'ACER', authority: 'EU Agency for the Cooperation of Energy Regulators' },
  {
    id: 'src-entsoe',
    name: 'ENTSO-E',
    authority: 'European Network of Transmission System Operators for Electricity',
  },
  { id: 'src-rae', name: 'RAE / RAAEY', authority: 'Greek Regulatory Authority for Energy' },
  { id: 'src-euoj', name: 'EU Official Journal', authority: 'Official Journal of the European Union' },
];

/** Returns today's real date as YYYY-MM-DD; mutated later by Simulate Time. */
const today = () => new Date().toISOString().slice(0, 10);

/** Presenter "simulate time" jumps, relative to the REMIT II implementation due date. */
export type TimeJumpKey = 'T-30' | 'T-14' | 'T-7' | 'T+1';
export interface TimeJump {
  key: TimeJumpKey;
  label: string;
  /** Days relative to the implementation due date. */
  offset: number;
}
export const TIME_JUMPS: TimeJump[] = [
  { key: 'T-30', label: 'T‑30 days', offset: -30 },
  { key: 'T-14', label: 'T‑14 days', offset: -14 },
  { key: 'T-7', label: 'T‑7 days', offset: -7 },
  { key: 'T+1', label: 'T+1 (overdue)', offset: 1 },
];

/** Regulations already in the monitored catalogue before the live scan. */
const INITIAL_CATALOGUE = ['rc-demand-response', 'rc-res-licensing', 'rc-csrd-esg'];

interface DemoState {
  regulatoryChanges: RegulatoryChange[];
  obligations: Obligation[];
  businessUnitImpacts: BusinessUnitImpact[];
  tickets: Ticket[];
  evidence: Evidence[];
  supportRequests: SupportRequest[];
  auditTrail: AuditTrailEntry[];
  currentDate: string;
  /** The presenter time-jump currently applied (null = base date). */
  activeJump: TimeJumpKey | null;
  /** Reg-change ids currently in the source catalogue. */
  catalogue: string[];
  sourceScanRun: boolean;
  catalogueUpdated: boolean;
  /** Generated communication reports, keyed by regulatory change id. */
  communicationReports: Record<string, CommunicationReport>;
}

/** "Received but not started" states — entering measures moves these to In Progress. */
const RECEIVED_STATES: WorkflowState[] = [
  'Notification Sent',
  'Viewed',
  'Downloaded',
  'Clarification Requested',
];
const COMPLETED_STATES: WorkflowState[] = ['Completed', 'Ready for Audit', 'Reported'];
const STARTED_STATES: WorkflowState[] = [
  'In Progress',
  'Pending Evidence',
  'Clarification Requested',
  'Completed',
  'Ready for Audit',
  'Reported',
  'Overdue',
  'Escalated',
];

/** Recompute a change's implementation/audit rollup statuses from its tickets,
 *  so Legal screens stay consistent after BU actions. */
function recomputeChange(
  changes: RegulatoryChange[],
  tickets: Ticket[],
  regChangeId: string,
): RegulatoryChange[] {
  const own = tickets.filter((t) => t.regChangeId === regChangeId);
  if (own.length === 0) return changes;
  const allCompleted = own.every((t) => COMPLETED_STATES.includes(t.status));
  const anyStarted = own.some((t) => STARTED_STATES.includes(t.status));
  const implementationStatus = allCompleted
    ? 'Completed'
    : anyStarted
      ? 'In Progress'
      : 'Not Started';
  const allReported = own.every((t) => t.status === 'Reported');
  const anyAuditReady = own.some(
    (t) => t.status === 'Ready for Audit' || t.status === 'Reported',
  );
  const auditStatus = allReported ? 'Reported' : anyAuditReady ? 'Ready for Audit' : 'Not Ready';
  return changes.map((c) =>
    c.id === regChangeId ? { ...c, implementationStatus, auditStatus } : c,
  );
}

/** Input for raising a second-level support request from the BU view. */
export interface CreateSupportRequestInput {
  ticketId: string;
  businessUnit: BusinessUnit;
  subject: string;
  description: string;
  reportSection?: string;
  priority: RiskPriority;
  chatbotTranscript?: ChatMessage[];
}

/** Input for adding an evidence item. */
export interface AddEvidenceInput {
  ticketId: string;
  fileName: string;
  linkedObligationId: string;
  uploadedBy: string;
}

function buildInitialState(): DemoState {
  return {
    regulatoryChanges: structuredClone(seedRegulatoryChanges),
    obligations: structuredClone(seedObligations),
    businessUnitImpacts: structuredClone(seedImpacts),
    tickets: structuredClone(seedTickets),
    evidence: structuredClone(seedEvidence),
    supportRequests: structuredClone(seedSupportRequests),
    auditTrail: structuredClone(seedAuditTrail),
    currentDate: today(),
    activeJump: null,
    catalogue: [...INITIAL_CATALOGUE],
    sourceScanRun: false,
    catalogueUpdated: false,
    communicationReports: {},
  };
}

interface DemoStoreValue extends DemoState {
  /** Mark the agentic source scan as having run (reveals the detected regulation). */
  runSourceScan: () => void;
  /** Append the detected REMIT II regulation to the source catalogue. */
  updateSourceCatalogue: () => void;
  /**
   * Send the communication to the selected Business Units: stores the report,
   * marks the change as Sent, ensures each BU has an active (notified) ticket,
   * and appends audit-trail entries. Visible across both roles.
   */
  sendCommunication: (report: CommunicationReport) => void;
  /** BU opened the notification — marks the ticket viewed (idempotent). */
  markTicketViewed: (ticketId: string) => void;
  /** BU downloaded the report — marks the ticket downloaded (idempotent). */
  markTicketDownloaded: (ticketId: string) => void;
  /** Raise a second-level support request; sets the ticket to Clarification Requested. */
  createSupportRequest: (input: CreateSupportRequestInput) => void;
  /** Legal answers a support request. */
  answerSupportRequest: (id: string, response: string) => void;
  /** Add a compliance measure to a ticket. */
  addComplianceMeasure: (ticketId: string, measure: Omit<ComplianceMeasure, 'id'>) => void;
  /** Attach an evidence item to a ticket (simulated upload). */
  addEvidence: (input: AddEvidenceInput) => void;
  /** Submit compliance & close: marks the ticket Ready for Audit and notifies Legal. */
  submitCompliance: (ticketId: string, residualRisk: RiskPriority) => void;
  /** Presenter "simulate time": advance the demo clock; T+1 escalates incomplete tickets. */
  simulateTime: (key: TimeJumpKey) => void;
  /** Restore all state to the seed (Reset Demo). */
  reset: () => void;
}

const DemoStoreContext = createContext<DemoStoreValue | null>(null);

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(buildInitialState);

  const runSourceScan = useCallback(() => {
    setState((s) => {
      if (s.sourceScanRun) return s;
      const entry: AuditTrailEntry = {
        id: 'at-source-scan',
        regChangeId: REMIT_II_ID,
        timestamp: `${s.currentDate}T08:30:00`,
        actor: 'AI Source Monitor',
        action: 'Regulatory change detected',
        detail: 'New REMIT II reporting requirements identified during ACER / EU REMIT source scan.',
      };
      return {
        ...s,
        sourceScanRun: true,
        auditTrail: s.auditTrail.some((a) => a.id === entry.id)
          ? s.auditTrail
          : [...s.auditTrail, entry],
      };
    });
  }, []);

  const updateSourceCatalogue = useCallback(() => {
    setState((s) => {
      if (s.catalogue.includes(REMIT_II_ID)) return s;
      const entry: AuditTrailEntry = {
        id: 'at-catalogue-update',
        regChangeId: REMIT_II_ID,
        timestamp: `${s.currentDate}T09:00:00`,
        actor: 'AI Source Monitor',
        action: 'Source catalogue updated',
        detail: 'REMIT II added to the monitored regulatory source catalogue.',
      };
      return {
        ...s,
        catalogue: [...s.catalogue, REMIT_II_ID],
        catalogueUpdated: true,
        auditTrail: s.auditTrail.some((a) => a.id === entry.id)
          ? s.auditTrail
          : [...s.auditTrail, entry],
      };
    });
  }, []);

  const sendCommunication = useCallback((report: CommunicationReport) => {
    setState((s) => {
      const regChangeId = report.regChangeId;
      const selected = new Set<BusinessUnit>(report.sentTo);

      // 1. Mark the regulatory change as communicated.
      const regulatoryChanges = s.regulatoryChanges.map((c) =>
        c.id === regChangeId ? { ...c, communicationStatus: 'Sent' as const } : c,
      );

      // 2. Reset every selected-BU ticket to Notification Sent (fresh start on send).
      const existingByBu = new Map(
        s.tickets.filter((t) => t.regChangeId === regChangeId).map((t) => [t.businessUnit, t]),
      );
      const tickets = s.tickets.map((t): Ticket => {
        if (t.regChangeId === regChangeId && selected.has(t.businessUnit)) {
          return {
            ...t,
            status: 'Notification Sent' as const,
            viewed: false,
            downloaded: false,
            evidenceUploaded: false,
            completedOn: null,
            residualRisk: null,
            complianceMeasures: [],
            clarifications: [],
          };
        }
        return t;
      });
      for (const bu of report.sentTo) {
        if (!existingByBu.has(bu)) {
          tickets.push({
            id: `tkt-${regChangeId}-${bu.toLowerCase().replace(/[^a-z]+/g, '-')}`,
            regChangeId,
            businessUnit: bu,
            status: 'Notification Sent',
            viewed: false,
            downloaded: false,
            evidenceUploaded: false,
            completedOn: null,
            residualRisk: null,
            complianceMeasures: [],
            clarifications: [],
          });
        }
      }

      // Recompute implementation/audit status now that tickets are freshly reset.
      const updatedChanges = recomputeChange(regulatoryChanges, tickets, regChangeId);

      // 3. Purge stale seed entries for this change so the timeline stays coherent with the
      //    freshly-reset tickets. Keep only entries added today (detection + catalogue from
      //    the live demo run) and entries belonging to other regulatory changes.
      const cleanTrail = s.auditTrail.filter(
        (a) => a.regChangeId !== regChangeId || a.timestamp.startsWith(s.currentDate),
      );

      // Append a fresh send audit-trail entry.
      const entryId = `at-send-${regChangeId}`;
      const auditTrail = cleanTrail.some((a) => a.id === entryId)
        ? cleanTrail
        : [
            ...cleanTrail,
            {
              id: entryId,
              regChangeId,
              timestamp: `${s.currentDate}T09:30:00`,
              actor: 'Legal / Compliance',
              action: 'Communication sent',
              detail: `Communication report approved and sent to ${report.sentTo.length} Business Units: ${report.sentTo.join(', ')}. Tracking and audit trail activated.`,
            } satisfies AuditTrailEntry,
          ];

      return {
        ...s,
        regulatoryChanges: updatedChanges,
        tickets,
        auditTrail,
        communicationReports: { ...s.communicationReports, [regChangeId]: report },
      };
    });
  }, []);

  const markTicketViewed = useCallback((ticketId: string) => {
    setState((s) => {
      const ticket = s.tickets.find((t) => t.id === ticketId);
      if (!ticket || ticket.viewed) return s;
      const tickets = s.tickets.map((t): Ticket =>
        t.id === ticketId
          ? { ...t, viewed: true, status: t.status === 'Notification Sent' ? 'Viewed' : t.status }
          : t,
      );
      const entryId = `at-view-${ticketId}`;
      const auditTrail: AuditTrailEntry[] = [
        ...s.auditTrail,
        {
          id: entryId,
          regChangeId: ticket.regChangeId,
          ticketId,
          timestamp: `${s.currentDate}T10:00:00`,
          actor: ticket.businessUnit,
          action: 'Notification viewed',
          detail: `${ticket.businessUnit} opened the regulatory change notification.`,
        },
      ];
      return {
        ...s,
        tickets,
        auditTrail,
        regulatoryChanges: recomputeChange(s.regulatoryChanges, tickets, ticket.regChangeId),
      };
    });
  }, []);

  const markTicketDownloaded = useCallback((ticketId: string) => {
    setState((s) => {
      const ticket = s.tickets.find((t) => t.id === ticketId);
      if (!ticket || ticket.downloaded) return s;
      const tickets = s.tickets.map((t): Ticket =>
        t.id === ticketId
          ? {
              ...t,
              downloaded: true,
              viewed: true,
              status:
                t.status === 'Viewed' || t.status === 'Notification Sent'
                  ? 'Downloaded'
                  : t.status,
            }
          : t,
      );
      const entryId = `at-download-${ticketId}`;
      const auditTrail: AuditTrailEntry[] = [
        ...s.auditTrail,
        {
          id: entryId,
          regChangeId: ticket.regChangeId,
          ticketId,
          timestamp: `${s.currentDate}T10:05:00`,
          actor: ticket.businessUnit,
          action: 'Report downloaded',
          detail: `${ticket.businessUnit} downloaded the communication report.`,
        },
      ];
      return {
        ...s,
        tickets,
        auditTrail,
        regulatoryChanges: recomputeChange(s.regulatoryChanges, tickets, ticket.regChangeId),
      };
    });
  }, []);

  const createSupportRequest = useCallback((input: CreateSupportRequestInput) => {
    setState((s) => {
      const ticket = s.tickets.find((t) => t.id === input.ticketId);
      if (!ticket) return s;
      const id = `sr-live-${s.supportRequests.length + 1}`;
      const question = input.description
        ? `${input.subject} — ${input.description}`
        : input.subject;
      const sr: SupportRequest = {
        id,
        ticketId: input.ticketId,
        businessUnit: input.businessUnit,
        question,
        chatbotTranscript: input.chatbotTranscript,
        reportSection: input.reportSection,
        priority: input.priority,
        status: 'Open',
        history: [
          {
            timestamp: `${s.currentDate}T11:00:00`,
            actor: input.businessUnit,
            note: 'Support request raised.',
          },
        ],
      };
      const tickets = s.tickets.map((t): Ticket =>
        t.id === input.ticketId && !COMPLETED_STATES.includes(t.status)
          ? { ...t, status: 'Clarification Requested', clarifications: [...t.clarifications, id] }
          : t,
      );
      const auditTrail: AuditTrailEntry[] = [
        ...s.auditTrail,
        {
          id: `at-support-${id}`,
          regChangeId: ticket.regChangeId,
          ticketId: input.ticketId,
          timestamp: `${s.currentDate}T11:00:00`,
          actor: input.businessUnit,
          action: 'Clarification requested',
          detail: `Support request raised: ${input.subject}`,
        },
      ];
      return {
        ...s,
        supportRequests: [...s.supportRequests, sr],
        tickets,
        auditTrail,
        regulatoryChanges: recomputeChange(s.regulatoryChanges, tickets, ticket.regChangeId),
      };
    });
  }, []);

  const answerSupportRequest = useCallback((id: string, response: string) => {
    setState((s) => {
      const sr = s.supportRequests.find((r) => r.id === id);
      if (!sr) return s;
      const ticket = s.tickets.find((t) => t.id === sr.ticketId);
      const supportRequests = s.supportRequests.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Answered' as const,
              legalResponse: response,
              history: [
                ...r.history,
                {
                  timestamp: `${s.currentDate}T14:00:00`,
                  actor: 'Legal / Compliance',
                  note: 'Responded to support request.',
                },
              ],
            }
          : r,
      );
      const tickets = s.tickets.map((t): Ticket =>
        t.id === sr.ticketId && t.status === 'Clarification Requested'
          ? { ...t, status: 'In Progress' }
          : t,
      );
      const auditTrail: AuditTrailEntry[] = [
        ...s.auditTrail,
        {
          id: `at-answer-${id}`,
          regChangeId: ticket?.regChangeId ?? '',
          ticketId: sr.ticketId,
          timestamp: `${s.currentDate}T14:00:00`,
          actor: 'Legal / Compliance',
          action: 'Support request answered',
          detail: `Response sent to ${sr.businessUnit}.`,
        },
      ];
      return {
        ...s,
        supportRequests,
        tickets,
        auditTrail,
        regulatoryChanges: ticket
          ? recomputeChange(s.regulatoryChanges, tickets, ticket.regChangeId)
          : s.regulatoryChanges,
      };
    });
  }, []);

  const addComplianceMeasure = useCallback(
    (ticketId: string, measure: Omit<ComplianceMeasure, 'id'>) => {
      setState((s) => {
        const ticket = s.tickets.find((t) => t.id === ticketId);
        if (!ticket) return s;
        const id = `cm-live-${ticketId}-${ticket.complianceMeasures.length + 1}`;
        const tickets = s.tickets.map((t): Ticket =>
          t.id === ticketId
            ? {
                ...t,
                complianceMeasures: [...t.complianceMeasures, { ...measure, id }],
                status: RECEIVED_STATES.includes(t.status) ? 'In Progress' : t.status,
              }
            : t,
        );
        return {
          ...s,
          tickets,
          regulatoryChanges: recomputeChange(s.regulatoryChanges, tickets, ticket.regChangeId),
        };
      });
    },
    [],
  );

  const addEvidence = useCallback((input: AddEvidenceInput) => {
    setState((s) => {
      const ticket = s.tickets.find((t) => t.id === input.ticketId);
      if (!ticket) return s;
      const count = s.evidence.filter((e) => e.ticketId === input.ticketId).length + 1;
      const fileType = input.fileName.includes('.')
        ? (input.fileName.split('.').pop() ?? 'FILE').toUpperCase()
        : 'FILE';
      const ev: Evidence = {
        id: `ev-live-${input.ticketId}-${count}`,
        ticketId: input.ticketId,
        fileName: input.fileName,
        fileType,
        uploadedBy: input.uploadedBy,
        uploadedOn: s.currentDate,
        linkedObligationId: input.linkedObligationId,
      };
      const tickets = s.tickets.map((t): Ticket =>
        t.id === input.ticketId ? { ...t, evidenceUploaded: true } : t,
      );
      const auditTrail: AuditTrailEntry[] = [
        ...s.auditTrail,
        {
          id: `at-evidence-${ev.id}`,
          regChangeId: ticket.regChangeId,
          ticketId: input.ticketId,
          timestamp: `${s.currentDate}T12:00:00`,
          actor: input.uploadedBy,
          action: 'Evidence uploaded',
          detail: `Evidence "${input.fileName}" uploaded.`,
        },
      ];
      return { ...s, evidence: [...s.evidence, ev], tickets, auditTrail };
    });
  }, []);

  const submitCompliance = useCallback((ticketId: string, residualRisk: RiskPriority) => {
    setState((s) => {
      const ticket = s.tickets.find((t) => t.id === ticketId);
      if (!ticket) return s;
      const tickets = s.tickets.map((t): Ticket =>
        t.id === ticketId
          ? {
              ...t,
              status: 'Ready for Audit' as const,
              completedOn: s.currentDate,
              residualRisk,
            }
          : t,
      );
      const entryId = `at-complete-${ticketId}`;
      const auditTrail: AuditTrailEntry[] = s.auditTrail.some((a) => a.id === entryId)
        ? s.auditTrail
        : [
            ...s.auditTrail,
            {
              id: entryId,
              regChangeId: ticket.regChangeId,
              ticketId,
              timestamp: `${s.currentDate}T13:00:00`,
              actor: ticket.businessUnit,
              action: 'Compliance action submitted',
              detail: `${ticket.businessUnit} submitted compliance measures and evidence; ticket marked Ready for Audit.`,
            },
          ];
      return {
        ...s,
        tickets,
        auditTrail,
        regulatoryChanges: recomputeChange(s.regulatoryChanges, tickets, ticket.regChangeId),
      };
    });
  }, []);

  const simulateTime = useCallback((key: TimeJumpKey) => {
    setState((s) => {
      const jump = TIME_JUMPS.find((j) => j.key === key);
      if (!jump) return s;
      const remit = s.regulatoryChanges.find((c) => c.id === REMIT_II_ID);
      const due = remit?.implementationDueDate ?? s.currentDate;
      const newDate = addDays(due, jump.offset);
      const daysToDue = -jump.offset;

      // Reminder / escalation audit entry (idempotent per jump).
      let auditTrail = s.auditTrail;
      const reminderId = `at-reminder-${key}`;
      if (!auditTrail.some((a) => a.id === reminderId)) {
        auditTrail = [
          ...auditTrail,
          {
            id: reminderId,
            regChangeId: REMIT_II_ID,
            timestamp: `${newDate}T08:00:00`,
            actor: 'System',
            action: key === 'T+1' ? 'Deadline passed' : 'Reminder issued',
            detail:
              key === 'T+1'
                ? 'Implementation deadline passed. Escalation triggered for incomplete tickets.'
                : `${key} reminder issued to impacted Business Units and Legal/Compliance — ${daysToDue} days to implementation due date.`,
          },
        ];
      }

      let tickets = s.tickets;
      let regulatoryChanges = s.regulatoryChanges;

      if (key === 'T+1') {
        tickets = s.tickets.map((t): Ticket =>
          t.regChangeId === REMIT_II_ID &&
          !COMPLETED_STATES.includes(t.status) &&
          t.status !== 'Escalated'
            ? { ...t, status: 'Escalated' }
            : t,
        );
        const escalationEntries: AuditTrailEntry[] = tickets
          .filter((t) => t.regChangeId === REMIT_II_ID && t.status === 'Escalated')
          .filter((t) => !auditTrail.some((a) => a.id === `at-escalate-${t.id}`))
          .map((t) => ({
            id: `at-escalate-${t.id}`,
            regChangeId: REMIT_II_ID,
            ticketId: t.id,
            timestamp: `${newDate}T08:05:00`,
            actor: 'System',
            action: 'Escalated',
            detail: `${t.businessUnit} ticket escalated — incomplete at the implementation deadline.`,
          }));
        auditTrail = [...auditTrail, ...escalationEntries];
        regulatoryChanges = recomputeChange(s.regulatoryChanges, tickets, REMIT_II_ID);
      }

      return { ...s, currentDate: newDate, activeJump: key, tickets, auditTrail, regulatoryChanges };
    });
  }, []);

  const reset = useCallback(() => setState(buildInitialState()), []);

  const value = useMemo<DemoStoreValue>(
    () => ({
      ...state,
      runSourceScan,
      updateSourceCatalogue,
      sendCommunication,
      markTicketViewed,
      markTicketDownloaded,
      createSupportRequest,
      answerSupportRequest,
      addComplianceMeasure,
      addEvidence,
      submitCompliance,
      simulateTime,
      reset,
    }),
    [
      state,
      runSourceScan,
      updateSourceCatalogue,
      sendCommunication,
      markTicketViewed,
      markTicketDownloaded,
      createSupportRequest,
      answerSupportRequest,
      addComplianceMeasure,
      addEvidence,
      submitCompliance,
      simulateTime,
      reset,
    ],
  );

  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>;
}

export function useDemoStore(): DemoStoreValue {
  const ctx = useContext(DemoStoreContext);
  if (!ctx) throw new Error('useDemoStore must be used within a DemoStoreProvider');
  return ctx;
}
