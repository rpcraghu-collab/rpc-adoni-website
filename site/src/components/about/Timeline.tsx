import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { SITE } from '../../content/site'
import { Reveal, useReduce } from '../ui'
import { cn } from '../../lib/cn'
import { useYears } from '../../lib/years'

// Real milestones only. Entries without a known year show a label, never a made-up date.
const STEPS = [
  { mark: String(SITE.since), year: true, title: 'RPC opens in Adoni', text: `${SITE.founder} starts Real Point Computer Education: quality computer education for everyone in Adoni.` },
  { mark: '2006', year: true, title: 'Government permission', text: 'Permission from the Directorate of Employment & Training, Govt of Andhra Pradesh, and ISO certification.' },
  { mark: 'ISO 9001:2015', year: false, title: 'Certified for quality', text: 'RPC is certified to the ISO 9001:2015 standard and registered as an MSME.' },
  { mark: '5×', year: true, title: 'Five Education Excellence Awards', text: 'Honoured on national stages by V.V.S. Laxman, Abhinav Bindra, Chetan Chauhan and others.' },
  { mark: 'Today', year: true, title: 'Years of teaching', text: 'Coding and non-coding courses, basic to advanced, in two batches every day: morning and evening.' },
]

/** The journey on a navy panel. The red line fills as you scroll through it. */
export default function Timeline() {
  const list = useRef<HTMLOListElement>(null)
  const reduce = useReduce()
  const years = useYears()
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 80%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

  return (
    <section className="container-x py-6 lg:py-10" aria-labelledby="journey-h">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#0b1e4a] px-5 py-14 text-white sm:px-10 lg:rounded-[2.5rem] lg:px-16 lg:py-24 dark:bg-brand">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />

        <div className="relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-[#ff8a83]">Our journey</p>
            <h2 id="journey-h" className="mt-4 text-balance font-display text-[clamp(2.3rem,6.4vw,4.2rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-white">
              {years} years in Adoni, one step at a time.
            </h2>
            <p className="mt-5 max-w-md text-pretty text-[1.05rem] leading-relaxed text-white/75">
              From opening in {SITE.since} to an ISO 9001:2015 certified, government-approved institute with five national awards.
            </p>
          </Reveal>

          <ol ref={list} className="relative">
            <span aria-hidden className="absolute bottom-3 left-[0.6875rem] top-3 w-px bg-white/15" />
            <motion.span aria-hidden style={{ scaleY: reduce ? 1 : fill }} className="absolute bottom-3 left-[0.625rem] top-3 w-[3px] origin-top rounded-full bg-gradient-to-b from-accent to-[#ff8a83]" />
            {STEPS.map((s, i) => {
              const last = i === STEPS.length - 1
              return (
                <Reveal as="li" key={s.title} delay={0.04 * i} className="relative pb-12 pl-12 last:pb-0 sm:pl-16">
                  <span aria-hidden className={cn('absolute left-0 top-[0.55em] grid size-[1.4rem] place-items-center rounded-full ring-4 ring-[#0b1e4a] dark:ring-brand', last ? 'bg-accent' : 'bg-white')}>
                    <span className={cn('size-2 rounded-full', last ? 'bg-white' : 'bg-accent')} />
                  </span>
                  <p className={cn('font-display font-extrabold leading-[0.9] tracking-[-0.04em]', s.year ? 'text-[clamp(3.2rem,13vw,5.6rem)]' : 'text-[clamp(2.1rem,8vw,3.4rem)]', last ? 'text-[#ff8a83]' : 'text-white')}>
                    {s.mark}
                  </p>
                  <h3 className="mt-3 font-display text-[1.3rem] font-bold leading-tight text-white sm:text-2xl">{s.mark === 'Today' ? `${years} years of teaching` : s.title}</h3>
                  <p className="mt-2 max-w-lg text-pretty leading-relaxed text-white/75">{s.text}</p>
                </Reveal>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
