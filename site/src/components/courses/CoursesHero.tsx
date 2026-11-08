import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowDown, ArrowRight, Backpack, BadgeCheck, BriefcaseBusiness, Check, Clock, GraduationCap, NotebookPen, UserRound, type LucideIcon } from 'lucide-react'
import { CREDENTIALS, FINDER, SITE, type Course } from '../../content/site'
import { MaskLines, useReduce } from '../ui'
import { CourseArt } from '../CourseArt'
import { cn } from '../../lib/cn'
import { SCENE_SIZE, sceneSet, sceneSrc } from './data'
import './courses.css'

const SCENES = ['hero-achieve', 'hero-office', 'hero-code', 'hero-career']
const ICON: Record<string, LucideIcon> = { school: Backpack, inter: NotebookPen, degree: GraduationCap, work: BriefcaseBusiness }

/** Courses for one FINDER persona, in its order, leaving out hidden or missing ones. */
export const personaCourses = (id: string | null, all: Course[]) =>
  (FINDER.find((f) => f.id === id)?.slugs ?? []).map((s) => all.find((c) => c.slug === s)).filter((c): c is Course => !!c)

/**
 * Dark, cinematic opening of the Courses page: crossfading 3D scenes, the live course count, and a
 * "Who are you?" picker that marks the courses that fit (same FINDER data as the Home finder).
 */
