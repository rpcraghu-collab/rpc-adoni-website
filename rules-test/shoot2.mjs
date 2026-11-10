// 10 Nov 2026 test: PDF courses, timings, years, Home finder, gallery folders (admin CRUD -> public sections).
// Emulator mode, off-screen browser. Cloudinary is faked: uploads return a fake URL, images are served from public/img.
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
const { chromium } = createRequire(process.env.APPDATA + '/npm/node_modules/')('playwright')
const BASE = 'http://localhost:5181'
const OUT = process.argv[2]
const IMG = ['award-1-sm.webp', 'award-2-sm.webp', 'award-4-sm.webp', 'award-5-sm.webp'].map((f) => readFileSync(new URL(`../site/public/img/${f}`, import.meta.url)))
const browser = await chromium.launch({ args: ['--window-position=-2400,0', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding'] })
const errors = []
const log = (...a) => console.log(...a)
const check = (ok, msg) => { log(ok ? 'OK  ' : 'FAIL', msg); if (!ok) errors.push(msg) }

async function page(w, scheme) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 500 ? 844 : 900 }, colorScheme: scheme, deviceScaleFactor: 1 })
  let n = 0
  await ctx.route('https://api.cloudinary.com/**', (r) => r.fulfill({ json: { secure_url: `https://res.cloudinary.com/q2nhyak9/image/upload/v1/test/up${++n}.jpg` } }))
  await ctx.route('https://res.cloudinary.com/**', (r) => { const m = r.request().url().match(/(\d+)\.jpg/); r.fulfill({ body: IMG[(m ? +m[1] : 0) % IMG.length], contentType: 'image/webp' }) })
  const p = await ctx.newPage()
  p.on('pageerror', (e) => errors.push(`${w}${scheme}: ${e.message}`))
  p.on('console', (m) => { if (m.type() === 'error' && !/favicon|ERR_NAME|net::|Failed to load resource/.test(m.text())) errors.push(`${w}${scheme} console: ${m.text().slice(0, 160)}`) })
  return { ctx, p }
}
const overflow = (p) => p.evaluate(() => document.documentElement.scrollWidth - innerWidth)

// 1. Admin: folders CRUD.
{
  const { ctx, p } = await page(1440, 'light')
  await p.goto(`${BASE}/admin/gallery`, { waitUntil: 'load' })
  await p.waitForFunction(() => window.__emuSignIn); await p.evaluate(() => window.__emuSignIn('rpcraghu@gmail.com'))
  await p.getByRole('button', { name: 'New folder' }).waitFor({ timeout: 15000 })
  check(await p.locator('text=General photos').count() > 0, 'admin: general photos tab shows the old flat gallery')
  const files = IMG.slice(0, 3).map((b, i) => ({ name: `p${i}.webp`, mimeType: 'image/webp', buffer: b }))
  // Folder 1
  await p.getByRole('button', { name: 'New folder' }).click()
  await p.locator('#folder-name').fill('Independence Day 2026')
  await p.locator('input[type=file]').setInputFiles(files)
  await p.waitForSelector('text=3 photos uploaded', { timeout: 10000 })
  await p.getByPlaceholder('Caption').first().fill('Flag hoisting')
  // Folder 2
  await p.getByRole('button', { name: 'New folder' }).click()
  await p.locator('#folder-name').fill('Diwali 2026')
  await p.locator('input[type=file]').setInputFiles(files.slice(0, 2))
  await p.waitForSelector('text=2 photos uploaded', { timeout: 10000 })
  // Folder 3: made then deleted
  await p.getByRole('button', { name: 'New folder' }).click()
  await p.locator('#folder-name').fill('To delete')
  await p.getByRole('button', { name: 'Delete folder' }).click()
  await p.getByRole('button', { name: 'Delete', exact: true }).click()
  check(await p.locator('text=To delete').count() === 0, 'admin: folder deleted')
  // Remove one photo from Diwali, move Diwali first
  await p.locator('button[aria-pressed]', { hasText: 'Diwali 2026' }).click()
  await p.getByRole('button', { name: 'Remove photo' }).first().click()
  await p.getByRole('button', { name: 'Move folder earlier' }).click()
  await p.screenshot({ path: `${OUT}/admin-folders-1440-light.png`, fullPage: true })
  await p.getByRole('button', { name: 'Save', exact: true }).click()
  await p.waitForSelector('text=Saved. The website is updated.', { timeout: 10000 })
  check(true, 'admin: saved')
  // Courses editor starts from the new defaults (old saved list ignored)
  await p.click('nav[aria-label="Admin sections"] a[href="/admin/courses"]')
  await p.waitForTimeout(900)
  check(await p.locator('text=Old PGDCA Advanced').count() === 0 && await p.locator('text=OAM Pro').count() > 0, 'admin: courses editor shows the new course sheet, not the old list')
  // Rename folder after save
  await p.click('nav[aria-label="Admin sections"] a[href="/admin/gallery"]')
  await p.locator('button[aria-pressed]', { hasText: 'Independence Day 2026' }).click()
  await p.locator('#folder-name').fill('Independence Day 15 Aug 2026')
  await p.getByRole('button', { name: 'Save', exact: true }).click()
  await p.waitForSelector('text=Saved. The website is updated.', { timeout: 10000 })
  await ctx.close()
}

