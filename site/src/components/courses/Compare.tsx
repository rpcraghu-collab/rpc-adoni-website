import { Link } from 'react-router-dom'
import { Check, MoveRight } from 'lucide-react'
import type { Course } from '../../content/site'
import { Reveal } from '../ui'
import { cn } from '../../lib/cn'
import { compareRows, topicCount } from './data'

/**
 * Side-by-side table built from each course's syllabus and tools (a tick = the subject is in it).
 * Phones scroll it sideways with the subject column pinned on the left.
 */
export default function Compare({ id, title, courses, rec }: { id: string; title: string; courses: Course[]; rec: Set<string> }) {
  if (courses.length < 2) return null
  const rows = compareRows(courses)
  const head = 'sticky left-0 z-[1] bg-surface'
  return (
    <Reveal className="mt-8 overflow-hidden rounded-[1.6rem] bg-surface ring-1 ring-line lg:mt-10">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 p-5 pb-4 sm:p-7 sm:pb-5">
        <div>
          <p className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />Side by side</p>
          <h3 id={id} className="mt-2 text-[1.55rem] font-bold leading-tight sm:text-[1.9rem]">{title}</h3>
          <p className="mt-1 text-[0.92rem] text-muted">Built from each syllabus. Tap a course to open it.</p>
        </div>
        <p className="inline-flex items-center gap-1.5 text-[0.82rem] font-bold text-ink-soft md:hidden" aria-hidden>Swipe to see all <MoveRight className="size-4" /></p>
      </div>
      <div className="relative overflow-x-auto overscroll-x-contain border-t border-line" tabIndex={0} role="region" aria-labelledby={id}>
        <table className="w-full border-separate border-spacing-0 text-[0.88rem]" style={{ minWidth: `${7.5 + courses.length * 6.75}rem` }}>
          <thead>
            <tr>
              <th scope="col" className={cn(head, 'w-[7.5rem] border-b border-r border-line px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-[0.1em] text-muted sm:w-[13rem] sm:px-6')}>Subject</th>
              {courses.map((c) => (
                <th key={c.slug} scope="col" className={cn('border-b border-line px-2 py-3 text-center align-bottom', rec.has(c.slug) && 'bg-accent/[0.07]')}>
                  <Link to={`/courses/${c.slug}`} className="inline-flex min-h-11 flex-col items-center justify-center rounded-xl px-2 font-display text-[1.02rem] font-extrabold leading-tight text-ink hover:text-accent-text sm:text-[1.15rem]">
                    {c.code}
                    {rec.has(c.slug) && <span className="mt-0.5 font-sans text-[0.66rem] font-extrabold uppercase tracking-[0.08em] text-accent-text">For you</span>}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className={cn(head, 'border-b border-r border-line px-4 py-3 text-left font-bold text-ink sm:px-6')}>Duration</th>
              {courses.map((c) => (
                <td key={c.slug} className={cn('border-b border-line px-2 py-3 text-center text-[0.76rem] font-semibold leading-snug text-ink-soft sm:text-[0.8rem]', rec.has(c.slug) && 'bg-accent/[0.07]')}>
                  {c.duration.length ? c.duration.map((d) => <span key={d} className="block py-0.5">{d}</span>) : 'Shared on enquiry'}
                </td>
              ))}
            </tr>
            {rows.map((r) => (
              <tr key={r.label} className="group/row">
                <th scope="row" className={cn(head, 'border-b border-r border-line px-4 py-2.5 text-left font-semibold text-ink-soft transition-colors group-hover/row:text-ink sm:px-6')}>{r.label}</th>
                {r.has.map((on, i) => (
                  <td key={courses[i].slug} className={cn('border-b border-line px-2 py-2.5 text-center transition-colors group-hover/row:bg-surface-2/60', rec.has(courses[i].slug) && 'bg-accent/[0.07]')}>
                    {on ? (
                      <span className="inline-grid size-7 place-items-center rounded-full bg-[#14803f] text-white"><Check className="size-4" strokeWidth={3} aria-hidden /><span className="sr-only">Included</span></span>
                    ) : (
                      <span className="inline-block h-[2px] w-3 rounded-full bg-line align-middle" aria-hidden />
                    )}
                    {!on && <span className="sr-only">Not included</span>}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row" className={cn(head, 'border-r border-line px-4 py-3 text-left font-bold text-ink sm:px-6')}>Syllabus</th>
              {courses.map((c) => (
                <td key={c.slug} className={cn('px-2 py-3 text-center text-[0.8rem] font-bold text-ink', rec.has(c.slug) && 'bg-accent/[0.07]')}>{topicCount(c)} topics</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Reveal>
  )
}
