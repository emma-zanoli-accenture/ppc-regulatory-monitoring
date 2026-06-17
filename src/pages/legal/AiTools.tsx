import { useEffect, useRef, useState } from 'react';
import { ArrowLeftRight, Globe, Languages, MessageSquare, Send, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  AIThinkingIndicator,
  Button,
  PageHeader,
  SectionCard,
  Select,
  Tag,
} from '../../components';
import { delay } from '../../lib/delay';
import { cn } from '../../lib/cn';

type Tab = 'summarise' | 'translate' | 'qa' | 'compare' | 'jurisdiction';
type Phase = 'idle' | 'thinking' | 'ready';
type Direction = 'en-el' | 'el-en';
type CmpType = 'new' | 'modified' | 'eliminated';
interface QaMsg { id: number; q: string; a: string }
interface CmpItem { type: CmpType; topic: string; detail: string }
type JxType = 'unique_a' | 'unique_b' | 'stricter_a' | 'stricter_b' | 'divergent' | 'aligned';
interface JxItem { type: JxType; area: string; jurisdA: string; jurisdB: string }
interface Jurisdiction { id: string; label: string; regulator: string; flag: string }

/* ------------------------------------------------------------------ data -- */

const DOCS = [
  { id: 'remit-full',        name: 'REMIT II — Full Regulation Text (ACER).pdf' },
  { id: 'acer-guidance',     name: 'ACER Transaction Reporting Guidance v2.pdf' },
  { id: 'impact-assessment', name: 'Internal Impact Assessment.docx' },
  { id: 'rrm-checklist',     name: 'RRM Onboarding Checklist.pdf' },
];

const DOC_EXCERPTS: Record<string, string> = {
  'remit-full': `Article 9 — Reporting obligation\n\nMarket participants shall report to the Agency, or through a Registered Reporting Mechanism, details of wholesale energy market transactions, including orders to trade, concluded in wholesale energy markets. Reports shall be submitted no later than the working day following the conclusion of the transaction (T+1). Lifecycle events — including modifications and cancellations — shall be reported without undue delay.\n\nMarket participants shall ensure that the data submitted is complete, accurate and submitted in a timely manner. Where errors or omissions are identified, corrected reports shall be submitted as soon as practicable.`,
  'acer-guidance': `1. Scope of reporting\n\nThis guidance applies to all market participants active in EU wholesale energy markets, including electricity and natural gas. Intragroup transactions between entities within the same corporate group are not exempt and must be reported unless a specific exemption has been granted by the relevant National Regulatory Authority.\n\n2. Reportable fields\n\nReports for standard supply contracts must include: contract type, trade ID, trading venue, execution timestamp, counterparty LEI, delivery point or hub, delivery period, price (EUR/MWh), volume (MWh), and currency. Missing or invalid LEIs will result in report rejection.`,
  'impact-assessment': `Executive Summary\n\nREMIT II introduces enhanced transaction reporting requirements effective 30 September 2026. This assessment identifies five impacted Business Units and concludes that the primary operational impact falls on Energy Trading and Wholesale Market Operations, which will require system reconfiguration to support automated T+1 reporting to ACER ARIS. Estimated implementation effort: 14 weeks.\n\nKey risks: High — failure to meet T+1 reporting deadline due to manual submission processes. Medium — incomplete LEI coverage for counterparties. Low — staff awareness gap.`,
  'rrm-checklist': `Phase 1 — Registration (by 30 June 2026)\n\n☐ Confirm RRM provider selection and execute service agreement.\n☐ Register as REMIT II market participant with ACER ARIS portal.\n☐ Obtain and validate Legal Entity Identifier (LEI) for all reporting entities.\n☐ Complete data mapping: internal trade fields → ACER schema fields.\n\nPhase 2 — Technical integration (by 31 July 2026)\n\n☐ Configure trade capture system to export REMIT II-compliant data feed.\n☐ Complete RRM connectivity testing in ACER ARIS UAT environment.\n☐ Validate all mandatory fields and test lifecycle event reporting.`,
};

const SUMMARIES: Record<string, string> = {
  'remit-full': `Key points:\n• Market participants must report all wholesale energy transactions to ACER by T+1 (next working day)\n• Scope includes standard contracts, orders to trade, and all lifecycle events (amendments, cancellations)\n• Intragroup transactions are not exempt — all must be reported unless a specific NRA exemption applies\n• Delegation to an RRM is permitted but does not relieve the market participant of legal responsibility\n• Persistent submission of incomplete or inaccurate data may result in administrative measures from ACER\n\nConclusion: REMIT II materially tightens reporting timeliness and scope versus REMIT I. PPC must ensure automated T+1 reporting is operational before 30 September 2026.`,
  'acer-guidance': `Key points:\n• Mandatory fields for standard contracts include: contract type, trade ID, counterparty LEI, delivery point, price (EUR/MWh) and volume\n• T+1 deadline: submissions must reach ACER ARIS by 23:59 on the next working day\n• Lifecycle events are due within two working days of the triggering event\n• Invalid or missing LEIs result in automatic report rejection by ARIS\n• A 30-day parallel run in the UAT environment is strongly recommended before go-live\n\nConclusion: Data quality — particularly LEI coverage — is the highest near-term operational risk. PPC should prioritise LEI enrichment and ARIS connectivity testing as immediate actions.`,
  'impact-assessment': `Key points:\n• Five Business Units impacted: Energy Trading, Wholesale Market Operations, Procurement, Regulatory Affairs, Sustainability\n• Highest burden on Energy Trading and Wholesale Market Operations — system reconfiguration required\n• Estimated implementation effort is 14 weeks, placing the critical path start at 30 June 2026\n• Three risk tiers identified: High (manual T+1 reporting), Medium (LEI data gaps), Low (staff awareness)\n• All five BUs require updated procedures and training by September 2026\n\nConclusion: Implementation is achievable within the deadline provided RRM configuration begins immediately. Delay beyond 30 June 2026 compresses the parallel run window and materially increases non-compliance risk.`,
  'rrm-checklist': `Key points:\n• Four sequential phases: Registration (June), Technical integration (July), Parallel run (Aug–Sep), Go-live (30 Sep 2026)\n• LEI validation and data field mapping must be complete before technical integration can begin\n• A 30-day parallel run against the live ACER ARIS environment is mandatory per ACER guidance\n• Evidence of the parallel run must be retained for a minimum of 5 years for audit purposes\n• Go-live sign-off is required from the Head of Wholesale Market Operations\n\nConclusion: The checklist is on the critical path. Phase 1 must complete by 30 June 2026 — any slip cascades directly into the parallel run window and risks the September go-live.`,
};

