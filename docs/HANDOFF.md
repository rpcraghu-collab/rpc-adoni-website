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
- GitHub: private `rpcraghu-collab/rpc-adoni-website` (main). Vercel: account rpcraghu, team "rpc", project `rpc-adoni` (root `site`, Vite) configured via the GitHub import page; **first deploy blocked by Vercel's "Verify your identity" email code** (Claude may not enter login codes). After it: live URL rpc-adoni.vercel.app, auto-deploys on push.

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

- 3D illustrations done (ChatGPT, Govardhan, 8 Nov): `site/public/img/art/*.webp`, sources + prompts in `assets/ai-art/`. Used on Courses (group cards + selected-group banner with WhatsApp button), course detail panel, Home final CTA.

## Next steps
1. (done) Illustrations. Never AI photos of RPC classrooms/students; real photos only from the client.
2. (done) Admin panel, Firebase, Cloudinary, GitHub, Vercel project.
3. Founder: in the RPC Chrome (Profile 191) Vercel import tab, Send Code → enter the code from rpcraghu Gmail → Deploy.
4. After deploy: live test (contact form → /admin enquiry, admin sign-in, gallery upload, settings save), Lighthouse, quick `security-audit`.
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
