import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { animate, motion, useMotionValue, type PanInfo } from 'motion/react'
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Pause, Play } from 'lucide-react'
import { listed, type Course } from '../../content/site'
import { groupOf } from '../course'
import { CourseArt } from '../CourseArt'
import { Reveal, useReduce } from '../ui'
import { cn } from '../../lib/cn'

const AUTO_MS = 4800
/** After the visitor drags, clicks or presses a key, autoplay waits this long before moving again. */
const IDLE_MS = 9000

/** Signed distance from the active card, wrapped around the ring (…, -2, -1, 0, 1, 2, …). */
function offsetOf(i: number, active: number, n: number) {
  let d = (i - active + n) % n
  if (d > n / 2) d -= n
  return d
}

/** Position of a card in the 3D ring. Only transform and opacity change, so the browser animates it on the GPU. */
function place(d: number): CSSProperties {
  const a = Math.abs(d)
  const s = Math.sign(d)
  const x = s * (Math.min(a, 1) * 64 + Math.max(a - 1, 0) * 34)
  const z = -Math.min(a, 3) * 150
  const ry = -s * Math.min(a, 1) * 32
  return {
    transform: `translateX(-50%) translateX(${x}%) translateZ(${z}px) rotateY(${ry}deg)`,
    opacity: a > 2.5 ? 0 : a > 1.5 ? 0.6 : 1,
    zIndex: 20 - Math.round(a),
    visibility: a > 3 ? 'hidden' : undefined,
  }
}

