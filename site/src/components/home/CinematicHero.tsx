import { useCallback, useEffect, useRef, useState, type CSSProperties, type FocusEvent, type KeyboardEvent, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react'
import { HERO_SIZE, HERO_SIZES, HERO_SLIDES, heroSet, heroSrc, type HeroSlide } from '../../content/heroSlides'
import { CREDENTIALS, SITE, listed, waLink } from '../../content/site'
import { enter } from '../../lib/boot'
import { cn } from '../../lib/cn'
import { Magnetic, WhatsAppIcon, useReduce } from '../ui'
import './hero.css'

const SLIDE_MS = 6000
const FADE_MS = 1600
const ease = [0.22, 1, 0.36, 1] as const
const N = HERO_SLIDES.length
const LONGEST = HERO_SLIDES.reduce((a, s) => (s.word.length > a.length ? s.word : a), '')
const pad = (v: number) => String(v).padStart(2, '0')

/** What the scene's 3D card lists: the group's course codes, or the batch timings. */
const cardLines = (s: HeroSlide) =>
  s.group ? listed().filter((c) => c.group === s.group).map((c) => c.code) : SITE.timings.map((t) => `${t.label.replace(/ batch$/i, '')} ${t.time}`)

/** The headline's last word. It slides up out of a mask as a whole word, never letter by letter. */
function Word({ word }: { word: string }) {
  return (
    <span aria-hidden className="relative -mb-[0.16em] inline-grid overflow-hidden pb-[0.16em] align-bottom">
      <span className="invisible col-start-1 row-start-1">{LONGEST}.</span>
      <AnimatePresence initial={false}>
        <motion.span
          key={word}
          initial={{ y: '112%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-112%' }}
          transition={{ duration: 0.85, ease: [0.77, 0, 0.18, 1] }}
          className="col-start-1 row-start-1 whitespace-nowrap bg-[linear-gradient(100deg,#ff6b5e_10%,#ffb84d_95%)] bg-clip-text pr-[0.04em] text-transparent"
        >
          {word}.
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/** Where each card of the 3D deck sits: 0 = in front, higher = further back and up. */
function place(rank: number, compact: boolean) {
  const k = compact ? 0.5 : 1
  return {
    x: rank * 30 * k,
    y: rank * -24 * k,
    z: rank * -90 * k,
    rotateY: compact ? -12 : -16,
    rotateX: compact ? 4 : 6,
    opacity: rank === 0 ? 1 : rank === 1 ? (compact ? 0.85 : 0.7) : rank === 2 ? (compact ? 0.5 : 0.38) : 0,
  }
}
const fly = (compact: boolean) => ({ x: compact ? -150 : -260, y: compact ? 14 : 34, z: 120, rotateY: -48 })

/**
 * The 3D card deck: one glass card per scene, stacked in depth. The front card is the current scene;
 * when the scene moves on, that card flies off to the left and the next one steps forward.
 */
function Deck({ active, from, dir, compact, still, className, px, py }: {
  active: number; from: number | null; dir: 1 | -1; compact?: boolean; still: boolean; className?: string
  px?: MotionValue<number>; py?: MotionValue<number>
}) {
  const c = !!compact
  const f = fly(c)
  return (
    <motion.div style={px && py ? { x: px, y: py } : undefined} className={cn('relative', className)}>
      {HERO_SLIDES.map((sl, i) => {
        const rank = (i - active + N) % N
        const front = rank === 0
        const t = place(rank, c)
        const leaving = !still && from === i && dir === 1
        const arriving = !still && from !== null && front && dir === -1
        const animate = leaving
          ? { x: [0, f.x, t.x], y: [0, f.y, t.y], z: [0, f.z, t.z], rotateY: [t.rotateY, f.rotateY, t.rotateY], rotateX: t.rotateX, opacity: [1, 0, t.opacity] }
          : arriving
            ? { x: [f.x, t.x], y: [f.y, t.y], z: [f.z, t.z], rotateY: [f.rotateY, t.rotateY], rotateX: t.rotateX, opacity: [0, 1] }
            : t
        const lines = cardLines(sl)
        const words = !c || front || leaving
        const shown = c ? lines.slice(0, sl.group ? 4 : 2) : lines
        const body = (
          <>
            <span aria-hidden className="absolute inset-x-4 top-0 h-px bg-[linear-gradient(90deg,transparent,#ffc861,transparent)]" />
            <span className="flex items-center justify-between gap-3">
              <span className={cn('font-display font-bold uppercase text-[#ffc861]', c ? 'text-[0.64rem] tracking-[0.14em]' : 'text-[0.74rem] tracking-[0.16em]')}>
                <span className="tabular-nums text-white/55">{pad(i + 1)}</span>&nbsp; {sl.label}
              </span>
              {!c && <span aria-hidden className="grid size-8 place-items-center rounded-full bg-white text-[#0b1e4a] transition-transform duration-300 group-hover:rotate-45"><ArrowUpRight className="size-4" /></span>}
            </span>
            <span className={cn('flex flex-wrap', c ? 'mt-2 gap-1' : 'mt-3.5 gap-1.5')}>
              {shown.map((l) => (
                <span key={l} className={cn('whitespace-nowrap rounded-full bg-white/[0.09] font-bold text-white ring-1 ring-white/[0.12]', c ? 'px-2 py-[3px] text-[0.68rem]' : 'px-2.5 py-1 text-[0.82rem]')}>{l}</span>
              ))}
            </span>
            {!c && <span className="mt-3.5 block text-[0.88rem] leading-snug text-white/75">{sl.caption}</span>}
          </>
        )
        const cls = cn(
          'group absolute bottom-0 right-0 block origin-[80%_100%] overflow-hidden text-left text-white',
          'shadow-[0_30px_60px_-24px_rgb(0_0_0/0.75),inset_0_1px_0_rgb(255_255_255/0.08)] ring-1 ring-white/15',
          c ? 'w-full rounded-2xl bg-[linear-gradient(155deg,#1f3a82,#0a1a48_70%)] p-3' : 'w-[20.5rem] rounded-[1.4rem] bg-[linear-gradient(155deg,rgb(30_54_120/0.8),rgb(7_18_50/0.92)_70%)] p-5 backdrop-blur-md',
          front ? 'pointer-events-auto' : 'pointer-events-none',
        )
        const style = { zIndex: leaving ? 20 : 10 - rank, transformPerspective: c ? 700 : 1100 } as CSSProperties
        const transition = still ? { duration: 0 } : { duration: leaving ? 1.05 : 0.95, ease, times: leaving ? [0, 0.5, 1] : undefined }
        return (
          <motion.div key={sl.name} aria-hidden={!front || undefined} initial={false} animate={animate} transition={transition} style={style} className={cls}>
            {front ? <Link to={sl.to} className="block rounded-[inherit]" aria-label={`${sl.label}: ${lines.join(', ')}. ${sl.caption}`}>{body}</Link> : words ? body : <span className="block h-[4.1rem]" />}
          </motion.div>
        )
      })}
    </motion.div>
  )
}

/** Real proof only: the award photos and the ISO credential from site.ts. */
function Proof({ className }: { className?: string }) {
  const by = (t: string) => CREDENTIALS.find((c) => c.title.startsWith(t))
  const award = by('5×')
  const creds = [by('ISO')].filter((c): c is (typeof CREDENTIALS)[number] => !!c)
  const short = (c: (typeof CREDENTIALS)[number]) => c.text.replace(/^Permission since/, 'since').replace(/ institute$/, '').toLowerCase()
  return (
    <ul className={cn('flex items-center text-white', className)}>
      {award && (
        <li className="shrink-0">
          <Link to="/awards" className="group flex items-center gap-2 rounded-xl lg:gap-2.5" aria-label={`${award.title} ${award.text}: see the award photos`}>
            <span aria-hidden className="relative h-8 w-[3.1rem] shrink-0 lg:h-10 lg:w-[5rem]">
              {[1, 2, 5].map((n, k) => (
                <img
                  key={n} src={`/img/hero/award-thumb-${n}.webp`} width={192} height={128} alt="" decoding="async"
                  className="absolute top-0.5 h-7 w-[2.6rem] rounded-[4px] object-cover shadow-[0_6px_14px_-4px_rgb(0_0_0/0.7)] ring-[1.5px] ring-white/85 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 lg:h-9 lg:w-[3.4rem] lg:rounded-[5px]"
                  style={{ left: `${k * 0.25}rem`, transform: `rotate(${(k - 1) * 9}deg) translateY(${k === 1 ? -2 : 2}px)`, zIndex: k === 1 ? 3 : 2 - k }}
                />
              ))}
            </span>
            <span className="leading-tight">
              <span className="block whitespace-nowrap font-display text-[0.92rem] font-extrabold lg:text-[1.08rem]">{award.title.replace(/Award$/, 'Awards')}</span>
              <span className="block whitespace-nowrap text-[0.7rem] font-semibold text-white/75 group-hover:text-white lg:text-[0.82rem]">{award.text}</span>
            </span>
          </Link>
        </li>
      )}
      {/* Phones: both credentials stacked in one column, so the row never runs off the screen. */}
      <li className="min-w-0 border-l border-white/20 pl-3 text-[0.7rem] leading-[1.45] lg:hidden">
        {creds.map((c) => (
          <span key={c.title} className="block whitespace-nowrap">
            <span className="font-display text-[0.8rem] font-extrabold">{c.title}</span> <span className="font-semibold text-white/75">{short(c)}</span>
          </span>
        ))}
      </li>
      {creds.map((c) => (
        <li key={c.title} className="hidden border-l border-white/20 pl-5 leading-tight lg:block">
          <span className="block whitespace-nowrap font-display text-[1.08rem] font-extrabold">{c.title}</span>
          <span className="block whitespace-nowrap text-[0.82rem] font-semibold text-white/75">{c.text}</span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Home hero. A cinematic stage of four 3D scenes: each new scene crossfades in over the last,
 * under a slow Ken Burns move. The headline's last word, the 3D card deck and the
 * story bars change with the scene. Phones get a story layout: the scene fills the top of the screen
 * over a blurred copy of itself, story bars under the header, swipe or tap to change, press and hold
 * to pause, and all of the copy sits above the quick-contact bar. Reduced motion: the first scene, still.
 */
export default function CinematicHero() {
  const reduce = useReduce()
  const [active, setActive] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [dir, setDir] = useState<1 | -1>(1)
  const [tick, setTick] = useState(0)
  // The tick at which each scene last came on: its image keeps that key, so the outgoing scene is never
  // re-mounted (a re-mount restarted its zoom mid-fade, which showed as a jump).
  const [starts, setStarts] = useState<number[]>(() => Array(N).fill(0))
  const tickRef = useRef(0)
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0]))
  const [hover, setHover] = useState(false)
  const [focus, setFocus] = useState(false)
  const [hold, setHold] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const paused = reduce || hover || focus || hold || hidden || userPaused

  // Timer that survives pauses: keeps the time left on the current scene.
  const left = useRef(SLIDE_MS)
  const since = useRef(0)
  const cur = useRef(0)

  const go = useCallback((to: number, d?: 1 | -1) => {
    const from = cur.current
    const next = ((to % N) + N) % N
    if (next === from) return
    cur.current = next
    setDir(d ?? (next > from ? 1 : -1))
    const nt = ++tickRef.current
    setPrev(from)
    setActive(next)
    setTick(nt)
    setStarts((st) => { const c = [...st]; c[next] = nt; return c })
    setLoaded((l) => new Set(l).add(next).add((next + 1) % N))
    left.current = SLIDE_MS
  }, [])

  useEffect(() => {
    if (paused) return
    since.current = performance.now()
    const t = window.setTimeout(() => go(cur.current + 1, 1), left.current)
    return () => {
      window.clearTimeout(t)
      left.current = Math.max(400, left.current - (performance.now() - since.current))
    }
  }, [paused, active, go])

  // The old scene is dropped once the new one has fully faded in.
  useEffect(() => {
    if (prev === null) return
    const t = window.setTimeout(() => setPrev(null), FADE_MS + 100)
    return () => window.clearTimeout(t)
  }, [prev, tick])

  // Fetch the second scene once the page has settled, so the first change never shows a gap.
  useEffect(() => {
    const t = window.setTimeout(() => setLoaded((l) => new Set(l).add(1 % N)), 1800)
    const vis = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', vis)
    return () => { window.clearTimeout(t); document.removeEventListener('visibilitychange', vis) }
  }, [])

  // Anything above the header (the admin's announcement strip) pushes the hero down: shrink it by that
  // much, so the copy and buttons still end above the phone's quick-contact bar.
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = root.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const set = () => el.style.setProperty('--hx-top', `${Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY))}px`)
    set()
    const ro = new ResizeObserver(set)
    ro.observe(document.body)
    return () => ro.disconnect()
  }, [])

  // Pointer parallax (mouse only): the scene drifts one way and the card deck the other, for depth.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 })
  const tx = useTransform(sx, (v) => v * -16)
  const ty = useTransform(sy, (v) => v * -10)
  const dx = useTransform(sx, (v) => v * 22)
  const dy = useTransform(sy, (v) => v * 16)
  const move = (e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  // Phones: swipe to change scene, tap the left / right side to step, press and hold to pause.
  const touch = useRef<{ x: number; y: number; t: number } | null>(null)
  const down = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'mouse' || (e.target as Element).closest('a,button')) return
    touch.current = { x: e.clientX, y: e.clientY, t: performance.now() }
    setHold(true)
  }
  const up = (e: PointerEvent<HTMLElement>) => {
    const st = touch.current
    touch.current = null
    setHold(false)
    if (!st) return
    const ddx = e.clientX - st.x
    const ddy = e.clientY - st.y
    if (Math.abs(ddx) > 40 && Math.abs(ddx) > Math.abs(ddy) * 1.3) return go(cur.current + (ddx < 0 ? 1 : -1), ddx < 0 ? 1 : -1)
    if (Math.abs(ddx) < 10 && Math.abs(ddy) < 10 && performance.now() - st.t < 300) {
      const r = e.currentTarget.getBoundingClientRect()
      const back = e.clientX - r.left < r.width * 0.3
      go(cur.current + (back ? -1 : 1), back ? -1 : 1)
    }
  }
  const cancel = () => { touch.current = null; setHold(false) }

  const keys = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const d = e.key === 'ArrowRight' ? 1 : -1
    const to = (cur.current + d + N) % N
    go(to, d)
    e.currentTarget.querySelectorAll<HTMLButtonElement>('button[data-scene]')[to]?.focus()
  }

  const s = HERO_SLIDES[active]
  const hoverOn = (e: PointerEvent) => { if (e.pointerType === 'mouse') setHover(true) }
  const controls = {
    onPointerEnter: hoverOn,
    onPointerLeave: () => setHover(false),
    onFocus: () => setFocus(true),
    onBlur: (e: FocusEvent<HTMLElement>) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocus(false) },
  }

  const bars = (labels: boolean) => (
    <ol className={cn('grid flex-1 grid-cols-4', labels ? 'gap-3' : 'gap-1.5')} aria-label="Scenes" onKeyDown={keys}>
      {HERO_SLIDES.map((sl, i) => (
        <li key={sl.name}>
          <button
            type="button" data-scene onClick={() => go(i)} tabIndex={i === active ? 0 : -1}
            aria-label={`Scene ${i + 1} of ${N}: ${sl.label}`} aria-current={i === active ? 'true' : undefined}
            className={cn('group block w-full text-left', labels ? 'py-2' : 'py-3')}
          >
            <span className={cn('block overflow-hidden rounded-full bg-white/25', labels ? 'h-[3px]' : 'h-[2.5px]')}>
              <span
                key={`${i}-${i === active ? tick : 'x'}`}
                className={cn('block h-full rounded-full bg-white', i === active ? (reduce ? 'w-full' : 'story-fill') : i < active ? 'w-full' : 'w-0')}
                style={i === active && !reduce ? { animationDuration: `${SLIDE_MS}ms` } : undefined}
              />
            </span>
            {labels && (
              <span className={cn('mt-2.5 block text-[0.76rem] font-bold uppercase tracking-[0.14em] transition-colors', i === active ? 'text-white' : 'text-white/55 group-hover:text-white/80')}>
                <span className="tabular-nums">{pad(i + 1)}</span>&nbsp;&nbsp;{sl.label}
              </span>
            )}
          </button>
        </li>
      ))}
    </ol>
  )
  const pauseBtn = (cls: string) => (
    <button
      type="button" onClick={() => setUserPaused((p) => !p)} aria-pressed={userPaused}
      aria-label={userPaused ? 'Play the scenes' : 'Pause the scenes'}
      className={cn('grid shrink-0 place-items-center rounded-full text-white transition-colors motion-reduce:hidden', cls)}
    >
      {userPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
    </button>
  )

  return (
    <section
      ref={root}
      aria-labelledby="hero-h"
      onPointerMove={move}
      onPointerLeave={() => { mx.set(0); my.set(0) }}
      className={cn(
        'relative isolate -mt-[calc(4.5rem+env(safe-area-inset-top))] flex min-h-[calc(100svh-var(--hx-top,0px))] flex-col overflow-hidden bg-[#050f2c] text-white',
        'lg:max-h-[68rem] lg:min-h-[max(42rem,calc(100svh-var(--hx-top,0px)))]',
        paused && 'is-paused',
      )}
    >
      {/* Phones: a blurred copy of the scene fills the whole screen, so the scene never looks like a strip. */}
      <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden lg:hidden">
        {HERO_SLIDES.map((sl, i) => ((i === active || i === prev) && loaded.has(i) ? (
          <img
            key={`${sl.name}-amb-${starts[i]}`}
            src={heroSrc(sl.name)} srcSet={heroSet(sl.name)} sizes={HERO_SIZES} width={HERO_SIZE.width} height={HERO_SIZE.height} alt=""
            className={cn('absolute inset-0 size-full scale-125 object-cover opacity-70 blur-[38px] saturate-[1.35]', i === active ? 'z-[1]' : 'z-0', i === active && tick > 0 && 'hx-fade')}
            style={{ objectPosition: sl.mobilePosition ?? '74% center' }}
          />
        ) : null))}
        <div className="absolute inset-0 z-[2] bg-[linear-gradient(180deg,rgb(5_15_44/0.2)_0%,rgb(5_15_44/0.6)_40%,rgb(5_15_44/0.8)_60%,rgb(5_15_44/0.88)_100%)]" />
      </div>

      {/* Scene window: on phones the top of the screen (all the room the copy leaves), on desktop full-bleed. */}
      <div className="relative min-h-[12.5rem] flex-1 touch-pan-y select-none lg:static lg:min-h-0 lg:flex-none" onPointerDown={down} onPointerUp={up} onPointerCancel={cancel}>
        <motion.div
          aria-hidden={HERO_SLIDES.every((x) => !x.alt) || undefined}
          style={{ x: tx, y: ty }}
          className="absolute inset-x-0 -bottom-[7.5rem] top-0 -z-10 overflow-hidden [mask-image:linear-gradient(180deg,#000_62%,transparent_100%)] lg:-inset-[2%] lg:[mask-image:none]"
        >
          {HERO_SLIDES.map((sl, i) => {
            if (!loaded.has(i)) return null
            const on = i === active
            const out = i === prev
            const moving = !reduce && (on || out)
            return (
              <div
                key={sl.name}
                className={cn(
                  'absolute inset-0 overflow-hidden',
                  on ? 'z-[2]' : out ? 'z-[1]' : 'invisible',
                  on && tick > 0 && !reduce && 'hx-fade',
                )}
              >
                <img
                  key={`${sl.name}-${starts[i]}`}
                  src={heroSrc(sl.name)} srcSet={heroSet(sl.name)} sizes={HERO_SIZES}
                  width={HERO_SIZE.width} height={HERO_SIZE.height}
                  alt={sl.alt}
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  loading="eager"
                  decoding={i === 0 ? 'sync' : 'async'}
                  style={{ '--mp': sl.mobilePosition ?? '74% center' } as CSSProperties}
                  className={cn(
                    'size-full object-cover [object-position:var(--mp)] lg:object-[72%_center]',
                    'origin-[60%_45%] lg:origin-[80%_45%]',
                    moving ? ((starts[i] + i) % 2 === 0 ? 'hx-kb-a' : 'hx-kb-b') : 'scale-[1.03]',
                  )}
                />
              </div>
            )
          })}
        </motion.div>

        {/* Phone grade: dark under the header, clear over the scene, deep navy into the copy. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-[7.5rem] top-0 -z-10 bg-[linear-gradient(180deg,rgb(5_15_44/0.75)_0%,rgb(5_15_44/0)_8.5rem,rgb(5_15_44/0)_50%,rgb(5_15_44/0.5)_72%,rgb(5_15_44/0.35)_88%,rgb(5_15_44/0)_100%)] lg:hidden" />

        {/* Phones: story bars under the header, and the light 3D deck at the foot of the scene. */}
        <div className="absolute inset-x-0 top-[calc(4.5rem+env(safe-area-inset-top))] z-10 lg:hidden" {...controls}>
          <div className="container-x flex items-center gap-2">
            {bars(false)}
            {pauseBtn('-mr-2 size-11 text-white/90 hover:bg-white/10')}
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-2 right-4 z-10 h-[5.2rem] w-[12rem] sm:right-6 lg:hidden [@media(max-height:760px)]:hidden" {...controls}>
          <Deck active={active} from={prev} dir={dir} compact still={reduce} className="size-full" />
        </div>
      </div>

      {/* Desktop grade (full-bleed) and film grain. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden lg:block">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(4_13_40/0.94)_0%,rgb(4_13_40/0.82)_28%,rgb(4_13_40/0.3)_52%,rgb(4_13_40/0)_66%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(4_13_40/0.6)_0%,transparent_20%,transparent_64%,rgb(4_13_40/0.9)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_62%_45%,transparent_55%,rgb(2_8_26/0.55)_100%)]" />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden mix-blend-soft-light"><div className="film-grain" /></div>

      {/* Copy */}
      <div className="container-x relative z-10 pb-[calc(env(safe-area-inset-bottom)+5.6rem)] pt-3 lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:pb-10 lg:pt-[calc(4.5rem+2.5rem)]">
        <div className="max-w-[44rem] xl:max-w-[54rem]" onPointerEnter={hoverOn} onPointerLeave={() => setHover(false)}>
          <motion.p initial={enter({ opacity: 0, y: 10 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="hidden items-center gap-2.5 rounded-full bg-white/[0.08] py-1.5 pl-2.5 pr-3.5 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-white/90 ring-1 ring-white/15 backdrop-blur-sm lg:inline-flex">
            <span className="size-1.5 rounded-full bg-[#ff4b42] shadow-[0_0_10px_#ff4b42]" aria-hidden />
            Adoni · Since {SITE.since}
          </motion.p>
          <motion.h1
            id="hero-h"
            initial={enter({ opacity: 0, y: 18 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.06, ease }}
            className="font-display text-[clamp(2.4rem,10.6vw,3.3rem)] font-extrabold leading-[0.98] tracking-[-0.025em] text-white [text-shadow:0_2px_30px_rgb(2_8_26/0.5)] lg:mt-6 lg:text-[clamp(3.8rem,5.4vw,5.6rem)] lg:leading-[0.95]"
          >
            <span className="sr-only">Learn computers for your degree, business, job and future.</span>
            <span aria-hidden className="block">Learn computers</span>
            <span aria-hidden className="block">for your</span>
            <span className="block"><Word word={s.word} /></span>
          </motion.h1>
          <motion.p initial={enter({ opacity: 0, y: 12 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.16, ease }} className="mt-4 max-w-[34rem] text-[1rem] leading-[1.55] [text-wrap:pretty] text-white/[0.86] lg:mt-6 lg:text-[1.15rem]">
            PGDCA, DCA, Tally Prime with GST, Java, Python and more. 100% practical classes at {SITE.addressShort}.
          </motion.p>
          <p lang="te" className="mt-1.5 text-[0.92rem] font-semibold text-[#ffd48a] lg:mt-2.5 lg:text-[1rem] [@media(max-height:700px)]:hidden">ఉద్యోగానికి సిద్ధం చేసే కంప్యూటర్ కోర్సులు</p>
          <motion.div initial={enter({ opacity: 0, y: 12 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.24, ease }} className="mt-4 grid gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-3 lg:mt-8">
            <Magnetic className="flex sm:inline-flex">
              <a href={waLink()} target="_blank" rel="noopener" className="btn-primary h-[3.25rem] w-full px-7 text-base sm:w-auto lg:h-14">
                <WhatsAppIcon /> Enquire on WhatsApp
              </a>
            </Magnetic>
            <Link to="/courses" className="group inline-flex h-[3.25rem] items-center justify-between gap-3 rounded-full bg-white/10 pl-6 pr-1.5 font-bold text-white ring-1 ring-white/25 backdrop-blur-sm transition-[background-color,transform] duration-200 hover:bg-white/15 active:scale-[0.97] lg:h-14 lg:pr-2">
              Explore courses
              <span className="grid size-10 place-items-center rounded-full bg-white text-[#0b1e4a] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5"><ArrowRight className="size-4" /></span>
            </Link>
          </motion.div>
          <motion.div initial={enter({ opacity: 0 })} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <Proof className="mt-4 gap-3 lg:mt-10 lg:gap-5" />
          </motion.div>
        </div>
      </div>

      {/* Desktop: the 3D deck over the scene floor, then the story bar. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[7.25rem] z-10 hidden lg:block">
        <div className="container-x relative h-[11rem]">
          <div className="absolute bottom-0 right-6 h-full w-[20.5rem] xl:right-8" {...controls}>
            <Deck active={active} from={prev} dir={dir} still={reduce} px={dx} py={dy} className="size-full" />
          </div>
        </div>
      </div>
      <div className="container-x relative z-10 hidden pb-7 lg:block" {...controls}>
        <div className="flex items-start gap-5 border-t border-white/15 pt-3">
          {bars(true)}
          <span className="mt-1.5 shrink-0 font-display text-sm font-bold tabular-nums text-white/60" aria-hidden>
            <span className="text-white">{pad(active + 1)}</span> / {pad(N)}
          </span>
          {pauseBtn('size-10 bg-white/10 ring-1 ring-white/20 hover:bg-white/20')}
        </div>
      </div>
    </section>
  )
}
