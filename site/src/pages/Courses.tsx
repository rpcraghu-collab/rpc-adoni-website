import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useReducedMotion, motion } from 'motion/react'
import { ArrowRight, LayoutGrid, Sparkles, X } from 'lucide-react'
import { enter } from '../lib/boot'
import { FINDER, GROUPS, listed, type CourseGroup } from '../content/site'
import { Seo } from '../components/ui'
import { CtaBand, artSet } from '../components/course'
import { cn } from '../lib/cn'
import CoursesHero, { personaCourses } from '../components/courses/CoursesHero'
import Chapter from '../components/courses/Chapter'
import CodeBand from '../components/courses/CodeBand'

type Filter = 'all' | CourseGroup

export default function Courses() {
  const [params, setParams] = useSearchParams()
  const g0 = params.get('group')
  const f: Filter = GROUPS.some((g) => g.id === g0) ? (g0 as CourseGroup) : 'all'
  const all = listed()
  const [who, setWho] = useState<string | null>(null)
  const picks = personaCourses(who, all)
  const rec = new Set(picks.map((c) => c.slug))
  const persona = FINDER.find((p) => p.id === who)
  const reduce = useReducedMotion()
  const listRef = useRef<HTMLDivElement>(null)
  const behavior = (): ScrollBehavior => (reduce ? 'auto' : 'smooth')

  const choose = (id: Filter) => {
    setParams(id === 'all' ? {} : { group: id }, { replace: true, preventScrollReset: true })
    // Changing the filter from further down the page: go back to the start of the list.
    const el = listRef.current
    if (el && el.getBoundingClientRect().top < 0) requestAnimationFrame(() => el.scrollIntoView({ behavior: behavior(), block: 'start' }))
  }
  /** "Show them in the list": make sure every pick is visible, then glide to the first one. */
  const showRecs = () => {
    const first = picks[0]
    if (!first) return
    if (f !== 'all' && picks.some((c) => c.group !== f)) setParams({}, { replace: true, preventScrollReset: true })
    window.setTimeout(() => {
      const el = document.getElementById(`course-${first.slug}`)
      el?.scrollIntoView({ behavior: behavior(), block: 'center' })
      el?.focus({ preventScroll: true })
    }, 80)
  }

  const count = (g: CourseGroup) => all.filter((c) => c.group === g).length
  const tabs: { id: Filter; label: string; n: number; art?: string }[] = [
    { id: 'all', label: 'All', n: all.length },
    ...GROUPS.map((g) => ({ id: g.id, label: g.label, n: count(g.id), art: g.art })),
  ]
  const groups = GROUPS.map((g) => ({ ...g, list: all.filter((c) => c.group === g.id) })).filter((g) => g.list.length)
  const shown = groups.filter((g) => f === 'all' || g.id === f)

  return (
    <>
      <Seo path="/courses" title="Computer courses in Adoni: PGDCA, DCA, OAM, Tally, Java, Python" description="All courses at RPC Adoni: PGDCA, DCA, DCP, CCA, OAM, OAM Advanced, OAM Pro, and Advanced Excel, Tally Prime with GST, Power BI, SQL, C, C++, Java, Oracle, Python. Morning and evening batches." />
      <CoursesHero all={all} who={who} onWho={setWho} onShow={showRecs} />

      <div className="sticky top-[calc(4.5rem+env(safe-area-inset-top))] z-30 mt-6 border-y border-line bg-bg/90 backdrop-blur-xl backdrop-saturate-150 lg:mt-10">
        <div className="container-x">
          <div role="group" aria-label="Filter courses" className="no-scrollbar edge-fade -mx-4 flex gap-2 overflow-x-auto py-2.5 pl-4 pr-12 sm:mx-0 sm:px-0 sm:[mask-image:none]">
            {tabs.map((t) => (
              <button key={t.id} type="button" aria-pressed={f === t.id} onClick={() => choose(t.id)} className={cn('relative inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full pl-4 pr-3.5 text-[0.95rem] font-bold transition-colors sm:pl-1.5 sm:pr-4', f === t.id ? 'text-bg' : 'bg-surface text-ink ring-1 ring-line hover:ring-ink/25')}>
                {f === t.id && <motion.span layoutId="course-filter" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <span aria-hidden className={cn('relative hidden size-8 place-items-center overflow-hidden rounded-full sm:grid', f === t.id ? 'bg-bg/15' : 'bg-surface-2')}>
                  {t.art ? <img src={t.art} srcSet={artSet(t.art)} sizes="32px" alt="" width={32} height={32} loading="lazy" decoding="async" className="size-[115%] max-w-none object-contain" /> : <LayoutGrid className="size-4" />}
                </span>
                <span className="relative">{t.label}</span>
                <span className={cn('relative rounded-full px-1.5 text-xs tabular-nums', f === t.id ? 'bg-bg/20' : 'bg-surface-2 text-muted')}>{t.n}</span>
              </button>
            ))}
            {persona && (
              <button type="button" onClick={() => setWho(null)} aria-label={`Clear the picks for ${persona.label}`} className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-accent/10 pl-3 pr-1.5 text-[0.88rem] font-bold text-accent-text ring-1 ring-accent/30 transition-colors hover:bg-accent/15 sm:ml-auto">
                <Sparkles className="size-3.5" aria-hidden /> For {persona.label}
                <span className="grid size-8 place-items-center rounded-full bg-accent/15"><X className="size-3.5" aria-hidden /></span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div ref={listRef} className="scroll-mt-[calc(4.5rem+env(safe-area-inset-top))]">
        <motion.div key={f} initial={enter({ opacity: 0, y: 10 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="pb-16 lg:pb-24">
          {shown.map((g) => {
            const n = groups.findIndex((x) => x.id === g.id) + 1
            return g.id === 'programming'
              ? <CodeBand key={g.id} n={n} total={groups.length} list={g.list} rec={rec} />
              : <Chapter key={g.id} g={g} n={n} total={groups.length} list={g.list} rec={rec} />
          })}
          {f !== 'all' && (
            <div className="container-x pt-8">
              <button type="button" onClick={() => choose('all')} className="btn-ghost min-h-12">
                See all {all.length} courses <ArrowRight className="size-4" aria-hidden />
              </button>
            </div>
          )}
        </motion.div>
      </div>

      <CtaBand title={<>Not sure which<br />course fits?</>} text="Tell us your qualification on WhatsApp or visit Babu Plaza. We will suggest the right course, batch and start date." art="/img/art/programming.webp" />
    </>
  )
}
