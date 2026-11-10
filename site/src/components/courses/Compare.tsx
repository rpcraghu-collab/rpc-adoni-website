import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import type { Course } from '../../content/site'
import { Reveal } from '../ui'
import { cn } from '../../lib/cn'
import { compareRows, topicCount } from './data'

/**
 * Compact side-by-side table built from each course's syllabus and tools (a tick = the subject is in it).
 * It always fits the screen width, with no sideways scrolling: on phones the course names stand upright and the
 * rows are tight, so the whole table can be read in about one screen.
 */
export default function Compare({ id, title, courses, rec }: { id: string; title: string; courses: Course[]; rec: Set<string> }) {
  if (courses.length < 2) return null
  const rows = compareRows(courses)
  const tint = (c: Course) => rec.has(c.slug) && 'bg-accent/[0.07]'
  // "1½ hours daily · 6 months" → "6 months"; both paces are shown one under the other.
  const lengths = (c: Course) => c.duration.map((d) => d.split(' · ')[1] ?? d)
  return (
    <Reveal className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-[1.4rem] bg-surface ring-1 ring-line lg:mt-10">
      <div className="px-4 pb-3 pt-4 sm:px-6 sm:pt-5">
        <p className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />Side by side</p>
        <h3 id={id} className="mt-1.5 text-[1.2rem] font-bold leading-tight sm:text-[1.45rem]">{title}</h3>
        <p className="mt-0.5 text-[0.8rem] text-muted sm:text-[0.86rem]">Built from each syllabus. Tap a course to open it.</p>
      </div>
      <table aria-labelledby={id} className="w-full table-fixed border-separate border-spacing-0 border-t border-line text-[0.74rem] sm:text-[0.82rem]">
        <colgroup>
          <col className="w-[38%] sm:w-[30%]" />
          {courses.map((c) => <col key={c.slug} />)}
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className="border-b border-r border-line px-3 py-2 text-left align-bottom text-[0.64rem] font-bold uppercase tracking-[0.1em] text-muted sm:px-5">Subject</th>
            {courses.map((c) => (
              <th key={c.slug} scope="col" className={cn('border-b border-line px-0.5 py-2 text-center align-bottom', tint(c))}>
                <Link
                  to={`/courses/${c.slug}`}
                  className="mx-auto inline-flex min-h-11 items-end justify-center rounded-lg px-1 font-display text-[0.74rem] font-extrabold leading-none text-ink hover:text-accent-text max-sm:[writing-mode:vertical-rl] max-sm:rotate-180 sm:items-center sm:text-[0.92rem]"
                >
                  {c.code}
                </Link>
                {rec.has(c.slug) && <span className="mt-1 block text-[0.56rem] font-extrabold uppercase tracking-[0.06em] text-accent-text">For you</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="group/row">
              <th scope="row" className="border-b border-r border-line px-3 py-1.5 text-left font-semibold leading-tight text-ink-soft transition-colors group-hover/row:text-ink sm:px-5">{r.label}</th>
              {r.has.map((on, i) => (
                <td key={courses[i].slug} className={cn('border-b border-line px-0.5 py-1.5 text-center transition-colors group-hover/row:bg-surface-2/60', tint(courses[i]))}>
                  {on ? (
                    <span className="inline-grid size-[1.15rem] place-items-center rounded-full bg-[#14803f] text-white sm:size-5"><Check className="size-3 sm:size-3.5" strokeWidth={3.5} aria-hidden /><span className="sr-only">Included</span></span>
                  ) : (
                    <><span className="inline-block h-[2px] w-2.5 rounded-full bg-line align-middle" aria-hidden /><span className="sr-only">Not included</span></>
                  )}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <th scope="row" className="border-b border-r border-line px-3 py-1.5 text-left font-bold text-ink sm:px-5">Duration</th>
            {courses.map((c) => (
              <td key={c.slug} className={cn('border-b border-line px-0.5 py-1.5 text-center text-[0.62rem] font-semibold leading-tight text-ink-soft sm:text-[0.72rem]', tint(c))}>
                {c.duration.length ? lengths(c).map((d) => <span key={d} className="block">{d.replace(' months', ' mo').replace(' month', ' mo')}</span>) : '—'}
              </td>
            ))}
          </tr>
          <tr>
            <th scope="row" className="border-r border-line px-3 py-1.5 text-left font-bold text-ink sm:px-5">Topics</th>
            {courses.map((c) => (
              <td key={c.slug} className={cn('px-0.5 py-1.5 text-center font-bold tabular-nums text-ink', tint(c))}>{topicCount(c)}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </Reveal>
  )
}
