import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { ArrowRight, BadgeCheck, Pause, Play } from 'lucide-react'
import { HERO_SIZE, HERO_SIZES, HERO_SLIDES, heroSet, heroSrc } from '../../content/heroSlides'
import { waLink } from '../../content/site'
import { enter } from '../../lib/boot'
import { cn } from '../../lib/cn'
import { Magnetic, WhatsAppIcon, useReduce } from '../ui'

const SLIDE_MS = 6500
const WORD_MS = 2600
const WORDS = ['job', 'degree', 'business', 'future']
const ease = [0.22, 1, 0.36, 1] as const

/** The rotating last word of the headline. Screen readers get the full sentence once (sr-only). */
function RotatingWord({ still }: { still: boolean }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (still) return
    const t = window.setInterval(() => setI((n) => (n + 1) % WORDS.length), WORD_MS)
    return () => window.clearInterval(t)
  }, [still])
  return (
    <span aria-hidden className="relative inline-flex overflow-hidden pb-[0.12em] align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={WORDS[i]}
          initial={{ y: '105%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-105%', opacity: 0 }}
          transition={{ duration: 0.6, ease }}
          className="inline-block text-[#ff7a72]"
        >
          {WORDS[i]}.
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/**
 * Home hero: a full-bleed stage of 3D scenes that cross-fade with a slow Ken Burns zoom, under a
 * navy grade, vignette, film grain and an occasional light sweep. Story-style bars at the bottom
 * show the progress and jump to a scene. It pauses on hover / keyboard focus of the controls, when
 * the tab is hidden, or with the pause button. Reduced motion: one still scene, nothing moves.
 */
export default function CinematicHero() {
  const reduce = useReduce()
  const [active, setActive] = useState(0)
  const [started, setStarted] = useState<number[]>(() => HERO_SLIDES.map((_, i) => (i === 0 ? 0 : -1)))
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0]))
  const [prev, setPrev] = useState<number | null>(null)
  const [hover, setHover] = useState(false)
  const [focus, setFocus] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const paused = reduce || hover || focus || hidden || userPaused
  const n = HERO_SLIDES.length

  // Timer that survives pauses: keeps the time left on the current scene.
  const left = useRef(SLIDE_MS)
  const since = useRef(0)
  const tick = useRef(0)

  const go = useCallback((to: number) => {
    setActive((cur) => {
      if (to === cur) return cur
      tick.current += 1
      const t = tick.current
      setPrev(cur)
      setStarted((s) => s.map((v, i) => (i === to ? t : v)))
      setLoaded((l) => new Set(l).add(to).add((to + 1) % n))
      left.current = SLIDE_MS
      return to
    })
  }, [n])

  useEffect(() => {
    if (paused) return
    since.current = performance.now()
    const t = window.setTimeout(() => go((active + 1) % n), left.current)
    return () => {
      window.clearTimeout(t)
      left.current = Math.max(400, left.current - (performance.now() - since.current))
    }
  }, [paused, active, go, n])

  // The scene that faded out stops moving once it is fully gone.
  useEffect(() => {
    if (prev === null) return
    const t = window.setTimeout(() => setPrev(null), 1500)
    return () => window.clearTimeout(t)
  }, [prev, active])

  // Fetch the second scene once the page has settled, so the first change never shows a gap.
  useEffect(() => {
    const t = window.setTimeout(() => setLoaded((l) => new Set(l).add(1 % n)), 1800)
    const vis = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', vis)
    return () => { window.clearTimeout(t); document.removeEventListener('visibilitychange', vis) }
  }, [n])

  // Pointer parallax on the scene (mouse only): a few pixels of drift and tilt for depth.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 60, damping: 20, mass: 0.6 })
  const sy = useSpring(py, { stiffness: 60, damping: 20, mass: 0.6 })
  const tx = useTransform(sx, (v) => v * -18)
  const ty = useTransform(sy, (v) => v * -12)
  const ry = useTransform(sx, (v) => v * 2.2)
  const rx = useTransform(sy, (v) => v * -1.6)
  const move = (e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const reset = () => { px.set(0); py.set(0) }

  const s = HERO_SLIDES[active]
  const pad = (v: number) => String(v).padStart(2, '0')

  return (
    <section
      aria-labelledby="hero-h"
      onPointerMove={move}
      onPointerLeave={reset}
      className={cn('relative isolate -mt-[calc(4.5rem+env(safe-area-inset-top))] flex min-h-[88svh] flex-col overflow-hidden bg-[#061840] text-white md:min-h-[100svh] md:max-h-[64rem]', paused && 'is-paused')}
    >
      {/* Scenes */}
      <motion.div aria-hidden={HERO_SLIDES.every((x) => !x.alt)} style={{ x: tx, y: ty, rotateX: rx, rotateY: ry, transformPerspective: 1400 }} className="absolute inset-x-[-2%] top-0 -z-10 h-[min(36svh,19rem)] md:inset-y-[-2%] md:h-auto">
        {HERO_SLIDES.map((sl, i) => {
          if (!loaded.has(i)) return null
          const on = i === active
          const moving = !reduce && (on || i === prev)
          return (
            <div key={sl.name} className={cn('absolute inset-0 overflow-hidden transition-opacity duration-[1400ms] ease-[cubic-bezier(0.4,0,0.2,1)]', on ? 'z-[1] opacity-100' : 'opacity-0')}>
              <img
                key={`${sl.name}-${started[i]}`}
                src={heroSrc(sl.name)} srcSet={heroSet(sl.name)} sizes={HERO_SIZES}
                width={HERO_SIZE.width} height={HERO_SIZE.height}
                alt={sl.alt}
                fetchPriority={i === 0 ? 'high' : 'low'}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding={i === 0 ? 'sync' : 'async'}
                style={{ '--mp': sl.mobilePosition ?? '78% center' } as CSSProperties}
                className={cn(
                  'size-full object-cover [object-position:var(--mp)] md:object-[15%_center] origin-[78%_50%] md:origin-[88%_45%]',
                  moving && (started[i] % 2 === 0 ? 'kb-a' : 'kb-b'),
                  !moving && 'scale-[1.06]',
                )}
              />
            </div>
          )
        })}
      </motion.div>

      {/* Grade: phones fade the scene into navy under the text; desktop darkens the left half. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 [background:linear-gradient(180deg,rgb(6_24_64/0.6)_0%,rgb(6_24_64/0)_9rem,rgb(6_24_64/0)_calc(min(36svh,19rem)_-_11rem),rgb(6_24_64/0.92)_calc(min(36svh,19rem)_-_3.5rem),#061840_min(36svh,19rem))] md:bg-[linear-gradient(90deg,rgb(5_18_50/0.92)_0%,rgb(5_18_50/0.78)_30%,rgb(5_18_50/0.25)_55%,rgb(5_18_50/0)_70%)]" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(180deg,rgb(5_18_50/0.55)_0%,transparent_18%,transparent_62%,rgb(5_18_50/0.85)_100%)] md:block" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_60%_45%,transparent_55%,rgb(2_8_26/0.55)_100%)]" />
        <div className="absolute inset-0 overflow-hidden mix-blend-soft-light"><div className="film-grain" /></div>
        <div className="light-sweep absolute inset-y-0 left-0 w-[28%] bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.07),transparent)]" />
      </div>

      {/* Copy */}
      <div className="container-x relative flex flex-1 flex-col justify-end pb-6 pt-[calc(min(36svh,19rem)_-_6.5rem)] md:justify-center md:pb-10 md:pt-[calc(4.5rem+3rem)]">
        <div className="max-w-[40rem]" onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)} onPointerLeave={() => setHover(false)}>
          <motion.p initial={enter({ opacity: 0, y: 10 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="inline-flex items-center gap-2.5 rounded-full bg-white/[0.08] py-1.5 pl-2.5 pr-3.5 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-white/90 ring-1 ring-white/15">
            <span className="size-1.5 rounded-full bg-[#ff4b42]" aria-hidden />
            Adoni · since 2000
          </motion.p>
          <motion.h1 id="hero-h" initial={enter({ opacity: 0, y: 18 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.06, ease }} className="mt-5 font-display text-[clamp(2.45rem,5.4vw,4.4rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-white [text-wrap:balance]">
            <span className="sr-only">Learn computers for your job, degree, business and future.</span>
            <span aria-hidden>Learn computers<br />for your </span>
            <RotatingWord still={reduce} />
          </motion.h1>
          <motion.p initial={enter({ opacity: 0, y: 12 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.16, ease }} className="mt-5 max-w-[33rem] text-[1.04rem] leading-relaxed text-white/85 sm:text-[1.12rem]">
            PGDCA, DCA, Tally Prime with GST, Java, Python and more. 100% practical classes at Babu Plaza, Adoni.
          </motion.p>
          <p lang="te" className="mt-2 text-[0.95rem] font-semibold text-white/75">ఉద్యోగానికి సిద్ధం చేసే కంప్యూటర్ కోర్సులు</p>
          <motion.div initial={enter({ opacity: 0, y: 12 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.24, ease }} className="mt-7 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href={waLink()} target="_blank" rel="noopener" className="btn-primary h-14 px-7 text-base">
                <WhatsAppIcon /> Enquire on WhatsApp
              </a>
            </Magnetic>
            <Link to="/courses" className="group inline-flex h-14 items-center gap-3 rounded-full bg-white/10 pl-6 pr-2 font-bold text-white ring-1 ring-white/25 transition-[background-color,transform] duration-200 hover:bg-white/15 active:scale-[0.97]">
              Explore courses
              <span className="grid size-10 place-items-center rounded-full bg-white text-[#0b1e4a] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5"><ArrowRight className="size-4" /></span>
            </Link>
          </motion.div>
          <motion.ul initial={enter({ opacity: 0 })} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-7 hidden flex-wrap gap-x-5 gap-y-2 text-[0.85rem] font-semibold text-white/80 sm:flex">
            {['ISO 9001:2015 certified', 'AP Govt DET permission', '5× Education Excellence Award'].map((t) => (
              <li key={t} className="flex items-center gap-1.5"><BadgeCheck className="size-4 text-[#ff7a72]" />{t}</li>
            ))}
          </motion.ul>
        </div>
      </div>

      {/* Story bar: progress, caption, counter, pause */}
      <div
        className="container-x relative pb-[calc(max(1rem,env(safe-area-inset-bottom))+4.5rem)] lg:pb-8"
        onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
        onPointerLeave={() => setHover(false)}
        onFocus={() => setFocus(true)}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocus(false) }}
      >
        <div className="flex items-end gap-4 border-t border-white/15 pt-4">
          <ol className="grid flex-1 grid-cols-4 gap-2 sm:gap-3" aria-label="Scenes">
            {HERO_SLIDES.map((sl, i) => (
              <li key={sl.name}>
                <button type="button" onClick={() => go(i)} aria-label={`Scene ${i + 1}: ${sl.label}`} aria-current={i === active ? 'true' : undefined} className="group block w-full py-2 text-left">
                  <span className="block h-[3px] overflow-hidden rounded-full bg-white/20">
                    <span
                      key={`${i}-${started[i]}-${i === active}`}
                      className={cn('block h-full rounded-full bg-white', i === active ? (reduce ? 'w-full' : 'story-fill') : i < active ? 'w-full opacity-60' : 'w-0')}
                      style={i === active && !reduce ? { animationDuration: `${SLIDE_MS}ms` } : undefined}
                    />
                  </span>
                  <span className={cn('mt-2 hidden text-[0.78rem] font-bold uppercase tracking-[0.12em] transition-colors md:block', i === active ? 'text-white' : 'text-white/55 group-hover:text-white/80')}>
                    {pad(i + 1)} {sl.label}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <button type="button" onClick={() => setUserPaused((p) => !p)} aria-label={userPaused ? 'Play the scenes' : 'Pause the scenes'} aria-pressed={userPaused} className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors hover:bg-white/20 motion-reduce:hidden">
            {userPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between gap-4 text-sm">
          <Link to={s.to} className="group line-clamp-2 min-w-0 font-semibold text-white/85 hover:text-white">
            <span className="font-bold text-white md:hidden">{s.label} · </span>{s.caption}
            <ArrowRight className="ml-1.5 inline size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <span className="shrink-0 font-display font-bold tabular-nums text-white/70" aria-hidden>
            <span className="text-white">{pad(active + 1)}</span> / {pad(n)}
          </span>
        </div>
      </div>
    </section>
  )
}
