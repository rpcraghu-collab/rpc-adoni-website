# RPC Adoni website: handoff

Client: Real Point Computer Education (RPC), Adoni. Owner Mr. A.G. Raghavendra, WhatsApp +91 99596 63984.
Facts: `CLIENT.md`. Decisions and pages: `docs/PLAN.md`. Competitors: `docs/COMPETITOR-RESEARCH.md`.

## State (8 Nov 2026)
- `site/` = Vite 6 + React 19 + TS + Tailwind v4 + motion. `npm run build` passes.
- Pages done: Home, About, Courses (filter), Course detail ×13 (`/courses/:slug`), Awards (lightbox), Admissions/Contact (form → Firestore when keys exist, then WhatsApp), 404.
- Light + dark mode, mobile bottom bar, mega menu, SEO titles, JSON-LD, sitemap, robots, `vercel.json` (SPA rewrite + security headers).
- Screenshots checked at 390 / 1440, light + dark (`shots/`, git-ignored): no console errors, no horizontal overflow.
- Admin panel `/admin` built (Google sign-in; enquiries, courses, batches, gallery, settings, admins), emulator-tested.
- Firebase project `rpc-adoni-4953b`: Google sign-in on, Firestore rules LIVE, web config in `site/src/lib/firebase-config.ts` (not secret, so Vercel needs no env vars). Owner rpcraghu@gmail.com is admin; extra admins at `admins/{email}`. Authorized domains include rpc-adoni.vercel.app.
- Cloudinary cloud `q2nhyak9`, unsigned preset `rpc_gallery` (folder rpc-gallery, public ID disallowed, jpg/jpeg/png/webp/avif/heic only, incoming `c_limit,w_2400,h_2400`). Tested 8 Nov: upload OK, .txt rejected. Two 8×8 test PNGs left in rpc-gallery (harmless, delete in Media Library any time).
- GitHub: private `rpcraghu-collab/rpc-adoni-website` (main). Vercel: account rpcraghu, team "rpc", project `rpc-adoni` (root `site`, Vite).
- **LIVE: https://rpc-adoni.vercel.app** (8 Nov). Live test: all pages 200 at 390/1440, no console errors, no overflow; contact form → Firestore write OK (test enquiry deleted after). `content/site` created with json `{}` (admin's first save fills it). Lighthouse mobile home: A11y 97→fixed contrast/label, Best Practices 100, SEO 100; llms.txt added.
- **Deploy gotcha:** Vercel Hobby + private repo deploys ONLY commits authored by rpcraghu-collab. Pushes from this PC (author govardhan9692) show "Blocked". To deploy: push, then make any small commit in the GitHub web UI in the RPC Chrome (it builds latest main). See `docs/DEPLOY-NOTES.md`.
- Admin Google sign-in not tested live (the popup opens outside Claude's tab group); emulator-tested. Owner just opens /admin and signs in with rpcraghu@gmail.com.

## Timeline promised to the client (sent 8 Nov 10:05 am)
| Date | Work |
|---|---|
| 9 Nov | Home page |
| 10 Nov | Other 5 pages |
| 11 Nov | Admin panel (Firebase Auth; enquiries, courses, batches, awards via Cloudinary, settings) |
| 12 Nov | Testing + preview link (deploy needs the user's OK) |
| 13 Nov | Live on rpcadoni.com (needs domain access) |

We are ahead: all public pages are built on 8 Nov.

## Founder instructions (8 Nov 2026, ~11:10 am): FINISH THE WHOLE SITE TODAY
- GitHub, Firebase, Cloudinary and Vercel accounts are ALREADY CREATED on the client's Gmail rpcraghu@gmail.com.
- Browser: Chrome deviceId `af87ad88-dbd5-43f3-80d5-6806a8240e56` (Profile 191, verified as rpcraghu@gmail.com). Use ONLY it for RPC accounts. If it's missing: `"C:/Program Files/Google/Chrome/Application/chrome.exe" --profile-directory="Profile 191"`.
- Do everything yourself: Firebase project + web app keys → `site/.env`, Auth + Firestore rules (emulator-tested), admin panel, Cloudinary upload preset, GitHub repo push, Vercel project + deploy. The founder wants it complete today, so the timeline above is replaced.
- **Do NOT send the client any update messages** (this cancels the daily 7 pm update). Ask the client only for information that is truly required.

- **8 Nov afternoon (founder rated UI/UX 2/10, said pages don't open, wants light default):** fixed + LIVE. e42a184: light default, mobile menu closes on tap, pages preloaded, stale-chunk reload after deploys. 6895b93: Home redesign: hero with a navy "What do you want to learn?" picker (3D art tiles to `/courses?group=<id>`), one merged course finder (cards with art + durations), light "Our story" (award photo, 2000/2006/Today timeline, award thumbs), compact facilities + timings card, FAQ, CTA; ProofStrip/Marquee/dark awards band removed; cooler light palette (bg #f4f6fa). Mobile home 10.4k to 7.9k px. Live-checked: 7 pages x 390/1440 x light/dark, no overflow/errors, menu links open. Waiting for the founder's new rating.
- 3D illustrations done (ChatGPT, Govardhan, 8 Nov): `site/public/img/art/*.webp`, sources + prompts in `assets/ai-art/`. Used on Courses (group cards + selected-group banner with WhatsApp button), course detail panel, Home final CTA.

## Next steps
1. (done) Illustrations. Never AI photos of RPC classrooms/students; real photos only from the client.
2. (done) Admin panel, Firebase, Cloudinary, GitHub, Vercel project.
3. (done) Deployed + live-tested + Lighthouse.
4. Before rpcadoni.com goes live: quick `security-audit` (rules already strict; only public writes = enquiries, validated).
5. Later: rpcadoni.com DNS → Vercel (needs domain access) + add it to Firebase authorized domains.
6. No client update messages (founder 8 Nov); ask the client only for must-have info.

## Client message log
- 8 Nov 10:05 am: timeline sent.

## Gotchas
- Bash tool mangles `\n` / `\\` inside sed/python heredocs: edit such lines with the Edit tool.
- Tailwind v4: classes used inside `@apply` (btn) must be `@utility`, not `@layer components`.
- Full-page screenshots need a scroll pass first (scroll-reveal sections stay hidden otherwise).
- Award 3 exists only in low-res (`award-3-sm.webp`).

Last updated: 8 Nov 2026
