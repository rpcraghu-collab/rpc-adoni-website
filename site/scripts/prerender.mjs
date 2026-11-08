// Turns every public page into ready-made HTML after `vite build` (runs on Vercel too).
// Phones on slow data then show the real page from the first byte instead of a white screen,
// and the app attaches to it when its JavaScript arrives (see src/main.tsx).
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = path.resolve('dist')
const shell = readFileSync(path.join(dist, 'index.html'), 'utf8')

// Plain app shell for /admin and unknown addresses (vercel.json rewrites to it).
writeFileSync(path.join(dist, 'app.html'), shell)

const ssr = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href)

// Bake in the admin's latest saved content, so the HTML matches what visitors should see.
let json = '{}'
try {
  const url = `https://firestore.googleapis.com/v1/projects/${ssr.firebaseConfig.projectId}/databases/(default)/documents/content/site?key=${ssr.firebaseConfig.apiKey}`
  const r = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (r.ok) {
    const doc = await r.json()
    const s = doc?.fields?.json?.stringValue
    if (typeof s === 'string') { JSON.parse(s); json = s }
  }
} catch (e) {
  console.warn('prerender: live content not fetched, using defaults:', e.message)
}
ssr.applyOverrides(JSON.parse(json))

// Tags the pages render for the <head> (Seo component). React may emit them in the body.
const HEAD_TAG = /<title>[\s\S]*?<\/title>|<meta (?:name="description"|property="og:[^"]*"|name="twitter:[^"]*")[^>]*\/?>|<link rel="canonical"[^>]*\/?>/g

let count = 0
for (const route of ssr.routes()) {
  let body = ssr.render(route)
  const head = []
  body = body.replace(HEAD_TAG, (m) => { head.push(m); return '' })
  if (!head.some((t) => t.startsWith('<title>'))) throw new Error(`prerender: ${route} has no <title>`)

  let html = shell
    .replace(/<title>[\s\S]*?<\/title>\s*/, '')
    .replace(/<meta name="description"[^>]*>\s*/, '')
    .replace('</head>', `    ${head.join('\n    ')}\n  </head>`)
    .replace(
      '<div id="root"></div>',
      `<div id="root" data-path="${route}">${body}</div>\n    <script type="application/json" id="rpc-content">${json.replace(/</g, '\\u003c')}</script>`,
    )

  const out = route === '/' ? path.join(dist, 'index.html') : route === '/404' ? path.join(dist, '404.html') : path.join(dist, route.slice(1), 'index.html')
  mkdirSync(path.dirname(out), { recursive: true })
  writeFileSync(out, html)
  count++
}

rmSync(path.resolve('dist-ssr'), { recursive: true, force: true })
console.log(`prerender: ${count} pages written`)
