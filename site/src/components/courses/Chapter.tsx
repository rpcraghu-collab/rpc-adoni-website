import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import type { Course, CourseGroup } from '../../content/site'
import { GROUPS, waLink } from '../../content/site'
import { MaskLines, Reveal, WhatsAppIcon, useReduce } from '../ui'
import { GROUP_SCENE, SCENE_SIZE, sceneSet, sceneSrc } from './data'
import RichCourseCard from './RichCourseCard'
import Compare from './Compare'

const COMPARE_TITLE: Partial<Record<CourseGroup, string>> = { diploma: 'Compare diplomas', office: 'Compare office courses' }

/** A wide, dark image banner that opens each group: chapter number, title, blurb, the courses in it, and a WhatsApp ask. */
export function ChapterBanner({ g, list }: { g: (typeof GROUPS)[number]; n?: number; total?: number; list: Course[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReduce()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, (p) => (reduce ? '0%' : `${(p - 0.5) * 12}%`))
  const scene = GROUP_SCENE[g.id]
  return (
    <div ref={ref}>
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#061840] text-white shadow-[0_40px_80px_-40px_rgb(6_24_64/0.7)] ring-1 ring-white/10">
        {/* Scene: a band on top on phones, the whole banner from tablets up. Parallax drift while scrolling. */}
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[12.5rem] overflow-hidden sm:inset-y-0 sm:h-auto">
          <motion.img
            style={{ y }}
            src={sceneSrc(scene)} srcSet={sceneSet(scene)} sizes="(max-width: 639px) 170vw, 100vw"
            width={SCENE_SIZE.width} height={SCENE_SIZE.height} alt="" loading="lazy" decoding="async"
            className="absolute inset-x-0 top-[-8%] h-[116%] w-full object-cover object-[72%_center] sm:object-[80%_center]"
          />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(6_24_64/0.2)_0%,rgb(6_24_64/0)_5rem,rgb(6_24_64/0.9)_10.5rem,#061840_12.5rem)] sm:bg-[linear-gradient(90deg,#061840_0%,rgb(6_24_64/0.94)_34%,rgb(6_24_64/0.4)_62%,rgb(6_24_64/0.05)_85%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_70%_40%,transparent_55%,rgb(2_8_26/0.5)_100%)]" />

        <div className="relative px-5 pb-6 pt-[9.5rem] sm:max-w-[62%] sm:px-9 sm:py-12 lg:max-w-[56%] lg:px-12 lg:py-16">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-white ring-1 ring-white/15 backdrop-blur-md">
            {list.length} {list.length === 1 ? 'course' : 'courses'}
          </p>
          <MaskLines id={`g-${g.id}`} className="mt-4 text-[clamp(2.4rem,7vw,4.4rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-white" lines={[g.label]} />
          <p className="mt-3 max-w-md text-[1rem] leading-relaxed text-white/85 sm:text-[1.08rem]">{g.blurb}</p>
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={`${g.label} courses`}>
            {list.map((c) => <li key={c.slug}><a href={`#course-${c.slug}`} className="inline-flex min-h-11 items-center rounded-full bg-white/10 px-3.5 text-[0.82rem] font-bold text-white ring-1 ring-white/15 transition-colors hover:bg-white/20">{c.code}</a></li>)}
          </ul>
          <a href={waLink(`Hello RPC, I want details about ${g.label} courses (fees and next batch).`)} target="_blank" rel="noopener" className="btn mt-6 h-12 bg-white text-[#0b1e4a] hover:bg-white/90">
            <WhatsAppIcon className="text-[#14803f]" /> Ask about {g.label}
          </a>
        </div>
      </div>
    </div>
  )
}

/** One group of the catalogue: banner, course cards and (for diplomas and office) the compare table. */
export default function Chapter({ g, n, total, list, rec }: { g: (typeof GROUPS)[number]; n: number; total: number; list: Course[]; rec: Set<string> }) {
  const title = COMPARE_TITLE[g.id]
  return (
    <section aria-labelledby={`g-${g.id}`} className="container-x pt-8 lg:pt-14">
      <ChapterBanner g={g} n={n} total={total} list={list} />
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:mt-7 lg:gap-5 xl:grid-cols-4">
        {list.map((c, i) => (
          <Reveal as="li" key={c.slug} delay={Math.min(i, 3) * 0.06} className="h-full">
            <RichCourseCard c={c} rec={rec.has(c.slug)} />
          </Reveal>
        ))}
      </ul>
      {title && <Compare id={`cmp-${g.id}`} title={title} courses={list} rec={rec} />}
    </section>
  )
}