const TRANSLATIONS_EN_EL: Record<string, string> = {
  'remit-full': `Άρθρο 9 — Υποχρέωση υποβολής αναφορών\n\nΟι συμμετέχοντες στην αγορά υποβάλλουν στον Οργανισμό, ή μέσω Εγγεγραμμένου Μηχανισμού Υποβολής Αναφορών, λεπτομέρειες σχετικά με τις συναλλαγές στις αγορές χονδρικής ενέργειας, συμπεριλαμβανομένων εντολών διαπραγμάτευσης. Οι αναφορές υποβάλλονται το αργότερο την εργάσιμη ημέρα που ακολουθεί τη σύναψη της συναλλαγής (Τ+1). Γεγονότα κύκλου ζωής — συμπεριλαμβανομένων τροποποιήσεων και ακυρώσεων — αναφέρονται χωρίς αδικαιολόγητη καθυστέρηση.\n\nΟι συμμετέχοντες στην αγορά διασφαλίζουν ότι τα υποβληθέντα δεδομένα είναι πλήρη, ακριβή και υποβάλλονται εγκαίρως. Όταν εντοπίζονται σφάλματα ή παραλείψεις, διορθωτικές αναφορές υποβάλλονται το συντομότερο δυνατό.`,
  'acer-guidance': `1. Πεδίο εφαρμογής της υποβολής αναφορών\n\nΗ παρούσα καθοδήγηση εφαρμόζεται σε όλους τους συμμετέχοντες στην αγορά που δραστηριοποιούνται στις αγορές χονδρικής ενέργειας της ΕΕ. Οι ενδοομιλικές συναλλαγές μεταξύ οντοτήτων εντός του ίδιου ομίλου δεν εξαιρούνται και πρέπει να αναφέρονται εκτός εάν χορηγηθεί ειδική εξαίρεση.\n\n2. Υποχρεωτικά πεδία\n\nΟι αναφορές για τυποποιημένες συμβάσεις πρέπει να περιλαμβάνουν: τύπο σύμβασης, αναγνωριστικό συναλλαγής, τόπο διαπραγμάτευσης, χρονοσφραγίδα εκτέλεσης, LEI αντισυμβαλλομένου, σημείο παράδοσης, τιμή (EUR/MWh), όγκο (MWh) και νόμισμα. Μη έγκυρα LEI οδηγούν σε αυτόματη απόρριψη.`,
  'impact-assessment': `Εκτελεστική Σύνοψη\n\nΤο REMIT II εισάγει ενισχυμένες απαιτήσεις υποβολής αναφορών που τίθενται σε ισχύ στις 30 Σεπτεμβρίου 2026. Η παρούσα αξιολόγηση εντοπίζει πέντε επηρεαζόμενες Επιχειρηματικές Μονάδες. Η κύρια επιχειρησιακή επίπτωση αφορά την Ενεργειακή Διαπραγμάτευση και τις Λειτουργίες Χονδρικής Αγοράς, οι οποίες απαιτούν αναδιαμόρφωση συστημάτων. Εκτιμώμενη προσπάθεια υλοποίησης: 14 εβδομάδες.\n\nΚύριοι κίνδυνοι: Υψηλός — αδυναμία τήρησης της προθεσμίας Τ+1. Μέτριος — ελλιπής κάλυψη LEI. Χαμηλός — έλλειψη ευαισθητοποίησης προσωπικού.`,
  'rrm-checklist': `Φάση 1 — Εγγραφή (έως 30 Ιουνίου 2026)\n\n☐ Επιβεβαίωση επιλογής παρόχου ΕΜΥ και σύναψη συμφωνίας υπηρεσιών.\n☐ Εγγραφή στην πύλη ARIS του ACER ως συμμετέχων REMIT II.\n☐ Απόκτηση και επικύρωση LEI για όλες τις υπόχρεες οντότητες.\n☐ Χαρτογράφηση δεδομένων: εσωτερικά πεδία συναλλαγών → σχήμα ACER.\n\nΦάση 2 — Τεχνική ενσωμάτωση (έως 31 Ιουλίου 2026)\n\n☐ Διαμόρφωση συστήματος καταγραφής για εξαγωγή δεδομένων συμμόρφωσης REMIT II.\n☐ Δοκιμές συνδεσιμότητας ΕΜΥ στο περιβάλλον UAT του ARIS.\n☐ Επικύρωση υποχρεωτικών πεδίων και δοκιμή αναφοράς γεγονότων κύκλου ζωής.`,
};

const EL_SOURCE = `Άρθρο 3 — Πεδίο εφαρμογής (ΡΑΕ, Κατευθυντήριες Οδηγίες REMIT II, Μάρτιος 2026)\n\nΗ υποχρέωση υποβολής αναφορών βάσει του REMIT II εφαρμόζεται σε κάθε συμμετέχοντα στην αγορά που συνάπτει συναλλαγές χονδρικής ενέργειας στην Ελλάδα ή που επηρεάζει τις ελληνικές αγορές ηλεκτρικής ενέργειας και φυσικού αερίου. Η ΡΑΕ ενεργεί ως αρμόδια εθνική ρυθμιστική αρχή και συνεργάζεται με τον ACER για την επιτήρηση της αγοράς. Παραβάσεις δύνανται να επισύρουν διοικητικές κυρώσεις, δημόσια αποκάλυψη και, σε σοβαρές περιπτώσεις, προσωρινή αναστολή πρόσβασης στην αγορά.`;

const EL_TRANSLATION = `Article 3 — Scope of application (RAE, REMIT II Guidance Notes, March 2026)\n\nThe reporting obligation under REMIT II applies to any market participant that concludes wholesale energy transactions in Greece or that affects the Greek electricity and natural gas markets. RAE acts as the competent National Regulatory Authority and cooperates with ACER for market surveillance. Infringements may result in administrative penalties, public disclosure, and — in serious cases — temporary suspension of market access.`;

const QA_QUESTIONS = [
  'Which BUs carry the highest compliance risk?',
  'What is the penalty regime under REMIT II?',
  'What evidence is needed for audit readiness?',
  'What if we miss the 30 September deadline?',
];

const QA_ANSWERS: Record<string, string> = {
  'Which BUs carry the highest compliance risk?': `Based on the obligation mapping, Energy Trading and Wholesale Market Operations carry the highest exposure. Both have direct T+1 reporting obligations and require system-level changes to their trade capture infrastructure. Energy Trading is the counterparty of record for most wholesale transactions and is directly liable for report accuracy. Wholesale Market Operations manages RRM connectivity and must ensure the ARIS submission pipeline is operational before go-live.\n\nProcurement and Regulatory Affairs have secondary obligations — contract lifecycle management and oversight respectively. Sustainability's exposure is limited to ESG disclosure alignment and carries the lowest residual risk.`,
  'What is the penalty regime under REMIT II?': `Under REMIT II, ACER may refer enforcement cases to National Regulatory Authorities. In Greece, the Regulatory Authority for Energy (RAE) is the competent authority.\n\nSanctions can include: administrative fines scaled to the severity and duration of the infringement, public disclosure on ACER's enforcement register, and — in the most serious cases — temporary suspension of market access. Persistent submission of incomplete or inaccurate data is treated as a separate and ongoing infringement, distinct from a single missed deadline.\n\nPPC should request a formal opinion from RAE on the applicable fine schedule before the implementation deadline and document that request as a risk-mitigation measure.`,
  'What evidence is needed for audit readiness?': `For full audit readiness under REMIT II, PPC should retain the following:\n\n• RRM connectivity test logs and UAT acceptance reports from the ACER ARIS environment\n• Parallel run reports demonstrating 30 days of accepted live submissions\n• Transaction reconciliation logs confirming T+1 compliance for all reportable contracts\n• Staff training completion records for all personnel involved in the reporting process\n• Signed-off internal impact assessment and process owner sign-off documentation\n• Evidence of LEI validation for all counterparties\n\nAll records must be retained for a minimum of 5 years in accordance with REMIT II Article 16.`,
  'What if we miss the 30 September deadline?': `Missing the go-live date on 30 September 2026 would immediately expose PPC to regulatory risk. ACER monitors submission gaps in real time via the ARIS portal — any absence of T+1 reports from that date will be flagged automatically and escalated to RAE.\n\nRAE would typically issue a formal notice requiring PPC to provide a credible remediation plan before imposing sanctions. However, PPC cannot rely on that grace period as a strategy.\n\nThe recommended course of action if a delay becomes likely: notify RAE proactively before the deadline, providing the reason and a revised go-live date. Early disclosure is treated more favourably in enforcement proceedings. Legal/Compliance should brief the Board before any such notification is made.`,
};

