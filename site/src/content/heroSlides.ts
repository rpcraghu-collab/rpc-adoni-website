// The Home hero's background slideshow. Add a slide = add one object here.
//
// Each slide is a 16:9 scene with the LEFT ~55% dark and empty (the headline sits there) and the
// subject on the right. Save three copies in public/img/hero/:
//   <name>.webp (1672 px wide), <name>-md.webp (1280 px), <name>-sm.webp (768 px).
//
// Real content only: these four are illustrative 3D scenes, so their captions name the course
// area they stand for. Never caption an illustration as RPC's classroom or students. A real RPC
// photo can be added the same way (same three sizes) with a caption that says what it shows.
// The first slide is the page's main image (LCP): it loads first, the rest load later.

import type { CourseGroup } from './site'

export type HeroSlide = {
  /** Base name in public/img/hero/ (without size suffix or .webp). */
  name: string
  /** What the scene stands for, shown in the hero's bottom bar. */
  caption: string
  /** Short label above the caption. */
  label: string
  /** Where the caption links to. */
  to: string
  /** Alt text. Empty for decorative illustrations (the caption carries the meaning). */
  alt: string
  /** Focus point on phones, where only a slice of the wide scene fits. Default '74% center'. */
  mobilePosition?: string
  /** The headline's last word while this scene shows ("Learn computers for your <word>."). */
  word: string
  /** Course group whose codes show on the scene's 3D card (hidden courses left out). No group = the batch timings. */
  group?: CourseGroup
}

export const HERO_SIZE = { width: 1672, height: 941 }
export const heroSrc = (name: string) => `/img/hero/${name}.webp`
export const heroSet = (name: string) => `/img/hero/${name}-sm.webp 768w, /img/hero/${name}-md.webp 1280w, /img/hero/${name}.webp 1672w`
/** Phones: the stage is taller than wide, so the scene is drawn about 2.3x the screen width. */
export const HERO_SIZES = '(max-width: 1023px) 230vw, 100vw'

export const HERO_SLIDES: HeroSlide[] = [
  { name: 'hero-code', word: 'degree', group: 'programming', label: 'Programming', caption: 'For Degree and B.Tech students', to: '/courses?group=programming', alt: '', mobilePosition: '66% center' },
  { name: 'hero-office', word: 'business', group: 'office', label: 'Office & accounts', caption: 'MS Office, Advanced Excel, Tally Prime with GST', to: '/courses?group=office', alt: '', mobilePosition: '76% center' },
  { name: 'hero-achieve', word: 'job', group: 'diploma', label: 'Certified diplomas', caption: 'From an ISO 9001:2015 certified institute', to: '/courses?group=diploma', alt: '', mobilePosition: '64% center' },
  { name: 'hero-career', word: 'future', label: 'Your next step', caption: 'Morning and evening batches', to: '/contact', alt: '', mobilePosition: '80% center' },
]
