// The photo gallery (/gallery, the Home teaser and the Awards page lightbox).
// Real photos only: the five award days and RPC's own flyers ship with the site; photos of classes and
// events are added by RPC in /admin → Gallery and appear under "Campus & events".
import { AWARDS, SITE } from './site'
import { LIVE } from '../lib/content'
import { cldUrl } from '../lib/cloudinary'

export type ShotKind = 'awards' | 'campus' | 'flyers'
export type Shot = {
  id: string
  kind: ShotKind
  /** Small copy for grids. */
  thumb: string
  /** Large copy for the lightbox. */
  full: string
  srcSet?: string
  w: number
  h: number
  alt: string
  title: string
  sub?: string
}

export const KINDS: { id: ShotKind | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'awards', label: 'Awards' },
  { id: 'campus', label: 'Campus & events' },
  { id: 'flyers', label: 'Flyers' },
]

const AWARD_SIZE: Record<string, [number, number]> = { 'award-1': [1280, 854], 'award-2': [1024, 680], 'award-3': [640, 444], 'award-4': [1024, 752], 'award-5': [1280, 872] }

/** The five award photos. award-3's large file is smaller than its -sm copy, so the -sm copy is used everywhere. */
export const AWARD_SHOTS: Shot[] = AWARDS.map((a) => {
  const [w, h] = AWARD_SIZE[a.img] ?? [1280, 872]
  const small = `/img/${a.img}-sm.webp`
  const full = a.img === 'award-3' ? small : `/img/${a.img}.webp`
  return {
    id: a.img, kind: 'awards', thumb: small, full, w, h,
    srcSet: a.img === 'award-3' ? undefined : `${small} 640w, ${full} ${w}w`,
    alt: `${SITE.founder} receiving the Education Excellence Award from ${a.from}`,
    title: `Education Excellence Award · ${a.from}`,
    sub: a.role,
  }
})

const FLYERS: Shot[] = [
  { id: 'poster', kind: 'flyers', thumb: '/img/poster.webp', full: '/img/poster.webp', w: 1200, h: 818, alt: 'RPC admissions flyer listing OAM, OAM Advanced, OAM Pro and PGDCA courses', title: 'Admissions flyer', sub: 'Job-oriented computer courses at Babu Plaza, Adoni' },
  { id: 'award-banner', kind: 'flyers', thumb: '/img/award-banner-md.webp', full: '/img/award-banner.webp', srcSet: '/img/award-banner-md.webp 900w, /img/award-banner.webp 1865w', w: 1865, h: 1072, alt: 'RPC flyer: courses offered, five Education Excellence Awards and ISO 9001:2015 certification', title: 'Courses flyer', sub: 'Our courses, awards and ISO 9001:2015 certification' },
]

/** Photos RPC added in the admin panel (read at render time, so new uploads show without a rebuild). */
export const campusShots = (): Shot[] =>
  LIVE.gallery.map((g) => ({
    id: g.id, kind: 'campus', thumb: cldUrl(g.url, 640), full: cldUrl(g.url, 1600),
    srcSet: `${cldUrl(g.url, 480)} 480w, ${cldUrl(g.url, 960)} 960w`,
    w: 4, h: 3,
    alt: g.caption || 'A class or event at RPC Computer Education, Adoni',
    title: g.caption || 'Life at RPC',
  }))

export const allShots = (): Shot[] => [...AWARD_SHOTS, ...campusShots(), ...FLYERS]
