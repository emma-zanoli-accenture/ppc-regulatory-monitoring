/**
 * Seed data aggregator.
 *
 * The runtime store (built later) imports `seedData` once, copies it into mutable
 * React context state, and resets back to it on demand. Individual collections are
 * also re-exported for direct reference.
 */

import { regulatoryChanges, remitII, REMIT_II_ID } from './regulatoryChanges';
import { obligations } from './obligations';
import { businessUnitImpacts } from './businessUnitImpacts';
import { tickets } from './tickets';
import { evidence } from './evidence';
import { supportRequests } from './supportRequests';
import { auditTrail } from './auditTrail';
import { businessUnits } from './businessUnits';

export {
  regulatoryChanges,
  remitII,
  REMIT_II_ID,
  obligations,
  businessUnitImpacts,
  tickets,
  evidence,
  supportRequests,
  auditTrail,
  businessUnits,
};

/** Everything the store needs to seed the demo, in one object. */
export const seedData = {
  regulatoryChanges,
  obligations,
  businessUnitImpacts,
  tickets,
  evidence,
  supportRequests,
  auditTrail,
} as const;

export type SeedData = typeof seedData;
