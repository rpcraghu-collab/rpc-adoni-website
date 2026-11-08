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
  /** Focus point on phones, where only a slice of the wide scene fits. Default '78% center'. */
  mobilePosition?: string
}

export const HERO_SIZE = { width: 1672, height: 941 }
export const heroSrc = (name: string) => `/img/hero/${name}.webp`
export const heroSet = (name: string) => `/img/hero/${name}-sm.webp 768w, /img/hero/${name}-md.webp 1280w, /img/hero/${name}.webp 1672w`
/** Phones: the stage is taller than wide, so the scene is drawn about 2.3x the screen width. */
export const HERO_SIZES = '(max-width: 767px) 230vw, 100vw'

export const HERO_SLIDES: HeroSlide[] = [
  { name: 'hero-code', label: 'Programming', caption: 'C, C++, Java, Python and Oracle', to: '/courses?group=programming', alt: '' },
  { name: 'hero-office', label: 'Office & accounts', caption: 'MS Office, Advanced Excel, Tally Prime with GST', to: '/courses?group=office', alt: '' },
  { name: 'hero-achieve', label: 'Certified courses', caption: 'PGDCA, DCA and DCP diplomas · ISO 9001:2015 institute', to: '/courses?group=diploma', alt: '' },
  { name: 'hero-career', label: 'Your next step', caption: 'Job-oriented computer skills, since 2000', to: '/contact', alt: '' },
]
