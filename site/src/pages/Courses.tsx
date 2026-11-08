import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Clock, Users } from 'lucide-react'
import { COURSES, GROUPS, waLink, type CourseGroup } from '../content/site'
import { Seo, Tilt, WhatsAppIcon } from '../components/ui'
import PageHero from '../components/PageHero'
import { cn } from '../lib/cn'

type Filter = 'all' | CourseGroup

export default function Courses() {
  const [f, setF] = useState<Filter>('all')
  const list = COURSES.filter((c) => f === 'all' || c.group === f)
  const tabs: { id: Filter; label: string }[] = [{ id: 'all', label: `All (${COURSES.length})` }, ...GROUPS.map((g) => ({ id: g.id, label: g.label }))]
  return (
    <>
      <Seo path="/courses" title="Computer courses in Adoni: PGDCA, DCA, OAM, Tally, Java, Python" description="All courses at RPC Adoni: PGDCA, PGDCA Advanced, DCA, DCP, OAM, OAM Advanced, OAM PRO, CCA, and C, C++, Java, Oracle, Python. Morning and evening batches." />
      <PageHero eyebrow="Courses & programs" title={<>Thirteen courses. <span className="text-muted">One for every stage.</span></>} text="Choose by your qualification or the skill you want. Every course is 100% practical and ends with a certificate." />
      <section className="container-x pb-24">
        <div role="tablist" aria-label="Filter courses" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={f === t.id} onClick={() => setF(t.id)} className={cn('relative min-h-12 shrink-0 rounded-full px-5 text-[0.95rem] font-bold transition-colors', f === t.id ? 'text-bg' : 'bg-surface text-ink ring-1 ring-line hover:ring-ink/25')}>
              {f === t.id && <motion.span layoutId="course-filter" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {f === 'all' ? (
            <motion.div key="all" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }} className="mt-6 grid gap-3 sm:grid-cols-3">
              {GROUPS.map((g) => (
                <button key={g.id} onClick={() => setF(g.id)} className="card group flex items-center gap-4 p-4 text-left transition-colors hover:border-ink/25">
                  <img src={g.art} alt="" width={80} height={80} loading="lazy" decoding="async" className="size-20 shrink-0 object-contain transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-3" />
                  <span className="min-w-0">
                    <b className="block font-display text-lg text-ink">{g.label}</b>
                    <span className="block text-sm leading-snug text-muted">{g.blurb}</span>
                  </span>
                </button>
              ))}
            </motion.div>
          ) : (() => {
            const g = GROUPS.find((x) => x.id === f)!
            return (
              <motion.div key={g.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }} className="mt-6 flex items-center gap-5 overflow-hidden rounded-[1.4rem] bg-brand p-5 text-white sm:gap-8 sm:p-7">
                <img src={g.art} alt="" width={160} height={160} decoding="async" className="float size-24 shrink-0 object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.35)] sm:size-36" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/65">{list.length} courses</p>
                  <p className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">{g.label}</p>
                  <p className="mt-1 text-white/80">{g.blurb}</p>
                </div>
                <a href={waLink(`Hello RPC, I want details about ${g.label} courses (fees and next batch).`)} target="_blank" rel="noopener" className="btn ml-auto hidden h-12 shrink-0 bg-white px-6 text-brand hover:bg-white/90 md:inline-flex"><WhatsAppIcon className="text-[#178a48]" /> Ask about {g.label}</a>
              </motion.div>
            )
          })()}
        </AnimatePresence>
        <motion.ul layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((c) => (
              <motion.li key={c.slug} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25 }}>
                <Tilt className="h-full rounded-[1.4rem]" max={5}>
                  <Link to={`/courses/${c.slug}`} className="card group flex h-full flex-col p-6 transition-colors hover:border-ink/25">
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-bold text-ink-soft">{GROUPS.find((g) => g.id === c.group)!.label}</span>
                      <ArrowUpRight className="size-5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-text" />
                    </div>
                    <p className="mt-6 font-display text-3xl font-extrabold text-ink">{c.code}</p>
                    {c.name !== c.code && <p className="mt-1 text-sm font-semibold text-ink-soft">{c.name}</p>}
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{c.tagline}</p>
                    <div className="mt-auto space-y-2 pt-6 text-sm">
                      <p className="flex items-center gap-2 text-ink-soft"><Users className="size-4 text-muted" />{c.forWho}</p>
                      <p className="flex items-center gap-2 text-ink-soft"><Clock className="size-4 text-muted" />{c.duration[0] ?? 'Ask us for the duration'}</p>
                    </div>
                  </Link>
                </Tilt>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </section>
    </>
  )
}
