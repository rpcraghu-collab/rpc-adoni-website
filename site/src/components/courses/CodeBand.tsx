import './courses.css'
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, ListChecks, Sparkles, Terminal } from 'lucide-react'
import { GROUPS, waLink, type Course } from '../../content/site'
import { MaskLines, Reveal, WhatsAppIcon, useReduce } from '../ui'
import { cn } from '../../lib/cn'
import { CourseArt } from '../CourseArt'
import { SCENE_SIZE, SNIPPETS, highlight, sceneSet, sceneSrc, topicCount, type Tok } from './data'

const TOK: Record<NonNullable<Tok['k']>, string> = {
  kw: 'text-[#ff7ab2]',
  str: 'text-[#ffd47a]',
  fn: 'text-[#7ad7ff]',
  num: 'text-[#d0a8ff]',
  pre: 'text-[#ff9f7a]',
  type: 'text-[#8ef0c4]',
}
const CHAR_S = 0.032

/**
 * Lines type themselves in when the card first scrolls into view. The code is always in the ready-made
 * HTML; it is only hidden (clipped) after the app attaches and the card is still below the screen, and it
 * always comes back: on screen, on scroll, or after a 6 s fail-safe. Reduced motion: no typing.
 */
function useTyping(ref: { current: HTMLElement | null }) {
  const reduce = useReduce()
  const [mode, setMode] = useState<'still' | 'armed' | 'play'>('still')
  const iso = typeof window === 'undefined' ? useEffect : useLayoutEffect
  iso(() => {
    if (reduce || !ref.current) return
    if (ref.current.getBoundingClientRect().top > window.innerHeight) setMode('armed')
  }, [reduce])
  useEffect(() => {
    if (mode !== 'armed') return
    const check = () => {
      const r = ref.current?.getBoundingClientRect()
      if (r && r.top < window.innerHeight * 0.85 && r.bottom > 0) setMode('play')
    }
    const safety = window.setTimeout(() => setMode('play'), 6000)
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    check()
    return () => { clearTimeout(safety); window.removeEventListener('scroll', check); window.removeEventListener('resize', check) }
  }, [mode, ref])
  return mode
}

function Editor({ c, rec }: { c: Course; rec?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const mode = useTyping(ref)
  const snip = SNIPPETS[c.slug] ?? { file: `${c.slug}.txt`, lang: c.code, code: [`// ${c.name}`] }
  const topics = topicCount(c)
  let t = 0.15
  const lines = snip.code.map((l) => {
    const n = Math.max(1, l.length)
    const d = n * CHAR_S
    const style = { '--n': n, '--d': `${d}s`, '--t': `${t}s` } as CSSProperties
    t += d + 0.08
    return { l, style }
  })
  return (
    <Link
      ref={ref}
      id={`course-${c.slug}`}
      to={`/courses/${c.slug}`}
      className={cn(
        'group flex h-full scroll-mt-40 flex-col overflow-hidden rounded-[1.4rem] bg-[#0b1433] shadow-[0_40px_70px_-40px_rgb(0_0_0/0.9)] ring-1 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5',
        rec ? 'ring-2 ring-[#ff7a72]' : 'ring-white/10 hover:ring-white/25',
      )}
    >
      {/* Title bar */}
      <span className="flex items-center gap-3 border-b border-white/[0.08] bg-white/[0.03] px-4 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f57]" /><span className="size-2.5 rounded-full bg-[#febc2e]" /><span className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="flex-1 truncate text-center font-mono text-[0.75rem] text-white/60" aria-hidden>{snip.file}</span>
        {rec ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#ff7a72] px-2 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-[#2a0706]"><Sparkles className="size-3" aria-hidden />For you</span>
        ) : (
          <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.66rem] font-bold text-white/60" aria-hidden>{snip.lang}</span>
        )}
      </span>
      {/* Code */}
      <span aria-hidden className={cn('relative block min-h-[9.5rem] overflow-hidden px-1 py-3.5 font-mono text-[0.78rem] leading-[1.75] text-[#d6def5] sm:text-[0.8rem]', mode === 'armed' && 'code-armed', mode === 'play' && 'code-play')}>
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_70%_at_100%_0%,rgb(122_215_255/0.08),transparent_70%)]" />
        {lines.map(({ l, style }, i) => (
          <span key={i} className="relative flex">
            <span className="w-8 shrink-0 select-none pr-3 text-right text-white/25">{i + 1}</span>
            <span className="code-line inline-block whitespace-pre" style={style}>
              {highlight(l).map((tk, j) => <span key={j} className={tk.k ? TOK[tk.k] : undefined}>{tk.t}</span>)}
              {i === lines.length - 1 && <span className="caret ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] bg-[#7ad7ff]" />}
            </span>
          </span>
        ))}
      </span>
      {/* Course */}
      <span className="mt-auto block border-t border-white/[0.08] p-4 sm:p-5">
        <span className="flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-3">
            <span className="relative size-11 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/15"><CourseArt slug={c.slug} className="absolute inset-0 size-full" /></span>
            <span className="font-display text-[2rem] font-extrabold leading-none tracking-[-0.03em] text-white">{c.code}</span>
          </span>
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-[#0b1e4a] transition-[transform,background-color,color] duration-300 group-hover:translate-x-0.5 group-hover:bg-[#ff7a72] group-hover:text-[#2a0706]">
            <ArrowRight className="size-4" aria-hidden />
          </span>
        </span>
        <span className="mt-2 block text-[0.9rem] leading-snug text-white/80">{c.tagline}</span>
        <span className="mt-3 flex flex-wrap gap-1.5 text-[0.76rem] font-bold text-white/85">
          {c.duration.length ? c.duration.map((d) => (
            <span key={d} className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.07] px-2.5 py-1.5"><Clock className="size-3.5 text-white/60" aria-hidden />{d}</span>
          )) : (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.07] px-2.5 py-1.5"><Clock className="size-3.5 text-white/60" aria-hidden />Duration shared on enquiry</span>
          )}
          {topics > 0 && <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.07] px-2.5 py-1.5"><ListChecks className="size-3.5 text-white/60" aria-hidden />{topics} topics</span>}
        </span>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[0.86rem] font-bold text-[#7ad7ff] group-hover:underline group-hover:underline-offset-4">View syllabus <ArrowRight className="size-3.5" aria-hidden /></span>
      </span>
    </Link>
  )
}

