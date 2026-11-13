import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Clock, FileCheck2, Laptop, MapPin, MonitorCheck, Projector, Snowflake, Users, Zap } from 'lucide-react'
import { FACILITIES, GROUPS, SITE, splitTopic, waLink, type Course, type CourseGroup } from '../content/site'
import { Magnetic, Reveal, WhatsAppIcon, useReduce } from './ui'
import { cn } from '../lib/cn'
import { CourseArt } from './CourseArt'

/** Soft tile colour behind each group's 3D illustration. */
export const TINT: Record<CourseGroup, string> = {
  diploma: 'bg-[#fde9e7] dark:bg-[#3a1a25]',
  office: 'bg-[#fbf0d9] dark:bg-[#382c14]',
  programming: 'bg-[#e4ebf8] dark:bg-[#1b2b55]',
}
/** Icons for FACILITIES, in the same order. */
export const FAC_ICONS = [Snowflake, Projector, Laptop, MonitorCheck, BookOpen, FileCheck2, Users, Zap]

/** Intrinsic sizes of the 3D art, so the browser reserves the right space (no layout shift). */
export const ART_SIZE: Record<string, [number, number]> = {
  '/img/art/diplomas.webp': [800, 521], '/img/art/office.webp': [800, 787], '/img/art/programming.webp': [800, 772], '/img/art/career.webp': [800, 702],
}

export const groupOf = (g: CourseGroup) => GROUPS.find((x) => x.id === g)!
const artV = (src: string, s: string) => src.replace(/\.webp$/, `-${s}.webp`)
/** srcSet for a 3D art file (200 / 480 / 800 px copies). */
export const artSet = (src: string) => (src.startsWith('/img/art/') ? `${artV(src, 'sm')} 200w, ${artV(src, 'md')} 480w, ${src} 800w` : undefined)
export const artOf = (g: CourseGroup) => groupOf(g).art

/** Text colour + soft background for each group's label chip. */
const CHIP: Record<CourseGroup, string> = {
  diploma: 'bg-[#fde9e7] text-accent-text dark:bg-[#3a1a25]',
  office: 'bg-[#fbf0d9] text-gold-text dark:bg-[#382c14]',
  programming: 'bg-[#e4ebf8] text-ink dark:bg-[#1b2b55]',
}

/** The main course card (Home finder, Courses page). */
export function CourseCard({ c, bare }: { c: Course; bare?: boolean }) {
  // A one-subject course would just repeat its own name as its tool, so it shows its brief (Core X · Advanced X).
  const line = c.tools.length > 1 ? c.tools.slice(0, 4) : c.modules.flatMap((m) => m.items).map((t) => splitTopic(t).sub || t).slice(0, 3)
  const arrow = (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-ink transition-colors group-hover:bg-accent group-hover:text-white">
      <ArrowRight className="size-4" />
    </span>
  )
  return (
    <Link to={`/courses/${c.slug}`} className="group flex h-full flex-col rounded-[1.4rem] bg-surface p-5 ring-1 ring-line transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgb(11_30_74/0.45)] sm:p-6">
      {bare ? (
        <span className="flex items-start justify-between gap-3">
          <span className="font-display text-[1.8rem] font-extrabold leading-none text-ink">{c.code}</span>
          {arrow}
        </span>
      ) : (
        <>
          <span className="flex items-center justify-between gap-3">
            <span className={cn('rounded-full px-2.5 py-1 text-[0.72rem] font-bold uppercase tracking-[0.08em]', CHIP[c.group])}>{groupOf(c.group).label}</span>
            {arrow}
          </span>
          <span className="mt-4 block font-display text-[1.8rem] font-extrabold leading-none text-ink">{c.code}</span>
        </>
      )}
      <p className="mt-1.5 text-[0.92rem] font-semibold leading-snug text-ink-soft">{c.code === c.name ? c.tagline : c.name}</p>
      {line.length > 0 && <p className="mt-3 text-[0.85rem] leading-snug text-muted">{line.join(' · ')}</p>}
      <span className="mt-auto block pt-5">
        <span className="flex items-start gap-2 border-t border-line pt-4 text-[0.84rem] font-semibold text-ink-soft">
          <Clock className="mt-0.5 size-4 shrink-0 text-muted" />
          <span>{c.duration.length ? c.duration.map((d) => <span key={d} className="block">{d}</span>) : 'Duration shared on enquiry'}</span>
        </span>
      </span>
    </Link>
  )
}

/** Facilities as one list card, two columns from tablet up (Home, About, course pages). */
export function FacilityList({ pick, className }: { pick?: number[]; className?: string }) {
  const items = (pick ?? FACILITIES.map((_, i) => i)).map((i) => ({ f: FACILITIES[i], Icon: FAC_ICONS[i % FAC_ICONS.length] })).filter((x) => x.f)
  return (
    <ul className={cn('grid content-start gap-x-8 rounded-[1.6rem] bg-surface px-5 ring-1 ring-line sm:grid-cols-2 sm:px-7', className)}>
      {items.map(({ f, Icon }, i) => (
        <Reveal as="li" key={f.title} delay={0.03 * i} className={cn('flex gap-4 border-line py-4 sm:py-5', i > 0 && 'border-t', i === 1 && 'sm:border-t-0')}>
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent-text"><Icon className="size-5" /></span>
          <span>
            <span className="block font-display text-[1.02rem] font-bold leading-tight text-ink">{f.title}</span>
            <span className="mt-1 block text-[0.88rem] leading-snug text-muted">{f.text}</span>
          </span>
        </Reveal>
      ))}
    </ul>
  )
}