// 2. Public pages, 4 views.
for (const scheme of ['light', 'dark']) {
  for (const w of [390, 1440]) {
    const { ctx, p } = await page(w, scheme)
    const tag = `${w}-${scheme}`
    await p.goto(`${BASE}/`, { waitUntil: 'networkidle' })
    await p.waitForTimeout(1500)
    const finder = p.locator('#finder-h, [aria-labelledby="finder-h"]').first()
    await p.locator('text=Tell us who you are').first().scrollIntoViewIfNeeded()
    await p.waitForTimeout(900)
    await p.screenshot({ path: `${OUT}/home-finder-${tag}.png` })
    if (w === 1440 && scheme === 'light') {
      for (const who of ['Inter student', 'Degree / B.Tech', 'Working / homemaker']) {
        await p.locator('button', { hasText: who }).first().click()
        await p.waitForTimeout(700)
        await p.screenshot({ path: `${OUT}/home-finder-${who.split(' ')[0].toLowerCase()}.png` })
      }
    }
    check(await overflow(p) <= 0, `${tag} home: no sideways scroll`)
    await p.goto(`${BASE}/gallery`, { waitUntil: 'networkidle' })
    await p.waitForTimeout(1200)
    const ev = p.locator('#events-h')
    check(await ev.count() > 0, `${tag} gallery: events section shown`)
    const titles = await p.locator('section[id^="f-"] h3').allInnerTexts()
    check(titles.join('|') === 'Diwali 2026|Independence Day 15 Aug 2026', `${tag} gallery: folder sections in admin order + renamed (${titles.join('|')})`)
    await ev.scrollIntoViewIfNeeded(); await p.waitForTimeout(900)
    await p.screenshot({ path: `${OUT}/gallery-events-${tag}.png`, fullPage: false })
    check(await overflow(p) <= 0, `${tag} gallery: no sideways scroll`)
    if (w === 390 && scheme === 'light') {
      await p.locator('section[id^="f-"] button').first().click()
      await p.waitForTimeout(800)
      await p.screenshot({ path: `${OUT}/gallery-lightbox-${tag}.png` })
      await p.keyboard.press('Escape')
    }
    for (const slug of ['python', 'oam-pro', 'sql', 'pgdca']) {
      await p.goto(`${BASE}/courses/${slug}`, { waitUntil: 'networkidle' })
      await p.waitForTimeout(900)
      await p.screenshot({ path: `${OUT}/course-${slug}-${tag}.png`, fullPage: w > 500 })
      check(await overflow(p) <= 0, `${tag} /courses/${slug}: no sideways scroll`)
    }
    if (scheme === 'light') {
      const py = await p.goto(`${BASE}/courses/python`, { waitUntil: 'networkidle' }).then(() => p.locator('main').innerText())
      check(/Core Python/.test(py) && /Advanced Python/.test(py) && !/Old Python|t11/.test(py), `${tag} python: brief Core/Advanced only`)
    }
    await p.goto(`${BASE}/courses`, { waitUntil: 'networkidle' })
    await p.waitForTimeout(1000)
    await p.screenshot({ path: `${OUT}/courses-${tag}.png`, fullPage: w > 500 })
    const ct = await p.locator('main').innerText()
    check(!/PGDCA Advanced/i.test(ct) && /OAM Pro/.test(ct) && /Power BI/.test(ct), `${tag} courses: PGDCA Advanced gone, new courses shown`)
    check(await overflow(p) <= 0, `${tag} courses: no sideways scroll`)
    await p.goto(`${BASE}/about`, { waitUntil: 'networkidle' })
    const yrs = new Date().getFullYear() - 2000
    check((await p.locator('main').innerText()).includes(`${yrs} years`), `${tag} about: shows ${yrs} years`)
    await p.goto(`${BASE}/contact`, { waitUntil: 'networkidle' })
    check((await p.locator('body').innerText()).includes('9:00 am – 1:30 pm'), `${tag} contact: new morning timing`)
    if (w === 390) {
      await p.getByRole('button', { name: /menu/i }).first().click()
      await p.waitForTimeout(700)
      await p.screenshot({ path: `${OUT}/menu-${tag}.png` })
    }
    await ctx.close()
  }
}
await browser.close()
console.log(errors.length ? `\nPROBLEMS:\n${errors.join('\n')}` : '\nALL CLEAN')
