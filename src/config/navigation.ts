import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Building2,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Network,
  Scale,
  ShieldCheck,
  Sparkles,
  Ticket,
} from 'lucide-react';
import type { Role } from '../context/RoleContext';
import type { BusinessUnit } from '../types';
import { REMIT_II_ID } from '../data/regulatoryChanges';

/** The Business Unit the BU role represents during the demo. Procurement's
 *  seeded ticket starts as a fresh, unread notification — ideal for walking
 *  the full BU journey live without altering the seed. */
export const DEMO_BUSINESS_UNIT: BusinessUnit = 'Procurement';

/** The example ids the contextual detail/ticket routes point at during the demo. */
export const DEMO_REG_CHANGE_ID = REMIT_II_ID; // 'rc-remit2'
export const DEMO_TICKET_ID = 'tkt-procurement'; // Procurement ticket (see src/data/tickets.ts)

export interface RoleMeta {
  /** Full label shown on the role switcher. */
  label: string;
  /** Where the switcher lands when this role is selected. */
  defaultPath: string;
  icon: LucideIcon;
}

export const ROLE_META: Record<Role, RoleMeta> = {
  legal: {
    label: 'Legal / Compliance',
    defaultPath: '/legal/dashboard',
    icon: Scale,
  },
  bu: {
    label: 'Business Unit',
    defaultPath: '/bu/dashboard',
    icon: Building2,
  },
};

/** Ordered list of roles for the segmented control. */
export const ROLES: Role[] = ['legal', 'bu'];

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  /** Match the route exactly (used for index/dashboard links). */
  end?: boolean;
}

export const NAV_ITEMS: Record<Role, NavItem[]> = {
  legal: [
    { label: 'Dashboard', to: '/legal/dashboard', icon: LayoutDashboard, end: true },
    { label: 'Impact Overview', to: '/legal/impact-overview', icon: Network },
    { label: 'REMIT II Detail', to: `/legal/regulatory-change/${DEMO_REG_CHANGE_ID}`, icon: FileText },
    { label: 'Monitoring', to: '/legal/monitoring', icon: Activity },
    { label: 'Support Requests', to: '/legal/support-requests', icon: MessageSquare },
    { label: 'Audit & Reporting', to: '/legal/audit', icon: ShieldCheck },
    { label: 'AI Tools', to: '/legal/ai-tools', icon: Sparkles },
  ],
  bu: [
    { label: 'My Dashboard', to: '/bu/dashboard', icon: LayoutDashboard, end: true },
    { label: 'REMIT II Detail', to: `/bu/regulatory-change/${DEMO_REG_CHANGE_ID}`, icon: FileText },
    { label: 'My Ticket', to: `/bu/tickets/${DEMO_TICKET_ID}`, icon: Ticket },
  ],
};
