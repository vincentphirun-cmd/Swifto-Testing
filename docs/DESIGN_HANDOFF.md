# Swifto — Design handoff summary

_Branch: `design/redesign-handoff` · Full files in `/design-handoff` · Live app unchanged on `main`_

## What this branch is for

Test the **warm redesign** and POC design system **without** changing production. The Next.js app (`app/`, Supabase, fees, chat) is the same as `main` until you deliberately migrate tokens.

## Two surfaces in `design-handoff/`

### A) POC design system (blue palette — frozen)

- Tokens: `design-handoff/tokens/*.css` (`#006494` primary, Inter, flat backgrounds)
- Components: `design-handoff/components/`
- UI kit: `design-handoff/ui_kits/swifto-marketplace/index.html`

### B) Redesign exploration (warm coral — default)

- **Entry:** `design-handoff/redesign/Swifto Redesign.html`
- Self-contained: `redesign/styles.css`, `*.jsx`, Tweaks panel
- Default: paper `#FBF6F0`, coral `#FF6A4D`, trust blue, Bricolage + Inter headlines

## Open decisions (block full migration)

| # | Decision |
|---|----------|
| **O1** | Keep redesign as exploration only, or migrate into the real Next.js app? |
| **O2** | Palette: Coral / Blue / Green | **Coral applied** in `tailwind.config.js` on this branch |
| **O3** | Headline font: Bricolage / Inter / Space Grotesk |
| **O4** | Corners: Soft / Pill / Sharp |
| **O5** | Allow gradients + photography (redesign) vs flat colour only (POC)? |

Use the Tweaks panel in `Swifto Redesign.html` to explore O2–O4.

## Migrating to the live app (when O1 = yes)

1. Lock O2–O5 and record choices here.
2. Update **`tailwind.config.js`** at repo root (colors, radii) — fonts only if you change O3 globally.
3. Update `components/site-nav.tsx`, home, dashboards incrementally — **do not** overwrite `app/` with zip HTML.
4. Merge `design/redesign-handoff` → `main` when ready.

## Vercel preview

Push this branch → Vercel builds a **Preview** URL (not production). Production only updates from `main`.

## Reference

Full handoff detail: `design-handoff/readme.md`, `design-handoff/SKILL.md`
