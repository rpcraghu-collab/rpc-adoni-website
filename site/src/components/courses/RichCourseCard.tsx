import { Link } from 'react-router-dom'
import { ArrowRight, Clock, ListChecks, Sparkles, Users } from 'lucide-react'
import type { Course } from '../../content/site'
import { CourseArt } from '../CourseArt'
import { Tilt } from '../ui'
import { cn } from '../../lib/cn'
import { topicCount } from './data'

/**
 * The Courses page card: the course's own drawn cover, the big course code, then who it is for, both
 * duration options, the tools, the number of syllabus topics and a clear "View syllabus".
 * Home and the course pages keep their own CourseCard.
 */
export default function RichCourseCard({ c, rec }: { c: Course; rec?: boolean }) {
  const topics = topicCount(c)
  const sub = c.code === c.name ? c.tagline : c.name
  return (
    <Tilt max={5} className="h-full rounded-[1.6rem]">
      <Link
        id={`course-${c.slug}`}
        to={`/courses/${c.slug}`}
        className={cn(
          'group relative flex h-full scroll-mt-40 flex-col overflow-hidden rounded-[1.6rem] bg-surface shadow-[0_1px_0_rgb(11_30_74/0.04),0_18px_40px_-28px_rgb(11_30_74/0.35)] ring-1 transition-[box-shadow] duration-300 hover:shadow-[0_30px_60px_-30px_rgb(11_30_74/0.55)]',
          rec ? 'ring-2 ring-accent' : 'ring-line',
        )}
      >
        {/* Cover: a drawn picture of this course's subject (its own colours), never a photo */}
        <span className="relative block h-[11rem] overflow-hidden">
          <span className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]">
            <CourseArt slug={c.slug} className="absolute inset-0 size-full" />
          </span>
          <span className="absolute left-3.5 top-3.5 flex flex-wrap gap-1.5">
            {rec && <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-white shadow-sm"><Sparkles className="size-3" aria-hidden />For you</span>}
            {c.featured && <span className="rounded-full bg-[#0b1e4a] px-2.5 py-1 text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-white shadow-sm ring-1 ring-white/20">Featured</span>}
          </span>
        </span>

        {/* Body */}
        <span className="flex flex-1 flex-col p-4 pt-4 sm:p-5">
          <span className="block font-display text-[clamp(1.8rem,8vw,2.1rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-ink">{c.code}</span>
          <span className="mt-1.5 block text-[0.95rem] font-bold leading-snug text-ink-soft">{sub}</span>
          {c.forWho && (
            <span className="mt-2 flex items-start gap-2 text-[0.86rem] leading-snug text-ink-soft">
              <Users className="mt-[0.1rem] size-4 shrink-0 text-muted" aria-hidden />
              <span><span className="font-bold text-ink">For:</span> {c.forWho}</span>
            </span>
          )}
          <span className="mt-3 flex flex-wrap gap-1.5">
            {c.duration.length ? (
              c.duration.map((d) => (
                <span key={d} className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-2.5 py-1.5 text-[0.8rem] font-bold text-ink">
                  <Clock className="size-3.5 text-muted" aria-hidden />{d}
                </span>
              ))
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-2.5 py-1.5 text-[0.8rem] font-bold text-ink-soft">
                <Clock className="size-3.5 text-muted" aria-hidden />Duration shared on enquiry
              </span>
            )}
          </span>
          {c.tools.length > 0 && (
            <span className="mt-3 flex flex-wrap gap-1" aria-label="Tools">
              {c.tools.slice(0, 7).map((t) => (
                <span key={t} className="rounded-full px-2.5 py-1 text-[0.75rem] font-semibold text-ink-soft ring-1 ring-line">{t}</span>
              ))}
              {c.tools.length > 7 && <span className="rounded-full px-2.5 py-1 text-[0.75rem] font-semibold text-muted">+{c.tools.length - 7}</span>}
            </span>
          )}
          <span className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-5">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[0.82rem] font-semibold text-muted">
              {topics > 0 && <><ListChecks className="size-4" aria-hidden />{topics} topics</>}
            </span>
            <span className="ml-auto inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full bg-ink pl-4 pr-1.5 text-[0.86rem] font-bold text-bg transition-colors duration-200 group-hover:bg-accent group-hover:text-white">
              View syllabus
              <span className="grid size-8 place-items-center rounded-full bg-bg/15 transition-transform duration-300 group-hover:translate-x-0.5"><ArrowRight className="size-4" aria-hidden /></span>
            </span>
          </span>
        </span>
      </Link>
    </Tilt>
  )
}
