# RPC website plan (8 Nov 2026)

Inputs: `../CLIENT.md` (facts), `COMPETITOR-RESEARCH.md`, old site + poster in `../old-site/`.
Goal: more admission enquiries (WhatsApp + form) from Adoni and nearby. Users: Inter/Degree/B.Tech students, their parents, housewives, business people. Mostly mobile and Android, often on slow 4G.

## Decisions
- **Stack:** Vite + React 19 + TS + Tailwind v4 + Motion + React Router; Firebase (Auth + Firestore) + Cloudinary (images); Vercel; app in `site/`.
- **Content:** default content ships in code (`src/content/*.ts`, from CLIENT.md), and Firestore overrides it when admin edits. Pages render instantly and work before the Firebase keys arrive.
- **Brand:** RPC navy `#0B1E4A` + signal red `#E2231A` (from the logo), warm paper `#F6F4EF`, award gold `#C9962B` only for awards. Light-first, with dark mode.
- **Type:** Bricolage Grotesque (display) + Manrope (body), self-hosted variable fonts.
- **Concept:** "A 25-year institution with modern energy": editorial big type, real award photos as the proof, bento grids, crisp cards.
- **Motion:** purposeful only (reveals, 3D tilt on course cards, magnetic primary CTA, marquee of tools, award parallax). Everything respects reduced-motion.
- **Why we're not using every buzzword the brief listed:** glass only on the sticky nav and bottom bar, no neumorphism, no heavy 3D/WebGL. The users are on budget phones and 4G, so we keep LCP under 2.5 s. The anti-slop rules also ban glass-everywhere.

## Pages (5 + course detail routes)
1. **Home:**
   - Hero: "Job-ready computer courses in Adoni, since 2000", primary CTA "Enquire on WhatsApp", secondary "See courses".
   - Proof strip: ISO 9001:2015, AP DET permission 2006, MSME, 5× award winners, 25 years.
   - Course finder by qualification (School / Inter / Degree & B.Tech / Working & homemakers).
   - Bento of the 4 flagship courses, tools marquee, why RPC (real facilities), awards teaser, upcoming batches (admin), FAQ, final CTA.
2. **About RPC:** founder story (2000 → 2006 DET + ISO → awards → today), mission incl. tribal/poor students, facilities grid, timings, certifications.
3. **Courses & Programs:**
   - Filter tabs: Diplomas (PGDCA, PGDCA Adv, DCA, DCP) / Office & Tally (OAM, OAM Adv, OAM PRO, CCA) / Programming (C, C++, Java, Oracle, Python).
   - Each course gets a detail route `/courses/:slug`: fact strip, what you learn, syllabus accordion, who it's for, CTA. Titles follow "<Course> course in Adoni" for SEO.
4. **Awards & Achievements:** 5 awards as a timeline with real photos + lightbox; gallery (admin-managed).
5. **Contact & Admissions:**
   - 4-field enquiry form: name, mobile, course, preferred batch (morning/evening).
   - It saves to Firestore and then opens WhatsApp with a pre-filled message.
   - Plus map, timings, call/WhatsApp/email.

**Global:**
- Sticky glass nav with a Courses mega menu.
- Mobile bottom bar: Call · WhatsApp · Enquire.
- Floating WhatsApp button on desktop.
- Footer with all real links (no `#` links).
- SEO: per-route meta, EducationalOrganization + Course JSON-LD (no ratings), sitemap, robots.

## Admin (`/admin`, Firebase Auth email login)
- Enquiries: list, status New/Called/Joined/Not interested, notes, call/WhatsApp buttons, CSV export.
- Courses: edit text, duration, eligibility, syllabus, fee line, show/hide, order.
- Batches: course, start date, timing, open/closed.
- Awards & gallery: Cloudinary upload, caption, order.
- Settings & SEO: phones, address, timings, hero text, meta.

## Needs from the client (asked 8 Nov: real photos only)
- Real photos (optional).
- Domain access at go-live.
- Everything else uses the old site; unknowns show neutral text ("Enquire for fees").

## Timeline (sent to the client)
| Date | Work |
|---|---|
| 8 Nov | Research + plan |
| 9 Nov | Home design |
| 10 Nov | 5 pages |
| 11 Nov | Admin |
| 12 Nov | Testing + preview link (deploy needs the founder's OK) |
| 13 Nov | Changes + live on rpcadoni.com |
