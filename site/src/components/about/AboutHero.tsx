import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, BadgeCheck } from 'lucide-react'
import { AWARDS, SITE, waLink } from '../../content/site'
import { Magnetic, WhatsAppIcon, useReduce } from '../ui'
import { enter } from '../../lib/boot'
import AwardSeal from './AwardSeal'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * About hero: the headline, then a huge "2000" with a real award photo sliding over it.
 * Phones get headline → photo → text, so the first screen is never text only.
 */
export default function AboutHero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReduce()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const numY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const picY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%'])
  const a = AWARDS[0]
  const up = (d: number) => ({ initial: enter({ opacity: 0, y: 26 }), animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay: d, ease: EASE } })

  return (
    <section ref={ref} className="relative overflow-hidden" aria-labelledby="about-h">
      <div aria-hidden className="grain absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <div aria-hidden className="absolute -left-40 top-10 size-[34rem] rounded-full bg-accent/[0.07] blur-3xl dark:bg-accent/[0.12]" />

      <div className="container-x relative grid gap-x-14 pb-16 pt-8 sm:pt-12 lg:grid-cols-[1fr_1.02fr] lg:grid-rows-[auto_1fr] lg:pb-32 lg:pt-16">
        {/* Headline */}
        <motion.div {...up(0)} className="lg:self-end">
          <p className="inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-accent-text ring-1 ring-line">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />About RPC · Adoni
          </p>
          <h1 id="about-h" className="mt-5 text-balance font-display text-[clamp(2.7rem,10.6vw,5.6rem)] font-extrabold leading-[0.94] tracking-[-0.035em] text-ink">
            Teaching Adoni <span className="text-accent-text">computers</span> since {SITE.since}.
          </h1>
        </motion.div>

        {/* The year and the photo */}
        <div className="relative mt-12 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:self-center">
          <motion.p
            aria-hidden
            style={reduce ? undefined : { y: numY }}
            initial={enter({ opacity: 0, x: -30 })}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.1, ease: EASE }}
            className="pointer-events-none relative z-0 select-none whitespace-nowrap font-display text-[clamp(7.2rem,37vw,15.5rem)] font-extrabold leading-[0.74] tracking-[-0.07em] text-transparent [-webkit-text-stroke:1.5px_var(--ink)] [text-stroke:1.5px_var(--ink)] lg:-ml-2"
          >
            <span className="absolute -top-[0.5em] left-[0.04em] font-sans text-[0.11em] font-bold uppercase tracking-[0.3em] text-accent-text [-webkit-text-stroke:0]">Since</span>
            {SITE.since}
          </motion.p>

          <motion.div
            style={reduce ? undefined : { y: picY }}
            initial={enter({ opacity: 0, y: 40, scale: 0.97 })}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
            className="relative z-10 -mt-[11%] ml-[8%] lg:-mt-[13%] lg:ml-[14%]"
          >
            <div className="rounded-[2rem] bg-ink/[0.04] p-1.5 ring-1 ring-line dark:bg-white/[0.04]">
              <figure className="relative overflow-hidden rounded-[calc(2rem-0.375rem)] bg-surface-2 shadow-[0_40px_80px_-40px_rgb(11_30_74/0.55)]">
                <img
                  src={`/img/${a?.img ?? 'award-1'}-sm.webp`}
                  srcSet={`/img/${a?.img ?? 'award-1'}-sm.webp 640w, /img/${a?.img ?? 'award-1'}.webp 1280w`}
                  sizes="(min-width:1024px) 40vw, 86vw"
                  width={1280}
                  height={854}
                  fetchPriority="high"
                  decoding="async"
                  alt={`${SITE.founder} receiving the Education Excellence Award for RPC${a ? ` from ${a.from}` : ''}`}
                  className="aspect-[4/3] w-full object-cover"
                />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#06102a]/90 to-transparent" />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[0.72rem] font-bold text-[#0b1e4a] shadow-sm backdrop-blur sm:left-4 sm:top-4 sm:text-xs">
                  <BadgeCheck className="size-3.5 text-[#b81b15]" aria-hidden />ISO 9001:2015 certified
                </span>
                {a && (
                  <figcaption className="absolute inset-x-0 bottom-0 p-4 pr-28 text-white sm:p-5 sm:pr-36">
                    <span className="block text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white/75">Education Excellence Award</span>
                    <span className="mt-1 block font-display text-[1.05rem] font-bold leading-tight sm:text-xl">Presented by {a.from}</span>
                  </figcaption>
                )}
              </figure>
            </div>
            <AwardSeal className="absolute -bottom-10 right-3 size-[6.4rem] sm:right-6 sm:size-[7.6rem] lg:-bottom-12 lg:-right-4 lg:size-[8.5rem]" />
          </motion.div>
        </div>

        {/* Story line and actions */}
        <motion.div {...up(0.15)} className="mt-16 lg:mt-7 lg:self-start">
          <p className="max-w-[34rem] text-pretty text-[1.08rem] leading-relaxed text-ink-soft sm:text-lg">
            25 years of quality computer education in Adoni, basic to advanced, coding and non-coding, for children, students, homemakers and business people.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href={waLink('Hello RPC, I want to know more about your institute and courses.')} target="_blank" rel="noopener" className="btn-primary h-14 pl-6 pr-2 text-base">
                <WhatsAppIcon /> Talk to RPC
                <span className="ml-1 grid size-10 place-items-center rounded-full bg-white/15"><ArrowRight className="size-4" aria-hidden /></span>
              </a>
            </Magnetic>
            <Link to="/courses" className="btn-ghost h-14 px-6 text-base">See the courses</Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