function Card({ c, n, total, d, onPick }: { c: Course; n: number; total: number; d: number; onPick: () => void }) {
  const g = groupOf(c.group)
  const front = d === 0
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${n} of ${total}: ${c.code}`}
      aria-hidden={!front || undefined}
      className="absolute left-1/2 top-0 h-full w-[min(19.5rem,76vw)] transition-[transform,opacity] duration-[750ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none [backface-visibility:hidden]"
      style={place(d)}
    >
      <Link
        to={`/courses/${c.slug}`}
        tabIndex={front ? 0 : -1}
        draggable={false}
        onClick={(e) => { if (!front) { e.preventDefault(); onPick() } }}
        className="group relative flex h-full flex-col rounded-[1.9rem] bg-surface p-1.5 shadow-[0_40px_70px_-40px_rgb(11_30_74/0.55)] ring-1 ring-line select-none"
      >
        <span className="relative block h-[44%] overflow-hidden rounded-[calc(1.9rem-0.375rem)]">
          <CourseArt slug={c.slug} className="size-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]" />
          <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-ink">{g.label}</span>
        </span>
        <span className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-4">
          <span className="font-display text-[2.1rem] font-extrabold leading-none tracking-[-0.02em] text-ink">{c.code}</span>
          <span className="mt-1.5 line-clamp-2 text-[0.92rem] font-semibold leading-snug text-ink-soft">{c.code === c.name ? c.forWho : c.name}</span>
          <span className="mt-2 line-clamp-2 text-[0.86rem] leading-snug text-muted">{c.tagline}</span>
          <span className="mt-auto flex items-end justify-between gap-3 pt-3">
            <span className="flex min-w-0 items-start gap-1.5 text-[0.8rem] font-semibold text-ink-soft">
              <Clock className="mt-[0.1rem] size-3.5 shrink-0 text-muted" aria-hidden />
              <span className="truncate">{c.duration[0] ?? 'Duration on enquiry'}</span>
            </span>
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-surface transition-[transform,background-color] duration-300 group-hover:translate-x-0.5 group-hover:bg-accent group-hover:text-white">
              <ArrowRight className="size-4" aria-hidden />
            </span>
          </span>
        </span>
        {/* Dims the cards at the side, so the front card reads as the one in focus. */}
        <span aria-hidden className={cn('pointer-events-none absolute inset-0 rounded-[1.9rem] bg-[#061840] transition-opacity duration-700', front ? 'opacity-0' : 'opacity-[0.16] dark:opacity-30')} />
      </Link>
    </div>
  )
}

/**
 * Every listed course as a 3D carousel: drag or swipe, arrows, dots, or the keyboard's arrow keys.
 * It turns on its own every few seconds, and stops while hovered, focused or after the visitor takes over.
 */
export default function Coverflow() {
  const courses = listed()
  const n = courses.length
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState(false)
  const [focus, setFocus] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [idleUntil, setIdleUntil] = useState(0)
  const [visible, setVisible] = useState(false)
  const reduce = useReduce()
  const root = useRef<HTMLElement>(null)
  const dragX = useMotionValue(0)
  const dragged = useRef(false)

  const go = useCallback((to: number) => setActive(((to % n) + n) % n), [n])
  const takeOver = () => setIdleUntil(Date.now() + IDLE_MS)
  const step = (by: number) => { takeOver(); setActive((a) => (((a + by) % n) + n) % n) }

  // Only turn while the section is on screen and the tab is visible.
  useEffect(() => {
    const el = root.current
    if (!el || typeof IntersectionObserver === 'undefined') { setVisible(true); return }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const paused = reduce || userPaused || hover || focus || !visible
  useEffect(() => {
    if (paused) return
    const wait = Math.max(AUTO_MS, idleUntil - Date.now())
    const t = window.setTimeout(() => { if (!document.hidden) setActive((a) => (a + 1) % n) }, wait)
    return () => clearTimeout(t)
  }, [paused, active, idleUntil, n])

  const onPan = (_: unknown, info: PanInfo) => { dragged.current = true; dragX.set(info.offset.x * 0.35) }
  const onPanEnd = (_: unknown, info: PanInfo) => {
    animate(dragX, 0, { type: 'spring', stiffness: 320, damping: 32 })
    const by = Math.abs(info.velocity.x) > 500 ? -Math.sign(info.velocity.x) : -Math.round(info.offset.x / 110)
    if (by) step(Math.max(-3, Math.min(3, by)))
    window.setTimeout(() => { dragged.current = false }, 0)
  }

  const c = courses[active]
  return (
    <section ref={root} className="relative overflow-hidden py-16 lg:py-24" aria-labelledby="cf-h">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(50%_60%_at_50%_70%,rgb(211_32_26/0.08),transparent_70%)] dark:bg-[radial-gradient(50%_60%_at_50%_70%,rgb(221_47_38/0.14),transparent_70%)]" />
      <div className="container-x">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />{n} courses</p>
            <h2 id="cf-h" className="mt-3 text-[clamp(1.9rem,4.2vw,3.1rem)] font-bold leading-[1.04]">Pick a course. Turn the deck.</h2>
            <p className="mt-3 max-w-xl text-[1.02rem] leading-relaxed text-muted">From a first course at 11 years old to PGDCA and Java. Swipe, drag or use the arrows.</p>
          </div>
          <Link to="/courses" className="inline-flex min-h-12 items-center gap-2 font-bold text-ink hover:text-accent-text">All courses <ArrowRight className="size-4" aria-hidden /></Link>
        </Reveal>
      </div>

      <div
        className="relative mt-10"
        role="region"
        aria-roledescription="carousel"
        aria-label="Courses"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setFocus(true)}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocus(false) }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); step(1) }
          if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1) }
        }}
      >
        <motion.div
          onPan={onPan}
          onPanEnd={onPanEnd}
          onClickCapture={(e) => { if (dragged.current) { e.preventDefault(); e.stopPropagation() } }}
          className="relative mx-auto h-[27rem] max-w-[72rem] cursor-grab touch-pan-y [perspective:1400px] active:cursor-grabbing sm:h-[28.5rem]"
        >
          <motion.div style={{ x: dragX }} className="absolute inset-0 [transform-style:preserve-3d]">
            {courses.map((course, i) => (
              <Card key={course.slug} c={course} n={i + 1} total={n} d={offsetOf(i, active, n)} onPick={() => { takeOver(); go(i) }} />
            ))}
          </motion.div>
        </motion.div>

        <div className="container-x mt-8 flex flex-col items-center gap-4">
          <p className="sr-only" aria-live="polite">{`${c.code}, course ${active + 1} of ${n}`}</p>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => step(-1)} aria-label="Previous course" className="grid size-12 place-items-center rounded-full bg-surface text-ink ring-1 ring-line transition-[transform,background-color] hover:bg-surface-2 active:scale-95"><ChevronLeft className="size-5" /></button>
            <button type="button" onClick={() => setUserPaused((p) => !p)} aria-pressed={userPaused} aria-label={userPaused ? 'Play the course carousel' : 'Pause the course carousel'} className="grid size-12 place-items-center rounded-full bg-surface text-ink ring-1 ring-line hover:bg-surface-2">
              {userPaused || reduce ? <Play className="size-4" /> : <Pause className="size-4" />}
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Next course" className="grid size-12 place-items-center rounded-full bg-ink text-surface transition-[transform,background-color] hover:bg-accent hover:text-white active:scale-95"><ChevronRight className="size-5" /></button>
          </div>
          <ul className="flex max-w-full flex-wrap justify-center" aria-label="Choose a course">
            {courses.map((course, i) => (
              <li key={course.slug}>
                <button type="button" onClick={() => { takeOver(); go(i) }} aria-label={`Show ${course.code}`} aria-current={i === active || undefined} className="group grid size-6 place-items-center">
                  <span className={cn('h-1.5 w-5 rounded-full transition-[transform,background-color] duration-300', i === active ? 'bg-accent' : 'scale-x-[0.3] bg-ink/25 group-hover:bg-ink/50')} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
