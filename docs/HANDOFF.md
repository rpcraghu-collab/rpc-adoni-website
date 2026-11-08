# RPC Adoni website: handoff

Client: Real Point Computer Education (RPC), Adoni. Owner Mr. A.G. Raghavendra, WhatsApp +91 99596 63984.
Facts: `CLIENT.md`. Decisions and pages: `docs/PLAN.md`. Competitors: `docs/COMPETITOR-RESEARCH.md`.

## State (8 Nov 2026)
- `site/` = Vite 6 + React 19 + TS + Tailwind v4 + motion. `npm run build` passes.
- Pages done: Home, About, Courses (filter), Course detail ×13 (`/courses/:slug`), Awards (lightbox), Admissions/Contact (form → Firestore when keys exist, then WhatsApp), 404.
- Light + dark mode, mobile bottom bar, mega menu, SEO titles, JSON-LD, sitemap, robots, `vercel.json` (SPA rewrite + security headers).
- Screenshots checked at 390 / 1440, light + dark (`shots/`, git-ignored): no console errors, no horizontal overflow.
- Firebase: code ready (`site/src/lib/firebase.ts`), waiting for the client's project keys → `site/.env` (see `.env.example`). Cloudinary: waiting.

## Timeline promised to the client (sent 8 Nov 10:05 am)
| Date | Work |
|---|---|
| 9 Nov | Home page |
| 10 Nov | Other 5 pages |
| 11 Nov | Admin panel (Firebase Auth; enquiries, courses, batches, awards via Cloudinary, settings) |
| 12 Nov | Testing + preview link (deploy needs the user's OK) |
| 13 Nov | Live on rpcadoni.com (needs domain access) |

We are ahead: all public pages are built on 8 Nov.

- 3D illustrations done (ChatGPT, Govardhan, 8 Nov): `site/public/img/art/*.webp`, sources + prompts in `assets/ai-art/`. Used on Courses (group cards + selected-group banner with WhatsApp button), course detail panel, Home final CTA.

## Next steps
1. (done) Illustrations. Never AI photos of RPC classrooms/students; real photos only from the client.
2. Admin panel `/admin` once Firebase keys arrive: Firestore rules (author + emulator test), content overrides for `content/site.ts`.
3. Lighthouse run; then `security-audit` skill before the first deploy.
4. Daily 7 pm client update (English + Telugu, DREAM TEAM SERVICES WhatsApp, @mention the client, screenshots as photos).

## Client message log
- 8 Nov 10:05 am: timeline sent.

## Gotchas
- Bash tool mangles `\n` / `\\` inside sed/python heredocs: edit such lines with the Edit tool.
- Tailwind v4: classes used inside `@apply` (btn) must be `@utility`, not `@layer components`.
- Full-page screenshots need a scroll pass first (scroll-reveal sections stay hidden otherwise).
- Award 3 exists only in low-res (`award-3-sm.webp`).

Last updated: 8 Nov 2026
