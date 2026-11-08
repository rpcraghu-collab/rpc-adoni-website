import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Heart } from 'lucide-react'
import { CREDENTIALS, FACILITIES, SITE } from '../content/site'
import { Reveal, SectionHead, Seo } from '../components/ui'
import PageHero from '../components/PageHero'

const STORY = [
  { year: '2000', title: 'RPC opens in Adoni', text: `${SITE.founder} starts Real Point Computer Education with one goal: quality computer education for everyone in Adoni.` },
  { year: '2006', title: 'Government permission & ISO', text: 'Permission from the Directorate of Employment & Training, Govt of Andhra Pradesh, and ISO certification.' },
  { year: 'Awards', title: 'Five Education Excellence Awards', text: 'Honoured on national stages, from V.V.S. Laxman, Abhinav Bindra, Chetan Chauhan and others.' },
  { year: 'Today', title: '25 years of teaching', text: 'ISO 9001:2015 certified and MSME registered. Coding and non-coding courses, basic to advanced.' },
]

export default function About() {
  return (
    <>
      <Seo path="/about" title="About RPC: 25 years of computer education in Adoni" description={`Founded in 2000 by ${SITE.founder}. ISO 9001:2015 certified, AP Govt DET permission since 2006, MSME registered, 5-time Education Excellence Award winners.`} />
      <PageHero eyebrow="About RPC" title={<>Twenty-five years of <span className="text-accent-text">teaching Adoni</span> to use computers.</>} text="Real Point Computer Education offers quality computer education, basic to advanced, coding and non-coding, for children, students, housewives and business people." />

      <section className="container-x pb-20">
        <ol className="relative grid gap-4 md:grid-cols-4">
          {STORY.map((s, i) => (
            <Reveal key={s.year} delay={i * 0.08}>
              <li className="card h-full p-6">
                <p className="font-display text-3xl font-extrabold text-accent-text">{s.year}</p>
                <p className="mt-4 font-display text-lg font-bold leading-tight text-ink">{s.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="bg-surface py-20 lg:py-28">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow="Our founder" title={SITE.founder} text="He founded RPC in 2000 and built it around practical, hands-on learning: every concept shown on the projector, then practised on the computer." />
            <Reveal delay={0.1} className="mt-8 rounded-2xl border border-line bg-bg p-6">
              <Heart className="size-6 text-accent-text" />
              <p className="mt-3 font-display text-xl font-bold text-ink">Education for every family</p>
              <p className="mt-2 leading-relaxed text-ink-soft">RPC also supports computer education for tribal and poor students in and around Adoni.</p>
            </Reveal>
          </div>
          <Reveal>
            <figure className="overflow-hidden rounded-[2rem] border-4 border-surface shadow-[0_40px_90px_-40px_rgb(11_30_74/0.6)]">
              <img src="/img/award-5-sm.webp" srcSet="/img/award-5-sm.webp 640w, /img/award-5.webp 1280w" sizes="(min-width:1024px) 45vw, 92vw" loading="lazy" width={1280} height={872} alt={`${SITE.founder} receiving an Education Excellence Award`} className="aspect-[4/3] w-full object-cover" />
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-20 lg:py-28">
        <SectionHead eyebrow="Recognised" title="Certified and registered." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CREDENTIALS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <div className="card h-full p-6">
                <BadgeCheck className="size-6 text-accent-text" />
                <p className="mt-4 font-display text-2xl font-bold text-ink">{c.title}</p>
                <p className="mt-1 text-sm text-muted">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <SectionHead className="mt-20" eyebrow="Facilities" title="What you get at RPC." />
        <ul className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {FACILITIES.map((f) => (
            <li key={f.title} className="border-t-2 border-ink pt-4">
              <p className="font-display text-lg font-bold text-ink">{f.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{f.text}</p>
            </li>
          ))}
        </ul>
        <Reveal className="mt-14">
          <Link to="/courses" className="btn-primary h-14 px-7">See all courses <ArrowRight className="size-4" /></Link>
        </Reveal>
      </section>
    </>
  )
}
