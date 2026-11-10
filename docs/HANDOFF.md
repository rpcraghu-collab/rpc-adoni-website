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

## Next steps
1. (done 10 Nov) Deployed + live data cleaned.
2. Deploy recipe: push to `rpcraghu-collab/rpc-adoni-website`, then a small commit in the GitHub web UI in the RPC Chrome (Vercel builds only rpcraghu-collab commits). See `docs/DEPLOY-NOTES.md`.
3. Logo: the client will send a NEW logo `[NEED]`. Swap `site/public` logo files + favicon when it arrives.
4. rpcadoni.com shows the new site (10 Nov), user rule: only wp-admin + Vercel, no GoDaddy/Hostinger. DONE via WP plugin "RPC Vercel Proxy" (source + zip in `wp-proxy/`, uploaded through wp-admin → Plugins): every non-WordPress path is fetched from https://rpc-adoni.vercel.app and served under https://rpcadoni.com (www/http → 301 to https apex; wp-admin, wp-login, wp-json, wp-content stay WordPress; GET/HEAD only; LiteSpeed caches pages 5 min, /assets 7 days, purge via LiteSpeed in wp-admin if a deploy must show at once). New Vercel deploys appear automatically. Verified: pages, assets, images, robots, sitemap identical to Vercel; no console errors. Old "Redirect Redirection" rule is now bypassed (harmless). To undo: deactivate the plugin. Cleaner later: point DNS at Vercel (Vercel side already set up in team `rpc16`), then remove the plugin.
5. (10 Nov) Google still lists old WP URLs (/main-page/ → 404). Commit 5321e8b adds 301s in site/vercel.json (main-page, about-us, awards-2, contact-us, btech/coding/non-codeing, feeds, wp-sitemap.xml). NOT deployed yet: push + web commit (deploy recipe), then check https://rpcadoni.com/main-page/ → 301 → / and purge LiteSpeed.
5. No client update messages (founder 8 Nov); ask the client only for must-have info.

## Gotchas
- **`COURSES_REV` gate** (`lib/content.ts`): a saved course list without the current `coursesRev` is ignored, so the PDF list wins over the old live list. Bump it whenever the default course sheet changes shape.
- Deleting a photo in admin only removes it from the website; the file stays in Cloudinary (unsigned uploads can't delete).
- Files are CRLF (git autocrlf): line-based scripts must split on `/\r?\n/`; Python edits use `newline=''`.
- Tests: emulators (Firestore 8085, Auth 9099), `node rules-test/seed2.mjs`, `VITE_EMULATOR=1 npx vite --port 5181`, then `node rules-test/shoot2.mjs <outdir>` (fakes Cloudinary; screenshots go to `shots/`, git-ignored).
- Deploy: Vercel Hobby + private repo deploys ONLY commits authored by rpcraghu-collab.
- Reduced-motion branching must use `useReduce()` from `ui.tsx` (plain `useReducedMotion` caused hydration errors). Effects need `{ }` bodies (check-safety enforces it).
- No picture may repeat on a page (founder 9 Nov). Never AI photos of RPC classrooms/students.
- Bash tool mangles `\n` / `\\` inside sed/python heredocs: edit such lines with the Edit tool.
- Tailwind v4: classes used inside `@apply` must be `@utility`.

Last updated: 10 Nov 2026
