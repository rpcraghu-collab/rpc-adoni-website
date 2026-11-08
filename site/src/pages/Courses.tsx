import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { FINDER, GROUPS, listed, waLink, type Course, type CourseGroup } from '../content/site'
import { Seo, WhatsAppIcon } from '../components/ui'
import PageHero from '../components/PageHero'
import { CourseCard, CtaBand, MiniCourseCard, TINT, artSet } from '../components/course'
import { cn } from '../lib/cn'

type Filter = 'all' | CourseGroup

/** "I am a … → start with …" guide built from FINDER (same data as the Home finder). */
function FitGuide({ all, className }: { all: Course[]; className?: string }) {
  return (
    <div className={cn('rounded-[1.75rem] bg-surface p-5 ring-1 ring-line sm:p-6', className)}>
      <p className="font-display text-xl font-bold text-ink">Where should I start?</p>
      <p className="mt-1 text-sm text-muted">Pick the line that fits you.</p>
      <ul className="mt-3 divide-y divide-line">
        {FINDER.map((f) => {
          const cs = f.slugs.map((s) => all.find((c) => c.slug === s)).filter((c): c is Course => !!c)
          if (!cs.length) return null
          return (
            <li key={f.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
              <span>
                <b className="block text-[0.95rem] text-ink">{f.label}</b>
                <span className="text-xs font-semibold text-muted">{f.note}</span>
              </span>
              <span className="flex flex-wrap gap-1.5">
                {cs.map((c) => (
                  <Link key={c.slug} to={`/courses/${c.slug}`} className="inline-flex min-h-11 items-center rounded-xl bg-surface-2 px-3 text-sm font-bold text-ink transition-colors hover:bg-accent hover:text-white">{c.code}</Link>
                ))}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function Courses() {
  const [params, setParams] = useSearchParams()
  const g0 = params.get('group')
  const f: Filter = GROUPS.some((g) => g.id === g0) ? (g0 as CourseGroup) : 'all'
  const choose = (id: Filter) => setParams(id === 'all' ? {} : { group: id }, { replace: true, preventScrollReset: true })
  const all = listed()
  const count = (g: CourseGroup) => all.filter((c) => c.group === g).length
  const tabs: { id: Filter; label: string; n: number }[] = [{ id: 'all', label: 'All', n: all.length }, ...GROUPS.map((g) => ({ id: g.id, label: g.label, n: count(g.id) }))]
  const shown = GROUPS.filter((g) => f === 'all' || g.id === f).map((g) => ({ ...g, list: all.filter((c) => c.group === g.id) })).filter((g) => g.list.length)

  return (
    <>
      <Seo path="/courses" title="Computer courses in Adoni: PGDCA, DCA, OAM, Tally, Java, Python" description="All courses at RPC Adoni: PGDCA, PGDCA Advanced, DCA, DCP, OAM, OAM Advanced, OAM PRO, CCA, and C, C++, Java, Oracle, Python. Morning and evening batches." />
      <PageHero
        eyebrow="Courses & programs"
        title={<>{all.length} courses. <span className="text-muted">One for every stage.</span></>}
        text="Diplomas, office and Tally skills, or a single programming language. Every course is 100% practical and ends with a certificate."
        aside={<FitGuide all={all} />}
      />

      <div className="sticky top-[calc(4.5rem+env(safe-area-inset-top))] z-30 border-b border-line bg-bg/90 backdrop-blur-xl backdrop-saturate-150">
        <div className="container-x">
          <div role="group" aria-label="Filter courses" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-3 sm:mx-0 sm:px-0">
            {tabs.map((t) => (
              <button key={t.id} type="button" aria-pressed={f === t.id} onClick={() => choose(t.id)} className={cn('relative inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-[0.95rem] font-bold transition-colors sm:px-5', f === t.id ? 'text-bg' : 'bg-surface text-ink ring-1 ring-line hover:ring-ink/25')}>
                {f === t.id && <motion.span layoutId="course-filter" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <span className="relative">{t.label}</span>
                <span className={cn('relative rounded-full px-1.5 text-xs tabular-nums', f === t.id ? 'bg-bg/20' : 'bg-surface-2 text-muted')}>{t.n}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.div key={f} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="container-x space-y-14 pb-16 pt-8 lg:space-y-20 lg:pb-24 lg:pt-12">
        {shown.map((g) => (
          <section key={g.id} aria-labelledby={`g-${g.id}`}>
            <div className="flex items-center gap-4">
              <span className={cn('grid size-16 shrink-0 place-items-center rounded-2xl sm:size-20', TINT[g.id])} aria-hidden>
                <img src={g.art} srcSet={artSet(g.art)} sizes="80px" alt="" width={80} height={80} loading="lazy" decoding="async" className="size-[90%] object-contain drop-shadow-[0_8px_10px_rgb(11_30_74/0.18)]" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id={`g-${g.id}`} className="text-[1.65rem] font-bold leading-tight sm:text-[2rem]">{g.label}</h2>
                <p className="mt-1 text-[0.95rem] leading-snug text-muted">{g.blurb}</p>
              </div>
              <a href={waLink(`Hello RPC, I want details about ${g.label} courses (fees and next batch).`)} target="_blank" rel="noopener" className="btn-ghost hidden min-h-11 shrink-0 md:inline-flex">
                <WhatsAppIcon className="size-4 text-[#14803f]" /> Ask about {g.label}
              </a>
            </div>
            {g.id === 'programming' ? (
              <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
                {g.list.map((c) => <li key={c.slug}><MiniCourseCard c={c} sub={c.name.replace(/ Programming$/, '') === c.code ? 'Programming' : c.name} /></li>)}
              </ul>
            ) : (
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {g.list.map((c) => <li key={c.slug}><CourseCard c={c} /></li>)}
              </ul>
            )}
          </section>
        ))}
        {f !== 'all' && (
          <button type="button" onClick={() => choose('all')} className="inline-flex min-h-12 items-center gap-2 font-bold text-ink hover:text-accent-text">
            See all {all.length} courses <ArrowRight className="size-4" />
          </button>
        )}
        <FitGuide all={all} className="lg:hidden" />
      </motion.div>

      <CtaBand title={<>Not sure which<br />course fits?</>} text="Tell us your qualification on WhatsApp or visit Babu Plaza. We will suggest the right course, batch and start date." art="/img/art/programming.webp" />
    </>
  )
}