export default function CoursesHero({ all, who, onWho, onShow }: { all: Course[]; who: string | null; onWho: (id: string | null) => void; onShow: () => void }) {
  const reduce = useReduce()
  const [scene, setScene] = useState(0)
  useEffect(() => {
    if (reduce) return
    const t = window.setInterval(() => { if (!document.hidden) setScene((s) => (s + 1) % SCENES.length) }, 7000)
    return () => clearInterval(t)
  }, [reduce])
  const persona = FINDER.find((f) => f.id === who)
  const recs = personaCourses(who, all)
  const personas = FINDER.filter((f) => personaCourses(f.id, all).length)
  const iso = CREDENTIALS[0]

  return (
    <section aria-labelledby="courses-title" className="dark px-2 pt-2 sm:px-3 lg:px-4">
      <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-[#061840] text-white shadow-[0_40px_90px_-50px_rgb(6_24_64/0.9)] lg:rounded-[2.25rem]">
        {/* Scenes: a band on top on phones, the right side from tablets up. Illustrations, not RPC photos. */}
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[16.5rem] overflow-hidden sm:inset-y-0 sm:left-[22%] sm:h-auto">
          {SCENES.map((s, i) => (
            <div key={s} className={cn('scene absolute inset-0', i === scene && 'is-on')}>
              <img
                src={sceneSrc(s)} srcSet={sceneSet(s)} sizes="(max-width: 639px) 170vw, 80vw"
                width={SCENE_SIZE.width} height={SCENE_SIZE.height} alt=""
                loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'low'} decoding="async"
                className="size-full object-cover object-[74%_center] sm:object-[78%_center]"
              />
            </div>
          ))}
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(6_24_64/0.35)_0%,rgb(6_24_64/0)_5rem,rgb(6_24_64/0.85)_12.5rem,#061840_16.5rem)] sm:bg-[linear-gradient(90deg,#061840_0%,#061840_24%,rgb(6_24_64/0.9)_42%,rgb(6_24_64/0.35)_68%,rgb(6_24_64/0.1)_100%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_0%_100%,rgb(211_32_26/0.22),transparent_70%)]" />
        <div aria-hidden className="film-grain pointer-events-none absolute -inset-[20%] -z-10 opacity-[0.07]" />

        <div className="relative px-5 pb-6 pt-[12.75rem] sm:px-9 sm:pb-10 sm:pt-16 lg:px-14 lg:pb-14 lg:pt-20">
          <div className="sm:max-w-[62%] lg:max-w-[52%]">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-white ring-1 ring-white/15 backdrop-blur-md">
              <span className="size-1.5 rounded-full bg-[#ff7a72]" aria-hidden /> Courses & programs · Adoni
            </p>
            <MaskLines
              as="h1" id="courses-title"
              className="mt-4 text-[clamp(2.7rem,11.5vw,5.6rem)] font-extrabold leading-[0.92] tracking-[-0.04em] text-white"
              lines={[<><span className="text-[#ff7a72]">{all.length}</span> courses.</>, <span className="text-white/70">One for every stage.</span>]}
            />
            <p className="mt-4 max-w-md text-[1rem] leading-relaxed text-white/85 sm:text-[1.1rem]">
              Diplomas, office and Tally skills, or a single programming language. Every course is 100% practical and ends with a certificate.
            </p>
          </div>

          {/* Who are you? */}
          {personas.length > 0 && (
            <div className="mt-7 lg:mt-10">
              <p id="who-label" className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-white/75">Who are you? <span className="font-semibold normal-case tracking-normal text-white/60">Tap one to see your courses.</span></p>
              <div role="group" aria-labelledby="who-label" className="mt-3 grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4 lg:gap-3">
                {personas.map((f) => {
                  const Icon = ICON[f.id] ?? UserRound
                  const on = who === f.id
                  return (
                    <button
                      key={f.id} type="button" aria-pressed={on} onClick={() => onWho(on ? null : f.id)}
                      className={cn(
                        'group relative flex min-h-[5.75rem] flex-col items-start justify-between gap-2 rounded-[1.15rem] p-3.5 text-left ring-1 backdrop-blur-md transition-[background-color,color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.97] sm:p-4 lg:min-h-[6.5rem]',
                        on ? 'bg-white text-[#0b1e4a] shadow-[0_20px_40px_-20px_rgb(0_0_0/0.8)] ring-white' : 'bg-[#0b1e4a]/85 text-white ring-white/15 hover:bg-[#13285e] hover:ring-white/30',
                      )}
                    >
                      <span className="flex w-full items-center justify-between">
                        <span className={cn('grid size-9 place-items-center rounded-xl transition-colors', on ? 'bg-[#d3201a] text-white' : 'bg-white/10 text-white')}><Icon className="size-[1.15rem]" aria-hidden /></span>
                        <span className={cn('grid size-6 place-items-center rounded-full ring-1 transition-colors', on ? 'bg-[#0b1e4a] text-white ring-[#0b1e4a]' : 'text-transparent ring-white/30')} aria-hidden><Check className="size-3.5" strokeWidth={3} /></span>
                      </span>
                      <span>
                        <span className="block text-[0.98rem] font-bold leading-tight lg:text-[1.05rem]">{f.label}</span>
                        <span className={cn('mt-0.5 block text-[0.78rem] font-semibold leading-snug', on ? 'text-[#0b1e4a]/75' : 'text-white/70')}>{f.note}</span>
                      </span>
                    </button>
                  )
                })}
              </div>

              <div aria-live="polite">
                <AnimatePresence initial={false}>
                  {persona && recs.length > 0 && (
                    <motion.div
                      key="recs"
                      initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 rounded-[1.25rem] bg-white/[0.07] p-3.5 ring-1 ring-white/15 backdrop-blur-md sm:p-4">
                        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                          <p className="text-[0.95rem] font-bold text-white">Recommended for you <span className="text-white/60">· {persona.label}</span></p>
                          <button type="button" onClick={onShow} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-[#d3201a] px-4 text-[0.86rem] font-bold text-white transition-colors hover:bg-[#b81b16]">
                            Show them in the list <ArrowDown className="size-4" aria-hidden />
                          </button>
                        </div>
                        <ul className="no-scrollbar -mx-3.5 mt-3 flex snap-x gap-2 overflow-x-auto px-3.5 sm:-mx-4 sm:px-4 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
                          {recs.map((c, i) => (
                            <motion.li key={c.slug} className="w-[12.5rem] shrink-0 snap-start lg:w-auto" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.05, duration: 0.4 }}>
                              <Link to={`/courses/${c.slug}`} className="group flex h-full flex-col rounded-2xl bg-white p-3.5 text-[#0b1e4a] transition-transform duration-300 hover:-translate-y-0.5">
                                <span className="flex items-center gap-2.5">
                                  <span className="relative size-10 shrink-0 overflow-hidden rounded-xl"><CourseArt slug={c.slug} className="absolute inset-0 size-full" /></span>
                                  <span className="min-w-0 flex-1 truncate font-display text-[1.35rem] font-extrabold leading-none tracking-[-0.03em]">{c.code}</span>
                                  <ArrowRight className="size-4 text-[#d3201a] transition-transform group-hover:translate-x-0.5" aria-hidden />
                                </span>
                                <span className="mt-1.5 line-clamp-2 text-[0.8rem] font-semibold leading-snug text-[#0b1e4a]/75">{c.code === c.name ? c.tagline : c.name}</span>
                                <span className="mt-auto inline-flex items-center gap-1 pt-2 text-[0.74rem] font-bold text-[#0b1e4a]/70"><Clock className="size-3.5" aria-hidden />{c.duration[0] ?? 'Duration shared on enquiry'}</span>
                              </Link>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          <ul className="mt-6 flex flex-wrap gap-2 text-[0.82rem] font-semibold text-white/85">
            {SITE.timings.map((t) => (
              <li key={t.label} className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] px-3 py-1.5 ring-1 ring-white/15"><Clock className="size-3.5 text-white/60" aria-hidden />{t.label.split(' ')[0]} {t.time}</li>
            ))}
            {iso && <li className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] px-3 py-1.5 ring-1 ring-white/15"><BadgeCheck className="size-3.5 text-white/60" aria-hidden />{iso.title} · {iso.text}</li>}
          </ul>
        </div>
      </div>
    </section>
  )
}
