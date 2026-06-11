import type { AuditTrailEntry } from '../types';
import { REMIT_II_ID } from './regulatoryChanges';

/** Pre-written audit-trail entries for REMIT II, in chronological order. */
export const auditTrail: AuditTrailEntry[] = [
  {
    id: 'at-1',
    regChangeId: REMIT_II_ID,
    timestamp: '2026-03-12T08:30:00',
    actor: 'AI Source Monitor',
    action: 'Regulatory change detected',
    detail:
      'New REMIT II reporting requirements identified during ACER / EU REMIT source scan.',
  },
  {
    id: 'at-2',
    regChangeId: REMIT_II_ID,
    timestamp: '2026-03-12T08:31:00',
    actor: 'AI Source Monitor',
    action: 'Source catalogue updated',
    detail: 'REMIT II appended to the monitored regulatory source catalogue.',
  },
  {
    id: 'at-3',
    regChangeId: REMIT_II_ID,
    timestamp: '2026-05-20T14:05:00',
    actor: 'Sofia Konstantinou (Legal/Compliance)',
    action: 'Communication sent',
    detail:
      'Communication issued to Energy Trading, Wholesale Market Operations, Procurement, ' +
      'Regulatory Affairs and Sustainability.',
  },
  {
    id: 'at-4',
    regChangeId: REMIT_II_ID,
    ticketId: 'tkt-regaffairs',
    timestamp: '2026-05-22T09:40:00',
    actor: 'Sofia Konstantinou (Regulatory Affairs)',
    action: 'Notification viewed',
    detail: 'Regulatory Affairs opened the regulatory change notification.',
  },
  {
    id: 'at-5',
    regChangeId: REMIT_II_ID,
    ticketId: 'tkt-trading',
    timestamp: '2026-05-28T10:15:00',
    actor: 'Nikos Papadopoulos (Energy Trading)',
    action: 'Clarification requested',
    detail:
      'Support request raised regarding reportable scope of intragroup supply contracts.',
  },
  {
    id: 'at-6',
    regChangeId: REMIT_II_ID,
    ticketId: 'tkt-wmo',
    timestamp: '2026-06-02T16:20:00',
    actor: 'Eleni Georgiou (Wholesale Market Operations)',
    action: 'Evidence submitted & ticket closed',
    detail:
      'Two evidence files uploaded and compliance measures recorded; ticket marked Ready for Audit.',
  },
];
