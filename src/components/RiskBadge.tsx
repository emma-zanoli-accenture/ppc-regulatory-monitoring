import type { RiskPriority, ImpactLevel } from '../types';
import { Badge } from './Badge';
import type { BadgeSize } from './Badge';

/** Low/Medium/High share one semantic color map (used for risk, priority, impact). */
const LEVEL_STYLES: Record<RiskPriority, { badge: string; dot: string }> = {
  Low: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'text-emerald-500' },
  Medium: { badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'text-amber-500' },
  High: { badge: 'bg-red-50 text-red-700 border-red-200', dot: 'text-red-500' },
};

export interface RiskBadgeProps {
  level: RiskPriority | ImpactLevel;
  size?: BadgeSize;
  withDot?: boolean;
  /** Optional label suffix, e.g. "High" -> "High Risk". */
  suffix?: string;
}

export function RiskBadge({ level, size = 'md', withDot = true, suffix }: RiskBadgeProps) {
  const style = LEVEL_STYLES[level];
  return (
    <Badge size={size} className={style.badge} dotClassName={withDot ? style.dot : undefined}>
      {suffix ? `${level} ${suffix}` : level}
    </Badge>
  );
}

/** PriorityBadge is the same Low/Medium/High visual language as RiskBadge. */
export const PriorityBadge = RiskBadge;
