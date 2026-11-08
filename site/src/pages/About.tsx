import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Heart, Trophy } from 'lucide-react'
import { AWARDS, CREDENTIALS, SITE } from '../content/site'
import { Reveal, SectionHead, Seo } from '../components/ui'
import PageHero from '../components/PageHero'
import { CtaBand, FacilityList } from '../components/course'
import { cn } from '../lib/cn'

const STORY = [
  { year: '2000', title: 'RPC opens in Adoni', text: `${SITE.founder} starts Real Point Computer Education: quality computer education for everyone in Adoni.` },
  { year: '2006', title: 'Government permission & ISO', text: 'Permission from the Directorate of Employment & Training, Govt of Andhra Pradesh, and ISO certification.' },
  { year: 'Awards', title: 'Five Education Excellence Awards', text: 'Honoured on national stages by V.V.S. Laxman, Abhinav Bindra, Chetan Chauhan and others.' },
  { year: 'Today', title: '25 years of teaching', text: 'ISO 9001:2015 certified and MSME registered. Coding and non-coding courses, basic to advanced.' },
]

export default function About() {
  // Real award photos: Home already shows award-2 (hero) and award-5 (story), so About uses award-1 and award-4.
  const heroAward = AWARDS[0]
  const founderAward = AWARDS[3]
  return (
    <>
      <Seo path="/about" title="About RPC: 25 years of computer education in Adoni" description={`Founded in 2000 by ${SITE.founder}. ISO 9001:2015 certified, AP Govt DET permission since 2006, MSME registered, 5-time Education Excellence Award winners.`} />
      <PageHero
        eyebrow="About RPC"
        title={<>Teaching Adoni <span className="text-accent-text">computers</span> since 2000.</>}
        text="25 years of quality computer education, basic to advanced, coding and non-coding, for children, students, homemakers and business people."
        aside={heroAward && (
          <figure className="overflow-hidden rounded-[2rem] bg-surface ring-1 ring-line">
            <img src={`/img/${heroAward.img}-sm.webp`} srcSet={`/img/${heroAward.img}-sm.webp 640w, /img/${heroAward.img}.webp 1280w`} sizes="(min-width:1024px) 34vw, 1px" width={1280} height={854} decoding="async" alt={`RPC receiving the Education Excellence Award from ${heroAward.from}`} className="aspect-[3/2] w-full object-cover" />
            <figcaption className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-ink-soft"><Trophy className="size-4 shrink-0 text-gold-text" aria-hidden />Education Excellence Award, presented by {heroAward.from}</figcaption>
          </figure>
        )}
      />

      {/* Founder */}
      <section className="container-x pb-16 lg:pb-24" aria-labelledby="founder-h">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
          <Reveal>
            <figure className="overflow-hidden rounded-[1.8rem] bg-surface-2">
              <img src="/img/award-4-sm.webp" srcSet="/img/award-4-sm.webp 640w, /img/award-4.webp 1024w" sizes="(min-width:1024px) 46vw, 92vw" loading="lazy" decoding="async" width={1024} height={752} alt={`${SITE.founder} receiving an Education Excellence Award from ${founderAward?.from ?? 'a guest of honour'}`} className="aspect-[4/3] w-full object-cover" />
              {founderAward && <figcaption className="px-5 py-3.5 text-sm font-semibold text-ink-soft">Receiving the Education Excellence Award from {founderAward.from}.</figcaption>}
            </figure>
          </Reveal>
          <div>
            <Reveal>
              <p className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />Our founder</p>
              <h2 id="founder-h" className="mt-3 text-[clamp(1.9rem,4.2vw,3.1rem)] font-bold leading-[1.04]">{SITE.founder}</h2>
              <p className="mt-4 max-w-xl text-[1.05rem] leading-relaxed text-muted">He founded RPC in {SITE.since} and built it around practical, hands-on learning: every concept shown on the projector, then practised on the computer.</p>
              <dl className="mt-7 grid max-w-xl grid-cols-3 divide-x divide-line rounded-[1.25rem] bg-surface py-4 ring-1 ring-line">
                {[{ k: SITE.since, v: 'Founded RPC' }, { k: '5×', v: 'Excellence awards' }, { k: 'ISO', v: '9001:2015 certified' }].map((f) => (
                  <div key={f.v} className="px-3 text-center sm:px-5">
                    <dt className="sr-only">{f.v}</dt>
                    <dd className="font-display text-[1.6rem] font-extrabold leading-none text-ink sm:text-[1.9rem]">{f.k}</dd>
                    <dd className="mt-1.5 text-[0.8rem] font-semibold leading-snug text-muted sm:text-sm">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={0.08} className="mt-7">
              <div className="flex gap-4 rounded-[1.5rem] bg-surface p-5 ring-1 ring-line sm:p-6">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent-text"><Heart className="size-5" /></span>
                <div>
                  <p className="font-display text-lg font-bold text-ink">Education for every family</p>
                  <p className="mt-1 leading-relaxed text-ink-soft">RPC also supports computer education for tribal and poor students in and around Adoni.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Journey + credentials */}
      <section className="border-y border-line bg-surface py-16 lg:py-24" aria-labelledby="journey-h">
        <div className="container-x grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div>
            <SectionHead eyebrow="Our journey" title={<span id="journey-h">From one institute to five national awards.</span>} />
            <ol className="mt-8">
              {STORY.map((s, i) => (
                <Reveal as="li" key={s.year} delay={0.05 * i} className="relative flex gap-5 pb-7 last:pb-0">
                  {i < STORY.length - 1 && <span aria-hidden className="absolute left-[2.1rem] top-11 h-[calc(100%-2.75rem)] w-px bg-line" />}
                  <span className={cn('grid h-10 w-[4.2rem] shrink-0 place-items-center rounded-xl font-display text-sm font-extrabold', i === STORY.length - 1 ? 'bg-accent text-white' : 'bg-surface-2 text-ink')}>{s.year}</span>
                  <div className="pt-1.5">
                    <p className="font-display text-[1.1rem] font-bold leading-tight text-ink">{s.title}</p>
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">{s.text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center gap-4">
              <ul className="flex -space-x-3">
                {AWARDS.map((a) => (
                  <li key={a.n}><img src={`/img/${a.img}-sm.webp`} alt={`Award from ${a.from}`} width={56} height={56} loading="lazy" decoding="async" className="size-14 rounded-2xl object-cover ring-4 ring-surface" /></li>
                ))}
              </ul>
              <Link to="/awards" className="inline-flex min-h-12 items-center gap-2 font-bold text-ink hover:text-accent-text">See all 5 awards <ArrowRight className="size-4" /></Link>
            </Reveal>
          </div>
          <Reveal className="lg:sticky lg:top-28 lg:mt-24 lg:self-start">
            <div className="rounded-[1.6rem] bg-bg p-5 ring-1 ring-line sm:p-7">
              <p className="font-display text-xl font-bold text-ink">Certified and registered</p>
              <ul className="mt-3 divide-y divide-line">
                {CREDENTIALS.map((c) => (
                  <li key={c.title} className="flex items-center gap-4 py-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent-text"><BadgeCheck className="size-5" /></span>
                    <span>
                      <span className="block font-display text-lg font-bold leading-tight text-ink">{c.title}</span>
                      <span className="text-sm text-muted">{c.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Facilities */}
      <section className="container-x py-16 lg:py-24" aria-labelledby="fac-h">
        <SectionHead eyebrow="Facilities" title={<span id="fac-h">What you get at RPC.</span>} />
        <FacilityList className="mt-10" />
        <Reveal className="mt-8">
          <Link to="/courses" className="inline-flex min-h-12 items-center gap-2 font-bold text-ink hover:text-accent-text">See all courses <ArrowRight className="size-4" /></Link>
        </Reveal>
      </section>

      <CtaBand title={<>Come and see<br />the classrooms.</>} text={`Visit us at ${SITE.addressShort}, or send a message. We will help you pick the course, the batch and the start date.`} art="/img/art/office.webp" />
    </>
  )
}
