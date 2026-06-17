import type { BusinessUnitImpact, Obligation, RegulatoryChange, Ticket } from '../types';
import { formatDate } from './format';

/* ---- scripted implementation actions per obligation × BU ---- */

const ACTIONS: Record<string, Partial<Record<string, string[]>>> = {
  'obl-1': {
    'Energy Trading': [
      'Map all contract types to REMIT II reporting categories and confirm no gaps in scope coverage',
      'Update trade capture system to include all newly reportable contract types',
    ],
    'Wholesale Market Operations': [
      'Reconfigure reporting pipeline to handle the expanded reportable contract scope',
    ],
    'Procurement': [
      'Review all supply contracts and classify those within the REMIT II reportable scope',
      'Update contract templates to capture all mandatory REMIT II reporting fields at execution',
    ],
    'Regulatory Affairs': [
      'Update ACER registration to reflect expanded scope and notify ACER of classification changes',
    ],
  },
  'obl-2': {
    'Energy Trading': [
      'Redesign trade reporting workflow to guarantee T+1 submission for all standard contracts',
      'Implement automated T+1 submission trigger integrated with the trade capture system',
    ],
    'Wholesale Market Operations': [
      'Configure automated T+1 reporting pipeline with real-time monitoring and failure alerting',
      'Define escalation and remediation workflow for failed or late T+1 submissions',
      'Conduct 30-day parallel run against ACER ARIS to validate T+1 compliance before go-live',
    ],
    'Procurement': [
      'Align supply contract execution and data collection timelines with T+1 reporting requirements',
    ],
  },
  'obl-3': {
    'Energy Trading': [
      'Enrich counterparty master data with valid LEIs for all REMIT II reportable entities',
    ],
    'Wholesale Market Operations': [
      'Complete RRM onboarding and connectivity testing in ACER ARIS UAT environment',
      'Validate counterparty LEI coverage — confirm no reportable entity lacks a valid LEI',
      'Implement pre-submission data-quality validation rules aligned with ACER ARIS schema',
    ],
    'Regulatory Affairs': [
      'Maintain RRM registration and manage annual ACER conformance reporting',
    ],
  },
  'obl-4': {
    'Energy Trading': [
      'Implement 5-year retention policy for all trade records and associated submission evidence',
    ],
    'Wholesale Market Operations': [
      'Archive submission receipts, correction logs, and exception reports in ACER-retrievable format',
      'Schedule periodic audit-readiness reviews to verify record completeness and accessibility',
    ],
    'Regulatory Affairs': [
      'Establish audit-ready recordkeeping process and define ACER inspection response procedure',
    ],
    'Sustainability': [
      'Document market transparency data contributions and confirm retention schedule compliance',
    ],
  },
};

const REQUIRED_EVIDENCE: Record<string, string> = {
  'obl-1': 'Contract type classification matrix; updated trade capture system configuration; scope sign-off by process owner',
  'obl-2': 'T+1 submission logs; 30-day parallel run report; pipeline monitoring evidence',
  'obl-3': 'RRM connectivity test results; LEI validation report; ACER ARIS UAT acceptance evidence; data-quality KPI report',
  'obl-4': 'Retention policy documentation; submission receipt archive; audit log export; inspection readiness checklist',
};

function deriveStatus(ticket: Ticket | undefined): string {
  if (!ticket) return 'Not started';
  switch (ticket.status) {
    case 'Notification Sent':
    case 'Unread':
      return 'Not started';
    case 'In Progress':
    case 'Downloaded':
    case 'Pending Evidence':
      return 'In progress';
    case 'Clarification Requested':
      return 'Pending clarification';
    case 'Ready for Audit':
    case 'Completed':
    case 'Reported':
      return 'Completed';
    case 'Escalated':
      return 'Escalated';
    default:
      return 'Not started';
  }
}

/** Wrap a cell value in double-quotes if it contains the delimiter, quotes, or newlines. */
function cell(value: string): string {
  const v = String(value ?? '');
  if (v.includes(';') || v.includes('"') || v.includes('\n') || v.includes('\r')) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

const HEADERS = [
  'Regulatory Change ID',
  'Regulatory Source',
  'Obligation',
  'Requirement',
  'Key Impact',
  'Impacted Business Unit',
  'Implementation Action',
  'Action Owner',
  'Due Date',
  'Required Evidence',
  'Status',
];

export function exportObligationMapping(
  change: RegulatoryChange,
  obligations: Obligation[],
  impacts: BusinessUnitImpact[],
  tickets: Ticket[],
) {
  const rows: string[][] = [HEADERS];

  for (const obl of obligations) {
    const oblActions = ACTIONS[obl.id] ?? {};
    const evidence = REQUIRED_EVIDENCE[obl.id] ?? '';

    for (const impact of impacts) {
      const buActions = oblActions[impact.businessUnit];
      if (!buActions?.length) continue;

      const ticket = tickets.find(
        (t) => t.regChangeId === change.id && t.businessUnit === impact.businessUnit,
      );

      for (const action of buActions) {
        rows.push([
          change.id,
          change.regulatorySource,
          obl.text,
          obl.requirement,
          impact.impactedProcess,
          impact.businessUnit,
          action,
          impact.owner,
          formatDate(impact.dueDate),
          evidence,
          deriveStatus(ticket),
        ]);
      }
    }
  }

  const csv = '﻿' + rows.map((r) => r.map(cell).join(';')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Obligation-Mapping_${change.id}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