/* -------------------------------------------------- comparison data -- */

const COMPARISON_ITEMS: CmpItem[] = [
  // New obligations
  {
    type: 'new',
    topic: 'Hard T+1 reporting deadline',
    detail: 'REMIT II introduces a mandatory next-working-day (T+1) deadline for all standard contracts and orders. REMIT I required "timely" reporting without a specific cut-off, allowing batch submissions over several days in practice.',
  },
  {
    type: 'new',
    topic: 'Intragroup transactions explicitly in scope',
    detail: 'Intragroup wholesale energy trades are now unambiguously reportable. REMIT I was silent on intragroup transactions, leading to inconsistent NRA interpretations. REMIT II removes all implied exemptions unless specifically granted by the relevant NRA.',
  },
  {
    type: 'new',
    topic: 'Data quality and self-correction obligation',
    detail: 'Market participants must proactively monitor submission quality and file corrected reports without undue delay upon discovering errors or omissions. No equivalent positive obligation existed under REMIT I.',
  },
  {
    type: 'new',
    topic: 'Lifecycle event reporting',
    detail: 'Amendments, cancellations, and early terminations must be reported within two working days of the triggering event. REMIT I did not explicitly mandate lifecycle reporting for all in-scope contract types.',
  },
  // Modified provisions
  {
    type: 'modified',
    topic: 'Counterparty identification — LEI mandatory',
    detail: 'REMIT I permitted national identifiers (EIC, BIC) as alternatives to LEI. REMIT II mandates LEI exclusively for all counterparties; reports with missing or invalid LEIs are automatically rejected by ACER ARIS.',
  },
  {
    type: 'modified',
    topic: 'ACER enforcement and investigative powers',
    detail: 'REMIT II materially expands ACER\'s powers: direct interim measures, data-sharing with financial regulators (ESMA, ECB), and coordinated cross-border investigations. Under REMIT I, enforcement was exclusively channelled through NRAs with limited ACER coordination.',
  },
  {
    type: 'modified',
    topic: 'Definition of "wholesale energy product"',
    detail: 'The scope definition is broadened to capture new financial instruments linked to energy delivery, capacity products, and balancing contracts. Several MiFID II dual-scope instruments are now explicitly brought within REMIT II reporting, reducing regulatory arbitrage.',
  },
  {
    type: 'modified',
    topic: 'RRM technical standards and obligations',
    detail: 'Registered Reporting Mechanisms face stricter requirements: mandatory UAT connectivity testing, ongoing data quality KPIs reported to ACER, and annual conformance reviews. REMIT I RRM requirements were lighter-touch and largely self-certified at onboarding.',
  },
  // Eliminated provisions
  {
    type: 'eliminated',
    topic: 'Phased implementation timeline',
    detail: 'REMIT I was rolled out in phases between 2015 and 2016, with separate go-live dates for different contract categories. REMIT II sets a single unified implementation date — 30 September 2026 — for all in-scope contracts simultaneously.',
  },
  {
    type: 'eliminated',
    topic: 'Volume-based reporting thresholds',
    detail: 'REMIT I permitted certain low-volume or standardised contracts to be excluded from individual reporting or submitted in aggregate. REMIT II removes all volume thresholds: every in-scope transaction must be individually reported regardless of size.',
  },
  {
    type: 'eliminated',
    topic: 'National reporting schemes as interim alternative',
    detail: 'Several jurisdictions operated national reporting hubs as a transitional alternative to direct ACER submission under REMIT I. REMIT II mandates all reporting go directly to ACER ARIS or through an ACER-registered RRM — no national routing remains permitted.',
  },
];

const CMP_SECTIONS: { type: CmpType; label: string; tone: 'success' | 'warning' | 'danger' }[] = [
  { type: 'new',        label: 'New obligations',        tone: 'success' },
  { type: 'modified',   label: 'Modified provisions',    tone: 'warning' },
  { type: 'eliminated', label: 'Eliminated provisions',  tone: 'danger'  },
];

/* ----------------------------------------------- jurisdiction data -- */

const JURISDICTIONS: Jurisdiction[] = [
  { id: 'greece',  label: 'Greece',          regulator: 'RAE (ΡΑΑΕΥ)', flag: '🇬🇷' },
  { id: 'eu',      label: 'European Union',  regulator: 'ACER',        flag: '🇪🇺' },
  { id: 'germany', label: 'Germany',         regulator: 'BNetzA',      flag: '🇩🇪' },
  { id: 'italy',   label: 'Italy',           regulator: 'ARERA',       flag: '🇮🇹' },
  { id: 'france',  label: 'France',          regulator: 'CRE',         flag: '🇫🇷' },
];

