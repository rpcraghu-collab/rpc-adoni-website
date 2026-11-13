// Live content from the admin panel (Firestore doc content/site, field `json`).
// The defaults in content/site.ts ship with the build; the admin's saved changes are layered on top.
// Boot: apply the cached copy at once (no flash), then refresh in the background with one small REST call
// (no Firebase SDK on public pages), and re-render if anything changed.
import { COURSES, COURSES_REV, SITE, type Course } from '../content/site'
import { firebaseConfig } from './firebase-config'

export type Timing = { label: string; time: string }
export type Batch = { id: string; course: string; starts: string; time: string; note?: string }
export type GalleryItem = { id: string; url: string; caption: string }
/** A named photo folder (Independence Day, Republic Day, festivals...), shown as its own section. */
export type Album = { id: string; name: string; photos: GalleryItem[] }
export type SiteSettings = { phone: string; email: string; address: string; facebook: string; timings: Timing[] }
export type Overrides = {
  site?: Partial<SiteSettings>
  courses?: Course[]
  /** COURSES_REV the saved course list was made from; an older list is ignored. */
  coursesRev?: number
  batches?: Batch[]
  gallery?: GalleryItem[]
  albums?: Album[]
  announcement?: string
}

// JSON copy, not structuredClone: that is missing on iOS < 15.4 and older Android WebViews, and failing
// here (at load) stopped the whole app from starting. The data is plain JSON.
export const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T

export const DEFAULT_SITE: SiteSettings = clone({ phone: SITE.phone, email: SITE.email, address: SITE.address, facebook: SITE.facebook, timings: SITE.timings })
export const DEFAULT_COURSES: Course[] = clone(COURSES)

/** Extra live content that has no default in the build. */
export const LIVE = { batches: [] as Batch[], gallery: [] as GalleryItem[], albums: [] as Album[], announcement: '' }

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

const SLUG = /^[a-z0-9][a-z0-9-]{0,59}$/
const strList = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [])

function cleanCourse(c: unknown): Course | null {
  if (!c || typeof c !== 'object') return null
  const o = c as Record<string, unknown>
  if (typeof o.slug !== 'string' || !SLUG.test(o.slug) || typeof o.code !== 'string' || !o.code || typeof o.name !== 'string' || !o.name) return null
  const modules = Array.isArray(o.modules)
    ? o.modules.filter((m) => m && typeof m === 'object').map((m) => ({ title: str((m as { title?: unknown }).title), items: strList((m as { items?: unknown }).items) }))
    : []
  return {
    slug: o.slug, code: o.code, name: o.name,
    group: (['diploma', 'office', 'programming'].includes(o.group as string) ? o.group : 'office') as Course['group'],
    tagline: str(o.tagline, 400) ?? '', forWho: str(o.forWho, 600) ?? '',
    duration: strList(o.duration), modules, tools: strList(o.tools),
    featured: o.featured === true || undefined, hidden: o.hidden === true || undefined, fee: str(o.fee, 120),
  }
}

const cleanPhotos = (v: unknown): GalleryItem[] => (Array.isArray(v) ? v : [])
  .filter((g) => typeof g?.url === 'string' && g.url.startsWith('https://res.cloudinary.com/'))
  .map((g) => ({ id: typeof g.id === 'string' ? g.id : g.url, url: g.url, caption: str(g.caption, 300) ?? '' }))

/** The admin's saved course list, or null when there is none or it predates the current defaults (COURSES_REV). */
export function savedCourses(o: Overrides): Course[] | null {
  if (typeof o.coursesRev !== 'number' || o.coursesRev < COURSES_REV || !Array.isArray(o.courses)) return null
  const valid = o.courses.map(cleanCourse).filter((c): c is Course => c !== null)
  return valid.length ? valid : null
}

/** Apply overrides to the shared content objects (mutated in place so every page reads the live values). */
export function applyOverrides(o: Overrides) {
  current = o ?? {}
  const s = current.site ?? {}
  const phone = str(s.phone, 30)?.trim() || DEFAULT_SITE.phone
  Object.assign(SITE, {
    phone,
    phoneRaw: phoneToRaw(phone),
    // The old Gmail saved in the admin settings gives way to the new domain email (RPC, 13 Nov 2026).
    email: (str(s.email, 120)?.trim().toLowerCase() !== 'rpcraghu@gmail.com' && str(s.email, 120)?.trim()) || DEFAULT_SITE.email,
    address: str(s.address)?.trim() || DEFAULT_SITE.address,
    facebook: (str(s.facebook, 200)?.trim().startsWith('https://') && str(s.facebook, 200)?.trim()) || DEFAULT_SITE.facebook,
    timings: Array.isArray(s.timings) && s.timings.length ? s.timings.filter((t) => typeof t?.label === 'string' && typeof t.time === 'string' && t.label && t.time) : DEFAULT_SITE.timings,
  })
  // Only well-formed courses: a broken entry (bad slug, missing name, wrong types) is dropped instead of
  // crashing every page, and a slug can never become a file path outside dist/ in the prerender.
  // A list saved before the default courses last changed (COURSES_REV) is ignored, so RPC's new course sheet
  // is not hidden by an old copy; the admin editor then starts from the new defaults.
  const courses = savedCourses(current) ?? DEFAULT_COURSES
  COURSES.splice(0, COURSES.length, ...clone(courses))
  LIVE.batches = Array.isArray(current.batches) ? current.batches.filter((b) => typeof b?.course === 'string' && typeof b.starts === 'string' && typeof b.time === 'string') : []
  LIVE.gallery = cleanPhotos(current.gallery)
  LIVE.albums = Array.isArray(current.albums)
    ? current.albums.filter((a) => typeof a?.id === 'string' && SLUG.test(a.id) && typeof a.name === 'string' && a.name.trim())
      .map((a) => ({ id: a.id, name: a.name.trim().slice(0, 80), photos: cleanPhotos(a.photos) }))
    : []
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
