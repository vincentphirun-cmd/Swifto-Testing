# Swifto design handoff (exploration)

This folder is a **copy of the design-system handoff** — it does **not** power the live Next.js app in `/app`. Production UI still uses `tailwind.config.js` at the repo root until you migrate (see `docs/DESIGN_HANDOFF.md`).

## Preview the warm redesign prototype

**Locally (fastest):**

1. Open in Finder: `design-handoff/redesign/Swifto Redesign.html`
2. Double-click to open in Chrome or Safari
3. Use the **Tweaks panel** to try Coral / Blue / Green palettes, fonts, and corners

**From terminal:**

```bash
open "design-handoff/redesign/Swifto Redesign.html"
```

## Preview the POC UI kit (blue palette)

```bash
open "design-handoff/ui_kits/swifto-marketplace/index.html"
```

## Folder layout

| Path | Purpose |
|------|---------|
| `redesign/` | Warm coral prototype — **start here** for the new direction |
| `tokens/`, `components/` | Compiler-backed design system (POC blue palette) |
| `ui_kits/swifto-marketplace/` | Full marketplace flow mock (POC palette) |
| `guidelines/` | Token specimen cards |

## Do not

- Replace `/app` or `/components` with files from here without a planned migration
- Hand-edit `_ds_bundle.js`, `_ds_manifest.json`, or `_adherence.oxlintrc.json` (compiler-generated)

## Apply to the real site

Work on branch `design/redesign-handoff`. When O1–O5 are decided, map winning tokens into `/tailwind.config.js` and update Next.js pages — not by copying this folder over the app.
