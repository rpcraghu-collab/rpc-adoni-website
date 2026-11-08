# RPC Adoni: UI/UX scorecard

Reviewer lens: an Adoni student or parent on a cheap Android phone and slow data, often Telugu-first. Every public page checked at 390 and 1440 px, light and dark (local prerendered build, Playwright). Bar: 4.5:1 contrast, visible focus, keyboard reachable, reduced motion, tap targets 44 px.

## Round 0 → round 1 (8 Nov 2026)

| Page | R0 | R1 | Defects found (R0) → fix applied |
|---|---|---|---|
| Global | – | – | Browser bar `theme-color` #F6F4EF (warm) did not match the cool `--bg` #F4F6FA and stayed light in dark mode → `index.html` + `lib/theme.ts` set #F4F6FA, and #070F24 when dark. |
| Home | 9.0 | 9.5 | Facts row led with a vague number → "25+ years teaching computers in Adoni, since 2000". Finder chips hid behind a horizontal scroll on phones (half the audience never sees "Working / homemaker") → 2×2 grid on phones, wrap on desktop. FAQ: on phones the "Didn't find your answer?" card came before the questions, and the list was rendered twice → one grid, questions first on mobile, help card in the left column on desktop. |
| About | 8.5 | 9.5 | Hero used a generic 3D art tile on the one page about real people → real award-1 photo with caption. Founder photo repeated the Home photo → award-4. Founder block was text only → stat row (since 2000 / 5× awards / ISO 9001:2015). Credentials card floated mid-air on desktop → sticky card. |
| Courses | 8.5 | 9.5 | Desktop hero left half empty under the text → batch-time chips + ISO chip. Filter chips cut off at the right edge with no hint → edge fade on phones. Python orphaned alone in a half-width cell → last odd card spans 2 columns on phones. |
| Course detail (13) | 8.5 | 9.5 | Programming courses (no syllabus yet) showed a thin "ask us" line → card: practical promise + what we send (syllabus, duration, fee & next batch) + WhatsApp "Ask for the {code} syllabus". Page ended abruptly after related courses → course-specific CtaBand ("Ready to start {code}?"). Related grid orphan on phones fixed; desktop art tile reduced (max 25 rem) so it no longer dominates the title. |
| Awards | 9.0 | 9.5 | No defect beyond missing award years (client data). |
| Contact | 8.5 | 9.5 | Visit row did not say it opens Maps → "Get directions ↗" line. Right column had no trust signal next to the form → awards/ISO/DET card linking to /awards (2 thumbnails on phones so the title fits). |
| 404 | 9.0 | 9.5 | No defect. |

Checks passed in R1: 32 shots (8 routes × 390/1440 × light/dark) with no horizontal overflow and no console errors; contact empty-submit shows inline errors and focuses the first field; mobile menu opens/closes (Esc); keyboard focus ring 2 px solid; no visible tap target under 44 px (only the sr-only skip link and the visually hidden radio inputs, whose labels are the targets).

Lighthouse mobile, local build (8 Nov, PC under load from other jobs): Accessibility 100, Best Practices 100, SEO 100 on Home, /courses/pgdca, /about, /contact. Performance on this loaded PC is identical to the live HEAD build measured the same way (same CLS 0.118 from local font timing, which is 0 on the live CDN), so the change is neutral; re-measure on the live URL after deploy (last live: 96).

## Why not 10 yet: client data only
- `[NEED]` syllabus and duration for C, C++, Java, Oracle, Python.
- `[NEED]` OAM PRO duration.
- `[NEED]` what PGDCA Advanced adds over PGDCA (in plain words).
- `[NEED]` real classroom / lab / students-at-computers photos (the strongest missing trust signal).
- `[NEED]` fees per course (or a "from ₹…" line).
- `[NEED]` award years (for the Awards page and the About timeline).
