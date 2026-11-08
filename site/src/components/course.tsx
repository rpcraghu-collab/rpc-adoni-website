import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Clock, FileCheck2, Laptop, MonitorCheck, Projector, Snowflake, Users, Zap } from 'lucide-react'
import { GROUPS, waLink, type Course, type CourseGroup } from '../content/site'
import { Magnetic, Reveal, WhatsAppIcon } from './ui'
import { cn } from '../lib/cn'

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
export const artOf = (g: CourseGroup) => groupOf(g).art

/** The main course card (Home finder, Courses page). */
export function CourseCard({ c }: { c: Course }) {
  return (
    <Link to={`/courses/${c.slug}`} className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-surface p-5 ring-1 ring-line transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgb(11_30_74/0.45)] sm:p-6">
      <span className={cn('absolute -right-6 -top-6 grid size-32 place-items-center rounded-full', TINT[c.group])} aria-hidden>
        <img src={artOf(c.group)} alt="" width={96} height={96} loading="lazy" decoding="async" className="mt-5 mr-5 size-[4.5rem] object-contain transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110" />
      </span>
      <p className="relative pr-24 font-display text-[1.9rem] font-extrabold leading-none text-ink">{c.code}</p>
      <p className="relative mt-2 pr-20 text-sm font-semibold leading-snug text-ink-soft">{c.code === c.name ? c.tagline : c.name}</p>
      <ul className="mt-5 flex flex-wrap gap-1.5">
        {c.tools.slice(0, 4).map((t) => <li key={t} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-bold text-ink-soft">{t}</li>)}
      </ul>
      <div className="mt-auto flex items-end justify-between gap-3 pt-6">
        <span className="flex items-start gap-1.5 text-[0.8rem] font-semibold text-muted">
          <Clock className="mt-0.5 size-3.5 shrink-0" />
          <span>{c.duration.length ? c.duration.map((d) => <span key={d} className="block">{d}</span>) : 'Duration shared on enquiry'}</span>
        </span>
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-bg transition-colors group-hover:bg-accent group-hover:text-white">
          <ArrowRight className="size-4" />
        </span>
      </div>
    </Link>
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

/** The navy closing call to action, shared by every page. */
export function CtaBand({ title = <>Your career…<br />our commitment.</>, text = 'Visit us at Babu Plaza, or send a message. We will help you pick the course, the batch and the start date.', art = '/img/art/diplomas.webp' }: { title?: ReactNode; text?: ReactNode; art?: string }) {
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
            </div>
            <img src={art} alt="" width={ART_SIZE[art]?.[0] ?? 800} height={ART_SIZE[art]?.[1] ?? 600} loading="lazy" decoding="async" className="float mx-auto w-64 drop-shadow-[0_30px_40px_rgba(0,0,0,0.35)] sm:w-80 lg:w-full lg:max-w-[24rem]" />
          </div>
        </div>
      </Reveal>
    </section>
  )
}
