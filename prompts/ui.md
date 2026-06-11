The current UI reads as a generic AI-generated app. I want a distinctive, intentional design that looks like a real product team built it. Do a focused redesign pass — structure and data stay exactly as they are, only the visual language changes.

First, READ the frontend-design skill if available.

## Diagnose first
Before changing anything, audit the current UI and list the specific "default AI look" tells you find (e.g. violet/indigo gradients, uniformly rounded corners, centered floaty layouts, Inter everywhere, gratuitous shadows, rainbow status colors, oversized hero sections). Report them, then fix them.

## Establish a real design identity
This is an enterprise regulatory/compliance tool for a Greek energy utility. The feel should be: serious, dense-with-purpose, trustworthy, closer to a Bloomberg terminal / Linear / Stripe dashboard than a consumer landing page. Make deliberate, opinionated choices:

- **Typography:** Drop default Inter-as-everything. Pick a distinctive but professional pairing — e.g. a grotesque/neo-grotesque for UI (Söhne-like, or a well-set Geist/IBM Plex Sans) and consider a mono accent (IBM Plex Mono / JetBrains Mono) for IDs, dates, codes, and numeric/audit data. Use real typographic scale and tight, intentional line-heights. Load via the standard web-font approach.
- **Color:** Replace any purple/violet/indigo defaults. Build a restrained palette from BRAND colors in src/config/brand.ts: one confident primary, mostly a sophisticated neutral range (warm or cool gray — pick one and commit), and use color sparingly and meaningfully. Status colors should be muted/desaturated, not crayon-bright. Define them as tokens, don't scatter hex values.
- **Density & layout:** Move away from big centered cards with lots of air. Enterprise tools are information-dense and grid-aligned. Tighten spacing, use clear left-aligned hierarchy, real data tables with proper alignment (numbers right-aligned, monospaced), and structured page headers with breadcrumbs/context rather than oversized titles.
- **Borders & elevation:** Prefer crisp 1px hairline borders and subtle backgrounds over heavy drop shadows and large border-radii. Use a smaller, consistent radius (e.g. 4-6px) instead of pill-everything. Shadows only where they signal real elevation (modals, slide-overs).
- **Detail & texture:** Add the small touches that signal a human designed it — a subtle top bar with a thin accent rule, refined empty states, considered hover/focus states, keyboard-focus rings, table row hover, micro-interactions that are quick and understated (not bouncy), and consistent icon weight/size from lucide.

## Constraints
- Keep ALL functionality, routes, state, the runtime store, and the 18-step demo flow exactly as-is. This is purely a visual/CSS/token layer change.
- Keep branding centralized in src/config/brand.ts; expand it into a proper token set (colors, font families, radii, spacing scale) if helpful, but it stays the single source of truth.
- The three agentic moments must stay visually impressive, but make their animations feel refined and engineered, not flashy/AI-demo-ish.
- Still must look great fullscreen at ~1440px for a live presentation.
- Don't over-correct into "brutalist" or hard-to-read. The goal is polished, credible, distinctive enterprise software.

Apply the redesign across the shared components and both role views so it's consistent everywhere. When done, show me the dashboard and one detail page first so I can react before you propagate further.