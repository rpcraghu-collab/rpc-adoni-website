import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import {
  ArrowRight, ArrowUpRight, Award, BadgeCheck, BookOpen, Building2, Clock, FileCheck2, GraduationCap, Laptop,
  MonitorCheck, Plus, Projector, Snowflake, Users, Zap,
} from 'lucide-react'
import { AWARDS, COURSES, CREDENTIALS, FACILITIES, FAQS, FINDER, SITE, TOOLS, listed, waLink, type Course } from '../content/site'
import { LIVE } from '../lib/content'
import { JsonLd, Magnetic, Reveal, SectionHead, Seo, Tilt, WhatsAppIcon } from '../components/ui'
import { cn } from '../lib/cn'

const bySlug = (s: string) => COURSES.find((c) => c.slug === s && !c.hidden)
const ease = [0.22, 1, 0.36, 1] as const

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const badgeY = useTransform(scrollYProgress, [0, 1], [0, -40])
  const words = ['Job-ready', 'computer', 'skills,', 'taught', 'in', 'Adoni']

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div aria-hidden className="grain absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
      <div className="container-x relative grid items-center gap-12 pb-16 pt-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-24 lg:pt-14">
        <div>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[0.8rem] font-bold text-ink-soft">
            <BadgeCheck className="size-4 text-accent-text" /> ISO 9001:2015 · AP Govt DET permission
          </motion.p>
          <h1 className="mt-6 text-[clamp(2.6rem,7.4vw,5.4rem)] font-extrabold leading-[0.95]">
            <span className="sr-only">Job-ready computer skills, taught in Adoni since 2000</span>
            <span aria-hidden>
              {words.map((w, i) => (
                <motion.span key={i} className="mr-[0.22em] inline-block" initial={{ opacity: 0, y: '0.5em' }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08 + i * 0.06, ease }}>
                  {w}
                </motion.span>
              ))}
              <motion.span className="relative inline-block whitespace-nowrap text-accent-text" initial={{ opacity: 0, y: '0.5em' }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5, ease }}>
                since 2000.
                <svg viewBox="0 0 300 18" className="absolute -bottom-[0.12em] left-0 h-[0.22em] w-full" preserveAspectRatio="none" aria-hidden>
                  <motion.path d="M3 13 C 70 3, 170 3, 297 9" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 1, ease }} />
                </svg>
              </motion.span>
            </span>
          </h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }} className="mt-7 max-w-[34rem] text-[1.12rem] leading-relaxed text-ink-soft">
            From your first click to PGDCA, Tally Prime with GST, Java and Python. 100% practical classes, morning and evening batches, at Babu Plaza.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.82 }} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href={waLink()} target="_blank" rel="noopener" className="btn-primary h-14 px-7 text-base">
                <WhatsAppIcon /> Enquire on WhatsApp
              </a>
            </Magnetic>
            <Link to="/courses" className="btn-ghost h-14 px-7 text-base">Explore courses <ArrowRight className="size-4" /></Link>
          </motion.div>
          <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {SITE.timings.map((t) => (
              <div key={t.label} className="flex items-center gap-2">
                <Clock className="size-4 text-muted" />
                <dt className="text-muted">{t.label}</dt>
                <dd className="font-bold text-ink">{t.time}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.96, rotate: 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.9, delay: 0.2, ease }} className="relative mx-auto w-full max-w-[36rem]">
          <div className="absolute -inset-3 -z-10 rotate-[-3deg] rounded-[2.2rem] bg-brand" aria-hidden />
          <motion.figure style={{ y: imgY }} className="overflow-hidden rounded-[2rem] border-4 border-surface bg-surface shadow-[0_40px_90px_-40px_rgb(11_30_74/0.6)]">
            <img
              src="/img/award-1-sm.webp"
              srcSet="/img/award-1-sm.webp 640w, /img/award-1.webp 1280w"
              sizes="(min-width: 1024px) 46vw, 92vw"
              width={1280} height={854}
              fetchPriority="high"
              alt="RPC founder Mr. A.G. Raghavendra receiving the Education Excellence Award on stage"
              className="aspect-[4/3.4] w-full object-cover object-[58%_50%]"
            />
            <figcaption className="flex items-center justify-between gap-3 px-5 py-4 text-sm">
              <span className="font-semibold text-ink-soft">Education Excellence Award, received from {AWARDS[0].from}</span>
              <Award className="size-5 shrink-0 text-gold-text" />
            </figcaption>
          </motion.figure>
          <motion.div style={{ y: badgeY }} className="absolute -left-3 top-8 sm:-left-10">
            <div className="rounded-2xl border border-line bg-surface/95 px-4 py-3 shadow-xl backdrop-blur">
              <p className="font-display text-4xl font-extrabold leading-none text-ink">5×</p>
              <p className="mt-1 max-w-[8.5rem] text-xs font-bold leading-snug text-gold-text">Education Excellence Award winners</p>
            </div>
          </motion.div>
          <div className="absolute -right-2 bottom-20 rotate-[4deg] rounded-full bg-accent px-4 py-2 text-sm font-extrabold text-white shadow-lg sm:-right-6">
            25 years of teaching
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ProofStrip() {
  return (
    <section aria-label="Certifications" className="border-y border-line bg-surface">
      <div className="container-x grid grid-cols-2 md:grid-cols-4">
        {CREDENTIALS.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.06} className={cn('px-2 py-6 sm:px-6', i % 2 === 1 && 'border-l border-line', i > 1 && 'border-t border-line md:border-t-0', i === 2 && 'md:border-l')}>
            <p className="font-display text-xl font-bold text-ink sm:text-2xl">{c.title}</p>
            <p className="mt-1 text-sm text-muted">{c.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Batches() {
  const today = new Date().toISOString().slice(0, 10)
  const list = LIVE.batches.filter((b) => b.starts >= today).slice(0, 4)
  if (!list.length) return null
  const fmt = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  return (
    <section className="container-x pb-16" aria-labelledby="batches-h">
      <div className="card flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center">
        <div className="lg:w-56 lg:shrink-0">
          <p className="eyebrow">Admissions open</p>
          <h2 id="batches-h" className="mt-2 text-2xl font-extrabold">New batches</h2>
        </div>
        <ul className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {list.map((b) => {
            const c = COURSES.find((x) => x.code === b.course)
            return (
              <li key={b.id}>
                <Link to={`/contact${c ? `?course=${c.slug}` : ''}`} className="flex h-full items-center gap-4 rounded-2xl bg-surface-2 p-4 transition-colors hover:bg-line/60">
                  <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-ink text-center font-display text-sm font-extrabold leading-tight text-bg">{fmt(b.starts)}</span>
                  <span className="min-w-0">
                    <span className="block font-display text-lg font-bold text-ink">{b.course}</span>
                    <span className="block text-sm text-ink-soft">{b.time}</span>
                    {b.note && <span className="block text-xs font-semibold text-accent-text">{b.note}</span>}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function CourseRow({ c }: { c: Course }) {
  return (
    <Link to={`/courses/${c.slug}`} className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-ink/25 sm:p-5">
      <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-brand font-display text-sm font-extrabold text-white">{c.code.split(' ')[0]}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-lg font-bold leading-tight text-ink">{c.code === c.name ? c.name : `${c.code}: ${c.name}`}</span>
        <span className="mt-1 block text-sm text-muted">{c.duration[0] ?? 'Ask for duration'}{c.duration[1] ? ` · or ${c.duration[1]}` : ''}</span>
      </span>
      <ArrowUpRight className="size-5 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-text" />
    </Link>
  )
}

function Finder() {
  const [who, setWho] = useState(FINDER[1].id)
  const pick = FINDER.find((f) => f.id === who)!
  return (
    <section className="container-x py-20 lg:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHead eyebrow="Find your course" title={<>Tell us who you are. <span className="text-muted">We'll show where to start.</span></>} />
          <Reveal delay={0.1} className="mt-8">
            <div role="tablist" aria-label="I am a" className="flex flex-wrap gap-2">
              {FINDER.map((f) => (
                <button
                  key={f.id} role="tab" aria-selected={who === f.id} onClick={() => setWho(f.id)}
                  className={cn('relative min-h-12 rounded-full px-5 text-[0.95rem] font-bold transition-colors', who === f.id ? 'text-bg' : 'bg-surface text-ink ring-1 ring-line hover:ring-ink/25')}
                >
                  {who === f.id && <motion.span layoutId="finder-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                  <span className="relative">{f.label}</span>
                </button>
              ))}
            </div>
            <p className="mt-5 text-sm text-muted">{pick.note}</p>
          </Reveal>
        </div>
        <div role="tabpanel" aria-live="polite" className="min-h-[22rem]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.ul key={who} className="space-y-3" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease }}>
              {pick.slugs.map(bySlug).filter((c): c is Course => !!c).map((c) => <li key={c.slug}><CourseRow c={c} /></li>)}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function Bento() {
  const pg = bySlug('pgdca')
  const langs = listed().filter((c) => c.group === 'programming')
  return (
    <section className="container-x pb-20 lg:pb-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHead eyebrow="Flagship programs" title="Four courses most students start with." />
        <Reveal><Link to="/courses" className="inline-flex items-center gap-2 font-bold text-ink hover:text-accent-text">All {listed().length} courses <ArrowRight className="size-4" /></Link></Reveal>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-6">
        {pg && <Reveal className="md:col-span-3 md:row-span-3">
          <Tilt className="h-full rounded-[1.6rem]" max={4}>
            <Link to={`/courses/${pg.slug}`} className="flex h-full flex-col rounded-[1.6rem] bg-brand p-7 text-white sm:p-9">
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]">For Degree & B.Tech</span>
                <GraduationCap className="size-8 text-white/70" />
              </div>
              <p className="mt-10 font-display text-[clamp(3rem,7vw,5rem)] font-extrabold leading-none">PGDCA</p>
              <p className="mt-3 max-w-sm text-white/80">{pg.tagline}</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {pg.modules.map((m) => (
                  <div key={m.title} className="rounded-2xl bg-white/[0.07] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/60">{m.title}</p>
                    <ul className="mt-2 space-y-1 text-sm text-white/90">{m.items.slice(0, 5).map((it) => <li key={it}>{it}</li>)}</ul>
                  </div>
                ))}
              </div>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-8 text-sm">
                <span className="text-white/75">{pg.duration.join('  ·  ')}</span>
                <span className="inline-flex items-center gap-1 font-bold">View syllabus <ArrowRight className="size-4" /></span>
              </div>
            </Link>
          </Tilt>
        </Reveal>}
        {(['oam', 'oam-advanced', 'oam-pro'] as const).map((s, i) => {
          const c = bySlug(s)
          if (!c) return null
          return (
            <Reveal key={s} delay={0.08 * (i + 1)} className="md:col-span-3">
              <Tilt className="h-full rounded-[1.6rem]" max={5}>
                <Link to={`/courses/${s}`} className="card group flex h-full flex-col p-6 transition-colors hover:border-ink/25">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-2xl font-extrabold text-ink">{c.code}</p>
                    <ArrowUpRight className="size-5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-text" />
                  </div>
                  <p className="mt-2 text-[0.95rem] text-ink-soft">{c.tagline}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {c.tools.map((t) => <span key={t} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-bold text-ink-soft">{t}</span>)}
                  </div>
                  <p className="mt-auto pt-5 text-sm font-semibold text-muted">{c.duration[0] ?? 'Ask us for the duration'}</p>
                </Link>
              </Tilt>
            </Reveal>
          )
        })}
      </div>
      <Reveal delay={0.1} className="mt-4">
        <div className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-xl font-bold text-ink">Just one language?</p>
            <p className="mt-1 text-sm text-muted">Individual courses for Degree and B.Tech students.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {langs.map((l) => (
              <Link key={l.slug} to={`/courses/${l.slug}`} className="rounded-xl border border-line px-4 py-2.5 font-display font-bold text-ink transition-colors hover:border-accent hover:text-accent-text">{l.code}</Link>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Marquee() {
  const row = [...TOOLS, ...TOOLS]
  return (
    <section aria-label="Tools you will learn" className="overflow-hidden border-y border-line bg-surface py-6">
      <div className="marquee flex w-max gap-10 pr-10">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-[clamp(1.4rem,3vw,2.2rem)] font-bold text-ink/80">
            {t}<span className="size-2 rounded-full bg-accent" aria-hidden />
          </span>
        ))}
      </div>
    </section>
  )
}

const FAC_ICONS = [Snowflake, Projector, Laptop, MonitorCheck, BookOpen, FileCheck2, Users, Zap]

function WhyRpc() {
  return (
    <section className="container-x py-20 lg:py-28">
      <SectionHead eyebrow="Why RPC" title="An institute built for learning by doing." text="Everything here is set up so you spend class time on the computer, not waiting for it." />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal className="sm:col-span-2 lg:row-span-2">
          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.6rem] bg-accent p-7 text-white sm:p-9">
            <Building2 className="size-9 text-white/80" />
            <div className="mt-16">
              <p className="font-display text-[clamp(2.2rem,4.5vw,3.4rem)] font-extrabold leading-[1]">Two batches,<br />every day.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {SITE.timings.map((t) => (
                  <div key={t.label} className="rounded-2xl bg-white/12 px-4 py-3 backdrop-blur">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/75">{t.label}</p>
                    <p className="mt-1 font-display text-xl font-bold">{t.time}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm text-white/85">Most courses run at 1½ hours a day, or finish in half the time at 3 hours a day.</p>
            </div>
          </div>
        </Reveal>
        {FACILITIES.map((f, i) => {
          const Icon = FAC_ICONS[i]
          return (
            <Reveal key={f.title} delay={0.04 * i}>
              <div className="card h-full p-6">
                <Icon className="size-6 text-accent-text" />
                <p className="mt-5 font-display text-lg font-bold leading-tight text-ink">{f.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.text}</p>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

function AwardsTeaser() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['4%', '-18%'])
  return (
    <section ref={ref} className="relative overflow-hidden bg-[#071330] py-20 text-white lg:py-28">
      <div className="container-x flex flex-wrap items-end justify-between gap-6">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-[#f0c766]"><span className="h-px w-6 bg-current" aria-hidden />Awards & recognition</p>
          <h2 className="mt-3 text-[clamp(1.9rem,4.2vw,3.1rem)] font-bold leading-[1.04] text-white">Honoured five times for education excellence.</h2>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-white/70">Received on national stages from sports legends and public leaders.</p>
        </Reveal>
        <Reveal><Link to="/awards" className="inline-flex items-center gap-2 font-bold text-white hover:text-[#f0c766]">See all awards <ArrowRight className="size-4" /></Link></Reveal>
      </div>
      <motion.ul style={{ x }} className="mt-12 flex gap-5 pl-4 sm:pl-[max(1.5rem,calc((100vw-1240px)/2+2rem))]">
        {AWARDS.map((a) => (
          <li key={a.n} className="w-[78vw] shrink-0 sm:w-[26rem]">
            <figure>
              <div className="overflow-hidden rounded-[1.4rem]">
                <img src={`/img/${a.img}-sm.webp`} alt={`RPC receiving an Education Excellence Award from ${a.from}`} loading="lazy" width={640} height={430} className="aspect-[3/2] w-full object-cover transition-transform duration-700 hover:scale-[1.04]" />
              </div>
              <figcaption className="mt-4 flex gap-4">
                <span className="font-display text-3xl font-extrabold text-[#f0c766]">0{a.n}</span>
                <span>
                  <span className="block font-display text-lg font-bold">{a.from}</span>
                  <span className="block text-sm text-white/65">{a.role}</span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </motion.ul>
    </section>
  )
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="container-x py-20 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHead eyebrow="Questions" title="Before you join." />
          <Reveal delay={0.1} className="mt-8">
            <div className="card p-6">
              <p className="font-display text-lg font-bold text-ink">Didn't find your answer?</p>
              <p className="mt-1 text-sm text-muted">Ask us directly. We usually reply during class hours.</p>
              <a href={waLink('Hello RPC, I have a question about your courses.')} target="_blank" rel="noopener" className="btn-primary mt-5 w-full"><WhatsAppIcon /> Ask on WhatsApp</a>
            </div>
          </Reveal>
        </div>
        <ul className="divide-y divide-line border-y border-line">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <li key={f.q}>
                <h3>
                  <button aria-expanded={isOpen} aria-controls={`faq-${i}`} onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-6 py-5 text-left font-display text-lg font-bold text-ink sm:text-xl">
                    {f.q}
                    <span className={cn('grid size-9 shrink-0 place-items-center rounded-full border border-line transition-[transform,background-color] duration-300', isOpen && 'rotate-45 bg-accent text-white')}><Plus className="size-4" /></span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div id={`faq-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden">
                      <p className="max-w-2xl pb-6 leading-relaxed text-ink-soft">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="container-x pb-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-brand px-6 py-14 text-white sm:px-12 lg:py-20">
          <div aria-hidden className="absolute -right-24 -top-24 size-80 rounded-full bg-accent/90 blur-[2px]" />
          <div aria-hidden className="absolute -right-10 -top-10 size-44 rounded-full border-[14px] border-white/10" />
          <div aria-hidden className="pointer-events-none absolute right-[3%] top-1/2 hidden w-[36%] max-w-[26rem] -translate-y-1/2 lg:block">
            <img src="/img/art/career.webp" alt="" width={800} height={702} loading="lazy" decoding="async" className="float w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.35)]" />
          </div>
          <div className="relative max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-white/70">Admissions open</p>
            <h2 className="mt-4 text-[clamp(2.2rem,5.5vw,4rem)] font-extrabold leading-[0.98] text-white">Your career…<br />our commitment.</h2>
            <p className="mt-5 max-w-lg text-lg text-white/80">Visit us at Babu Plaza, or send a message. We will help you pick the course, the batch and the start date.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Magnetic><a href={waLink()} target="_blank" rel="noopener" className="btn h-14 bg-white px-7 text-base text-brand hover:bg-white/90"><WhatsAppIcon className="text-[#14803f]" /> WhatsApp us</a></Magnetic>
              <Link to="/contact" className="btn h-14 border border-white/30 px-7 text-base text-white hover:bg-white/10">Fill the enquiry form</Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: SITE.name,
  alternateName: 'RPC Adoni',
  url: SITE.url,
  foundingDate: '2000',
  founder: { '@type': 'Person', name: 'A.G. Raghavendra' },
  telephone: SITE.phone,
  email: SITE.email,
  address: { '@type': 'PostalAddress', streetAddress: 'Babu Plaza, 2nd Floor', addressLocality: 'Adoni', addressRegion: 'Andhra Pradesh', addressCountry: 'IN' },
  sameAs: [SITE.facebook],
}

export default function Home() {
  return (
    <>
      <Seo title="Computer courses in Adoni since 2000" description="PGDCA, DCA, DCP, OAM, Tally Prime with GST, C, C++, Java and Python at Real Point Computer Education, Adoni. ISO 9001:2015 certified, AP Govt DET permission." />
      <JsonLd data={jsonLd} />
      <Hero />
      <ProofStrip />
      <Batches />
      <Finder />
      <Bento />
      <Marquee />
      <WhyRpc />
      <AwardsTeaser />
      <Faq />
      <FinalCta />
    </>
  )
}
