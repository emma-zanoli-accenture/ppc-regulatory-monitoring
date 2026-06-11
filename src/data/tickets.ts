import type { Ticket } from '../types';
import { REMIT_II_ID } from './regulatoryChanges';

/** Pre-built tickets in DIFFERENT workflow states so dashboards look alive.
 *  One ticket per impacted Business Unit for REMIT II. */
export const tickets: Ticket[] = [
  // Clarification Requested — awaiting Legal answer (links support request sr-1).
  {
    id: 'tkt-trading',
    regChangeId: REMIT_II_ID,
    businessUnit: 'Energy Trading',
    status: 'Clarification Requested',
    viewed: true,
    downloaded: true,
    evidenceUploaded: false,
    completedOn: null,
    residualRisk: null,
    complianceMeasures: [],
    clarifications: ['sr-1'],
  },
  // Completed / Ready for Audit — evidence uploaded, closed by the BU.
  {
    id: 'tkt-wmo',
    regChangeId: REMIT_II_ID,
    businessUnit: 'Wholesale Market Operations',
    status: 'Ready for Audit',
    viewed: true,
    downloaded: true,
    evidenceUploaded: true,
    completedOn: '2026-06-02',
    residualRisk: 'Low',
    complianceMeasures: [
      {
        id: 'cm-1',
        text: 'Upgraded reporting pipeline to next-working-day (T+1) submission with ' +
          'automated late/failed-submission monitoring.',
        linkedObligationId: 'obl-2',
      },
      {
        id: 'cm-2',
        text: 'Validated RRM connectivity and ACER data-quality checks; documented ' +
          'fallback submission path.',
        linkedObligationId: 'obl-3',
      },
    ],
    clarifications: [],
  },
  // Notification Sent — not yet opened.
  {
    id: 'tkt-procurement',
    regChangeId: REMIT_II_ID,
    businessUnit: 'Procurement',
    status: 'Notification Sent',
    viewed: false,
    downloaded: false,
    evidenceUploaded: false,
    completedOn: null,
    residualRisk: null,
    complianceMeasures: [],
    clarifications: [],
  },
  // Viewed — opened but no report download yet.
  {
    id: 'tkt-regaffairs',
    regChangeId: REMIT_II_ID,
    businessUnit: 'Regulatory Affairs',
    status: 'Viewed',
    viewed: true,
    downloaded: false,
    evidenceUploaded: false,
    completedOn: null,
    residualRisk: null,
    complianceMeasures: [],
    clarifications: [],
  },
  // In Progress — approaching its (earlier) due date of 2026-07-10.
  {
    id: 'tkt-sustainability',
    regChangeId: REMIT_II_ID,
    businessUnit: 'Sustainability',
    status: 'In Progress',
    viewed: true,
    downloaded: true,
    evidenceUploaded: false,
    completedOn: null,
    residualRisk: null,
    complianceMeasures: [
      {
        id: 'cm-3',
        text: 'Drafting market transparency data extract to support reporting obligations.',
        linkedObligationId: 'obl-1',
      },
    ],
    clarifications: [],
  },
];
