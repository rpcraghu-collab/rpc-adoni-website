import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { TOOLS, listed, waLink, type Course } from '../../content/site'
import { groupOf } from '../course'
import { MaskLines, Reveal, WhatsAppIcon } from '../ui'
import { cn } from '../../lib/cn'

/** One drifting row. The second copy makes the loop seamless and is hidden from screen readers and the keyboard. */
function Row<T>({ items, render, rev, dur, keyOf }: { items: T[]; render: (t: T, i: number, dup: boolean) => ReactNode; rev?: boolean; dur: number; keyOf: (t: T) => string }) {
  const half = (dup: boolean) => (
    <ul aria-hidden={dup || undefined} className={cn('flex shrink-0 gap-4 pr-4', dup && 'mq-dup')}>
      {items.map((t, i) => <Fragment key={keyOf(t)}>{render(t, i, dup)}</Fragment>)}
    </ul>
  )
  return (
    <div className="mq-row">
      <div className={cn('mq-track', rev && 'mq-rev')} style={{ ['--mq-dur' as string]: `${dur}s` }}>
        {half(false)}
        {half(true)}
      </div>
    </div>
  )
}

function CourseTile({ c, i, dup, detail }: { c: Course; i: number; dup: boolean; detail?: boolean }) {
  const hot = i % 5 === 0
  return (
    <li>
      <Link
        to={`/courses/${c.slug}`}
        tabIndex={dup ? -1 : undefined}
        className={cn(
          'group flex h-[7.5rem] w-[15rem] flex-col justify-between rounded-[1.4rem] p-4 ring-1 transition-[transform,background-color] duration-300 hover:-translate-y-1 sm:h-[8.5rem] sm:w-[17rem] sm:p-5',
          hot ? 'bg-accent text-white ring-white/10' : 'bg-white/[0.07] text-white ring-white/12 hover:bg-white/[0.12]',
        )}
      >
        <span className="flex items-start justify-between gap-3">
          <span className="font-display text-[1.75rem] font-extrabold leading-none tracking-[-0.02em] sm:text-[2rem]">{c.code}</span>
          <ArrowRight className="mt-1 size-4 shrink-0 opacity-70 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
        <span className={cn('line-clamp-2 text-[0.82rem] font-semibold leading-snug', hot ? 'text-white/90' : 'text-white/75')}>
          {detail ? (c.duration[0] ?? c.forWho) : `${groupOf(c.group).label} · ${c.code === c.name ? c.forWho : c.name}`}
        </span>
      </Link>
    </li>
  )
}

/**
 * "All courses at a glance": every course and tool on a tilted 3D wall whose rows drift in opposite
 * directions. Hover or keyboard focus stops it; reduced motion shows the rows still.
 */
export default function CardWall() {
  const courses = listed()
  const half = Math.ceil(courses.length / 2)
  const rowA = courses
  const rowC = [...courses.slice(half), ...courses.slice(0, half)].reverse()
  return (
    <section className="dark relative isolate overflow-hidden bg-[#061840] py-16 text-ink lg:py-24" aria-labelledby="wall-h">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_80%_0%,rgb(211_32_26/0.22),transparent_70%),radial-gradient(50%_60%_at_0%_100%,rgb(201_150_43/0.12),transparent_70%)]" />
      <div className="container-x">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />Everything we teach</p>
            <MaskLines id="wall-h" className="mt-3 text-[clamp(1.9rem,4.2vw,3.1rem)] font-bold leading-[1.04] text-white" lines={['All courses', 'at a glance.']} />
            <p className="mt-3 max-w-xl text-[1.02rem] leading-relaxed text-white/75">Diplomas, office and accounts, and programming, with the tools you will use in each. Tap any course to see its syllabus.</p>
          </div>
        </Reveal>
      </div>

      <div className="relative mt-6 h-[25rem] overflow-hidden [perspective:1600px] sm:h-[31rem] lg:h-[34rem]">
        <div className="wall-plane absolute inset-x-[-12%] top-[10%] flex flex-col gap-4">
          <Row items={rowA} dur={70} keyOf={(c) => c.slug} render={(c, i, dup) => <CourseTile c={c} i={i} dup={dup} />} />
          <Row
            items={TOOLS} rev dur={58} keyOf={(t) => t}
            render={(t, i) => (
              <li className={cn('flex h-[4.25rem] items-center gap-3 whitespace-nowrap rounded-full px-6 text-[1.05rem] font-bold ring-1 sm:h-[4.75rem] sm:px-7 sm:text-[1.2rem]', i % 4 === 1 ? 'bg-[#c9962b] text-[#1a1203] ring-white/10' : 'bg-white/[0.05] text-white ring-white/12')}>
                <span aria-hidden className={cn('size-2 rounded-full', i % 4 === 1 ? 'bg-[#1a1203]/60' : 'bg-[#ff7a72]')} />
                {t}
              </li>
            )}
          />
          <Row items={rowC} dur={84} keyOf={(c) => c.slug} render={(c, i, dup) => <CourseTile c={c} i={i + 2} dup={dup} detail />} />
          <Row
            items={[...TOOLS].reverse()} rev dur={66} keyOf={(t) => t}
            render={(t) => (
              <li className="flex h-[4.25rem] items-center whitespace-nowrap rounded-full px-6 font-display text-[1.05rem] font-bold uppercase tracking-[0.04em] text-white/55 ring-1 ring-white/10 sm:h-[4.75rem] sm:text-[1.2rem]">{t}</li>
            )}
          />
        </div>
        {/* Soft edges so the wall fades into the section instead of being cut off. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#061840_0%,transparent_18%,transparent_72%,#061840_100%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#061840_0%,transparent_14%,transparent_86%,#061840_100%)]" />
      </div>

      <div className="container-x relative mt-2 flex flex-wrap items-center gap-3">
        <Link to="/courses" className="btn bg-white text-[#0b1e4a] hover:bg-white/90">
          See every course
          <span className="-mr-3 grid size-8 place-items-center rounded-full bg-[#0b1e4a] text-white"><ArrowRight className="size-4" aria-hidden /></span>
        </Link>
        <a href={waLink('Hello RPC, please help me choose a course.')} target="_blank" rel="noopener" className="btn border border-white/20 text-white hover:bg-white/10">
          <WhatsAppIcon /> Help me choose
        </a>
      </div>
    </section>
  )
}
