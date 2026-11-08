import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { GROUPS, listed, waLink, type CourseGroup } from '../../content/site'
import { ART_SIZE, TINT, artSet } from '../course'
import { MaskLines, WhatsAppIcon, useReduce } from '../ui'
import { cn } from '../../lib/cn'

type Card = {
  id: string
  label: string
  text: string
  codes: string[]
  art: string
  to: string
  cta: string
  /** Card skin: light surface, navy, or the red accent. */
  skin: 'light' | 'navy' | 'red'
  /** Art panel colour (light cards use their group tint). */
  panel?: string
}

const SKIN: Record<Card['skin'], { card: string; panel: string; chip: string; num: string; btn: string; btnDot: string }> = {
  light: { card: 'bg-surface text-ink ring-line', panel: 'bg-[#e4ebf8] dark:bg-[#1b2b55]', chip: 'bg-surface-2 text-ink ring-line', num: 'text-ink/[0.07] dark:text-white/[0.07]', btn: 'bg-ink text-surface', btnDot: 'bg-surface text-ink' },
  navy: { card: 'dark bg-[#0b1e4a] text-white ring-white/10', panel: 'bg-white/[0.06]', chip: 'bg-white/[0.08] text-white ring-white/12', num: 'text-white/[0.08]', btn: 'bg-white text-[#0b1e4a]', btnDot: 'bg-[#0b1e4a] text-white' },
  red: { card: 'dark bg-[#b81c17] text-white ring-white/10', panel: 'bg-black/[0.12]', chip: 'bg-white/[0.12] text-white ring-white/15', num: 'text-white/[0.12]', btn: 'bg-white text-[#9e1712]', btnDot: 'bg-[#9e1712] text-white' },
}
const SKINS: Card['skin'][] = ['light', 'navy', 'light']

function cards(): Card[] {
  const all = listed()
  const codes = (g: CourseGroup) => all.filter((c) => c.group === g).map((c) => c.code)
  const groups: Card[] = GROUPS.filter((g) => codes(g.id).length).map((g, i) => ({
    id: g.id, label: g.label, text: g.blurb, codes: codes(g.id), art: g.art,
    to: `/courses?group=${g.id}`, cta: `See ${g.label.toLowerCase()} courses`, skin: SKINS[i % SKINS.length],
    panel: SKINS[i % SKINS.length] === 'light' ? TINT[g.id] : undefined,
  }))
  return [
    ...groups,
    {
      id: 'choose', label: 'Not sure which one?', skin: 'red', art: '/img/art/career.webp', to: '#find', cta: 'Find my course',
      text: 'School student above 11, Inter, Degree or B.Tech, working or at home: tell us where you are and we suggest the course and the batch.',
      codes: [],
    },
  ]
}

