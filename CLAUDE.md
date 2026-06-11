# CLAUDE.md — Regulatory Change Management Demo

## What this is
A **scripted, front-end-only demo** of an AI-powered Regulatory Change Management tool, built for a **live prospect presentation**. It is NOT a production system. Priorities, in order: visual impact, clarity of the value story, demo robustness (must not break live). Enterprise-grade architecture is explicitly out of scope.

## Client & domain context
- Prospect: enterprise utility company, Greek market (energy/utilities).
- Process demonstrated: Regulatory Change Management — monitor regulatory sources → interpret obligations → communicate to Business Units → follow up → collect evidence → audit readiness.
- Two roles, switchable live: **Legal/Compliance** (analytical control tower) and **Business Unit** (operational, action-oriented).

## The one example case (use everywhere, keep consistent)
- Regulatory change: **REMIT II — Enhanced Wholesale Energy Market Transaction Reporting**, source ACER / EU REMIT.
- Implementation due date: **30/09/2026** (fixed, deterministic).
- Impacted Business Units: Energy Trading, Wholesale Market Operations, Procurement, Regulatory Affairs, Sustainability. (Never use banking units.)

## Tech stack
- Vite + React + TypeScript + Tailwind CSS. react-router-dom, lucide-react, clsx.
- **No backend, no API calls, no env vars, no real file IO.** Everything is static seed data made mutable at runtime via a React context store.
- Runs locally only (`npm run dev`).

## The three "agentic" moments (scripted, but must FEEL live)
1. **Monitor regulatory sources** — "Run source scan" on the Legal dashboard.
2. **Update source catalogue** — appends the detected regulation to the catalogue.
3. **Advisory support on interpretation/implementation** — the BU AI chatbot + the Legal "Generate Communication Report".
Each uses an AIThinkingIndicator + delay + scripted reveal (typewriter for the chatbot). Slightly slow them so the audience registers the "AI working".

## Architecture conventions
- **Single source of truth for branding:** `src/config/brand.ts` (BRAND object). Swapping to "ΔΕΗ / PPC" = edit this one file.
- **Single source of truth for workflow states:** the union type + display/color config defined in the data layer. Reuse the StatusBadge everywhere; never hardcode state colors.
- **Single runtime store** (React context) holds all mutable demo state: tickets, statuses, evidence, support requests, audit trail. Seeded from `src/data/`, mutable at runtime, **reset on reload** (no persistence). Actions in one role must be visible in the other.
- Folders: `components/` (reusable UI), `layout/`, `pages/`, `data/` (typed seed), `lib/` (helpers, fake-AI delay), `types/`, `config/`.
- All data strongly typed. Dates are fixed strings — no `new Date()`-driven values that change between runs.

## Demo presenter affordances
- **Role switcher** in the top bar (Legal ↔ Business Unit).
- **Demo Controls** (clearly presenter-only): "Simulate time" jumps (T-30, T-14, T-7, T+1) that fire reminders and trigger escalation; **Reset Demo** to restore seed state.
- **Demo Guide** overlay listing the 18-step narrative (off by default).

## Hard constraints / do-NOT list
- Do not add a backend, database, real auth, or live LLM calls.
- Do not use browser storage (localStorage/sessionStorage) — keep state in React context.
- Do not introduce banking/finance-sector business units.
- Do not let any dashboard number contradict the seed/store data.
- Do not make agentic moments instant — they must read as "AI working".
- UI language: **English** only.

## The 18-step narrative (the demo must run this end to end)
Legal: dashboard + source scan + update catalogue → impact overview → reg-change detail → generate communication report → select BUs → send.
BU: receive notification → open detail (What's changing / Why it matters / What to do / Key dates) → view & download report → AI chatbot → request Legal support.
Legal: answer support request → simulate T-30 reminder.
BU: enter compliance measures → upload evidence → Submit & Close.
Legal: monitoring shows Completed → Audit & Regulatory Reporting + export.

## Definition of done
The full 18-step sequence runs clickably, fullscreen at ~1440px, with no errors, state propagating across both roles, and "Reset Demo" restoring a clean state for a re-run.