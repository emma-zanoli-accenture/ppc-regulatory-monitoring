import type { Evidence } from '../types';

/** Evidence uploaded by Wholesale Market Operations against ticket `tkt-wmo`. */
export const evidence: Evidence[] = [
  {
    id: 'ev-1',
    ticketId: 'tkt-wmo',
    fileName: 'RRM_Connectivity_Test_Report.pdf',
    fileType: 'PDF',
    uploadedBy: 'Eleni Georgiou',
    uploadedOn: '2026-06-02',
    linkedObligationId: 'obl-3',
  },
  {
    id: 'ev-2',
    ticketId: 'tkt-wmo',
    fileName: 'T1_Reporting_Pipeline_Runbook.docx',
    fileType: 'DOCX',
    uploadedBy: 'Eleni Georgiou',
    uploadedOn: '2026-06-02',
    linkedObligationId: 'obl-2',
  },
];