/** Each earlier card shrinks a little and darkens as the next one lands on it. */
function StackCard({ c, i, n, progress, still }: { c: Card; i: number; n: number; progress: MotionValue<number>; still: boolean }) {
  const depth = n - 1 - i
  // Progress through this card's share of the stack, 0 → 1. Reduced motion keeps it at 0 (the markup never changes, so hydration matches).
  const t = useTransform(progress, (p) => (still ? 0 : Math.min(1, Math.max(0, (p - i / n) / (1 - i / n)))))
  const scale = useTransform(t, (v) => 1 - v * depth * 0.02)
  const shade = useTransform(t, (v) => v * depth * 0.1)
  const s = SKIN[c.skin]
  const [w, h] = ART_SIZE[c.art] ?? [800, 700]
  const isHash = c.to.startsWith('#')
  const cta = (
    <>
      {c.cta}
      <span className={cn('-mr-3 grid size-8 place-items-center rounded-full transition-transform duration-300 group-hover/cta:translate-x-0.5', s.btnDot)}><ArrowRight className="size-4" aria-hidden /></span>
    </>
  )
  const ctaCls = cn('btn group/cta', s.btn)
  return (
    <li
      className="motion-safe:sticky"
      style={{ top: `calc(5.25rem + ${i * 24}px)`, zIndex: i + 1 }}
    >
      <motion.article
        style={{ scale }}
        className={cn('relative origin-top overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-30px_rgba(6,24,64,0.45)] ring-1', s.card)}
        aria-labelledby={`stack-${c.id}`}
      >
        <div className="grid min-h-[27rem] md:min-h-[26rem] md:grid-cols-[1.15fr_1fr]">
          <div className="relative flex flex-col p-6 sm:p-9 lg:p-12">
            <span aria-hidden className={cn('pointer-events-none absolute -top-4 right-4 font-display text-[7rem] font-extrabold leading-none tracking-[-0.04em] sm:text-[10rem] md:left-auto md:right-6 lg:text-[12rem]', s.num)}>{String(i + 1).padStart(2, '0')}</span>
            <p className="font-display text-sm font-bold tabular-nums opacity-70">{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</p>
            <h3 id={`stack-${c.id}`} className="mt-3 text-[clamp(1.9rem,4.4vw,3.4rem)] font-extrabold leading-[1] tracking-[-0.02em]">{c.label}</h3>
            <p className="mt-4 max-w-md text-[1rem] leading-relaxed opacity-80 sm:text-[1.08rem]">{c.text}</p>
            {c.codes.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${c.label} courses`}>
                {c.codes.map((code) => <li key={code} className={cn('rounded-full px-3.5 py-1.5 text-[0.82rem] font-bold ring-1', s.chip)}>{code}</li>)}
              </ul>
            )}
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
              {isHash ? <a href={c.to} className={ctaCls}>{cta}</a> : <Link to={c.to} className={ctaCls}>{cta}</Link>}
              {isHash && (
                <a href={waLink('Hello RPC, please help me choose a course.')} target="_blank" rel="noopener" className="btn border border-white/30 text-white hover:bg-white/10">
                  <WhatsAppIcon /> Ask on WhatsApp
                </a>
              )}
            </div>
          </div>
          <div className={cn('relative order-first grid h-40 place-items-center overflow-hidden sm:h-52 md:order-none md:h-auto', c.panel ?? s.panel)}>
            <img
              src={c.art} srcSet={artSet(c.art)} sizes="(min-width: 768px) 36vw, 60vw" width={w} height={h}
              alt="" loading="lazy" decoding="async"
              className="h-full w-auto object-contain py-3 drop-shadow-[0_24px_30px_rgba(0,0,0,0.25)] md:h-auto md:w-[78%] md:max-w-[26rem] md:py-0"
            />
          </div>
        </div>
        <motion.span aria-hidden style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-[#02081a]" />
      </motion.article>
    </li>
  )
}

/**
 * "Three ways to learn": course groups as cards that stick and pile up while you scroll.
 * Reduced motion: plain cards in a column, nothing pinned or scaled.
 */
export default function StackCards() {
  const list = useRef<HTMLOListElement>(null)
  const reduce = useReduce()
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 84px', 'end end'] })
  const items = cards()
  return (
    <section className="container-x py-16 lg:py-24" aria-labelledby="stack-h">
      <div className="max-w-3xl">
        <p className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />Ways to learn</p>
        <MaskLines
          id="stack-h"
          className="mt-3 text-[clamp(2rem,5vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.02em]"
          lines={[<>Three ways to learn.</>, <span className="text-muted">One institute since 2000.</span>]}
        />
      </div>
      <ol ref={list} className="mt-10 flex flex-col gap-[14vh] pb-[6vh] lg:mt-14 motion-reduce:gap-5 motion-reduce:pb-0">
        {items.map((c, i) => <StackCard key={c.id} c={c} i={i} n={items.length} progress={scrollYProgress} still={!!reduce} />)}
      </ol>
    </section>
  )
}
