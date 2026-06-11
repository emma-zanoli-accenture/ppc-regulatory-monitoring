import type { Obligation } from '../types';
import { REMIT_II_ID } from './regulatoryChanges';

/** The 4 obligations interpreted from REMIT II. */
export const obligations: Obligation[] = [
  {
    id: 'obl-1',
    regChangeId: REMIT_II_ID,
    text: 'Report all reportable wholesale energy contracts and orders to ACER.',
    requirement:
      'Submit transaction and order data for the expanded set of reportable contract ' +
      'types (including additional standard and non-standard supply contracts) to ACER.',
    interpretation:
      'The reportable universe widens beyond the current scope. Trading desks must map ' +
      'every contract type to its REMIT reporting category and confirm none fall outside ' +
      'the reporting net.',
    scope: 'All wholesale energy transactions and orders to trade.',
    linkedProcess: 'Trade capture & transaction reporting',
  },
  {
    id: 'obl-2',
    regChangeId: REMIT_II_ID,
    text: 'Meet tightened reporting timelines (T+1 for standard contracts).',
    requirement:
      'Standard contracts and orders must be reported no later than the working day ' +
      'following the transaction (T+1); lifecycle events reported without undue delay.',
    interpretation:
      'Existing batch reporting cadence is insufficient. Reporting must shift to a ' +
      'reliable next-working-day pipeline with monitoring for late or failed submissions.',
    scope: 'Standard contracts, orders, and lifecycle events.',
    linkedProcess: 'Reporting operations & scheduling',
  },
  {
    id: 'obl-3',
    regChangeId: REMIT_II_ID,
    text: 'Ensure data quality and report via a Registered Reporting Mechanism (RRM).',
    requirement:
      'All submissions must pass ACER data-quality validations and be channelled through ' +
      'a Registered Reporting Mechanism with documented field-level completeness.',
    interpretation:
      'Reference data and counterparty identifiers must be validated before submission. ' +
      'The RRM connection and fallback path must be confirmed and tested.',
    scope: 'All reportable submissions and reference data.',
    linkedProcess: 'Data quality assurance & RRM connectivity',
  },
  {
    id: 'obl-4',
    regChangeId: REMIT_II_ID,
    text: 'Maintain records and an auditable trail for regulatory inspection.',
    requirement:
      'Retain transaction records, submission receipts, and exception logs for the ' +
      'mandated retention period in a form retrievable for ACER inspection.',
    interpretation:
      'Recordkeeping must capture not only the trades but the reporting evidence ' +
      '(receipts, corrections, exceptions) to demonstrate compliance on demand.',
    scope: 'All reportable activity and associated reporting evidence.',
    linkedProcess: 'Recordkeeping & audit readiness',
  },
];
