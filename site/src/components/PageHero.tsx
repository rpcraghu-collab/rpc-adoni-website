import { enter } from '../lib/boot'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ChevronRight } from 'lucide-react'
import { cn } from '../lib/cn'
import { ART_SIZE, artSet } from './course'

const ease = [0.22, 1, 0.36, 1] as const

export type Crumb = { to: string; label: string }

/** Inner-page hero. Same type scale, background and motion as the Home hero. */
export default function PageHero({ eyebrow, title, text, children, art, artNode, artTint = 'bg-surface', crumbs, aside, backdrop }: {
  eyebrow?: ReactNode
  title: ReactNode
  text?: ReactNode
  children?: ReactNode
  /** 3D illustration in a tinted tile (desktop: right column; mobile: small tile beside the title). */
  art?: string
  /** A drawn cover (e.g. CourseArt) used instead of an art image: same two places. */
  artNode?: ReactNode
  artTint?: string
  crumbs?: Crumb[]
  /** Custom right column on desktop (replaces the art tile there). */
  aside?: ReactNode
  /** A real RPC photo drawn faintly behind the hero, fading out toward the text. */
  backdrop?: string
}) {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Cinematic backdrop: drifting colour fields, a dot grid and (optionally) a faint photo. Decorative only,
          kept light enough that the title keeps full contrast, and still under reduced motion. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="aurora absolute -inset-[20%] bg-[radial-gradient(34%_40%_at_82%_18%,rgb(211_32_26/0.11),transparent_70%),radial-gradient(30%_38%_at_12%_78%,rgb(11_30_74/0.08),transparent_70%),radial-gradient(22%_26%_at_60%_70%,rgb(201_150_43/0.08),transparent_70%)] dark:bg-[radial-gradient(34%_40%_at_82%_18%,rgb(221_47_38/0.18),transparent_70%),radial-gradient(30%_38%_at_12%_78%,rgb(70_110_220/0.14),transparent_70%),radial-gradient(22%_26%_at_60%_70%,rgb(217_166_64/0.1),transparent_70%)]" />
        <div className="grain absolute inset-0 opacity-70 [mask-image:radial-gradient(60%_70%_at_75%_25%,#000,transparent)]" />
        {backdrop && (
          <div className="absolute inset-y-0 right-0 w-full opacity-[0.13] [mask-image:linear-gradient(180deg,#000_30%,transparent),linear-gradient(90deg,transparent,#000_55%)] [mask-composite:intersect] [-webkit-mask-composite:source-in] lg:w-[62%] lg:opacity-[0.2] dark:opacity-[0.16] dark:lg:opacity-[0.24]">
            <img src={backdrop} alt="" decoding="async" fetchPriority="low" className="kb-slow size-full object-cover object-[60%_35%] [filter:saturate(0.85)]" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,var(--line)_30%,var(--line)_70%,transparent)]" />
      </div>
      <div className={cn('container-x grid items-center gap-8 pb-10 pt-5 lg:pb-16 lg:pt-12', (art || artNode || aside) && 'lg:grid-cols-[1.35fr_1fr] lg:gap-14')}>
        <div className="min-w-0">
          {crumbs && (
            <nav aria-label="Breadcrumb" className="-mt-2 mb-2">
              <ol className="flex flex-wrap items-center text-sm font-semibold text-muted">
                {crumbs.map((c, i) => (
                  <li key={c.to} className="flex items-center">
                    {i > 0 && <ChevronRight className="mx-0.5 size-3.5 opacity-60" aria-hidden />}
                    <Link to={c.to} className="inline-flex min-h-11 items-center rounded-lg hover:text-ink">{c.label}</Link>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {eyebrow && <motion.p initial={enter({ opacity: 0, y: 8 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />{eyebrow}</motion.p>}
              <motion.h1 initial={enter({ y: 14 })} animate={{ y: 0 }} transition={{ duration: 0.6, delay: 0.04, ease }} className="mt-4 max-w-4xl text-[clamp(2.15rem,4.6vw,3.9rem)] font-extrabold leading-[1] [text-wrap:balance]">
                {title}
              </motion.h1>
            </div>
            {artNode ? (
              <span className="mt-1 size-[4.5rem] shrink-0 overflow-hidden rounded-[1.1rem] shadow-[0_14px_24px_-14px_rgb(11_30_74/0.5)] lg:hidden" aria-hidden>{artNode}</span>
            ) : art && (
              <span className={cn('mt-1 grid size-[4.5rem] shrink-0 place-items-center rounded-[1.1rem] lg:hidden', artTint)} aria-hidden>
                <img src={art} srcSet={artSet(art)} sizes="72px" alt="" width={72} height={72} decoding="async" className="size-[92%] object-contain drop-shadow-[0_8px_10px_rgb(11_30_74/0.18)]" />
              </span>
            )}
          </div>
          {text && <motion.p initial={enter({ y: 10 })} animate={{ y: 0 }} transition={{ duration: 0.6, delay: 0.12 }} className="mt-5 max-w-[38rem] text-[1.06rem] leading-relaxed text-ink-soft">{text}</motion.p>}
          {children && <motion.div initial={enter({ opacity: 0, y: 10 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }}>{children}</motion.div>}
        </div>
        {aside ? (
          <motion.div initial={enter({ opacity: 0, y: 20 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08, ease }} className="hidden lg:block">{aside}</motion.div>
        ) : artNode ? (
          <motion.div initial={enter({ opacity: 0, y: 20 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08, ease }} className="hidden aspect-[4/3] w-full max-w-[26rem] justify-self-end overflow-hidden rounded-[2rem] shadow-[0_40px_70px_-40px_rgb(11_30_74/0.6)] lg:block" aria-hidden>{artNode}</motion.div>
        ) : art ? (
          <motion.div initial={enter({ opacity: 0, y: 20 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08, ease }} className={cn('hidden aspect-[4/3] w-full max-w-[25rem] place-items-center justify-self-end rounded-[2rem] lg:grid', artTint)} aria-hidden>
            <img src={art} srcSet={artSet(art)} sizes="(min-width:1024px) 320px, 1px" alt="" width={ART_SIZE[art]?.[0] ?? 320} height={ART_SIZE[art]?.[1] ?? 320} decoding="async" className="float w-[62%] object-contain drop-shadow-[0_24px_30px_rgb(11_30_74/0.22)]" />
          </motion.div>
        ) : null}
      </div>
    </section>
  )
}
