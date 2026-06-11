/**
 * Single source of truth for branding + design tokens.
 *
 * Swapping the demo to "ΔΕΗ / PPC" means editing BRAND here. The functional
 * color scales / radii / fonts are mirrored in tailwind.config.js (kept in sync
 * with the values below); THEME documents the deliberate design decisions so the
 * identity is intentional and centralized.
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
  primaryColor: '#0F4C81', // navy — confident primary, used sparingly
  accentColor: '#15B79E', // teal — the signature accent rule, used rarely
};

/**
 * Design identity — "compliance terminal":
 * cool slate neutrals, navy primary, a thin teal accent rule, monospaced data,
 * hairline borders, small radii, engineered (not flashy) motion.
 */
export const THEME = {
  fontSans: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif',
  fontMono: '"IBM Plex Mono", ui-monospace, monospace',
  /** Crisp, consistent corner — never pill-everything. */
  radius: '5px',
  neutral: 'slate', // committed cool-gray family
  /** Muted, semantic status intents (no rainbow). */
  statusTones: ['neutral', 'info', 'active', 'warn', 'danger', 'success'] as const,
} as const;

export type ThemeStatusTone = (typeof THEME.statusTones)[number];
