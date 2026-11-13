# RPC Adoni website: handoff

Client: Real Point Computer Education (RPC), Adoni. Owner Mr. A.G. Raghavendra, WhatsApp +91 99596 63984.
Facts: `CLIENT.md`. Decisions and pages: `docs/PLAN.md`. Old history (8-9 Nov): `docs/archive/HANDOFF-2026-11-08-to-09.md`.

## State (10 Nov 2026)
- `site/` = Vite 6 + React 19 + TS + Tailwind v4 + motion, prerendered (23 pages). `npm run build` passes.
- **LIVE: https://rpc-adoni.vercel.app** = the 10 Nov build (d6efc8f + web commit 3274bea, version 20261110074319). Live-checked: new timing, OAM Pro, 26 years, pgdca-advanced 308 → pgdca. Live `content/site`: coursesRev 2 with the 16-course PDF list, test photo "hiii" removed (gallery empty, no folders yet).
- Accounts (all on rpcraghu@gmail.com, Chrome deviceId `af87ad88-...`, Profile 191): GitHub `rpcraghu-collab/rpc-adoni-website`, Firebase `rpc-adoni-4953b`, Cloudinary `q2nhyak9` (preset `rpc_gallery`), Vercel team "rpc", project `rpc-adoni` (root `site`).
- **10 Nov, client PDF changes (done, emulator + Playwright tested, 54/54 checks, 0 console errors):**
  - Timings 9:00 am – 1:30 pm and 4:00 pm – 8:00 pm everywhere (site.ts, menu status, contact, footer, llms.txt).
  - Course sheet rebuilt from the PDF only (`content/site.ts`); PGDCA Advanced removed (vercel.json redirects `/courses/pgdca-advanced` → `/courses/pgdca`). New: OAM, OAM Advanced, OAM Pro, Advanced Excel, Tally, Power BI, SQL; languages (C, C++, Java, Oracle, Python, SQL) are a brief only: "Core X / Advanced X".
  - Years of teaching auto = current year − 2000 (`lib/years.ts`, 26 in 2026).
  - "Who are you?" course finder moved to the top of Home (the "highlight section for conversions"). Inter: + OAM, OAM Advanced, OAM Pro. Degree/B.Tech: every language. Working/homemaker: CCA first, OAM Pro in PGDCA Advanced's place.
  - Gallery folders: admin `/admin/gallery` has a "General photos" tab + folders (create, rename, reorder, delete with confirm, upload, caption, move/remove photos). Stored as `albums` inside `content/site` json (no rules change). Public `/gallery` shows an "Events" section with one section per folder (jump chips, show-all button, lightbox). Home teaser takes each folder's first photo.
  - Same-family fixes: course cards no longer repeat the name for one-language courses; check-safety handles CRLF.

- **10 Nov client round 2: LIVE (version 20261110134405, 7:14 pm), update sent to the client's WhatsApp 7:16 pm:** original logo, Awards page = awards only + Gallery = events (empty state until photos), no module numbers, hero crossfade, auto-turning course coverflow, FAQ opens on hover, rotating CTA card fans (Home/About), round WhatsApp button, batches card art beside the times, compact Compare table (fits one screen).

- **13 Nov client round 3 (Data2.pdf): LIVE 13 Nov** (3f1775a + web commit; live-checked on vercel.app and rpcadoni.com: Events/Reviews menu, no DET/MSME, PL/SQL, 45 days, both emails). Build passes; Playwright 390/1440 light+dark, 0 console errors, no overflow.
  - Topic sub-bullets: `'Parent: subs'` → bullet + sub-line (`splitTopic` in site.ts): "Microsoft Office: Word, Advanced Excel, PPT", "Oracle: SQL, PL/SQL".
  - Menu: Gallery → **Events** (page /gallery kept); Admissions → **Reviews** (Google Maps reviews, new tab; `SITE.reviews`). Enquire now button unchanged.
  - AP Govt DET + MSME removed everywhere (credentials, hero, fact band, proof strip, timeline, footer, contact, SEO, llms.txt).
  - Durations: Adv Excel 25d, Tally 50d, Power BI 30d, C 35d, C++ 30d, Java 45d, Oracle 45d, Python 45d.
  - About: Deputy Director Smt. S. Nagaveni (appointed 2 Nov 2025) in Founder block + Timeline + Home story; names one line; "two sessions every day"; tagline "Your Career… Our Commitment…".
  - Emails support@rpcadoni.com + rpcraghu@rpcadoni.com (`lib/content.ts` ignores the old saved Gmail). `COURSES_REV` 2 → 3 (live has no fees/hidden courses to lose).