/** Small card: single-language courses and related courses. */
export function MiniCourseCard({ c, sub }: { c: Course; sub?: ReactNode }) {
  return (
    <Link to={`/courses/${c.slug}`} className="group flex h-full min-h-[7.5rem] flex-col justify-between gap-4 rounded-[1.3rem] bg-surface p-4 ring-1 ring-line transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-28px_rgb(11_30_74/0.45)] sm:p-5">
      <span>
        <span className="block font-display text-[1.45rem] font-extrabold leading-none text-ink">{c.code}</span>
        <span className="mt-1.5 block text-[0.8rem] font-semibold leading-snug text-muted">{sub ?? (c.duration[0] || c.forWho)}</span>
      </span>
      <span className="grid size-9 place-items-center self-end rounded-full bg-surface-2 text-ink transition-colors group-hover:bg-accent group-hover:text-white">
        <ArrowRight className="size-4" />
      </span>
    </Link>
  )
}

/** Three course covers fanned like cards, the first in front. Used where a page would otherwise repeat a picture. */
// Where each card of the deck sits: the front card, then the back-left and back-right cards fanned out
// far enough to be clearly seen; any further cards wait hidden behind the front one.
const FAN = [
  { x: '0%', y: '0%', rotate: 0, scale: 1, opacity: 1, z: 3, dim: 0 },
  { x: '-34%', y: '-10%', rotate: -11, scale: 0.84, opacity: 1, z: 2, dim: 0.28 },
  { x: '34%', y: '-14%', rotate: 11, scale: 0.78, opacity: 1, z: 1, dim: 0.4 },
]
const FAN_HIDDEN = { x: '0%', y: '-6%', rotate: 0, scale: 0.7, opacity: 0, z: 0, dim: 0.5 }

/**
 * Three course covers as a fanned deck. Every few seconds the front card slides to the back and the next one
 * comes forward. Stops off screen, in a hidden tab and for reduced motion.
 */
export function CoverFan({ slugs }: { slugs: string[] }) {
  const list = slugs.filter(Boolean).slice(0, 4)
  const n = list.length
  const reduce = useReduce()
  const [k, setK] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const [onScreen, setOnScreen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') { setOnScreen(true); return }
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    if (reduce || !onScreen || n < 2) return
    const t = window.setInterval(() => { if (!document.hidden) setK((v) => (v + 1) % n) }, 3000)
    return () => window.clearInterval(t)
  }, [reduce, onScreen, n])
  return (
    <div ref={ref} aria-hidden className="relative mx-auto mb-12 mt-10 aspect-[4/3] w-60 sm:w-80 lg:my-6 lg:w-full lg:max-w-[23rem]">
      {list.map((slug, i) => {
        const p = (i - k + n) % n
        const f = FAN[p] ?? FAN_HIDDEN
        return (
          <motion.div
            key={slug}
            className="absolute left-[14%] top-[10%] w-[72%] overflow-hidden rounded-[1.4rem] ring-1 ring-white/20 shadow-[0_26px_46px_rgba(0,0,0,0.4)] will-change-transform"
            style={{ zIndex: f.z }}
            initial={false}
            animate={{ x: f.x, y: f.y, rotate: f.rotate, scale: f.scale, opacity: f.opacity }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
          >
            <CourseArt slug={slug} className="aspect-[4/3] w-full" />
            <motion.span className="pointer-events-none absolute inset-0 bg-[#020b26]" initial={false} animate={{ opacity: f.dim }} transition={{ duration: 0.6 }} />
          </motion.div>
        )
      })}
    </div>
  )
}

/** The navy closing call to action, shared by every page. */
export function CtaBand({ title = <>Your career…<br />our commitment.</>, text = 'Visit us at Babu Plaza, or send a message. We will help you pick the course, the batch and the start date.', art = '/img/art/diplomas.webp', artNode }: { title?: ReactNode; text?: ReactNode; art?: string; artNode?: ReactNode }) {
  return (
    <section className="container-x pb-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-brand px-6 pb-0 pt-12 text-white sm:px-12 lg:py-20">
          <div aria-hidden className="absolute -right-24 -top-24 hidden size-80 rounded-full bg-accent/90 sm:block" />
          <div aria-hidden className="absolute -right-10 -top-10 size-44 rounded-full border-[14px] border-white/10 max-sm:-right-16 max-sm:-top-16" />
          <div className="relative grid items-center gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-white/70">Admissions open</p>
              <h2 className="mt-4 text-[clamp(2.2rem,5.5vw,4rem)] font-extrabold leading-[0.98] text-white">{title}</h2>
              <p className="mt-5 max-w-lg text-lg text-white/80">{text}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic><a href={waLink()} target="_blank" rel="noopener" className="btn h-14 bg-white px-7 text-base text-brand hover:bg-white/90"><WhatsAppIcon className="text-[#14803f]" /> WhatsApp us</a></Magnetic>
                <Link to="/contact" className="btn h-14 border border-white/30 px-7 text-base text-white hover:bg-white/10">Fill the enquiry form</Link>
              </div>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`} target="_blank" rel="noopener" className="mt-6 inline-flex min-h-11 items-start gap-2.5 text-[0.95rem] font-semibold text-white/85 hover:text-white">
                <MapPin className="mt-0.5 size-4 shrink-0" /><span>{SITE.address} · <span className="underline underline-offset-4">Get directions</span></span>
              </a>
            </div>
            {artNode ?? <img src={art} srcSet={artSet(art)} sizes="(min-width:1024px) 384px, (min-width:640px) 320px, 256px" alt="" width={ART_SIZE[art]?.[0] ?? 800} height={ART_SIZE[art]?.[1] ?? 600} loading="lazy" decoding="async" className="float mx-auto w-48 drop-shadow-[0_30px_40px_rgba(0,0,0,0.35)] sm:w-80 lg:w-full lg:max-w-[24rem]" />}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
