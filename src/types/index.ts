/**
 * Shared domain types for the Regulatory Change Management demo.
 *
 * All entities are static seed data (src/data/) made mutable at runtime by the
 * store. Types favor relational consistency: entities reference each other by id
 * so actions in one role are visible in the other.
 */

import type { WorkflowState } from './workflow';

export * from './workflow';

/* ------------------------------------------------------------------ */
/* Supporting unions (no TS enums — tsconfig uses erasableSyntaxOnly)  */
/* ------------------------------------------------------------------ */

export const RISK_PRIORITIES = ['Low', 'Medium', 'High'] as const;
export type RiskPriority = (typeof RISK_PRIORITIES)[number];

export const IMPACT_LEVELS = ['Low', 'Medium', 'High'] as const;
export type ImpactLevel = (typeof IMPACT_LEVELS)[number];

/** The fixed set of impacted Business Units (Greek utility — never banking). */
export const BUSINESS_UNITS = [
  'Energy Trading',
  'Wholesale Market Operations',
  'Procurement',
  'Regulatory Affairs',
  'Sustainability',
] as const;
export type BusinessUnit = (typeof BUSINESS_UNITS)[number];

/** Roll-up summary statuses shown on the Legal control-tower change card. */
export const COMMUNICATION_STATUSES = [
  'Not Started',
  'Draft',
  'Partially Sent',
  'Sent',
] as const;
export type CommunicationStatus = (typeof COMMUNICATION_STATUSES)[number];

export const IMPLEMENTATION_STATUSES = [
  'Not Started',
  'In Progress',
  'Completed',
] as const;
export type ImplementationStatus = (typeof IMPLEMENTATION_STATUSES)[number];

export const AUDIT_STATUSES = [
  'Not Ready',
  'Ready for Audit',
  'Reported',
] as const;
export type AuditStatus = (typeof AUDIT_STATUSES)[number];

export const SUPPORT_REQUEST_STATUSES = ['Open', 'Answered', 'Closed'] as const;
export type SupportRequestStatus = (typeof SUPPORT_REQUEST_STATUSES)[number];

/* ------------------------------------------------------------------ */
/* Entities                                                           */
/* ------------------------------------------------------------------ */

/** A monitored regulatory change. The demo centers on one (REMIT II); others are
 *  "background" rows (title + statuses only) so list/dashboard views aren't empty. */
export interface RegulatoryChange {
  id: string;
  title: string;
  regulatorySource: string;
  regulatoryArea: string;
  /** ISO date string (YYYY-MM-DD) — fixed for determinism. */
  publicationDate: string;
  effectiveDate: string;
  implementationDueDate: string;
  riskPriority: RiskPriority;
  description: string;
  communicationStatus: CommunicationStatus;
  implementationStatus: ImplementationStatus;
  auditStatus: AuditStatus;
  /** True for the lightweight rows that have no obligations/impacts/tickets. */
  isBackground?: boolean;
}

/** A specific obligation derived from (and interpreted for) a regulatory change. */
export interface Obligation {
  id: string;
  regChangeId: string;
  text: string;
  requirement: string;
  interpretation: string;
  scope: string;
  linkedProcess: string;
}

/** How a regulatory change impacts a single Business Unit. */
export interface BusinessUnitImpact {
  id: string;
  regChangeId: string;
  businessUnit: BusinessUnit;
  impactedProcess: string;
  impactLevel: ImpactLevel;
  owner: string;
  /** ISO date string — the BU-specific implementation due date. */
  dueDate: string;
  impactReason: string;
  /** Whether this BU was selected to receive a communication. */
  selected: boolean;
}

/** A compliance measure entered by the Business Unit while implementing. */
export interface ComplianceMeasure {
  id: string;
  /** Implemented control description. */
  text: string;
  linkedObligationId?: string;
  affectedProcess?: string;
  controlIntroduced?: string;
  /** ISO date the control was implemented. */
  implementationDate?: string;
  owner?: string;
  comments?: string;
}

/** The unit of work tracked per Business Unit for a regulatory change. */
export interface Ticket {
  id: string;
  regChangeId: string;
  businessUnit: BusinessUnit;
  status: WorkflowState;
  viewed: boolean;
  downloaded: boolean;
  evidenceUploaded: boolean;
  /** ISO date string when the BU submitted & closed, else null. */
  completedOn: string | null;
  residualRisk: RiskPriority | null;
  complianceMeasures: ComplianceMeasure[];
  /** Ids of SupportRequest records raised against this ticket. */
  clarifications: string[];
}

/** A piece of evidence uploaded against a ticket. */
export interface Evidence {
  id: string;
  ticketId: string;
  fileName: string;
  fileType: string;
  uploadedBy: string;
  /** ISO date string. */
  uploadedOn: string;
  linkedObligationId: string;
}

/** An immutable audit-trail event. */
export interface AuditTrailEntry {
  id: string;
  regChangeId: string;
  ticketId?: string;
  /** ISO datetime string (fixed). */
  timestamp: string;
  actor: string;
  action: string;
  detail: string;
}

/** One turn in the BU advisory chatbot transcript. */
export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  /** ISO datetime string. */
  timestamp: string;
}

/** An entry in a support request's activity history. */
export interface ClarificationHistoryEntry {
  /** ISO datetime string. */
  timestamp: string;
  actor: string;
  note: string;
}

/** The generated (and optionally Legal-edited) communication report for a change.
 *  Stored at send time so the Business Unit view shows the same content. */
export interface CommunicationReport {
  regChangeId: string;
  title: string;
  executiveSummary: string;
  whatIsChanging: string;
  whyItMatters: string;
  requiredActions: string[];
  legalNotes: string[];
  /** ISO date the report was generated/sent. */
  generatedOn: string;
  sentTo: BusinessUnit[];
}

/** A clarification / support request from a BU to Legal/Compliance.
 *  May originate from the chatbot or reference a section of the report. */
export interface SupportRequest {
  id: string;
  ticketId: string;
  businessUnit: BusinessUnit;
  question: string;
  chatbotTranscript?: ChatMessage[];
  reportSection?: string;
  priority: RiskPriority;
  status: SupportRequestStatus;
  legalResponse?: string;
  history: ClarificationHistoryEntry[];
}
