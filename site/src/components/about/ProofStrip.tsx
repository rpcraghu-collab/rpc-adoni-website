import { BadgeCheck, Trophy } from 'lucide-react'
import { CREDENTIALS } from '../../content/site'
import { Reveal, Tilt } from '../ui'

const ICONS = [BadgeCheck, Trophy]

/** Certificates as solid, stamped tiles. Content comes from CREDENTIALS, so the admin panel can change it. */
export default function ProofStrip() {
  return (
    <section className="container-x pb-20 lg:pb-32" aria-labelledby="proof-h">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />Certified and awarded</p>
          <h2 id="proof-h" className="mt-3 max-w-xl text-balance font-display text-[clamp(1.9rem,4.6vw,3.2rem)] font-extrabold leading-[1] tracking-[-0.03em] text-ink">
            Certified for quality. Honoured for excellence.
          </h2>
        </div>
      </Reveal>

      <ul className="mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:gap-5">
        {CREDENTIALS.map((c, i) => {
          const Icon = ICONS[i] ?? BadgeCheck
          return (
            <Reveal as="li" key={c.title} delay={0.06 * i}>
              <Tilt max={6} className="h-full rounded-[1.6rem]">
                <div className="h-full rounded-[1.6rem] bg-ink/[0.04] p-1.5 ring-1 ring-line dark:bg-white/[0.04]">
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(1.6rem-0.375rem)] bg-surface p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.6),0_18px_36px_-28px_rgb(11_30_74/0.5)] sm:p-6 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]">
                    <span aria-hidden className="absolute -right-6 -top-6 size-24 rounded-full border-[10px] border-accent/[0.06]" />
                    <span className="grid size-12 place-items-center rounded-full border-2 border-dashed border-accent/40 text-accent-text sm:size-14">
                      <Icon className="size-5 sm:size-6" aria-hidden />
                    </span>
                    <p className="mt-6 font-display text-[1.35rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink sm:mt-8 sm:text-[1.75rem]">{c.title}</p>
                    <p className="mt-1.5 text-[0.9rem] font-semibold leading-snug text-muted sm:text-base">{c.text}</p>
                  </div>
                </div>
              </Tilt>
            </Reveal>
          )
        })}
      </ul>
    </section>
  )
}
