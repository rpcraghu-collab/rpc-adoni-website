import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ChevronRight } from 'lucide-react'
import { cn } from '../lib/cn'
import { ART_SIZE, artSet } from './course'

const ease = [0.22, 1, 0.36, 1] as const

export type Crumb = { to: string; label: string }

/** Inner-page hero. Same type scale, background and motion as the Home hero. */
export default function PageHero({ eyebrow, title, text, children, art, artTint = 'bg-surface', crumbs, aside }: {
  eyebrow?: ReactNode
  title: ReactNode
  text?: ReactNode
  children?: ReactNode
  /** 3D illustration in a tinted tile (desktop: right column; mobile: small tile beside the title). */
  art?: string
  artTint?: string
  crumbs?: Crumb[]
  /** Custom right column on desktop (replaces the art tile there). */
  aside?: ReactNode
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(42rem_28rem_at_100%_0%,rgb(211_32_26/0.07),transparent_70%),radial-gradient(36rem_30rem_at_0%_80%,rgb(11_30_74/0.05),transparent_70%)]" />
      <div className={cn('container-x grid items-center gap-8 pb-10 pt-5 lg:pb-16 lg:pt-12', (art || aside) && 'lg:grid-cols-[1.35fr_1fr] lg:gap-14')}>
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
              {eyebrow && <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />{eyebrow}</motion.p>}
              <motion.h1 initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.6, delay: 0.04, ease }} className="mt-4 max-w-4xl text-[clamp(2.15rem,4.6vw,3.9rem)] font-extrabold leading-[1] [text-wrap:balance]">
                {title}
              </motion.h1>
            </div>
            {art && (
              <span className={cn('mt-1 grid size-[4.5rem] shrink-0 place-items-center rounded-[1.1rem] lg:hidden', artTint)} aria-hidden>
                <img src={art} srcSet={artSet(art)} sizes="72px" alt="" width={72} height={72} decoding="async" className="size-[92%] object-contain drop-shadow-[0_8px_10px_rgb(11_30_74/0.18)]" />
              </span>
            )}
          </div>
          {text && <motion.p initial={{ y: 10 }} animate={{ y: 0 }} transition={{ duration: 0.6, delay: 0.12 }} className="mt-5 max-w-[38rem] text-[1.06rem] leading-relaxed text-ink-soft">{text}</motion.p>}
          {children && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }}>{children}</motion.div>}
        </div>
        {aside ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08, ease }} className="hidden lg:block">{aside}</motion.div>
        ) : art ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08, ease }} className={cn('hidden aspect-[5/4] place-items-center rounded-[2rem] lg:grid', artTint)} aria-hidden>
            <img src={art} srcSet={artSet(art)} sizes="(min-width:1024px) 320px, 1px" alt="" width={ART_SIZE[art]?.[0] ?? 320} height={ART_SIZE[art]?.[1] ?? 320} decoding="async" className="float w-[62%] object-contain drop-shadow-[0_24px_30px_rgb(11_30_74/0.22)]" />
          </motion.div>
        ) : null}
      </div>
    </section>
  )
}
