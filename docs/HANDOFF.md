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
4. rpcadoni.com → Vercel (10 Nov): user chose NO GoDaddy/DNS change, only wp-admin. DONE: WordPress plugin "Redirect Redirection" (wp-admin → Redirection, admin.php?page=irrp-redirection) rule All URLs → https://rpc-adoni.vercel.app/ (plugin forces 301 for All-URLs rules). Verified: every page on rpcadoni.com/www lands on rpc-adoni.vercel.app; wp-admin + wp-login still work. Vercel side also ready (team `rpc16`: rpcadoni.com Production, www 308, Vercel DNS zone with Hostinger email records) in case nameservers are moved later. Caveat: site canonicals say https://rpcadoni.com, which now redirects to vercel.app (SEO: proper fix = nameservers ns1/ns2.vercel-dns.com at GoDaddy, then delete the WP rule).
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