/** Keyed by alphabetically sorted jurisdiction IDs joined with "|". */
const JX_COMPARISONS: Record<string, JxItem[]> = {
  /* ── EU  ↔  Greece ──────────────────────────────────────────────────── */
  'eu|greece': [
    {
      type: 'aligned',
      area: 'T+1 reporting deadline',
      jurisdA: 'Reports must reach ACER ARIS by 23:59 on the next working day. No transitional exception to the deadline is available at EU level.',
      jurisdB: 'RAE (ΡΑΑΕΥ) enforces the same T+1 cutoff. No extension has been granted beyond the EU baseline.',
    },
    {
      type: 'unique_b',
      area: 'Supervisory tolerance at go-live',
      jurisdA: 'ACER has not announced any transitional tolerance period. Monitoring begins from the first day submissions are due.',
      jurisdB: 'RAE announced a 60-day supervisory observation window from 30 September 2026 for minor technical and connectivity failures. First-time infractions are handled informally before formal enforcement commences.',
    },
    {
      type: 'unique_b',
      area: 'Language of formal submissions',
      jurisdA: 'ACER accepts all formal regulatory communications and exemption requests in English.',
      jurisdB: 'RAE requires all formal notifications, exemption applications, and infringement responses to be submitted in Greek. English translations may be requested on a case-by-case basis.',
    },
    {
      type: 'divergent',
      area: 'Intragroup exemption pathway',
      jurisdA: 'ACER confirms intragroup transactions are reportable with no blanket exemption. Any NRA exemption requires formal justification and ACER notification within 30 days.',
      jurisdB: 'RAE has signalled openness to granting limited intragroup exemptions for purely domestic Greek market trades between entities within the same regulated group, subject to formal application review by Q3 2026.',
    },
    {
      type: 'unique_b',
      area: 'Penalty schedule transparency',
      jurisdA: 'ACER does not publish a standardised fine schedule; penalty quantum is delegated entirely to the relevant NRA.',
      jurisdB: 'RAE published a graduated administrative fine schedule: €5,000 (first minor infringement) to €500,000 (repeated or severe violations), giving market participants advance certainty on potential liability.',
    },
    {
      type: 'unique_b',
      area: 'Dedicated national market surveillance unit',
      jurisdA: 'ACER monitors all EU submissions centrally via ARIS.',
      jurisdB: 'RAE established a dedicated REMIT II Market Integrity Reporting Office (MIRO) that cross-references daily submission data with HEnEx (Greek Energy Exchange) feeds to detect local manipulation patterns not visible at supranational level.',
    },
    {
      type: 'aligned',
      area: 'Record retention period',
      jurisdA: 'REMIT II Article 16 mandates a minimum 5-year retention period for all reportable transaction records and associated evidence.',
      jurisdB: 'RAE mirrors the EU 5-year requirement with no national extension.',
    },
  ],

  /* ── EU  ↔  Germany ─────────────────────────────────────────────────── */
  'eu|germany': [
    {
      type: 'unique_b',
      area: 'Dual national reporting obligation',
      jurisdA: 'ACER ARIS is the sole mandatory destination for REMIT II reports. National routing has been explicitly eliminated under REMIT II.',
      jurisdB: 'BNetzA requires market participants active on German organised market venues to file a parallel notification via the national BNetzA regulatory portal — a dual submission requirement that goes beyond the EU baseline.',
    },
    {
      type: 'stricter_b',
      area: 'Financial penalty ceiling',
      jurisdA: 'REMIT II sets the enforcement framework but delegates penalty quantum entirely to NRAs with no EU-level cap defined.',
      jurisdB: 'BNetzA can impose fines of up to €5 million per infringement, plus daily incremental penalties for ongoing violations — one of the highest penalty ceilings in the EU under REMIT II.',
    },
    {
      type: 'stricter_b',
      area: 'LEI pre-validation deadline',
      jurisdA: 'LEI validation is required before the first submission; the regulation sets no specific advance deadline for LEI readiness.',
      jurisdB: 'BNetzA imposes a mandatory 6-week pre-go-live LEI pre-validation requirement, creating a formal regulatory milestone with its own compliance date independent of the September go-live.',
    },
    {
      type: 'divergent',
      area: 'Enforcement approach at go-live',
      jurisdA: 'ACER monitors submissions and refers persistent non-compliance to NRAs; no uniform timeline for first enforcement action is specified at EU level.',
      jurisdB: 'BNetzA applies zero tolerance from day one. A formal enforcement procedure is opened automatically after the first missed submission — significantly stricter than the majority of EU member states.',
    },
    {
      type: 'aligned',
      area: 'RRM registration framework',
      jurisdA: 'Only ACER-registered RRMs may be used for delegated reporting. No national RRM registration is permitted.',
      jurisdB: 'BNetzA accepts ACER-registered RRMs without imposing additional national registration. Full alignment with the EU baseline.',
    },
  ],

  /* ── EU  ↔  France ──────────────────────────────────────────────────── */
  'eu|france': [
    {
      type: 'aligned',
      area: 'T+1 deadline and record retention',
      jurisdA: 'EU baseline: T+1 submission by 23:59 next working day; 5-year record retention.',
      jurisdB: 'CRE applies identical requirements with no national deviation.',
    },
    {
      type: 'unique_b',
      area: 'Named reporting officer registration',
      jurisdA: 'No requirement to designate a named reporting officer at EU level.',
      jurisdB: 'CRE requires each market participant to register a named REMIT II Reporting Officer via the CRE portal by 30 September 2026. The officer is the point of contact for all NRA-level communications.',
    },
    {
      type: 'unique_b',
      area: 'Language of formal submissions',
      jurisdA: 'ACER accepts English for all formal regulatory communications.',
      jurisdB: 'CRE requires formal notifications, exemption requests, and infringement responses to be submitted in French.',
    },
    {
      type: 'divergent',
      area: 'Penalty publication process',
      jurisdA: 'Penalty decisions are referred to NRAs; no EU-level publication standard exists.',
      jurisdB: 'CRE publishes all REMIT II sanction decisions on its public website with a 30-day public comment period before the sanction becomes final — providing a transparency layer not required by EU regulation.',
    },
  ],

  /* ── EU  ↔  Italy ───────────────────────────────────────────────────── */
  'eu|italy': [
    {
      type: 'unique_b',
      area: '90-day transitional tolerance period',
      jurisdA: 'No transitional tolerance at EU level; ACER monitoring begins from go-live.',
      jurisdB: 'ARERA introduced a 90-day transitional period covering all infringement categories — including data quality and field completeness — before moving to formal enforcement. This is broader in scope than any other member state.',
    },
    {
      type: 'unique_b',
      area: 'Mandatory backup RRM designation',
      jurisdA: 'No requirement for a secondary RRM under EU rules.',
      jurisdB: 'ARERA mandates that market participants relying on an external RRM must designate and successfully test a backup RRM within 90 days of go-live, ensuring submission continuity if the primary RRM fails.',
    },
    {
      type: 'unique_b',
      area: 'Certified REMIT II reporting officer',
      jurisdA: 'No staff certification requirement in EU regulation.',
      jurisdB: 'ARERA requires at least one ARERA-certified REMIT II Reporting Officer per market participant. Certification must be obtained via an accredited training provider by 30 June 2026.',
    },
    {
      type: 'stricter_b',
      area: 'Penalty structure',
      jurisdA: 'Penalty quantum delegated to NRAs; no EU cap defined.',
      jurisdB: 'ARERA imposes revenue-based penalties: up to 10% of the market participant\'s annual turnover in regulated energy activities — making sanctions significantly larger for major market participants than fixed-ceiling regimes.',
    },
    {
      type: 'aligned',
      area: 'T+1 deadline and record retention',
      jurisdA: 'EU baseline: T+1 by 23:59 next working day; 5-year record retention.',
      jurisdB: 'ARERA applies identical requirements; no deviation on timeline or retention period.',
    },
  ],

  /* ── France  ↔  Germany ─────────────────────────────────────────────── */
  'france|germany': [
    {
      type: 'unique_b',
      area: 'Dual national reporting obligation',
      jurisdA: 'CRE requires only ACER ARIS submission; no parallel national platform required.',
      jurisdB: 'BNetzA requires parallel notification via its national regulatory portal for transactions on German organised venues — beyond the EU baseline and not mirrored in France.',
    },
    {
      type: 'stricter_b',
      area: 'Financial penalty ceiling',
      jurisdA: 'CRE administrative fines are capped at approximately €750,000 per infringement.',
      jurisdB: 'BNetzA fines can reach €5 million per infringement with daily incremental penalties for ongoing violations — more than six times the French ceiling.',
    },
    {
      type: 'divergent',
      area: 'Enforcement approach at go-live',
      jurisdA: 'CRE applies a 45-day observation window for technical connectivity issues before commencing formal enforcement.',
      jurisdB: 'BNetzA applies zero tolerance from day one; a formal procedure opens after the first missed submission.',
    },
    {
      type: 'aligned',
      area: 'T+1 deadline and retention',
      jurisdA: 'France: T+1 and 5-year retention as per EU baseline.',
      jurisdB: 'Germany: same EU baseline; no deviation.',
    },
  ],

  /* ── France  ↔  Greece ──────────────────────────────────────────────── */
  'france|greece': [
    {
      type: 'divergent',
      area: 'Grace period at go-live',
      jurisdA: 'CRE: 45-day observation window for technical connectivity failures only.',
      jurisdB: 'RAE: 60-day supervisory tolerance for technical and connectivity issues; slightly broader in duration.',
    },
    {
      type: 'unique_a',
      area: 'Named reporting officer registration',
      jurisdA: 'CRE requires a designated named Reporting Officer registered via the CRE portal by go-live.',
      jurisdB: 'RAE has issued guidance recommending a named contact but does not mandate formal registration.',
    },
    {
      type: 'divergent',
      area: 'Intragroup exemption policy',
      jurisdA: 'CRE follows ACER guidance strictly: intragroup transactions are reportable with no NRA exemption pathway.',
      jurisdB: 'RAE has signalled openness to granting limited intragroup exemptions for purely domestic Greek market trades, pending formal application.',
    },
    {
      type: 'aligned',
      area: 'T+1 deadline and retention',
      jurisdA: 'France: EU baseline — T+1 by 23:59 next working day; 5-year retention.',
      jurisdB: 'Greece: same; no deviation from EU baseline.',
    },
  ],

  /* ── France  ↔  Italy ───────────────────────────────────────────────── */
  'france|italy': [
    {
      type: 'divergent',
      area: 'Transitional tolerance period',
      jurisdA: 'CRE: 45-day period covering technical and connectivity failures only.',
      jurisdB: 'ARERA: 90-day period covering all infringement categories including data quality and field completeness — broader in scope and duration.',
    },
    {
      type: 'unique_b',
      area: 'Mandatory backup RRM',
      jurisdA: 'CRE imposes no backup RRM requirement.',
      jurisdB: 'ARERA mandates a designated and tested backup RRM within 90 days of go-live.',
    },
    {
      type: 'unique_b',
      area: 'Certified reporting officer requirement',
      jurisdA: 'CRE requires a named Reporting Officer registration but not formal certification via accredited training.',
      jurisdB: 'ARERA mandates a certified REMIT II Reporting Officer (accredited training, deadline 30 June 2026).',
    },
    {
      type: 'stricter_b',
      area: 'Penalty ceiling',
      jurisdA: 'CRE: fixed administrative fines up to approximately €750,000 per infringement.',
      jurisdB: 'ARERA: revenue-based fines up to 10% of annual regulated energy turnover — substantially higher for major utilities.',
    },
  ],

  /* ── Germany  ↔  Greece ─────────────────────────────────────────────── */
  'germany|greece': [
    {
      type: 'divergent',
      area: 'Enforcement approach at go-live',
      jurisdA: 'BNetzA: zero tolerance from 30 September 2026 — formal enforcement procedure opens after the first missed submission.',
      jurisdB: 'RAE: 60-day supervisory tolerance window for technical and connectivity issues; infringements are handled informally before formal sanctions are applied.',
    },
    {
      type: 'unique_a',
      area: 'Dual national reporting obligation',
      jurisdA: 'BNetzA requires parallel notification to its national portal for transactions on German organised venues, in addition to ACER ARIS submission.',
      jurisdB: 'RAE imposes no dual reporting obligation; ACER ARIS is the sole mandatory destination.',
    },
    {
      type: 'stricter_a',
      area: 'Financial penalty ceiling',
      jurisdA: 'BNetzA fines up to €5 million per infringement, plus daily increments for ongoing violations.',
      jurisdB: 'RAE graduated schedule: €5,000 (first minor infringement) to €500,000 (repeated/severe). Significantly lower ceiling than Germany.',
    },
    {
      type: 'divergent',
      area: 'LEI pre-validation requirement',
      jurisdA: 'BNetzA requires LEI validation to be completed and confirmed at least 6 weeks before go-live — a formal regulatory milestone with its own compliance date.',
      jurisdB: 'RAE sets no advance deadline for LEI validation; readiness is required by the first submission date only.',
    },
    {
      type: 'aligned',
      area: 'RRM and ACER connectivity',
      jurisdA: 'BNetzA accepts ACER-registered RRMs; no additional national RRM registration required.',
      jurisdB: 'RAE applies the same ACER registration requirement with no national addition.',
    },
    {
      type: 'divergent',
      area: 'Intragroup exemption policy',
      jurisdA: 'BNetzA strictly follows ACER guidance: no intragroup exemptions permitted under German jurisdiction.',
      jurisdB: 'RAE has signalled openness to intragroup exemptions for purely domestic trades within the same regulated group, pending formal application.',
    },
  ],

  /* ── Germany  ↔  Italy ──────────────────────────────────────────────── */
  'germany|italy': [
    {
      type: 'unique_a',
      area: 'Dual national reporting obligation',
      jurisdA: 'BNetzA requires a parallel submission to its national portal for German venue transactions.',
      jurisdB: 'ARERA imposes no dual reporting requirement; ACER ARIS is the only mandatory destination.',
    },
    {
      type: 'divergent',
      area: 'Enforcement approach at go-live',
      jurisdA: 'BNetzA: zero tolerance from day one; formal procedure after first missed submission.',
      jurisdB: 'ARERA: 90-day transitional tolerance covering all infringement categories before formal enforcement.',
    },
    {
      type: 'divergent',
      area: 'Penalty structure',
      jurisdA: 'BNetzA: fixed ceiling up to €5 million per infringement — predictable but high.',
      jurisdB: 'ARERA: revenue-based up to 10% of annual regulated energy turnover — variable but can significantly exceed €5 million for large utilities.',
    },
    {
      type: 'unique_b',
      area: 'Mandatory backup RRM and staff certification',
      jurisdA: 'BNetzA imposes neither a backup RRM requirement nor formal staff certification.',
      jurisdB: 'ARERA mandates both: a tested backup RRM within 90 days of go-live and an ARERA-certified Reporting Officer by 30 June 2026.',
    },
    {
      type: 'aligned',
      area: 'T+1 deadline and retention',
      jurisdA: 'Germany: EU baseline — T+1 by 23:59; 5-year retention.',
      jurisdB: 'Italy: same EU baseline; no deviation.',
    },
  ],

  /* ── Greece  ↔  Italy ───────────────────────────────────────────────── */
  'greece|italy': [
    {
      type: 'divergent',
      area: 'Transitional tolerance period',
      jurisdA: 'RAE: 60-day supervisory tolerance for technical and connectivity failures only.',
      jurisdB: 'ARERA: 90-day transitional period covering all infringement categories — broader in scope and 30 days longer.',
    },
    {
      type: 'unique_b',
      area: 'Mandatory backup RRM',
      jurisdA: 'RAE imposes no backup RRM obligation; market participants may rely on a single ACER-registered RRM.',
      jurisdB: 'ARERA mandates designation and successful testing of a backup RRM within 90 days of go-live.',
    },
    {
      type: 'divergent',
      area: 'Intragroup exemption policy',
      jurisdA: 'RAE is open to granting limited intragroup exemptions for purely domestic Greek market trades within the same regulated group.',
      jurisdB: 'ARERA has explicitly ruled out all intragroup exemptions under Italian jurisdiction; all trades must be reported without exception.',
    },
    {
      type: 'unique_b',
      area: 'Certified REMIT II reporting officer',
      jurisdA: 'RAE issues guidance on training best practices but does not mandate formal certification.',
      jurisdB: 'ARERA requires at least one ARERA-certified Reporting Officer per market participant (deadline 30 June 2026, accredited training providers).',
    },
    {
      type: 'stricter_b',
      area: 'Penalty ceiling',
      jurisdA: 'RAE graduated schedule: €5,000 to €500,000. Transparent and proportionate for smaller violations.',
      jurisdB: 'ARERA: up to 10% of annual regulated energy turnover. For a large utility, potential exposure is orders of magnitude higher than the Greek ceiling.',
    },
    {
      type: 'aligned',
      area: 'T+1 deadline and record retention',
      jurisdA: 'Greece: EU baseline — T+1 by 23:59; 5-year retention.',
      jurisdB: 'Italy: same; no deviation from EU baseline on timeline or retention.',
    },
  ],
};

