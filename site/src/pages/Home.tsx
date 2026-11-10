import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Clock, Plus } from 'lucide-react'
import { AWARDS, COURSES, FAQS, FINDER, INDIVIDUAL, SITE, listed, waLink, type Course } from '../content/site'
import { LIVE } from '../lib/content'
import { JsonLd, Reveal, SectionHead, Seo, WhatsAppIcon } from '../components/ui'
import { cn } from '../lib/cn'
import { useYears } from '../lib/years'
import CinematicHero from '../components/home/CinematicHero'
import FactBand from '../components/home/FactBand'
import Coverflow from '../components/home/Coverflow'
import CardWall from '../components/home/CardWall'
import GalleryTeaser from '../components/home/GalleryTeaser'
import StackCards from '../components/home/StackCards'
import { CourseCard, CoverFan, CtaBand, FacilityList } from '../components/course'
import { CourseArt } from '../components/CourseArt'

const bySlug = (s: string) => COURSES.find((c) => c.slug === s && !c.hidden)
const ease = [0.22, 1, 0.36, 1] as const


function Batches() {
  const today = new Date().toISOString().slice(0, 10)
  const list = LIVE.batches.filter((b) => b.starts >= today).slice(0, 4)
  if (!list.length) return null
  const fmt = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  return (
    <section className="container-x pb-14" aria-labelledby="batches-h">
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


/** The first thing after the hero: pick who you are, see where to start. Highlighted navy panel (conversion block). */
function FindCourse() {
  const [who, setWho] = useState(FINDER[1].id)
  const pick = FINDER.find((f) => f.id === who)!
  const list = pick.slugs.map(bySlug).filter((c): c is Course => !!c)
  const single = INDIVIDUAL.map(bySlug).filter((c): c is Course => !!c)
  const tiles = list.length + 1 // + the "not sure?" tile
  return (
    <section id="find" className="container-x scroll-mt-24 pb-14 pt-2 lg:pb-20" aria-labelledby="find-h">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#0b1e4a] px-4 py-10 text-white sm:px-8 sm:py-12 lg:rounded-[2.5rem] lg:px-12 lg:py-14 dark:bg-brand">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
        <div className="relative">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <Reveal className="max-w-2xl">
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-[#ff8a83]">Find your course</p>
              <h2 id="find-h" className="mt-3 text-[clamp(1.9rem,4.2vw,3.1rem)] font-bold leading-[1.04] text-white">Tell us who you are. <span className="text-white/60">We'll show where to start.</span></h2>
            </Reveal>
            <Link to="/courses" className="hidden min-h-11 items-center gap-2 font-bold text-white/85 hover:text-white sm:inline-flex">All {listed().length} courses <ArrowRight className="size-4" /></Link>
          </div>
          <div role="tablist" aria-label="I am a" className="mt-8 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {FINDER.map((f) => (
              <button
                key={f.id} role="tab" aria-selected={who === f.id} onClick={() => setWho(f.id)}
                className={cn('relative min-h-[4.25rem] rounded-2xl px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-5', who === f.id ? 'text-[#0b1e4a]' : 'bg-white/[0.08] text-white ring-1 ring-white/15 hover:bg-white/[0.14]')}
              >
                {who === f.id && <motion.span layoutId="finder-pill" className="absolute inset-0 rounded-2xl bg-white" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <span className="relative block font-display text-[0.98rem] font-bold leading-tight sm:text-[1.05rem]">{f.label}</span>
                <span className={cn('relative mt-0.5 block text-[0.78rem] font-semibold leading-snug', who === f.id ? 'text-[#0b1e4a]/70' : 'text-white/65')}>{f.note}</span>
              </button>
            ))}
          </div>
          <div role="tabpanel" aria-live="polite" className="mt-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.ul key={who} className={cn('grid gap-3 sm:grid-cols-2 sm:gap-4', tiles % 4 === 0 ? 'lg:grid-cols-4' : 'lg:grid-cols-3')} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28, ease }}>
                {list.map((c) => <li key={c.slug}><CourseCard c={c} /></li>)}
                <li>
                  <a href={waLink(`Hello RPC, I am a ${pick.label.toLowerCase()}. Which course is right for me?`)} target="_blank" rel="noopener" className="group flex h-full min-h-[11rem] flex-col justify-between gap-6 rounded-[1.4rem] bg-accent p-5 text-white transition-transform duration-300 hover:-translate-y-1 sm:p-6">
                    <span className="font-display text-[1.45rem] font-extrabold leading-[1.05]">Not sure which one? <span className="block text-white/80">Ask us on WhatsApp.</span></span>
                    <span className="flex items-center justify-between gap-3 text-sm font-bold">
                      <span className="inline-flex items-center gap-2"><WhatsAppIcon /> {SITE.phone}</span>
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </a>
                </li>
              </motion.ul>
            </AnimatePresence>
          </div>
          {single.length > 0 && (
            <div className="mt-6 flex flex-col gap-4 rounded-[1.5rem] bg-white/[0.07] p-5 ring-1 ring-white/12 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="lg:max-w-[16rem]">
                <p className="font-display text-xl font-bold text-white">Just one subject?</p>
                <p className="mt-1 text-sm text-white/70">Individual courses, one subject at a time.</p>
              </div>
              <ul className="flex flex-wrap gap-2">
                {single.map((l) => (
                  <li key={l.slug}><Link to={`/courses/${l.slug}`} className="grid min-h-11 min-w-14 place-items-center rounded-xl bg-white px-4 font-display font-bold text-[#0b1e4a] transition-colors hover:bg-[#ffe1de]">{l.code}</Link></li>
                ))}
              </ul>
            </div>
          )}
          <Link to="/courses" className="mt-6 inline-flex min-h-12 items-center gap-2 font-bold text-white hover:text-white/80 sm:hidden">See all {listed().length} courses <ArrowRight className="size-4" /></Link>
        </div>
      </div>
    </section>
  )
}

function Story() {
  const years = useYears()
  const steps = [
    { year: String(SITE.since), text: `Founded in Adoni by ${SITE.founder}.` },
    { year: '2006', text: 'Permission from the Directorate of Employment & Training, AP Govt, and ISO certification.' },
    { year: 'Today', text: 'ISO 9001:2015 certified, MSME registered, five-time Education Excellence Award winner.' },
  ]
  return (
    <section className="border-y border-line bg-surface py-16 lg:py-24" aria-labelledby="story-h">
      <div className="container-x grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
        <Reveal className="relative">
          <figure className="overflow-hidden rounded-[1.8rem] bg-surface-2">
            <img
              src="/img/award-5-sm.webp" srcSet="/img/award-5-sm.webp 640w, /img/award-5.webp 1280w" sizes="(min-width: 1024px) 46vw, 92vw"
              width={1280} height={872} loading="lazy" decoding="async"
              alt={`RPC founder ${SITE.founder} receiving the Education Excellence Award from ${AWARDS[4].from}`}
              className="aspect-[4/3] w-full object-cover object-[70%_40%]"
            />
          </figure>
        </Reveal>
        <div>
          <Reveal>
            <p className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />Our story</p>
            <h2 id="story-h" className="mt-3 text-[clamp(1.9rem,4.2vw,3.1rem)] font-bold leading-[1.04]">{years} years of teaching computers in Adoni.</h2>
            <p className="mt-4 max-w-xl text-[1.05rem] leading-relaxed text-muted">
              RPC teaches computers from the basics to advanced programming, for children, students, homemakers and business people. It also supports education for tribal and poor families around Adoni.
            </p>
          </Reveal>
          <ol className="mt-8 space-y-0">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.year} delay={0.06 * i} className="relative flex gap-5 pb-6 last:pb-0">
                {i < steps.length - 1 && <span aria-hidden className="absolute left-[1.9rem] top-10 h-[calc(100%-2.5rem)] w-px bg-line" />}
                <span className={cn('grid h-10 w-[3.8rem] shrink-0 place-items-center rounded-xl font-display text-sm font-extrabold', i === steps.length - 1 ? 'bg-accent text-white' : 'bg-surface-2 text-ink')}>{s.year}</span>
                <p className="pt-2 text-[0.95rem] leading-relaxed text-ink-soft">{s.text}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center gap-4">
            <ul className="flex -space-x-3">
              {AWARDS.map((a) => (
                <li key={a.n}>
                  <img src={`/img/${a.img}-sm.webp`} alt={`Award from ${a.from}`} width={56} height={56} loading="lazy" decoding="async" className="size-14 rounded-2xl object-cover ring-4 ring-surface" />
                </li>
              ))}
            </ul>
            <Link to="/awards" className="inline-flex min-h-12 items-center gap-2 font-bold text-ink hover:text-accent-text">See all 5 awards <ArrowRight className="size-4" /></Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}


function WhyRpc() {
  return (
    <section className="container-x py-16 lg:py-24" aria-labelledby="why-h">
      <Reveal className="max-w-2xl">
        <p className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />Why RPC</p>
        <h2 id="why-h" className="mt-3 text-[clamp(1.9rem,4.2vw,3.1rem)] font-bold leading-[1.04]">Built for learning by doing.</h2>
      </Reveal>
      <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_1.6fr]">
        <Reveal>
          <div className="relative flex h-full flex-col overflow-hidden rounded-[1.6rem] bg-brand p-6 text-white sm:p-8">
            {/* The art sits in its own row beside the clock, so it can never cover the title or the times. */}
            <div className="flex items-start justify-between gap-4">
              <Clock className="mt-1 size-7 shrink-0 text-white/70" />
              <div aria-hidden className="float pointer-events-none -mr-1 -mt-1 w-28 rotate-[6deg] overflow-hidden rounded-[1.1rem] shadow-[0_20px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/20 sm:w-36"><CourseArt slug="tally" className="aspect-[4/3] w-full" /></div>
            </div>
            <p className="relative mt-4 font-display text-[2rem] font-extrabold leading-[1.02]">Two batches,<br />every day.</p>
            <div className="relative mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {SITE.timings.map((t) => (
                <div key={t.label} className="rounded-2xl bg-white/10 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">{t.label}</p>
                  <p className="mt-1 font-display text-xl font-bold">{t.time}</p>
                </div>
              ))}
            </div>
            <p className="relative mt-5 text-sm text-white/80">Most courses run 1½ hours a day, or finish in half the time at 3 hours a day.</p>
          </div>
        </Reveal>
        <FacilityList />
      </div>
    </section>
  )
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  // Mouse: a question opens when the pointer rests on it for a moment (a quick sweep across the list opens nothing).
  const intent = useRef<number | undefined>(undefined)
  const hoverIn = (i: number) => (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    window.clearTimeout(intent.current)
    intent.current = window.setTimeout(() => setOpen(i), 140)
  }
  const hoverOut = () => window.clearTimeout(intent.current)
  useEffect(() => { return () => window.clearTimeout(intent.current) }, [])
  return (
    <section className="container-x pb-16 lg:pb-24" aria-labelledby="faq-h">
      {/* Phones: heading, questions, then the help card. Desktop: help card under the heading. */}
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-x-16 lg:gap-y-6">
        <SectionHead eyebrow="Questions" title={<span id="faq-h">Before you join.</span>} />
        <ul className="divide-y divide-line border-y border-line lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <li key={f.q} onPointerEnter={hoverIn(i)} onPointerLeave={hoverOut}>
                <h3>
                  <button aria-expanded={isOpen} aria-controls={`faq-${i}`} onClick={() => setOpen(isOpen ? null : i)} className="flex min-h-14 w-full items-center justify-between gap-6 py-4 text-left font-display text-[1.08rem] font-bold text-ink sm:text-xl">
                    {f.q}
                    <span className={cn('grid size-9 shrink-0 place-items-center rounded-full ring-1 ring-line transition-[transform,background-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]', isOpen && 'rotate-45 bg-accent text-white ring-accent')}><Plus className="size-4" /></span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1, transition: { height: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.4, delay: 0.08 } } }}
                      exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.45, ease: [0.4, 0, 0.2, 1] }, opacity: { duration: 0.2 } } }}
                      className="overflow-hidden"
                    >
                      <motion.p initial={{ y: -6 }} animate={{ y: 0 }} exit={{ y: -6 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="max-w-2xl pb-5 leading-relaxed text-ink-soft">{f.a}</motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
        <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
          <Reveal delay={0.1}>
            <div className="rounded-[1.5rem] bg-surface-2 p-6">
              <p className="font-display text-lg font-bold text-ink">Didn't find your answer?</p>
              <p className="mt-1 text-sm text-muted">Ask us directly. We usually reply during class hours.</p>
              <a href={waLink('Hello RPC, I have a question about your courses.')} target="_blank" rel="noopener" className="btn-primary mt-5 w-full"><WhatsAppIcon /> Ask on WhatsApp</a>
            </div>
          </Reveal>
        </div>
      </div>
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
      <Seo title="Computer courses in Adoni since 2000" description="PGDCA, DCA, DCP, CCA, OAM, Tally Prime with GST, Power BI, SQL, C, C++, Java and Python at Real Point Computer Education, Adoni. ISO 9001:2015 certified, AP Govt DET permission." />
      <JsonLd data={jsonLd} />
      <CinematicHero />
      <FactBand />
      <FindCourse />
      <Batches />
      <Coverflow />
      <Story />
      <StackCards />
      <WhyRpc />
      <CardWall />
      <GalleryTeaser />
      <Faq />
      <CtaBand artNode={<CoverFan slugs={['pgdca', 'dcp', 'oracle']} />} />
    </>
  )
}
