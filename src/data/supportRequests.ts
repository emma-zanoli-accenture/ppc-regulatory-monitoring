import type { SupportRequest } from '../types';

/** Clarification raised by Energy Trading against ticket `tkt-trading`.
 *  Originates from the BU advisory chatbot; awaiting Legal response (answered live). */
export const supportRequests: SupportRequest[] = [
  {
    id: 'sr-1',
    ticketId: 'tkt-trading',
    businessUnit: 'Energy Trading',
    question:
      'Do intragroup supply contracts between our trading desk and a wholly-owned ' +
      'subsidiary fall within the expanded REMIT II reportable scope, or are they exempt?',
    chatbotTranscript: [
      {
        id: 'msg-1',
        role: 'user',
        text: 'Are intragroup contracts in scope for the new REMIT II reporting?',
        timestamp: '2026-05-28T10:12:00',
      },
      {
        id: 'msg-2',
        role: 'ai',
        text:
          'REMIT II broadens reportable contract types. Intragroup transactions are not ' +
          'automatically exempt — scope depends on whether the contract relates to wholesale ' +
          'energy products delivered in the Union. This is a judgement call best confirmed by ' +
          'Legal/Compliance for your specific structure.',
        timestamp: '2026-05-28T10:12:08',
      },
      {
        id: 'msg-3',
        role: 'user',
        text: 'Thanks — I will raise this with Compliance to confirm for our subsidiary.',
        timestamp: '2026-05-28T10:13:20',
      },
    ],
    reportSection: 'Obligation 1 — Reportable contract scope',
    priority: 'High',
    status: 'Open',
    legalResponse: undefined,
    history: [
      {
        timestamp: '2026-05-28T10:15:00',
        actor: 'Nikos Papadopoulos (Energy Trading)',
        note: 'Support request raised from the advisory chatbot.',
      },
    ],
  },
];