/** Programming as a dark, code-themed band: each language is an editor window with a tiny real program. */
export default function CodeBand({ n, total, list, rec }: { n: number; total: number; list: Course[]; rec: Set<string> }) {
  const g = GROUPS.find((x) => x.id === 'programming')!
  const pad = (v: number) => String(v).padStart(2, '0')
  // Desktop: two wide windows on top, three below (or an even grid for other counts).
  const span = (i: number) => (list.length === 5 ? (i < 2 ? 'lg:col-span-3' : 'lg:col-span-2') : 'lg:col-span-2')
  return (
    <section aria-labelledby="g-programming" className="dark relative isolate mt-12 overflow-hidden bg-[#050b1c] py-14 text-ink lg:mt-20 lg:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[22rem] opacity-50 [mask-image:linear-gradient(180deg,#000_20%,transparent)] sm:inset-y-0 sm:left-auto sm:h-auto sm:w-[60%] sm:opacity-60 sm:[mask-image:linear-gradient(90deg,transparent,#000_45%),linear-gradient(180deg,#000_40%,transparent_90%)] sm:[mask-composite:intersect] sm:[-webkit-mask-composite:source-in]">
          <img src={sceneSrc('hero-code')} srcSet={sceneSet('hero-code')} sizes="(max-width: 639px) 170vw, 60vw" width={SCENE_SIZE.width} height={SCENE_SIZE.height} alt="" loading="lazy" decoding="async" className="kb-slow size-full object-cover object-[72%_center]" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.035)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(50%_40%_at_10%_100%,rgb(122_215_255/0.12),transparent_70%),radial-gradient(40%_40%_at_90%_10%,rgb(211_32_26/0.18),transparent_70%)]" />
      </div>
      <div className="container-x">
        <div className="max-w-2xl pt-28 sm:pt-0">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 font-mono text-[0.75rem] font-bold uppercase tracking-[0.12em] text-white ring-1 ring-white/15 backdrop-blur-md">
            <Terminal className="size-3.5" aria-hidden /> Chapter {pad(n)} / {pad(total)} · {list.length} {list.length === 1 ? 'language' : 'languages'}
          </p>
          <MaskLines id="g-programming" className="mt-4 text-[clamp(2.4rem,7vw,4.4rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-white" lines={[g.label]} />
          <p className="mt-3 max-w-lg text-[1rem] leading-relaxed text-white/80 sm:text-[1.08rem]">{g.blurb}. Learn one language at a time, at your pace.</p>
          <a href={waLink(`Hello RPC, I want details about ${g.label} courses (fees and next batch).`)} target="_blank" rel="noopener" className="btn mt-6 h-12 bg-white text-[#0b1e4a] hover:bg-white/90">
            <WhatsAppIcon className="text-[#14803f]" /> Ask about {g.label}
          </a>
        </div>
        <ul className="no-scrollbar -mx-4 mt-9 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:mt-12 lg:grid-cols-6 lg:gap-5" aria-label="Programming courses">
          {list.map((c, i) => (
            <Reveal as="li" key={c.slug} delay={Math.min(i, 4) * 0.06} className={cn('w-[84%] shrink-0 snap-center sm:w-auto', span(i), list.length === 5 && i === 4 && 'sm:col-span-2 lg:col-span-2')}>
              <Editor c={c} rec={rec.has(c.slug)} />
            </Reveal>
          ))}
        </ul>
        <p className="mt-3 text-center text-[0.8rem] font-semibold text-white/60 sm:hidden" aria-hidden>Swipe for all {list.length} languages</p>
      </div>
    </section>
  )
}
