/**
 * Single source of truth for branding.
 *
 * Swapping the demo to "ΔΕΗ / PPC" means editing ONLY this file.
 * Nothing else in the app should hardcode the company name or colors.
 */
export interface Brand {
  name: string;
  shortName: string;
  primaryColor: string;
  accentColor: string;
}

export const BRAND: Brand = {
  name: 'PowerGrid Hellas',
  shortName: 'PGH',
  primaryColor: '#0F4C81',
  accentColor: '#15B79E',
};
