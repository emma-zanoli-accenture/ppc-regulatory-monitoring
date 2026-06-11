import { WORKFLOW_STATE_CONFIG } from '../types/workflow';
import type { WorkflowState } from '../types/workflow';
import { Badge } from './Badge';
import type { BadgeSize } from './Badge';

export interface StatusBadgeProps {
  state: WorkflowState;
  size?: BadgeSize;
  /** Show the leading status dot (default true). */
  withDot?: boolean;
}

/**
 * Renders any workflow state with colors from the central WORKFLOW_STATE_CONFIG.
 * This is the ONLY component that should be used to display a workflow state.
 */
export function StatusBadge({ state, size = 'md', withDot = true }: StatusBadgeProps) {
  const config = WORKFLOW_STATE_CONFIG[state];
  return (
    <Badge
      size={size}
      className={config.badge}
      dotClassName={withDot ? config.dot : undefined}
    >
      {config.label}
    </Badge>
  );
}
