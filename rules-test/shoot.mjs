// Screenshots of the public site + admin panel (emulator mode). Off-screen browser.
import { createRequire } from 'node:module'
const { chromium } = createRequire(process.env.APPDATA + '/npm/node_modules/')('playwright')
const BASE = 'http://localhost:5181'
const OUT = process.argv[2]
const browser = await chromium.launch({ args: ['--window-position=-2400,0'] })
const errors = []

async function page(w, scheme) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 500 ? 844 : 900 }, colorScheme: scheme, deviceScaleFactor: 1 })
  const p = await ctx.newPage()
  p.on('pageerror', (e) => errors.push(`${w}${scheme}: ${e.message}`))
  p.on('console', (m) => { if (m.type() === 'error' && !/favicon|ERR_NAME|net::/.test(m.text())) errors.push(`${w}${scheme} console: ${m.text().slice(0, 160)}`) })
  return { ctx, p }
}

for (const scheme of ['light', 'dark']) {
  for (const w of [390, 1440]) {
    const { ctx, p } = await page(w, scheme)
    const tag = `${w}-${scheme}`
    await p.goto(`${BASE}/`, { waitUntil: 'networkidle' })
    await p.waitForTimeout(1200)
    await p.screenshot({ path: `${OUT}/home-top-${tag}.png` })
    const b = p.locator('#batches-h')
    if (await b.count()) { await b.scrollIntoViewIfNeeded(); await p.waitForTimeout(700); await p.screenshot({ path: `${OUT}/home-batches-${tag}.png` }) }
    else errors.push(`${tag}: batches strip missing`)
    await p.goto(`${BASE}/awards`, { waitUntil: 'networkidle' })
    const g = p.locator('#gallery-h')
    if (await g.count()) { await g.scrollIntoViewIfNeeded(); await p.waitForTimeout(900); await p.screenshot({ path: `${OUT}/awards-gallery-${tag}.png` }) }
    else errors.push(`${tag}: gallery missing`)

    await p.goto(`${BASE}/admin`, { waitUntil: 'load' })
    await p.waitForTimeout(800)
    await p.screenshot({ path: `${OUT}/admin-signin-${tag}.png` })
    await p.waitForFunction(() => window.__emuSignIn); await p.evaluate(() => window.__emuSignIn('rpcraghu@gmail.com'))
    await p.waitForSelector('text=Test Student A', { timeout: 15000 })
    await p.waitForTimeout(500)
    await p.screenshot({ path: `${OUT}/admin-enquiries-${tag}.png`, fullPage: w > 500 })
    for (const tab of ['courses', 'batches', 'gallery', 'settings', 'admins']) {
      await p.click(`nav[aria-label="Admin sections"] a[href="/admin/${tab}"]`)
      await p.waitForTimeout(900)
      if (tab === 'courses') { await p.locator('button[aria-expanded]').first().click(); await p.waitForTimeout(300) }
      await p.screenshot({ path: `${OUT}/admin-${tab}-${tag}.png` })
    }
    await ctx.close()
  }
}

// Function test: change the announcement in Settings, save, see it on the public site.
{
  const { ctx, p } = await page(1440, 'light')
  await p.goto(`${BASE}/admin/settings`, { waitUntil: 'load' })
  await p.waitForFunction(() => window.__emuSignIn); await p.evaluate(() => window.__emuSignIn('rpcraghu@gmail.com'))
  const box = p.getByPlaceholder('e.g. New Tally Prime batch starts 15 December')
  await box.waitFor({ timeout: 15000 })
  await box.fill('Edited from the admin test')
  await p.getByRole('button', { name: 'Save', exact: true }).click()
  await p.waitForSelector('text=Saved. The website is updated.', { timeout: 10000 })
  const p2 = await ctx.newPage()
  await p2.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await p2.waitForTimeout(800)
  const shown = await p2.locator('text=Edited from the admin test').count()
  console.log(shown ? 'FUNCTION OK: announcement saved and shown on the site' : 'FUNCTION FAIL: announcement not on site')
  // Hide a course and check the Courses page count drops.
  await p.goto(`${BASE}/admin/courses`, { waitUntil: 'load' })
  await p.locator('button[aria-label^="Hide "]').first().click()
  await p.getByRole('button', { name: 'Save', exact: true }).click()
  await p.waitForSelector('text=Saved. The website is updated.', { timeout: 10000 })
  await p2.goto(`${BASE}/courses`, { waitUntil: 'networkidle' })
  await p2.waitForTimeout(800)
  console.log('Courses tab label:', await p2.locator('[role=tab]').first().innerText().catch(() => '?'))
  // Public enquiry form writes to Firestore (emulator) and shows in admin.
  await p2.goto(`${BASE}/contact`, { waitUntil: 'networkidle' })
  await p2.getByPlaceholder('Full name').fill('Form Test')
  await p2.getByPlaceholder('10-digit mobile').fill('9123456780')
  await p2.locator('select').first().selectOption({ index: 2 })
  p2.on('popup', (pp) => pp.close())
  await p2.locator('form button[type=submit]').click()
  await p.goto(`${BASE}/admin/enquiries`, { waitUntil: 'load' })
  const got = await p.waitForSelector('text=Form Test', { timeout: 15000 }).then(() => true, () => false)
  console.log(got ? 'FUNCTION OK: form enquiry reached the admin panel' : 'FUNCTION FAIL: form enquiry not in admin')
  await ctx.close()
}

await browser.close()
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'no page errors')
