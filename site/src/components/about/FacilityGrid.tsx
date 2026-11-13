import { Clock3 } from 'lucide-react'
import { FACILITIES, SITE, waLink } from '../../content/site'
import { FAC_ICONS, ART_SIZE, artSet } from '../course'
import { Reveal } from '../ui'
import { cn } from '../../lib/cn'

// Three soft tints rotate across the tiles so the grid reads as a set, not a list.
const TINTS = [
  'bg-accent/10 text-accent-text',
  'bg-[#e6ebf7] text-[#0b1e4a] dark:bg-white/10 dark:text-white',
  'bg-[#fbf0d9] text-gold-text dark:bg-[#382c14]',
]
const ART = '/img/art/office.webp'

/** Facilities as a bento: a big batch-timings tile, then the eight facilities with their icons. */
export default function FacilityGrid() {
  return (
    <section className="container-x py-20 lg:py-32" aria-labelledby="fac-h">
      <Reveal className="max-w-2xl">
        <p className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />Facilities</p>
        <h2 id="fac-h" className="mt-3 text-balance font-display text-[clamp(2.2rem,6vw,4.2rem)] font-extrabold leading-[0.97] tracking-[-0.035em] text-ink">
          What you get at RPC.
        </h2>
      </Reveal>

      <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-14 lg:grid-cols-4 lg:gap-5">
        <Reveal as="li" className="col-span-2 lg:row-span-2">
          <div className="relative flex h-full flex-col overflow-hidden rounded-[1.6rem] bg-surface p-6 ring-1 ring-line sm:p-8 lg:rounded-[2rem] lg:p-10">
            <div aria-hidden className="absolute -right-16 -top-16 size-56 rounded-full bg-[#fbf0d9] sm:size-72 dark:bg-[#2a2112]" />
            <span className="relative grid size-12 place-items-center rounded-2xl bg-[#0b1e4a] text-white dark:bg-white dark:text-[#0b1e4a]"><Clock3 className="size-6" aria-hidden /></span>
            <p className="relative mt-6 font-display text-[clamp(1.8rem,4.6vw,2.8rem)] font-extrabold leading-[1] tracking-[-0.03em] text-ink">Two batches,<br />every day.</p>
            <dl className="relative mt-6 grid max-w-sm gap-3">
              {SITE.timings.map((t) => (
                <div key={t.label} className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
                  <dt className="whitespace-nowrap text-sm font-semibold text-muted">{t.label}</dt>
                  <dd className="whitespace-nowrap font-display text-lg font-bold tabular-nums text-ink">{t.time}</dd>
                </div>
              ))}
            </dl>
            <p className="relative mt-5 max-w-[17rem] text-[0.95rem] leading-relaxed text-ink-soft sm:max-w-sm">
              Most courses run 1½ hours a day, or 3 hours a day to finish faster.
            </p>
            <a href={waLink('Hello RPC, which batch timings are open now?')} target="_blank" rel="noopener" className="relative mt-6 inline-flex min-h-12 w-fit items-center gap-2 font-bold text-accent-text underline-offset-4 hover:underline">
              Ask which batch is open
            </a>
            <img src={ART} srcSet={artSet(ART)} sizes="(min-width:640px) 176px, 96px" width={ART_SIZE[ART]?.[0] ?? 800} height={ART_SIZE[ART]?.[1] ?? 787} alt="" loading="lazy" decoding="async" className="float pointer-events-none absolute right-3 top-4 w-24 drop-shadow-[0_24px_30px_rgb(11_30_74/0.3)] sm:right-6 sm:top-6 sm:w-40 lg:w-44" />
          </div>
        </Reveal>

        {FACILITIES.map((f, i) => {
          const Icon = FAC_ICONS[i] ?? FAC_ICONS[0]
          return (
            <Reveal as="li" key={f.title} delay={0.03 * (i % 4)}>
              <div className="group flex h-full flex-col rounded-[1.4rem] bg-surface p-4 ring-1 ring-line transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_24px_44px_-30px_rgb(11_30_74/0.5)] motion-reduce:transition-none sm:p-6 lg:rounded-[1.6rem]">
                <div className="flex items-start justify-between">
                  <span className={cn('grid size-11 place-items-center rounded-2xl sm:size-12', TINTS[i % TINTS.length])}><Icon className="size-5 sm:size-6" aria-hidden /></span>
                  <span aria-hidden className="font-display text-sm font-bold tabular-nums text-muted/70">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="mt-5 font-display text-[1.02rem] font-bold leading-tight text-ink sm:mt-8 sm:text-xl">{f.title}</h3>
                <p className="mt-1.5 text-[0.84rem] leading-snug text-ink-soft sm:text-[0.95rem] sm:leading-relaxed">{f.text}</p>
              </div>
            </Reveal>
          )
        })}
      </ul>
    </section>
  )
}
