/**
 * Builds the structured communication-report content from seed data so the
 * generated report reads as if the agent authored it from the prior workflow
 * steps. The editable narrative fields are seeded from here; the rest
 * (obligations, impacted BUs) are rendered directly from the store.
 */
import type { BusinessUnitImpact, Obligation, RegulatoryChange } from '../types';
import { formatDate } from './format';

export interface ReportKeyDate {
  label: string;
  date: string;
}

export interface ReportFaq {
  q: string;
  a: string;
}

export interface ReportContent {
  title: string;
  executiveSummary: string;
  whatIsChanging: string;
  whyItMatters: string;
  requiredActions: string[];
  keyDates: ReportKeyDate[];
  risks: string[];
  supportEscalation: string;
  evidenceRequired: string[];
  faq: ReportFaq[];
}

export function buildReportContent(
  change: RegulatoryChange,
  obligations: Obligation[],
  impacts: BusinessUnitImpact[],
): ReportContent {
  const buNames = impacts.map((i) => i.businessUnit);
  const buList =
    buNames.length > 1
      ? `${buNames.slice(0, -1).join(', ')} and ${buNames[buNames.length - 1]}`
      : buNames.join('');

  const executiveSummary =
    `${change.title} (${change.regulatorySource}) introduces enhanced obligations that must be ` +
    `implemented by ${formatDate(change.implementationDueDate)}. ${obligations.length} obligations ` +
    `have been mapped to internal processes across ${impacts.length} impacted Business Units` +
    `${buList ? ` (${buList})` : ''}. This is a ${change.riskPriority.toLowerCase()}-priority change; ` +
    `early action is required to ensure reporting readiness and avoid regulatory exposure.`;

  const requiredActions = obligations.map(
    (o) => `${o.linkedProcess}: ${o.interpretation}`,
  );

  const keyDates: ReportKeyDate[] = [
    { label: 'Publication', date: formatDate(change.publicationDate) },
    { label: 'Effective date', date: formatDate(change.effectiveDate) },
    { label: 'Implementation due', date: formatDate(change.implementationDueDate) },
  ];

  const risks = [
    'Regulatory sanctions and financial penalties imposed by ACER for incomplete or late reporting.',
    'Suspension of market participation and significant reputational damage in wholesale energy markets.',
    'Findings in regulatory inspection due to insufficient recordkeeping and audit evidence.',
  ];

  const evidenceRequired = [
    'Registered Reporting Mechanism (RRM) connectivity test report.',
    'Next-working-day (T+1) reporting pipeline runbook and monitoring evidence.',
    'Transaction reporting reconciliation and exception logs.',
    'Recordkeeping and retention policy covering reportable activity.',
  ];

  const supportEscalation =
    'For interpretation or implementation questions, raise a support request to Legal/Compliance ' +
    'from your ticket or the advisory assistant. Material scope questions are escalated to the ' +
    'Regulatory Affairs lead. Unresolved blockers approaching the due date are escalated automatically.';

  const faq: ReportFaq[] = [
    {
      q: 'Are intragroup supply contracts in scope?',
      a: 'Not automatically exempt. Scope depends on whether the contract relates to wholesale energy products delivered in the Union — confirm specific structures with Legal/Compliance.',
    },
    {
      q: 'What is the reporting deadline for standard contracts?',
      a: 'Standard contracts and orders must be reported by the working day following the transaction (T+1); lifecycle events without undue delay.',
    },
    {
      q: 'Which channel must we report through?',
      a: 'All submissions must go through a Registered Reporting Mechanism (RRM) and pass ACER data-quality validations.',
    },
    {
      q: 'What evidence will be required for audit?',
      a: 'Submission receipts, reconciliation and exception logs, RRM connectivity proof, and recordkeeping covering the mandated retention period.',
    },
  ];

  return {
    title: change.title,
    executiveSummary,
    whatIsChanging: change.description,
    whyItMatters:
      'These obligations directly affect how the organisation captures, reports and evidences ' +
      'wholesale energy transactions. Meeting them protects market access, avoids penalties, and ' +
      'demonstrates compliance to ACER on demand.',
    requiredActions,
    keyDates,
    risks,
    supportEscalation,
    evidenceRequired,
    faq,
  };
}
