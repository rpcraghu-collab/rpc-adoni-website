// Build-time renderer: scripts/prerender.mjs turns every public page into ready-made HTML,
// so phones on slow data see the page at once instead of a white screen while the app loads.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './App'
import { COURSES } from './content/site'

export { applyOverrides } from './lib/content'
export { firebaseConfig } from './lib/firebase-config'

export const routes = () => ['/', '/about', '/courses', ...COURSES.map((c) => `/courses/${c.slug}`), '/awards', '/contact', '/404']

export function render(url: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
}
