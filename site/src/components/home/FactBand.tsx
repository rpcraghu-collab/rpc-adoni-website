import { Fragment } from 'react'
import { SITE, listed } from '../../content/site'
import { cn } from '../../lib/cn'
import { useYears } from '../../lib/years'

/** Only true facts from the client (CLIENT.md). */
const facts = (years: number) => ['ISO 9001:2015 certified', '5× Education Excellence Award', `Teaching computers since ${SITE.since}`, `${years} years in Adoni`, 'Morning & evening batches']

function Row({ items, rev, dur, className, star }: { items: string[]; rev?: boolean; dur: number; className?: string; star: string }) {
  const half = (dup: boolean) => (
    <ul aria-hidden={dup || undefined} className={cn('flex shrink-0 items-center', dup && 'mq-dup')}>
      {items.map((t) => (
        <Fragment key={t}>
          <li className="whitespace-nowrap px-5 sm:px-7">{t}</li>
          <li aria-hidden className={cn('shrink-0', star)}>✦</li>
        </Fragment>
      ))}
    </ul>
  )
  return (
    <div className={cn('mq-row overflow-hidden', className)}>
      <div className={cn('mq-track', rev && 'mq-rev')} style={{ ['--mq-dur' as string]: `${dur}s` }}>
        {half(false)}
        {half(true)}
      </div>
    </div>
  )
}

/**
 * Two crossing tapes of text that drift in opposite directions under the hero:
 * the courses, then the institute's facts. Hover pauses a tape; reduced motion shows them as still, wrapped lines.
 */
export default function FactBand() {
  const FACTS = facts(useYears())
  const courses = listed().map((c) => c.code)
  return (
    <section aria-label="Courses and facts at a glance" className="relative z-[1] overflow-hidden py-10 sm:py-14">
      <div className="-rotate-[2.2deg] scale-x-[1.04]">
        <Row
          items={courses} dur={46} star="text-[0.6em] text-[#ff7a72]"
          className="bg-[#0b1e4a] py-3.5 font-display text-[clamp(1.6rem,4.2vw,3rem)] font-extrabold uppercase leading-none tracking-[-0.01em] text-white shadow-[0_24px_50px_-28px_rgb(11_30_74/0.7)] sm:py-5"
        />
      </div>
      <div className="-mt-1 rotate-[1.4deg] scale-x-[1.04]">
        <Row
          items={FACTS} rev dur={52} star="text-[0.7em] text-accent-text"
          className="border-y border-line bg-surface py-3 text-[clamp(0.95rem,1.8vw,1.2rem)] font-bold text-ink sm:py-4"
        />
      </div>
    </section>
  )
}