const JX_TYPE_CONFIG: Record<
  JxType,
  { label: string; tone: 'success' | 'warning' | 'danger' | 'info' | 'brand' | 'accent' | 'neutral'; cardClass: string }
> = {
  unique_a:   { label: 'Only in A',    tone: 'brand',   cardClass: 'border-brand-100 bg-brand-50/40'    },
  unique_b:   { label: 'Only in B',    tone: 'accent',  cardClass: 'border-accent-200 bg-accent-50/40'  },
  stricter_a: { label: 'A stricter',   tone: 'brand',   cardClass: 'border-brand-100 bg-brand-50/40'    },
  stricter_b: { label: 'B stricter',   tone: 'accent',  cardClass: 'border-accent-200 bg-accent-50/40'  },
  divergent:  { label: 'Divergent',    tone: 'warning', cardClass: 'border-amber-100 bg-amber-50/50'    },
  aligned:    { label: 'Aligned',      tone: 'success', cardClass: 'border-emerald-100 bg-emerald-50/50' },
};

function flipJxType(t: JxType): JxType {
  if (t === 'unique_a') return 'unique_b';
  if (t === 'unique_b') return 'unique_a';
  if (t === 'stricter_a') return 'stricter_b';
  if (t === 'stricter_b') return 'stricter_a';
  return t;
}

