/**
 * Pure dashboard metrics derived from the store data. Keeping these here means
 * the Legal dashboard and Monitoring screen report identical, seed-consistent
 * numbers.
 */
import type {
  RegulatoryChange,
  SupportRequest,
  Ticket,
  WorkflowState,
} from '../types';

export const COMPLETED_STATES: WorkflowState[] = [
  'Completed',
  'Ready for Audit',
  'Reported',
];
export const AUDIT_READY_STATES: WorkflowState[] = ['Ready for Audit', 'Reported'];
export const OVERDUE_STATES: WorkflowState[] = ['Overdue', 'Escalated'];

/** A change is "active" until it has been both implemented and reported. */
export function countActiveChanges(changes: RegulatoryChange[]): number {
  return changes.filter(
    (c) => !(c.implementationStatus === 'Completed' && c.auditStatus === 'Reported'),
  ).length;
}

/** Sent but not yet opened by the BU. */
export function countPendingAcknowledgements(tickets: Ticket[]): number {
  return tickets.filter((t) => t.status === 'Notification Sent' && !t.viewed).length;
}

export function countOpenSupportRequests(requests: SupportRequest[]): number {
  return requests.filter((r) => r.status === 'Open').length;
}

export function countOverdue(tickets: Ticket[]): number {
  return tickets.filter((t) => OVERDUE_STATES.includes(t.status)).length;
}

export function countCompleted(tickets: Ticket[]): number {
  return tickets.filter((t) => COMPLETED_STATES.includes(t.status)).length;
}

export function countAuditReady(tickets: Ticket[]): number {
  return tickets.filter((t) => AUDIT_READY_STATES.includes(t.status)).length;
}
