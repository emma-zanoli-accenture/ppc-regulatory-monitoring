import type { RegulatoryChange } from '../types';

/** Stable id for the one example change referenced across the demo. */
export const REMIT_II_ID = 'rc-remit2';

/** The single fully-detailed regulatory change the narrative centers on. */
export const remitII: RegulatoryChange = {
  id: REMIT_II_ID,
  title: 'REMIT II — Enhanced Wholesale Energy Market Transaction Reporting',
  regulatorySource: 'ACER / EU REMIT framework',
  regulatoryArea: 'Wholesale Energy Market Integrity & Transparency',
  publicationDate: '2026-03-12',
  effectiveDate: '2026-09-30',
  implementationDueDate: '2026-09-30',
  riskPriority: 'High',
  description:
    'Revised REMIT (Regulation on Wholesale Energy Market Integrity and Transparency) ' +
    'introduces enhanced transaction and order reporting obligations for wholesale energy ' +
    'market participants. It expands reportable contract types, tightens reporting timelines, ' +
    'raises data-quality and recordkeeping standards, and reinforces registration with ACER ' +
    'via Registered Reporting Mechanisms (RRMs). Non-compliance carries significant ' +
    'regulatory and reputational risk.',
  communicationStatus: 'Partially Sent',
  implementationStatus: 'In Progress',
  auditStatus: 'Not Ready',
};

/** Background rows (title + statuses only) so list/dashboard views aren't empty. */
export const backgroundChanges: RegulatoryChange[] = [
  {
    id: 'rc-demand-response',
    title: 'Network Code on Demand Response — Flexibility Participation Rules',
    regulatorySource: 'ENTSO-E / EU Network Codes',
    regulatoryArea: 'System Operation & Flexibility',
    publicationDate: '2026-02-04',
    effectiveDate: '2026-11-15',
    implementationDueDate: '2026-11-15',
    riskPriority: 'Medium',
    description:
      'New network code provisions governing demand-side response and flexibility ' +
      'participation in balancing and ancillary services markets.',
    communicationStatus: 'Draft',
    implementationStatus: 'Not Started',
    auditStatus: 'Not Ready',
    isBackground: true,
  },
  {
    id: 'rc-res-licensing',
    title: 'RES Licensing Simplification Framework',
    regulatorySource: 'RAE (Greek Regulatory Authority for Energy)',
    regulatoryArea: 'Renewables Licensing & Permitting',
    publicationDate: '2026-01-20',
    effectiveDate: '2026-07-01',
    implementationDueDate: '2026-07-01',
    riskPriority: 'Low',
    description:
      'Streamlined licensing pathway for renewable energy generation projects, ' +
      'reducing permitting stages and consolidating documentation requirements.',
    communicationStatus: 'Not Started',
    implementationStatus: 'Not Started',
    auditStatus: 'Not Ready',
    isBackground: true,
  },
  {
    id: 'rc-csrd-esg',
    title: 'CSRD ESG Disclosure Alignment — Sustainability Reporting Standards',
    regulatorySource: 'EU CSRD / ESRS',
    regulatoryArea: 'Sustainability & Non-Financial Disclosure',
    publicationDate: '2025-12-10',
    effectiveDate: '2026-12-31',
    implementationDueDate: '2026-12-31',
    riskPriority: 'Medium',
    description:
      'Alignment of corporate sustainability disclosures with the Corporate ' +
      'Sustainability Reporting Directive and European Sustainability Reporting Standards.',
    communicationStatus: 'Not Started',
    implementationStatus: 'Not Started',
    auditStatus: 'Not Ready',
    isBackground: true,
  },
];

/** All regulatory changes shown in catalogue/list/dashboard views. */
export const regulatoryChanges: RegulatoryChange[] = [remitII, ...backgroundChanges];
