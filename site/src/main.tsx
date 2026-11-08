import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { applyOverrides } from './lib/content'
import { setBooting } from './lib/boot'
import './index.css'

const root = document.getElementById('root')!

// Content baked into the page at build time, so the app's first draw matches the HTML exactly.
const baked = document.getElementById('rpc-content')?.textContent
if (baked) {
  try { applyOverrides(JSON.parse(baked)) } catch { /* ignore */ }
}

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Pages arrive as ready-made HTML (see scripts/prerender.mjs). When the HTML is for this exact
// address, React attaches to it without redrawing; otherwise (filters in the URL, admin) it draws fresh.
const here = location.pathname.replace(/\/+$/, '') || '/'
const pre = root.dataset.path
setBooting(Boolean(pre))
if (pre === here && !location.search) hydrateRoot(root, app)
else createRoot(root).render(app)