- **13 Nov client round 4: LIVE** (e182e63 + web commit 6dfff46), update sent to the client's WhatsApp ~6 pm. Playwright 390/1440 light+dark, 0 console errors, no overflow.
  - Batch poster popup: admin `/admin/batches` → "Batch poster popup" box (upload / change / hide / remove, each saves at once) → `popup {id,url,on}` in content json → `LIVE.popup` → `components/BatchPopup.tsx` (opens ~1.9 s after load once the picture loads, once per visit per poster via sessionStorage, Esc/X/outside click/Continue close, WhatsApp "Join this batch").
  - REAL POINT in capitals; Tally → Tally Prime; single-language "Core & Advanced" → duration (`dur` map in site.ts; SQL has none yet: asked the client); second phone `SITE.phone2` (footer + Contact); Reviews = Google search reviews panel (`#lrd=…,3`); timings `whitespace-nowrap`; tagline lines split; About timings card art moved top-right; Timeline "Deputy Director of RPC." nowrap.

## Next steps
00. Waiting: the client's SQL course duration → add to `dur.SQL` in site.ts.
0. (done 13 Nov) Round 3 deployed; update sent to the client's WhatsApp 2:48 pm (DREAM TEAM SERVICES WhatsApp, English + Telugu). Wait for client feedback.
0b. Gallery needs the client's event/function/festival photos.
1. (done 10 Nov) Deployed + live data cleaned.
2. Deploy recipe: push to `rpcraghu-collab/rpc-adoni-website`, then a small commit in the GitHub web UI in the RPC Chrome (Vercel builds only rpcraghu-collab commits). See `docs/DEPLOY-NOTES.md`.
3. (10 Nov) Original RPC logo now used site-wide (`site/public/img/brand/`, favicon, splash).
4. rpcadoni.com shows the new site (10 Nov), user rule: only wp-admin + Vercel, no GoDaddy/Hostinger. DONE via WP plugin "RPC Vercel Proxy" (source + zip in `wp-proxy/`, uploaded through wp-admin → Plugins): every non-WordPress path is fetched from https://rpc-adoni.vercel.app and served under https://rpcadoni.com (www/http → 301 to https apex; wp-admin, wp-login, wp-json, wp-content stay WordPress; GET/HEAD only; LiteSpeed caches pages 5 min, /assets 7 days, purge via LiteSpeed in wp-admin if a deploy must show at once). New Vercel deploys appear automatically. Verified: pages, assets, images, robots, sitemap identical to Vercel; no console errors. Old "Redirect Redirection" rule is now bypassed (harmless). To undo: deactivate the plugin. Cleaner later: point DNS at Vercel (Vercel side already set up in team `rpc16`), then remove the plugin.
5. (10 Nov) Google still lists old WP URLs (/main-page/ → 404). Commit 5321e8b adds 301s in site/vercel.json (main-page, about-us, awards-2, contact-us, btech/coding/non-codeing, feeds, wp-sitemap.xml). Pushed with 411a7f8. LIVE 10 Nov (308 on vercel.app and rpcadoni.com).
5. No client update messages (founder 8 Nov); ask the client only for must-have info.

## Gotchas
- **`COURSES_REV` gate** (`lib/content.ts`): a saved course list without the current `coursesRev` is ignored, so the PDF list wins over the old live list. Bump it whenever the default course sheet changes shape.
- Deleting a photo in admin only removes it from the website; the file stays in Cloudinary (unsigned uploads can't delete).
- Files are CRLF (git autocrlf): line-based scripts must split on `/\r?\n/`; Python edits use `newline=''`.
- Tests: emulators (Firestore 8085, Auth 9099), `node rules-test/seed2.mjs`, `VITE_EMULATOR=1 npx vite --port 5181`, then `node rules-test/shoot2.mjs <outdir>` (fakes Cloudinary; screenshots go to `shots/`, git-ignored).
- Deploy: Vercel Hobby + private repo deploys ONLY commits authored by rpcraghu-collab.
- vercel.json redirect `source` must be plain paths (list `/x` and `/x/` separately). `/x/?` or `/(a)?b/?` made Vercel reject the config: GitHub pushes then create NO deployment at all (no Blocked/Error row). Vercel → Deployments → ⋯ → Create Deployment (main) shows the real error.
- Reduced-motion branching must use `useReduce()` from `ui.tsx` (plain `useReducedMotion` caused hydration errors). Effects need `{ }` bodies (check-safety enforces it).
- No picture may repeat on a page (founder 9 Nov). Never AI photos of RPC classrooms/students.
- Bash tool mangles `\n` / `\\` inside sed/python heredocs: edit such lines with the Edit tool.
- Tailwind v4: classes used inside `@apply` must be `@utility`.

Last updated: 13 Nov 2026
