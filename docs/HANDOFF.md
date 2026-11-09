# RPC Adoni website: handoff

Client: Real Point Computer Education (RPC), Adoni. Owner Mr. A.G. Raghavendra, WhatsApp +91 99596 63984.
Facts: `CLIENT.md`. Decisions and pages: `docs/PLAN.md`. Competitors: `docs/COMPETITOR-RESEARCH.md`.

## State (8 Nov 2026)
- `site/` = Vite 6 + React 19 + TS + Tailwind v4 + motion. `npm run build` passes.
- Pages done: Home, About, Courses (filter), Course detail ×13 (`/courses/:slug`), Awards (lightbox), Admissions/Contact (form → Firestore when keys exist, then WhatsApp), 404.
- Light + dark mode, mobile bottom bar, mega menu, SEO titles, JSON-LD, sitemap, robots, `vercel.json` (SPA rewrite + security headers).
- **Cinematic redesign (9 Nov, commits c807947..d57a0c8):** Home = sliding hero (4 AI hero images, never captioned as RPC), fact marquee, 3D coverflow, scroll-stacking course cards (`home/StackCards.tsx`, flat under reduced motion), 3D card wall, gallery teaser; new `/gallery` (bento + filters + shared `Lightbox.tsx`). Reduced-motion branching must use `useReduce()` from `ui.tsx` (plain `useReducedMotion` caused React #418 hydration errors). Header phone link shows only at >=1536 px.
- Screenshots checked at 390 / 1440, light + dark (`shots/`, git-ignored): no console errors, no horizontal overflow.
- 8 Nov 2026 inner-page redesign (founder rated it 2/10). Every page now matches Home: a shared `PageHero` (breadcrumbs and art tile) and shared course cards/CtaBand in `components/course.tsx`. Changes:
  - Courses: `?group=` tabs and a fit guide.
  - Course page: a sticky facts card and a course-aware bottom bar.
  - About: a timeline.
  - Awards: a full lightbox.
  - Contact: focus on the first error, plus a 5 s save timeout.
  - 404: popular courses.
  Lighthouse mobile scores (Home, /courses/pgdca): a11y/BP/SEO 100, perf about 75. The LCP waits for the SPA JS; prerendering is the next speed step. Commits ac48e62..ba6b162: pushed + LIVE 8 Nov ~2 pm (index-BFB7iIsC.js), live-checked 7 pages x 390/1440 x light/dark + mobile menu. [NEED] from client: syllabus/duration for C, C++, Java, Oracle, Python; OAM PRO duration; PGDCA vs PGDCA Advanced; real classroom photos; fees. Next speed step: prerender.
- **8 Nov evening, speed + UI round 2/3 (LIVE, 568857a + web commit):** the blank-page fix plus prerender (`site/scripts/prerender.mjs`: 19 routes, inline CSS, font + hero image preload). Home hero = founder award photo (srcset 640/800/1024). One `FacilityList` style on Home/About/Course pages. Course cards are `bare`. Courses page: one fit guide (desktop aside, mobile fold). Live Lighthouse mobile home: 96/100/100/100, LCP 2.0 s, CLS 0. My grade about 9/10; 10/10 needs the client's real classroom photos, fees and syllabus.
- **8 Nov late, UI round 1 to 10/10 (local commits 40bca07..9fccf1f, NOT pushed/deployed):** grades 8.5-9 → 9.5 on every page; fixes in `docs/UI-SCORECARD.md`. Local Lighthouse a11y/BP/SEO 100 (perf: re-measure live after deploy). 10/10 needs client data: syllabus/duration C, C++, Java, Oracle, Python; OAM PRO duration; PGDCA vs Advanced; classroom photos; fees; award years.
- Admin panel `/admin` built (Google sign-in; enquiries, courses, batches, gallery, settings, admins), emulator-tested.
- Firebase project `rpc-adoni-4953b`: Google sign-in on, Firestore rules LIVE, web config in `site/src/lib/firebase-config.ts` (not secret, so Vercel needs no env vars). Owner rpcraghu@gmail.com is admin; extra admins at `admins/{email}`. Authorized domains include rpc-adoni.vercel.app.
- Cloudinary cloud `q2nhyak9`, unsigned preset `rpc_gallery` (folder rpc-gallery, public ID disallowed, jpg/jpeg/png/webp/avif/heic only, incoming `c_limit,w_2400,h_2400`). Tested 8 Nov: upload OK, .txt rejected. The two 8×8 test PNGs were deleted 9 Nov (folder kept).
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
- **8 Nov 3:15 pm blank-page fix (founder: "navigating shows a blank page and not coming back"), LIVE (index-B1aZkAeh.js):** a lazy page chunk that failed (old tab after a deploy, weak data) threw with no error boundary, so React unmounted the whole site and Back stayed white. Fix c38485a: public pages bundled into the main file (+11 KB gzip, navigation downloads nothing) + `PageErrorBoundary` keyed by path (retry box, menu still works). Live-tested 390/1440: all pages open, no JS fetched on navigation, blocked-chunk test shows the retry box and recovers. Tabs opened before 3:13 pm still run the old code: one refresh fixes them.
- **8 Nov ~4 pm "blank until refresh" fix (founder: every page white on first open), LIVE:** root cause = white SPA shell until ~200 KB JS arrives on slow data. Fix 27190a0: build-time prerender (`scripts/prerender.mjs` after `vite build --ssr src/entry-server.tsx`): 19 routes → `dist/<route>/index.html` with live Firestore content baked in (`#rpc-content`), `app.html` shell for /admin + unknown paths (vercel.json rewrite). `main.tsx` hydrates when `data-path` matches; `lib/boot.ts` `enter()` keeps first-paint motion off so nothing renders at opacity 0. Live-tested chromium + webkit: all pages show full content with JS off, first paint 1.7 s with JS held, nav/Back/filter/admin/404/dark OK, console clean. Admin content edits reach the HTML on the next deploy (the app still loads the latest content after attaching).
- 3D illustrations done (ChatGPT, Govardhan, 8 Nov): `site/public/img/art/*.webp`, sources + prompts in `assets/ai-art/`. Used on Courses (group cards + selected-group banner with WhatsApp button), course detail panel, Home final CTA.

## Next steps
1. (done) Illustrations. Never AI photos of RPC classrooms/students; real photos only from the client.
2. (done) Admin panel, Firebase, Cloudinary, GitHub, Vercel project.
3. (done) Deployed + live-tested + Lighthouse.
4. (done 9 Nov) Security check: rules strict, admin content escaped/https-only, no secrets in git history, contact form honeypot added. npm audit: firebase/grpc-js (server-only, not in the browser) and react-router 6 open-redirect (no URL-driven navigation in the app) are not exploitable; react-router 7 upgrade optional later. Spam beyond the honeypot: Firebase App Check (reCAPTCHA) if enquiries get flooded.
5. Later: rpcadoni.com DNS → Vercel (needs domain access) + add it to Firebase authorized domains.
6. No client update messages (founder 8 Nov); ask the client only for must-have info.

## Client message log
- 8 Nov 10:05 am: timeline sent.

## Gotchas
- Bash tool mangles `\n` / `\\` inside sed/python heredocs: edit such lines with the Edit tool.
- Tailwind v4: classes used inside `@apply` (btn) must be `@utility`, not `@layer components`.
- Full-page screenshots need a scroll pass first (scroll-reveal sections stay hidden otherwise).
- Award 3 exists only in low-res (`award-3-sm.webp`).

- No picture may repeat on a page (founder 9 Nov, "13 courses showing same images"). Each course has its own `CourseArt` cover; CTAs use `CoverFan`. Check with the scratchpad `audit.cjs` dup test (the home hero's blurred glow copy is the only allowed repeat).

## 9 Nov 2026
- Pushed 8b13c84 to `rpcraghu-collab/rpc-adoni-website` main. It includes the new phone menu, 13 course covers, the About/Home hero/Courses redesigns, version.json, and the duplicate-image fixes.
- Vercel picks the push up only if the project is linked to that repo. Check this in browser af87ad88.
- (done 9 Nov) Admin announcement strip: `content/site` json is `{}`, nothing shows.

## 9 Nov night: desktop test of the founder's phone flow
- `desk.cjs` (scratchpad) at 1440, light + dark: every header link is SPA (138-506 ms), mega menu, chips, compare table, card→detail, lightbox, form errors, theme, Back all OK; 0 console errors. audit.cjs: 44/44 OK (only the hero's allowed blur copy repeats).
- Phone "white page + spinner" = full reloads from VersionWatch while new builds went live mid-test. Fix 8718fa0 (pushed): never reload on route change; the new build loads only when the tab returns to view. Public pages don't load Firebase (only react, motion, index).
- Phone-video audio has no clear speech (Whisper te output = noise).

- **9 Nov 6 am: deployed LIVE** (version 20261109003022). Live-tested 1440 + 390, light + dark: every page change stays in-app (no reload, no white page), 0 console errors, no overflow.

- **9 Nov ~7 am "_ is not a function" blank site (founder report), fixed in 945efd7, LIVE 9 Nov (version 20261109045714; live repro with patched scrollTo + no structuredClone: full page, 0 errors).** Root cause: `ScrollTop` used `useEffect(() => window.scrollTo(...))`; in-app browsers (WhatsApp/Instagram) patch scrollTo to return a value, React called it as a cleanup on the next page change, and with no boundary above it the whole site unmounted. Reproduced with a patched scrollTo (blank, same error), fixed build passes. Same family fixed: `structuredClone` at load (dead app on iOS < 15.4 / old WebViews; now a JSON `clone`), root `PageErrorBoundary` around everything. `scripts/check-safety.mjs` runs first in `npm run build` and fails on effects without `{ }` and on APIs missing on old phones.

Last updated: 9 Nov 2026 7 am
