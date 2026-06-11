/**
 * SINGLE SOURCE OF TRUTH for workflow states.
 *
 * Every status shown anywhere in the app must come from this file:
 *  - `WorkflowState` is the union type used across the data model.
 *  - `WORKFLOW_STATE_CONFIG` holds the human label + Tailwind classes per state.
 *
 * The shared <StatusBadge> consumes WORKFLOW_STATE_CONFIG — components must NEVER
 * hardcode state colors. To restyle a state, edit it here once.
 */

export const WORKFLOW_STATES = [
  'Draft Communication',
  'Ready to Send',
  'Notification Sent',
  'Viewed',
  'Downloaded',
  'Clarification Requested',
  'In Progress',
  'Pending Evidence',
  'Completed',
  'Overdue',
  'Escalated',
  'Ready for Audit',
  'Reported',
] as const;

export type WorkflowState = (typeof WORKFLOW_STATES)[number];

/** Semantic color family — lets non-badge UI (charts, rows) reuse the same intent. */
export type WorkflowTone =
  | 'neutral'
  | 'info'
  | 'progress'
  | 'warning'
  | 'danger'
  | 'success';

export interface WorkflowStateStyle {
  /** Display label (kept identical to the union member for clarity). */
  label: WorkflowState;
  /** Semantic intent, reusable outside badges. */
  tone: WorkflowTone;
  /** Tailwind classes for the badge pill (bg + text + border). */
  badge: string;
  /** Tailwind text-color class for the status dot. */
  dot: string;
}

/**
 * Muted, semantic tone tokens — six intents, no rainbow. Every status badge
 * draws from these so the palette stays restrained and meaningful.
 */
const TONE: Record<string, { badge: string; dot: string }> = {
  neutral: { badge: 'bg-slate-100 text-slate-600 border-slate-300/70', dot: 'text-slate-400' },
  info: { badge: 'bg-brand-50 text-brand-700 border-brand-200', dot: 'text-brand-500' },
  active: { badge: 'bg-accent-50 text-accent-700 border-accent-200', dot: 'text-accent-600' },
  warn: { badge: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'text-amber-500' },
  danger: { badge: 'bg-red-50 text-red-700 border-red-200', dot: 'text-red-500' },
  success: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'text-emerald-600' },
};

export const WORKFLOW_STATE_CONFIG: Record<WorkflowState, WorkflowStateStyle> = {
  'Draft Communication': { label: 'Draft Communication', tone: 'neutral', ...TONE.neutral },
  'Ready to Send': { label: 'Ready to Send', tone: 'neutral', ...TONE.neutral },
  'Notification Sent': { label: 'Notification Sent', tone: 'info', ...TONE.info },
  Viewed: { label: 'Viewed', tone: 'info', ...TONE.active },
  Downloaded: { label: 'Downloaded', tone: 'info', ...TONE.active },
  'Clarification Requested': { label: 'Clarification Requested', tone: 'warning', ...TONE.warn },
  'In Progress': { label: 'In Progress', tone: 'progress', ...TONE.active },
  'Pending Evidence': { label: 'Pending Evidence', tone: 'warning', ...TONE.warn },
  Completed: { label: 'Completed', tone: 'success', ...TONE.success },
  Overdue: { label: 'Overdue', tone: 'danger', ...TONE.danger },
  Escalated: { label: 'Escalated', tone: 'danger', ...TONE.danger },
  'Ready for Audit': { label: 'Ready for Audit', tone: 'success', ...TONE.success },
  Reported: { label: 'Reported', tone: 'success', ...TONE.success },
};
