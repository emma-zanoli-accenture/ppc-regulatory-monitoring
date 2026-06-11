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

export const WORKFLOW_STATE_CONFIG: Record<WorkflowState, WorkflowStateStyle> = {
  'Draft Communication': {
    label: 'Draft Communication',
    tone: 'neutral',
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'text-slate-400',
  },
  'Ready to Send': {
    label: 'Ready to Send',
    tone: 'info',
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    dot: 'text-sky-500',
  },
  'Notification Sent': {
    label: 'Notification Sent',
    tone: 'info',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'text-blue-500',
  },
  Viewed: {
    label: 'Viewed',
    tone: 'info',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dot: 'text-indigo-500',
  },
  Downloaded: {
    label: 'Downloaded',
    tone: 'info',
    badge: 'bg-violet-50 text-violet-700 border-violet-200',
    dot: 'text-violet-500',
  },
  'Clarification Requested': {
    label: 'Clarification Requested',
    tone: 'warning',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'text-amber-500',
  },
  'In Progress': {
    label: 'In Progress',
    tone: 'progress',
    badge: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    dot: 'text-cyan-500',
  },
  'Pending Evidence': {
    label: 'Pending Evidence',
    tone: 'progress',
    badge: 'bg-teal-50 text-teal-700 border-teal-200',
    dot: 'text-teal-500',
  },
  Completed: {
    label: 'Completed',
    tone: 'success',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'text-emerald-500',
  },
  Overdue: {
    label: 'Overdue',
    tone: 'danger',
    badge: 'bg-red-50 text-red-700 border-red-200',
    dot: 'text-red-500',
  },
  Escalated: {
    label: 'Escalated',
    tone: 'danger',
    badge: 'bg-rose-100 text-rose-800 border-rose-300',
    dot: 'text-rose-600',
  },
  'Ready for Audit': {
    label: 'Ready for Audit',
    tone: 'success',
    badge: 'bg-green-50 text-green-700 border-green-200',
    dot: 'text-green-600',
  },
  Reported: {
    label: 'Reported',
    tone: 'success',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    dot: 'text-emerald-700',
  },
};
