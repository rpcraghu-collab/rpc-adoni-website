// New-build detection. The build writes /version.json (vite.config.ts) and bakes the same id into this code.
// A phone that kept an old copy of the site (cached page, tab left open across a deploy) finds a different id
// there and loads the new build, instead of showing broken or blank pages.

declare const __APP_VERSION__: string
export const APP_VERSION: string = typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : 'dev'

const KEY = 'rpc-version-reload'
let latest: string | null = null

/** Asks the server which build is live. Returns true when it is newer than the running code. */
export async function checkVersion(): Promise<boolean> {
  try {
    const r = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' })
    if (!r.ok) return false
    const v = (await r.json())?.version
    if (typeof v === 'string' && v) latest = v
  } catch { /* offline or dev server: keep running */ }
  return isStale()
}

export const isStale = () => latest !== null && latest !== APP_VERSION

/**
 * Loads the new build with a full page load. At most once per live version, so a cache that keeps
 * serving old files can never cause a reload loop.
 */
export function loadNewBuild(): boolean {
  if (!latest) return false
  try {
    if (sessionStorage.getItem(KEY) === latest) return false
    sessionStorage.setItem(KEY, latest)
  } catch { return false }
  location.reload()
  return true
}
