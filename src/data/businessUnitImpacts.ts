import type { BusinessUnitImpact } from '../types';
import { REMIT_II_ID } from './regulatoryChanges';

/** How REMIT II impacts each Business Unit (one row per BU). */
export const businessUnitImpacts: BusinessUnitImpact[] = [
  {
    id: 'imp-trading',
    regChangeId: REMIT_II_ID,
    businessUnit: 'Energy Trading',
    impactedProcess: 'Trade capture & transaction reporting',
    impactLevel: 'High',
    owner: 'Nikos Papadopoulos',
    dueDate: '2026-09-30',
    impactReason:
      'Expanded reportable contract types and T+1 timelines directly change how trades ' +
      'are captured and reported to ACER.',
    selected: true,
  },
  {
    id: 'imp-wmo',
    regChangeId: REMIT_II_ID,
    businessUnit: 'Wholesale Market Operations',
    impactedProcess: 'Reporting operations & RRM connectivity',
    impactLevel: 'High',
    owner: 'Eleni Georgiou',
    dueDate: '2026-09-30',
    impactReason:
      'Owns the reporting pipeline and RRM channel; must guarantee data quality and ' +
      'next-working-day submission.',
    selected: true,
  },
  {
    id: 'imp-procurement',
    regChangeId: REMIT_II_ID,
    businessUnit: 'Procurement',
    impactedProcess: 'Supply contract classification',
    impactLevel: 'Medium',
    owner: 'Dimitris Antoniou',
    dueDate: '2026-09-30',
    impactReason:
      'Certain procurement supply contracts now fall within the reportable scope and ' +
      'must be classified accordingly.',
    selected: true,
  },
  {
    id: 'imp-regaffairs',
    regChangeId: REMIT_II_ID,
    businessUnit: 'Regulatory Affairs',
    impactedProcess: 'ACER registration & regulatory liaison',
    impactLevel: 'Medium',
    owner: 'Sofia Konstantinou',
    dueDate: '2026-09-30',
    impactReason:
      'Maintains ACER registration and is the regulatory point of contact for the ' +
      'reporting obligations.',
    selected: true,
  },
  {
    id: 'imp-sustainability',
    regChangeId: REMIT_II_ID,
    businessUnit: 'Sustainability',
    impactedProcess: 'Market transparency disclosures',
    impactLevel: 'Low',
    owner: 'Maria Vasiliou',
    dueDate: '2026-07-10',
    impactReason:
      'Provides supporting market transparency data; limited but time-sensitive ' +
      'contribution required ahead of the main milestone.',
    selected: true,
  },
];
