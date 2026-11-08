import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, ArrowUpRight, Clock, MapPin, Phone, X } from 'lucide-react'
import { GROUPS, SITE, listed, telLink, waLink } from '../content/site'
import { cn } from '../lib/cn'
import { Logo, WhatsAppIcon } from './ui'

export type NavItem = { to: string; label: string }

const EASE = [0.22, 1, 0.36, 1] as const

/** Short real facts under each menu item (nothing invented: counts come from the content). */
function hint(to: string) {
  switch (to) {
    case '/': return 'Start here'
    case '/about': return `Teaching Adoni since ${SITE.since}`
    case '/courses': return `${listed().length} courses in ${GROUPS.length} tracks`
    case '/awards': return 'Honours and recognitions'
    case '/gallery': return 'Photos from RPC'
    case '/contact': return 'Enquire about the next batch'
    default: return ''
  }
}

/**
 * Full-screen phone menu. Rendered into <body> so nothing (the sticky header, the Call/WhatsApp bar) can paint
 * over it. Always the dark navy look; opens as a circle growing out of the menu button.
 */
export function MobileMenu({ nav, onClose, themeToggle }: { nav: NavItem[]; onClose: () => void; themeToggle: ReactNode }) {
  const reduce = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus({ preventScroll: true })
    const html = document.documentElement
    const prevHtml = html.style.overflow
    const prevBody = document.body.style.overflow
    html.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prevHtml
      document.body.style.overflow = prevBody
      opener?.focus?.({ preventScroll: true })
    }
  }, [])

  const origin = 'calc(100% - 2.6rem) 2.25rem'
  const counts = (id: string) => listed().filter((c) => c.group === id).length
  const featured = listed().filter((c) => c.featured)

  return createPortal(
    <motion.div
      role="dialog" aria-modal="true" aria-label="Menu"
      className="dark fixed inset-0 z-[70] flex flex-col overflow-hidden bg-[#06102a] text-white lg:hidden"
      initial={reduce ? { opacity: 0 } : { clipPath: `circle(0% at ${origin})` }}
      animate={reduce ? { opacity: 1 } : { clipPath: `circle(150% at ${origin})` }}
      exit={reduce ? { opacity: 0 } : { clipPath: `circle(0% at ${origin})`, transition: { duration: 0.42, ease: [0.65, 0, 0.35, 1] } }}
      transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
    >
      {/* Light: two slow colour fields and a dot grain, the same family as the page heroes. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="aurora absolute -right-24 -top-28 size-[26rem] rounded-full bg-[radial-gradient(closest-side,rgb(214_40_40/0.38),transparent)] blur-2xl" />
        <div className="aurora absolute -bottom-40 -left-32 size-[30rem] rounded-full bg-[radial-gradient(closest-side,rgb(56_104_255/0.32),transparent)] blur-2xl [animation-delay:-8s]" />
        <div className="grain absolute inset-0 opacity-70" />
      </div>

      <div className="relative shrink-0 pt-[env(safe-area-inset-top)]">
        <div className="flex h-[4.5rem] items-center justify-between px-4 sm:px-6">
          <Link to="/" onClick={onClose} aria-label="RPC home"><Logo invert /></Link>
          <div className="flex items-center gap-1">
            {themeToggle}
            <button ref={closeRef} onClick={onClose} aria-label="Close menu" className="grid size-11 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition-transform active:scale-90">
              <X className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto overscroll-contain px-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:px-6">
        <nav aria-label="Pages">
          <ul className="mt-1">
            {nav.map((n, i) => (
              <li key={n.to} className="border-b border-white/10">
                <NavLink to={n.to} end={n.to === "/"} onClick={onClose} className="group flex min-h-[4.4rem] items-center gap-4 py-2.5">
                  {({ isActive }) => (
                    <>
                      <span className="w-6 shrink-0 self-start pt-2.5 font-mono text-[0.7rem] font-bold tabular-nums text-white/40">{String(i + 1).padStart(2, '0')}</span>
                      <span className="min-w-0 flex-1 overflow-hidden pb-1">
                        <motion.span
                          className="block"
                          initial={reduce ? false : { y: '110%' }}
                          animate={{ y: '0%' }}
                          transition={{ duration: 0.7, delay: 0.18 + i * 0.05, ease: EASE }}
                        >
                          <span className="flex items-center gap-2.5 font-display text-[2rem] font-bold leading-[1.05] tracking-[-0.01em] text-white">
                            {n.label}
                            {isActive && <span className="rounded-full bg-[#e0392f] px-2 py-0.5 font-sans text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-white">You are here</span>}
                          </span>
                          <span className="mt-1 block truncate text-[0.82rem] font-medium text-white/60">{hint(n.to)}</span>
                        </motion.span>
                      </span>
                      <motion.span
                        aria-hidden
                        initial={reduce ? false : { opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 + i * 0.05, ease: EASE }}
                        className={cn('grid size-10 shrink-0 place-items-center rounded-full ring-1 transition-colors', isActive ? 'bg-white text-[#06102a] ring-white' : 'text-white ring-white/20 group-active:bg-white group-active:text-[#06102a]')}
                      >
                        <ArrowRight className="size-[1.1rem]" />
                      </motion.span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <motion.section
          aria-labelledby="menu-tracks"
          initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
          className="mt-7"
        >
          <div className="flex items-center justify-between">
            <h2 id="menu-tracks" className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-white/60">Find your course</h2>
            <Link to="/courses" onClick={onClose} className="inline-flex min-h-11 items-center gap-1 text-sm font-bold text-white">All {listed().length} courses <ArrowUpRight className="size-4" /></Link>
          </div>
          <div className="no-scrollbar -mx-4 mt-1 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:scroll-px-6 sm:px-6">
            {GROUPS.map((g) => (
              <Link key={g.id} to="/courses" onClick={onClose} className="group relative aspect-[4/5] w-[42%] min-w-[9.5rem] shrink-0 snap-start overflow-hidden rounded-2xl ring-1 ring-white/15">
                <img src={g.art.replace('.webp', '-sm.webp')} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-active:scale-105" />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#06102a] via-[#06102a]/40 to-transparent" />
                <span className="absolute inset-x-3 bottom-3">
                  <span className="block font-display text-[1.1rem] font-bold leading-tight">{g.label}</span>
                  <span className="mt-0.5 block text-[0.75rem] font-semibold text-white/75">{counts(g.id)} courses</span>
                </span>
              </Link>
            ))}
          </div>
          {featured.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="sr-only">Popular courses:</span>
              {featured.map((c) => (
                <Link key={c.slug} to={`/courses/${c.slug}`} onClick={onClose} className="inline-flex min-h-10 items-center rounded-full bg-white/[0.07] px-4 text-[0.85rem] font-bold text-white ring-1 ring-white/15 active:bg-white active:text-[#06102a]">{c.code}</Link>
              ))}
            </div>
          )}
        </motion.section>

        <motion.section
          aria-label="Contact RPC"
          initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
          className="mt-7 rounded-3xl bg-white/[0.06] p-4 ring-1 ring-white/12"
        >
          <p className="font-display text-[1.25rem] font-bold leading-tight">Talk to us today</p>
          <p className="mt-1 text-[0.85rem] text-white/70">Ask about courses, timings and the next batch.</p>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <a href={telLink()} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white text-[0.95rem] font-bold text-[#06102a] active:scale-[0.97]"><Phone className="size-[1.05rem]" /> Call</a>
            <a href={waLink()} target="_blank" rel="noopener" className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#14803f] text-[0.95rem] font-bold text-white active:scale-[0.97]"><WhatsAppIcon className="size-[1.1rem]" /> WhatsApp</a>
          </div>
          <ul className="mt-4 space-y-2 text-[0.82rem] text-white/75">
            <li className="flex items-start gap-2.5"><Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-white/50" /><span>{SITE.timings.map((t) => t.time).join('  ·  ')}</span></li>
            <li>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`} target="_blank" rel="noopener" className="flex items-start gap-2.5 hover:text-white">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-white/50" /><span>{SITE.address}</span>
              </a>
            </li>
          </ul>
        </motion.section>
      </div>
    </motion.div>,
    document.body,
  )
}
