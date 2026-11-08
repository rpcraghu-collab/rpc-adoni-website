import { enter } from '../lib/boot'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Award, BadgeCheck, Clock, Phone, Plus } from 'lucide-react'
import { AWARDS, COURSES, FAQS, FINDER, SITE, listed, telLink, waLink, type Course } from '../content/site'
import { LIVE } from '../lib/content'
import { JsonLd, Magnetic, Reveal, SectionHead, Seo, WhatsAppIcon } from '../components/ui'
import { cn } from '../lib/cn'
import { CourseCard, CtaBand, FacilityList, artSet } from '../components/course'

const bySlug = (s: string) => COURSES.find((c) => c.slug === s && !c.hidden)
const ease = [0.22, 1, 0.36, 1] as const


function Hero() {
  const trust = ['ISO 9001:2015 certified', 'AP Govt DET permission', 'MSME registered']
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(42rem_28rem_at_100%_0%,rgb(211_32_26/0.08),transparent_70%),radial-gradient(36rem_30rem_at_0%_60%,rgb(11_30_74/0.06),transparent_70%)]" />
      </div>
      <div className="container-x grid items-center gap-9 pb-14 pt-5 lg:grid-cols-[1.12fr_1fr] lg:gap-14 lg:pb-24 lg:pt-14">
        <div>
          <motion.p initial={enter({ opacity: 0, y: 8 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2.5 rounded-full bg-surface py-1.5 pl-2.5 pr-3.5 text-[0.8rem] font-bold text-ink-soft shadow-[0_1px_2px_rgb(11_30_74/0.08)] ring-1 ring-line">
            <span className="relative flex size-2.5" aria-hidden>
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#14803f] opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2.5 rounded-full bg-[#14803f]" />
            </span>
            Admissions open · Morning & evening batches
          </motion.p>
          <motion.h1 initial={enter({ y: 16 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05, ease }} className="mt-5 text-[clamp(2.35rem,4.6vw,4.1rem)] font-extrabold leading-[0.98] [text-wrap:balance]">
            Computer courses in Adoni that make you <span className="text-accent-text">job-ready.</span>
          </motion.h1>
          <p lang="te" className="mt-3 text-[1.02rem] font-semibold leading-snug text-ink-soft">అడోనిలో 2000 నుండి, ఉద్యోగానికి సిద్ధం చేసే కంప్యూటర్ కోర్సులు</p>
          <motion.p initial={enter({ y: 12 })} animate={{ y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="mt-5 max-w-[34rem] text-[1.06rem] leading-relaxed text-ink-soft">
            PGDCA, DCA, Tally Prime with GST, Java, Python and more. 100% practical classes at Babu Plaza, taught since 2000.
          </motion.p>
          <motion.div initial={enter({ opacity: 0, y: 12 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.22 }} className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Magnetic>
              <a href={waLink()} target="_blank" rel="noopener" className="btn-primary h-14 px-7 text-base">
                <WhatsAppIcon /> Enquire on WhatsApp
              </a>
            </Magnetic>
            <a href={telLink()} className="group inline-flex min-h-12 items-center gap-2.5 font-bold text-ink">
              <span className="grid size-10 place-items-center rounded-full bg-surface ring-1 ring-line transition-colors group-hover:ring-ink/30"><Phone className="size-4" /></span>
              {SITE.phone.replace('+91 ', '')}
            </a>
          </motion.div>
          <motion.ul initial={enter({ opacity: 0 })} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[0.85rem] font-semibold text-ink-soft">
            {trust.map((t) => (
              <li key={t} className="flex items-center gap-1.5"><BadgeCheck className="size-4 text-accent-text" />{t}</li>
            ))}
          </motion.ul>
        </div>

        <motion.div initial={enter({ opacity: 0, y: 24 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease }} className="relative lg:pl-6">
          <figure className="relative overflow-hidden rounded-[2rem] bg-surface-2 shadow-[0_40px_80px_-40px_rgb(11_30_74/0.55)]">
            <img
              src="/img/award-2-sm.webp" srcSet="/img/award-2-sm.webp 640w, /img/award-2-md.webp 800w, /img/award-2.webp 1024w" sizes="(min-width: 1024px) 44vw, 92vw"
              width={1024} height={680} fetchPriority="high" decoding="async"
              alt={`RPC founder ${SITE.founder} receiving the Education Excellence Award`}
              className="aspect-[4/3] w-full object-cover object-[22%_35%] lg:aspect-[5/6]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#060d22]/85 via-[#060d22]/40 to-transparent px-5 pb-5 pt-20 text-white sm:px-6 sm:pb-6">
              <span className="block font-display text-lg font-bold leading-tight sm:text-xl">{SITE.founder}</span>
              <span className="mt-0.5 block text-sm text-white/85">Founder · receiving the Education Excellence Award</span>
            </figcaption>
          </figure>
          <div className="absolute -top-4 right-3 hidden items-center sm:flex gap-3 rounded-2xl bg-surface p-3 pr-4 shadow-[0_20px_40px_-20px_rgb(11_30_74/0.5)] ring-1 ring-line sm:right-5 lg:-left-2 lg:right-auto lg:top-10">
            <span className="grid size-10 place-items-center rounded-xl bg-[#fbf0d9] text-gold-text dark:bg-[#382c14]"><Award className="size-5" /></span>
            <span className="leading-tight">
              <span className="block font-display text-xl font-extrabold text-ink">5× winner</span>
              <span className="block text-xs font-bold text-muted">Education Excellence Award</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Facts() {
  const facts = [
    { big: '25+', small: 'Years teaching computers in Adoni, since 2000' },
    { big: String(listed().length), small: 'Courses, from MS Office to Python' },
    { big: '2', small: 'Batches every day, morning and evening' },
    { big: '5×', small: 'Education Excellence Award' },
  ]
  return (
    <section aria-label="RPC in numbers" className="container-x pb-6">
      <ul className="grid grid-cols-2 overflow-hidden rounded-[1.6rem] bg-surface ring-1 ring-line lg:grid-cols-4">
        {facts.map((f, i) => (
          <li key={f.small} className={cn('p-5 sm:p-7', i % 2 === 1 && 'border-l border-line', i > 1 && 'border-t border-line lg:border-t-0', i === 2 && 'lg:border-l')}>
            <p className="font-display text-[2.2rem] font-extrabold leading-none tracking-tight text-ink sm:text-5xl">{f.big}</p>
            <p className="mt-2 text-[0.85rem] font-semibold leading-snug text-muted sm:text-[0.95rem]">{f.small}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

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


function FindCourse() {
  const [who, setWho] = useState(FINDER[1].id)
  const pick = FINDER.find((f) => f.id === who)!
  const list = pick.slugs.map(bySlug).filter((c): c is Course => !!c)
  const langs = listed().filter((c) => c.group === 'programming')
  return (
    <section className="container-x py-16 lg:py-24" aria-labelledby="find-h">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <Reveal className="max-w-2xl">
          <p className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />Find your course</p>
          <h2 id="find-h" className="mt-3 text-[clamp(1.9rem,4.2vw,3.1rem)] font-bold leading-[1.04]">Tell us who you are. <span className="text-muted">We'll show where to start.</span></h2>
        </Reveal>
        <Link to="/courses" className="hidden items-center gap-2 font-bold text-ink hover:text-accent-text sm:inline-flex">All {listed().length} courses <ArrowRight className="size-4" /></Link>
      </div>
      <div role="tablist" aria-label="I am a" className="mt-8 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {FINDER.map((f) => (
          <button
            key={f.id} role="tab" aria-selected={who === f.id} onClick={() => setWho(f.id)}
            className={cn('relative min-h-12 rounded-full px-3 text-[0.92rem] font-bold leading-tight transition-colors sm:px-5 sm:text-[0.95rem]', who === f.id ? 'text-bg' : 'bg-surface text-ink ring-1 ring-line hover:ring-ink/25')}
          >
            {who === f.id && <motion.span layoutId="finder-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
            <span className="relative">{f.label}</span>
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm font-semibold text-muted">{pick.note}</p>
      <div role="tabpanel" aria-live="polite" className="mt-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul key={who} className={cn('grid gap-4 sm:grid-cols-2', list.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4')} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28, ease }}>
            {list.map((c) => <li key={c.slug}><CourseCard c={c} /></li>)}
          </motion.ul>
        </AnimatePresence>
      </div>
      <Reveal delay={0.05} className="mt-4">
        <div className="flex flex-col gap-4 rounded-[1.5rem] bg-surface-2 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="font-display text-xl font-bold text-ink">Just one language?</p>
            <p className="mt-1 text-sm text-muted">Single-language courses for Degree and B.Tech students.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {langs.map((l) => (
              <Link key={l.slug} to={`/courses/${l.slug}`} className="grid min-h-11 min-w-14 place-items-center rounded-xl bg-surface px-4 font-display font-bold text-ink ring-1 ring-line transition-colors hover:text-accent-text hover:ring-accent">{l.code}</Link>
            ))}
          </div>
        </div>
      </Reveal>
      <Link to="/courses" className="mt-6 inline-flex min-h-12 items-center gap-2 font-bold text-ink hover:text-accent-text sm:hidden">See all {listed().length} courses <ArrowRight className="size-4" /></Link>
    </section>
  )
}

function Story() {
  const steps = [
    { year: '2000', text: `Founded in Adoni by ${SITE.founder}.` },
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
            <h2 id="story-h" className="mt-3 text-[clamp(1.9rem,4.2vw,3.1rem)] font-bold leading-[1.04]">25 years of teaching computers in Adoni.</h2>
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
            <img src="/img/art/career.webp" srcSet={artSet('/img/art/career.webp')} sizes="192px" alt="" width={260} height={228} loading="lazy" decoding="async" className="float pointer-events-none absolute -right-6 -top-4 w-40 opacity-95 drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)] sm:w-48" />
            <Clock className="size-7 text-white/70" />
            <p className="relative mt-8 max-w-[12rem] font-display text-[2rem] font-extrabold leading-[1.02] sm:max-w-none">Two batches,<br />every day.</p>
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
  return (
    <section className="container-x pb-16 lg:pb-24" aria-labelledby="faq-h">
      {/* Phones: heading, questions, then the help card. Desktop: help card under the heading. */}
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-x-16 lg:gap-y-6">
        <SectionHead eyebrow="Questions" title={<span id="faq-h">Before you join.</span>} />
        <ul className="divide-y divide-line border-y border-line lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <li key={f.q}>
                <h3>
                  <button aria-expanded={isOpen} aria-controls={`faq-${i}`} onClick={() => setOpen(isOpen ? null : i)} className="flex min-h-14 w-full items-center justify-between gap-6 py-4 text-left font-display text-[1.08rem] font-bold text-ink sm:text-xl">
                    {f.q}
                    <span className={cn('grid size-9 shrink-0 place-items-center rounded-full ring-1 ring-line transition-[transform,background-color] duration-300', isOpen && 'rotate-45 bg-accent text-white ring-accent')}><Plus className="size-4" /></span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div id={`faq-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden">
                      <p className="max-w-2xl pb-5 leading-relaxed text-ink-soft">{f.a}</p>
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
      <Seo title="Computer courses in Adoni since 2000" description="PGDCA, DCA, DCP, OAM, Tally Prime with GST, C, C++, Java and Python at Real Point Computer Education, Adoni. ISO 9001:2015 certified, AP Govt DET permission." />
      <JsonLd data={jsonLd} />
      <Hero />
      <Facts />
      <Batches />
      <FindCourse />
      <Story />
      <WhyRpc />
      <Faq />
      <CtaBand />
    </>
  )
}
