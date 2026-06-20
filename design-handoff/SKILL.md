---
name: swifto-design
description: Use this skill to generate well-branded interfaces and assets for Swifto, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick map
- `readme.md` — the design guide: content voice, visual foundations, iconography, index.
- `styles.css` + `tokens/` — link `styles.css` for all CSS custom properties, Inter, and base styles.
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing).
- `components/` — reusable React primitives; load `_ds_bundle.js` and read them from `window.SwiftoDesignSystem_8a726e`.
- `ui_kits/swifto-marketplace/` — interactive recreation of the Swifto web app; `icons.js` carries the Heroicons paths.

## Swifto in one breath
Calm blue marketplace (NZ student gig work). Brand blue `#006494` on a pale `#E8F1F2` canvas, near-navy `#13293D` ink text, Inter type, Heroicons outline, white hairline cards that lift on hover. Voice: warm, plain, sentence-case, "you"-addressed, trust-forward, no emoji.
