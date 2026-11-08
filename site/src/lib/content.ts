// Live content from the admin panel (Firestore doc content/site, field `json`).
// The defaults in content/site.ts ship with the build; the admin's saved changes are layered on top.
// Boot: apply the cached copy at once (no flash), then refresh in the background with one small REST call
// (no Firebase SDK on public pages), and re-render if anything changed.
import { COURSES, SITE, type Course } from '../content/site'
import { firebaseConfig } from './firebase-config'

export type Timing = { label: string; time: string }
export type Batch = { id: string; course: string; starts: string; time: string; note?: string }
export type GalleryItem = { id: string; url: string; caption: string }
export type SiteSettings = { phone: string; email: string; address: string; facebook: string; timings: Timing[] }
export type Overrides = {
  site?: Partial<SiteSettings>
  courses?: Course[]
  batches?: Batch[]
  gallery?: GalleryItem[]
  announcement?: string
}

export const DEFAULT_SITE: SiteSettings = structuredClone({ phone: SITE.phone, email: SITE.email, address: SITE.address, facebook: SITE.facebook, timings: SITE.timings })
export const DEFAULT_COURSES: Course[] = structuredClone(COURSES)

/** Extra live content that has no default in the build. */
export const LIVE = { batches: [] as Batch[], gallery: [] as GalleryItem[], announcement: '' }

let current: Overrides = {}
let version = 0
const listeners = new Set<() => void>()
const CACHE_KEY = 'rpc-content-v1'

export const getOverrides = () => current
export const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l) } }
export const getVersion = () => version

const str = (v: unknown, max = 300) => (typeof v === 'string' ? v.slice(0, max) : undefined)

export function phoneToRaw(phone: string) {
  const d = phone.replace(/\D/g, '')
  return d.length === 10 ? `91${d}` : d
}

/** Apply overrides to the shared content objects (mutated in place so every page reads the live values). */
export function applyOverrides(o: Overrides) {
  current = o ?? {}
  const s = current.site ?? {}
  const phone = str(s.phone, 30)?.trim() || DEFAULT_SITE.phone
  Object.assign(SITE, {
    phone,
    phoneRaw: phoneToRaw(phone),
    email: str(s.email, 120)?.trim() || DEFAULT_SITE.email,
    address: str(s.address)?.trim() || DEFAULT_SITE.address,
    facebook: str(s.facebook, 200)?.trim() || DEFAULT_SITE.facebook,
    timings: Array.isArray(s.timings) && s.timings.length ? s.timings.filter((t) => t && t.label && t.time) : DEFAULT_SITE.timings,
  })
  const courses = Array.isArray(current.courses) && current.courses.length ? current.courses : DEFAULT_COURSES
  COURSES.splice(0, COURSES.length, ...structuredClone(courses))
  LIVE.batches = Array.isArray(current.batches) ? current.batches : []
  LIVE.gallery = Array.isArray(current.gallery) ? current.gallery.filter((g) => typeof g?.url === 'string' && g.url.startsWith('https://res.cloudinary.com/')) : []
  LIVE.announcement = str(current.announcement, 200)?.trim() ?? ''
  version++
  listeners.forEach((l) => l())
}

function readCache(): string | null {
  try { return localStorage.getItem(CACHE_KEY) } catch { return null }
}
function writeCache(json: string) {
  try { localStorage.setItem(CACHE_KEY, json) } catch { /* private mode */ }
}

/** Called by the admin panel right after a save, so the change shows at once in this browser. */
export function setLocalContent(o: Overrides) {
  const json = JSON.stringify(o)
  writeCache(json)
  applyOverrides(o)
}

export function initContent() {
  const cached = readCache()
  if (cached) {
    try { applyOverrides(JSON.parse(cached)) } catch { /* bad cache: ignore */ }
  }
  const host = import.meta.env.DEV && import.meta.env.VITE_EMULATOR === '1' ? 'http://127.0.0.1:8085' : 'https://firestore.googleapis.com'
  const url = `${host}/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/content/site?key=${firebaseConfig.apiKey}`
  fetch(url)
    .then((r) => (r.ok ? r.json() : r.status === 404 ? { fields: { json: { stringValue: '{}' } } } : null))
    .then((doc) => {
      const json: string | undefined = doc?.fields?.json?.stringValue
      if (json === undefined || json === (cached ?? '{}')) return
      applyOverrides(JSON.parse(json))
      writeCache(json)
    })
    .catch(() => { /* offline: keep defaults/cache */ })
}
