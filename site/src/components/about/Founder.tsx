import { HeartHandshake } from 'lucide-react'
import { AWARDS, SITE } from '../../content/site'
import { Reveal, Tilt } from '../ui'

/** Founder and Deputy Director (each name on one line, RPC 13 Nov 2026), a real award photo and the RPC promise. */
export default function Founder() {
  const a = AWARDS[3]
  return (
    <section className="container-x py-20 lg:py-32" aria-labelledby="founder-h">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-20">
        <Reveal className="relative">
          <div aria-hidden className="absolute -inset-x-4 -bottom-6 top-12 -z-0 rounded-[2.4rem] bg-[#fbf0d9] sm:-inset-x-6 dark:bg-[#2a2112]" />
          <Tilt max={4} className="relative rounded-[2rem]">
            <div className="rounded-[2rem] bg-surface p-1.5 ring-1 ring-line">
              <figure className="overflow-hidden rounded-[calc(2rem-0.375rem)] bg-surface-2">
                <img
                  src={`/img/${a?.img ?? 'award-4'}-sm.webp`}
                  srcSet={`/img/${a?.img ?? 'award-4'}-sm.webp 640w, /img/${a?.img ?? 'award-4'}.webp 1024w`}
                  sizes="(min-width:1024px) 44vw, 92vw"
                  width={1024}
                  height={752}
                  loading="lazy"
                  decoding="async"
                  alt={`${SITE.founder} receiving an Education Excellence Award${a ? ` from ${a.from}` : ''}`}
                  className="aspect-[4/3] w-full object-cover"
                />
                {a && (
                  <figcaption className="flex items-baseline justify-between gap-4 px-4 py-3.5 text-sm sm:px-5">
                    <span className="font-semibold text-ink-soft">Receiving the award from {a.from}</span>
                  </figcaption>
                )}
              </figure>
            </div>
          </Tilt>
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />Our founder</p>
            <h2 id="founder-h" className="mt-4 whitespace-nowrap font-display text-[clamp(1.75rem,7.4vw,3.4rem)] font-extrabold leading-[1] tracking-[-0.035em] text-ink lg:text-[clamp(2rem,3.6vw,3.4rem)]">
              {SITE.founder}
            </h2>
            <p className="mt-6 max-w-xl text-pretty text-[1.08rem] leading-relaxed text-ink-soft">
              He founded RPC in {SITE.since} and built it around practical, hands-on learning: every concept shown on the projector, then practised on the computer.
            </p>
          </Reveal>

          <Reveal delay={0.05} className="mt-10 border-t border-line pt-8">
            <p className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />Our Deputy Director</p>
            <h3 className="mt-4 whitespace-nowrap font-display text-[clamp(1.75rem,7.4vw,3.4rem)] font-extrabold leading-[1] tracking-[-0.035em] text-ink lg:text-[clamp(2rem,3.6vw,3.4rem)]">{SITE.deputy}</h3>
            <p className="mt-4 max-w-xl text-pretty text-[1.08rem] leading-relaxed text-ink-soft">Appointed Deputy Director of RPC on 2nd November 2025.</p>
          </Reveal>

          <Reveal delay={0.08} className="mt-10 border-l-[3px] border-accent pl-5 sm:pl-7">
            <p className="font-display text-[clamp(1.9rem,5vw,2.9rem)] font-bold leading-[1.02] tracking-[-0.025em] text-ink">
              <span className="block">Your Career…</span> <span className="block text-accent-text">Our Commitment…</span>
            </p>
            <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em] text-muted">The RPC promise</p>
          </Reveal>

          <Reveal delay={0.14} className="mt-10">
            <div className="flex gap-4 rounded-[1.5rem] bg-surface p-5 ring-1 ring-line sm:p-6">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent-text"><HeartHandshake className="size-6" aria-hidden /></span>
              <div>
                <p className="font-display text-lg font-bold text-ink">Education for every family</p>
                <p className="mt-1 leading-relaxed text-ink-soft">RPC also supports computer education for tribal and poor students in and around Adoni.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