function getJxItems(a: string, b: string): JxItem[] {
  const sorted = [a, b].sort();
  const key = sorted.join('|');
  const items = JX_COMPARISONS[key];
  if (!items) return [];
  if (a === sorted[0]) return items;
  return items.map((item) => ({
    ...item,
    jurisdA: item.jurisdB,
    jurisdB: item.jurisdA,
    type: flipJxType(item.type),
  }));
}

/* --------------------------------------------------------------- layout -- */

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'summarise',    label: 'Summarise',        icon: Sparkles      },
  { id: 'translate',    label: 'Translate',        icon: Languages     },
  { id: 'qa',           label: 'Ask a Question',   icon: MessageSquare },
  { id: 'compare',      label: 'Compare Versions', icon: ArrowLeftRight },
  { id: 'jurisdiction', label: 'Jurisdiction',     icon: Globe         },
];

const DOC_OPTIONS = DOCS.map((d) => ({ label: d.name, value: d.id }));

/* ------------------------------------------------------------- component -- */

export default function AiTools() {
  const [tab, setTab] = useState<Tab>('summarise');

  // Summarise
  const [sumDoc,    setSumDoc]    = useState(DOCS[0].id);
  const [sumPhase,  setSumPhase]  = useState<Phase>('idle');
  const [sumOutput, setSumOutput] = useState('');

  // Translate
  const [transDoc,    setTransDoc]    = useState(DOCS[0].id);
  const [transDir,    setTransDir]    = useState<Direction>('en-el');
  const [transPhase,  setTransPhase]  = useState<Phase>('idle');
  const [transOutput, setTransOutput] = useState('');

  // Q&A
  const [qaMessages, setQaMessages] = useState<QaMsg[]>([]);
  const [qaThinking, setQaThinking] = useState(false);
  const [qaBusy,     setQaBusy]     = useState(false);
  const [qaDraft,    setQaDraft]    = useState('');
  const qaScrollRef = useRef<HTMLDivElement>(null);
  const qaIdRef     = useRef(0);

  // Compare (version)
  const [cmpPhase,    setCmpPhase]    = useState<Phase>('idle');
  const [cmpRevealed, setCmpRevealed] = useState(0);

  // Jurisdiction comparison
  const [jxA,       setJxA]       = useState('greece');
  const [jxB,       setJxB]       = useState('eu');
  const [jxPhase,   setJxPhase]   = useState<Phase>('idle');
  const [jxRevealed,setJxRevealed] = useState(0);
  const [jxItems,   setJxItems]   = useState<JxItem[]>([]);

  // Cancellation: incrementing this number aborts any in-flight typewriter.
  const runRef = useRef(0);

  useEffect(() => {
    qaScrollRef.current?.scrollTo({ top: qaScrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [qaMessages, qaThinking]);

  /* ---- summarise ---- */
  const handleSummarise = async () => {
    const rid = ++runRef.current;
    setSumPhase('thinking');
    setSumOutput('');
    await delay(1400);
    if (runRef.current !== rid) return;
    setSumPhase('ready');
    const text = SUMMARIES[sumDoc];
    for (let i = 8; i <= text.length; i += 8) {
      if (runRef.current !== rid) return;
      setSumOutput(text.slice(0, i));
      await delay(6);
    }
    if (runRef.current !== rid) return;
    setSumOutput(text);
  };

  /* ---- translate ---- */
  const handleTranslate = async () => {
    const rid = ++runRef.current;
    setTransPhase('thinking');
    setTransOutput('');
    await delay(1600);
    if (runRef.current !== rid) return;
    setTransPhase('ready');
    const text = transDir === 'en-el' ? TRANSLATIONS_EN_EL[transDoc] : EL_TRANSLATION;
    for (let i = 8; i <= text.length; i += 8) {
      if (runRef.current !== rid) return;
      setTransOutput(text.slice(0, i));
      await delay(6);
    }
    if (runRef.current !== rid) return;
    setTransOutput(text);
  };

  /* ---- Q&A ---- */
  const handleAsk = async (question: string) => {
    if (qaBusy || !question.trim()) return;
    setQaBusy(true);
    setQaDraft('');
    const rid = ++runRef.current;
    const msgId = ++qaIdRef.current;
    setQaMessages((m) => [...m, { id: msgId, q: question, a: '' }]);
    setQaThinking(true);
    await delay(1000);
    if (runRef.current !== rid) { setQaBusy(false); setQaThinking(false); return; }
    setQaThinking(false);
    const answer =
      QA_ANSWERS[question] ??
      'I don\'t have a scripted answer for that exact question. Please try one of the suggested questions above.';
    for (let i = 8; i <= answer.length; i += 8) {
      if (runRef.current !== rid) { setQaBusy(false); return; }
      setQaMessages((m) =>
        m.map((msg) => (msg.id === msgId ? { ...msg, a: answer.slice(0, i) } : msg)),
      );
      await delay(6);
    }
    if (runRef.current !== rid) { setQaBusy(false); return; }
    setQaMessages((m) => m.map((msg) => (msg.id === msgId ? { ...msg, a: answer } : msg)));
    setQaBusy(false);
  };

  /* ---- compare (version) ---- */
  const handleCompare = async () => {
    const rid = ++runRef.current;
    setCmpPhase('thinking');
    setCmpRevealed(0);
    await delay(2000);
    if (runRef.current !== rid) return;
    setCmpPhase('ready');
    for (let i = 1; i <= COMPARISON_ITEMS.length; i++) {
      if (runRef.current !== rid) return;
      setCmpRevealed(i);
      await delay(180);
    }
  };

  /* ---- jurisdiction comparison ---- */
  const handleJxCompare = async () => {
    const items = getJxItems(jxA, jxB);
    const rid = ++runRef.current;
    setJxPhase('thinking');
    setJxRevealed(0);
    setJxItems([]);
    await delay(2200);
    if (runRef.current !== rid) return;
    setJxPhase('ready');
    setJxItems(items);
    for (let i = 1; i <= items.length; i++) {
      if (runRef.current !== rid) return;
      setJxRevealed(i);
      await delay(200);
    }
  };

  /* ---------------------------------------------------------------- render -- */
  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[{ label: 'Legal / Compliance' }, { label: 'AI Tools' }]}
        title="AI Tools"
        description="AI-powered analysis tools for regulatory documents and compliance questions."
      />

      {/* Tab strip */}
      <div className="flex w-fit gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              tab === t.id
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700',
            )}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ---- Summarise ---- */}
      {tab === 'summarise' && (
        <SectionCard title="Summarise" icon={Sparkles}>
          <div className="space-y-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-64 flex-1">
                <Select
                  label="Select document"
                  value={sumDoc}
                  onChange={(v) => { setSumDoc(v); setSumPhase('idle'); setSumOutput(''); ++runRef.current; }}
                  options={DOC_OPTIONS}
                />
              </div>
              <Button
                icon={Sparkles}
                disabled={sumPhase === 'thinking'}
                loading={sumPhase === 'thinking'}
                onClick={handleSummarise}
              >
                Summarise
              </Button>
            </div>

            <div>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Document excerpt
              </p>
              <div className="max-h-40 overflow-y-auto scrollbar-slim rounded-lg border border-slate-100 bg-slate-50/60 px-3.5 py-3 text-sm leading-relaxed text-slate-500 whitespace-pre-line">
                {DOC_EXCERPTS[sumDoc]}
              </div>
            </div>

            {sumPhase === 'thinking' && (
              <AIThinkingIndicator
                variant="panel"
                label="Analysing document…"
                sublabel="Extracting key obligations and conclusions"
              />
            )}

            {sumPhase === 'ready' && (
              <div className="rounded-xl border border-accent-200 bg-accent-50/40 p-4">
                <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent-700">
                  <Sparkles size={12} /> Summary
                </p>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
                  {sumOutput}
                  {sumOutput.length < (SUMMARIES[sumDoc]?.length ?? 0) && (
                    <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-slate-400 align-middle" />
                  )}
                </p>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* ---- Translate ---- */}
      {tab === 'translate' && (
        <SectionCard title="Translate" icon={Languages}>
          <div className="space-y-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-64 flex-1">
                <Select
                  label="Select document"
                  value={transDoc}
                  onChange={(v) => { setTransDoc(v); setTransPhase('idle'); setTransOutput(''); ++runRef.current; }}
                  options={DOC_OPTIONS}
                />
              </div>
              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Direction
                </p>
                <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                  {(['en-el', 'el-en'] as Direction[]).map((dir) => (
                    <button
                      key={dir}
                      onClick={() => { setTransDir(dir); setTransPhase('idle'); setTransOutput(''); ++runRef.current; }}
                      className={cn(
                        'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
                        transDir === dir
                          ? 'bg-white text-brand-700 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700',
                      )}
                    >
                      {dir === 'en-el' ? 'EN → EL' : 'EL → EN'}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                icon={Languages}
                disabled={transPhase === 'thinking'}
                loading={transPhase === 'thinking'}
                onClick={handleTranslate}
              >
                Translate
              </Button>
            </div>

            <div>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Source —{' '}
                {transDir === 'en-el' ? 'English' : 'Greek (RAE Guidance Notes, March 2026)'}
              </p>
              <div className="max-h-40 overflow-y-auto scrollbar-slim rounded-lg border border-slate-100 bg-slate-50/60 px-3.5 py-3 text-sm leading-relaxed text-slate-500 whitespace-pre-line">
                {transDir === 'en-el' ? DOC_EXCERPTS[transDoc] : EL_SOURCE}
              </div>
            </div>

            {transPhase === 'thinking' && (
              <AIThinkingIndicator
                variant="panel"
                label="Translating…"
                sublabel={transDir === 'en-el' ? 'English → Greek' : 'Greek → English'}
              />
            )}

            {transPhase === 'ready' && (
              <div className="rounded-xl border border-accent-200 bg-accent-50/40 p-4">
                <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent-700">
                  <Languages size={12} />{' '}
                  Translation — {transDir === 'en-el' ? 'Greek' : 'English'}
                </p>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
                  {transOutput}
                  {transOutput.length <
                    ((transDir === 'en-el'
                      ? TRANSLATIONS_EN_EL[transDoc]
                      : EL_TRANSLATION
                    )?.length ?? 0) && (
                    <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-slate-400 align-middle" />
                  )}
                </p>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* ---- Q&A ---- */}
      {tab === 'qa' && (
        <SectionCard title="Ask a Question" icon={MessageSquare}>
          <div className="flex h-[500px] flex-col">
            {/* Messages */}
            <div
              ref={qaScrollRef}
              className="mb-4 flex-1 space-y-4 overflow-y-auto scrollbar-slim pr-1"
            >
              {qaMessages.length === 0 && !qaThinking && (
                <div className="rounded-2xl border border-accent-100 bg-accent-50/50 p-4">
                  <div className="flex items-center gap-2 text-accent-700">
                    <Sparkles size={16} />
                    <span className="text-sm font-semibold">Legal Advisory Assistant</span>
                  </div>
                  <p className="mt-1.5 text-sm text-slate-600">
                    Ask me anything about REMIT II, the obligation mapping, or compliance
                    strategy. I answer from the full regulatory analysis and obligation mapping.
                  </p>
                </div>
              )}

              {qaMessages.map((msg) => (
                <div key={msg.id} className="space-y-3">
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-brand-700 px-3.5 py-2.5 text-sm text-white">
                      {msg.q}
                    </div>
                  </div>
                  {(msg.a || (!qaThinking && msg.id === qaMessages[qaMessages.length - 1]?.id)) && (
                    <div className="flex justify-start">
                      <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-slate-100 px-3.5 py-2.5 text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                        {msg.a}
                        {qaBusy &&
                          msg.id === qaMessages[qaMessages.length - 1]?.id &&
                          msg.a.length > 0 && (
                            <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-slate-400 align-middle" />
                          )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {qaThinking && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-3.5 py-2.5">
                    <span className="inline-flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-thinking-bounce"
                          style={{ animationDelay: `${i * 0.16}s` }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested questions */}
            <div className="mb-3 flex flex-wrap gap-2">
              {QA_QUESTIONS.map((q) => (
                <button
                  key={q}
                  disabled={qaBusy}
                  onClick={() => handleAsk(q)}
                  className={cn(
                    'rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors',
                    'hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700',
                    qaBusy && 'cursor-not-allowed opacity-50',
                  )}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Composer */}
            <div className="flex gap-2">
              <input
                value={qaDraft}
                onChange={(e) => setQaDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAsk(qaDraft); }}
                placeholder="Ask a question about REMIT II or compliance strategy…"
                className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
              <Button
                icon={Send}
                disabled={qaBusy || !qaDraft.trim()}
                onClick={() => handleAsk(qaDraft)}
              >
                Send
              </Button>
            </div>
          </div>
        </SectionCard>
      )}

      {/* ---- Jurisdiction Comparison ---- */}
      {tab === 'jurisdiction' && (() => {
        const jxAMeta = JURISDICTIONS.find((j) => j.id === jxA)!;
        const jxBMeta = JURISDICTIONS.find((j) => j.id === jxB)!;
        const jxOptions = JURISDICTIONS.map((j) => ({ label: `${j.flag} ${j.label} (${j.regulator})`, value: j.id }));
        const visibleItems = jxItems.slice(0, jxRevealed);
        return (
          <SectionCard title="Jurisdiction Comparison" icon={Globe} description="REMIT II — implementation differences across regulatory jurisdictions">
            <div className="space-y-5">
              {/* Selector strip */}
              <div className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3">
                <div className="min-w-52 flex-1">
                  <Select
                    label="Jurisdiction A"
                    value={jxA}
                    onChange={(v) => { setJxA(v); setJxPhase('idle'); setJxRevealed(0); setJxItems([]); ++runRef.current; }}
                    options={jxOptions.filter((o) => o.value !== jxB)}
                  />
                </div>
                <ArrowLeftRight size={16} className="mb-2 shrink-0 text-slate-400" />
                <div className="min-w-52 flex-1">
                  <Select
                    label="Jurisdiction B"
                    value={jxB}
                    onChange={(v) => { setJxB(v); setJxPhase('idle'); setJxRevealed(0); setJxItems([]); ++runRef.current; }}
                    options={jxOptions.filter((o) => o.value !== jxA)}
                  />
                </div>
                <Button
                  icon={Globe}
                  disabled={jxPhase === 'thinking'}
                  loading={jxPhase === 'thinking'}
                  onClick={handleJxCompare}
                >
                  {jxPhase === 'idle' ? 'Compare' : 'Re-run'}
                </Button>
              </div>

              {jxPhase === 'thinking' && (
                <AIThinkingIndicator
                  variant="panel"
                  label="Analysing jurisdictional requirements…"
                  sublabel="Cross-referencing NRA publications, implementation guidelines and penalty frameworks"
                />
              )}

              {jxPhase === 'ready' && (
                <div className="space-y-3">
                  {/* Column headers */}
                  <div className="grid grid-cols-2 gap-3 px-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {jxAMeta.flag} {jxAMeta.label} — {jxAMeta.regulator}
                    </p>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {jxBMeta.flag} {jxBMeta.label} — {jxBMeta.regulator}
                    </p>
                  </div>

                  {/* Comparison cards */}
                  <ul className="space-y-2.5">
                    {visibleItems.map((item) => {
                      const cfg = JX_TYPE_CONFIG[item.type];
                      return (
                        <li key={item.area} className={cn('rounded-xl border px-4 py-3.5 animate-fade-in', cfg.cardClass)}>
                          <div className="mb-2.5 flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-slate-900">{item.area}</p>
                            <Tag tone={cfg.tone} size="sm" withDot>{cfg.label}</Tag>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-lg bg-white/70 px-3 py-2.5">
                              <p className="text-sm leading-relaxed text-slate-600">{item.jurisdA}</p>
                            </div>
                            <div className="rounded-lg bg-white/70 px-3 py-2.5">
                              <p className="text-sm leading-relaxed text-slate-600">{item.jurisdB}</p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {visibleItems.length < jxItems.length && (
                    <p className="text-center font-mono text-xs text-slate-400">
                      {visibleItems.length} / {jxItems.length} findings
                    </p>
                  )}
                </div>
              )}
            </div>
          </SectionCard>
        );
      })()}

      {/* ---- Compare ---- */}
      {tab === 'compare' && (
        <SectionCard
          title="Regulatory Comparison"
          icon={ArrowLeftRight}
          description="REMIT I  →  REMIT II"
        >
          <div className="space-y-5">
            {/* Context strip */}
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="rounded border border-slate-200 bg-white px-2.5 py-1 font-mono text-xs font-semibold text-slate-500">
                  REMIT I (2011)
                </span>
                <ArrowLeftRight size={14} className="text-slate-400" />
                <span className="rounded border border-brand-200 bg-brand-50 px-2.5 py-1 font-mono text-xs font-semibold text-brand-700">
                  REMIT II (2026)
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Wholesale energy market transaction reporting — EU regulation.
              </p>
              <div className="ml-auto">
                <Button
                  icon={ArrowLeftRight}
                  disabled={cmpPhase === 'thinking'}
                  loading={cmpPhase === 'thinking'}
                  onClick={handleCompare}
                >
                  {cmpPhase === 'idle' ? 'Run comparison' : 'Re-run'}
                </Button>
              </div>
            </div>

            {cmpPhase === 'thinking' && (
              <AIThinkingIndicator
                variant="panel"
                label="Comparing regulations…"
                sublabel="Identifying new obligations, modifications and eliminated provisions"
              />
            )}

            {cmpPhase === 'ready' && (
              <div className="space-y-6">
                {CMP_SECTIONS.map((section) => {
                  const items = COMPARISON_ITEMS.filter((x) => x.type === section.type);
                  const visibleItems = items.filter(
                    (item) =>
                      COMPARISON_ITEMS.indexOf(item) < cmpRevealed,
                  );
                  if (visibleItems.length === 0) return null;
                  return (
                    <div key={section.type}>
                      <div className="mb-3 flex items-center gap-2">
                        <Tag tone={section.tone} size="sm" withDot>
                          {section.label}
                        </Tag>
                        <span className="font-mono text-xs text-slate-400">
                          {visibleItems.length}/{items.length}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {visibleItems.map((item) => (
                          <li
                            key={item.topic}
                            className={cn(
                              'rounded-xl border px-4 py-3 animate-fade-in',
                              section.type === 'new'
                                ? 'border-emerald-100 bg-emerald-50/50'
                                : section.type === 'modified'
                                  ? 'border-amber-100 bg-amber-50/50'
                                  : 'border-red-100 bg-red-50/50',
                            )}
                          >
                            <p
                              className={cn(
                                'text-sm font-semibold',
                                section.type === 'new'
                                  ? 'text-emerald-800'
                                  : section.type === 'modified'
                                    ? 'text-amber-800'
                                    : 'text-red-800',
                              )}
                            >
                              {item.topic}
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-slate-600">
                              {item.detail}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
