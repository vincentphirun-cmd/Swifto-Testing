# Swifto Marketplace — UI Kit

An interactive, click-through recreation of the Swifto web app, composed entirely
from the design-system components in `/components`.

## Flow
`index.html` boots on the **landing page**. From there:

1. **Find jobs** → the **Browse** screen (search, filters, job rows).
2. **Quick Apply** flips a row to the green *Applied* state; **Apply** opens the
   application **Modal** with name / experience / availability fields.
3. **Log in / Sign up** → the **Login** screen → on submit you land on the
   **student Dashboard** (balance, withdraw, tile grid).
4. **Our Mission** shows the mission prose screen.

## Files
| File | Role |
|---|---|
| `index.html` | Mounts React + the design-system bundle, loads all screens |
| `icons.js` | `window.SwiftoIcons.Icon` — Heroicons outline paths |
| `SiteNav.jsx` | Sticky top bar (wordmark, links, auth actions) |
| `LandingScreen.jsx` | Hero, trust strip, how-it-works, why-Swifto, CTA |
| `BrowseScreen.jsx` | Search/filter + job rows + apply modal |
| `DashboardScreen.jsx` | Balance card + dashboard tile grid |
| `LoginScreen.jsx` | Centered login card on a brand band |
| `app.jsx` | Route + auth state, plus the Mission screen |

## Notes
- Screens consume `window.SwiftoDesignSystem_8a726e` (`Button`, `Card`, `JobCard`,
  `Badge`, `Input`, `Select`, `Textarea`, `Modal`, `DashboardTile`, …).
- All data is mocked; auth and apply actions are fake but stateful.
- This is a faithful recreation of the existing product, not a redesign.
