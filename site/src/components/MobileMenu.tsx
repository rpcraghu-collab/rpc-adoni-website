import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { COURSES, SITE, telLink, waLink } from '../content/site'
import { cn } from '../lib/cn'
import { Logo } from './ui'

/** `external`: `to` is a full URL opened in a new tab (the Google reviews link). */
export type NavItem = { to: string; label: string; external?: boolean }

const EASE = [0.22, 1, 0.36, 1] as const
const IN_OUT = [0.76, 0, 0.24, 1] as const

/** "9:00 am – 1:30 pm" → [540, 810] minutes after midnight; null when the text is not a time range. */
function slot(text: string): [number, number, string, string] | null {
  const t = [...text.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/gi)]
  if (t.length < 2) return null
  const min = (m: RegExpMatchArray) => ((+m[1] % 12) + (m[3].toLowerCase() === 'pm' ? 12 : 0)) * 60 + (+(m[2] ?? 0))
  const say = (m: RegExpMatchArray) => `${m[1]}${m[2] && m[2] !== '00' ? `:${m[2]}` : ''} ${m[3].toLowerCase()}`
  return [min(t[0]), min(t[1]), say(t[0]), say(t[1])]
}

/** Live class status from the daily slots in SITE.timings (admin-editable), in the visitor's local time. */
function classStatus(now: Date): { open: boolean; text: string } {
  const slots = SITE.timings.map((t) => slot(t.time)).filter((s) => s !== null).sort((x, y) => x[0] - y[0])
  if (!slots.length) return { open: false, text: 'Morning & evening batches' }
  const m = now.getHours() * 60 + now.getMinutes()
  const on = slots.find((s) => m >= s[0] && m < s[1])
  if (on) return { open: true, text: `Classes on now · till ${on[3]}` }
  const next = slots.find((s) => m < s[0])
  if (next) return { open: false, text: next === slots[0] ? `Opens today at ${next[2]}` : `Next batch at ${next[2]}` }
  return { open: false, text: `Opens tomorrow at ${slots[0][2]}` }
}

/**
 * Full-screen phone menu: quiet and editorial. The page colour, one hairline grid, big light type and a single red
 * accent for the page you are on. Rendered into <body> so the sticky header and the Call/WhatsApp bar cannot paint
 * over it. Opens as a circle growing out of the menu button; the links rise out of a mask one after another.
 */
export function MobileMenu({ nav, onClose, themeToggle }: { nav: NavItem[]; onClose: () => void; themeToggle: ReactNode }) {
  const reduce = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)
  const closeFn = useRef(onClose)
  closeFn.current = onClose
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus({ preventScroll: true })
    const html = document.documentElement
    const prevHtml = html.style.overflow
    const prevBody = document.body.style.overflow
    html.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeFn.current() }
    window.addEventListener('keydown', onKey)
    return () => {
      html.style.overflow = prevHtml
      document.body.style.overflow = prevBody
      window.removeEventListener('keydown', onKey)
      opener?.focus?.({ preventScroll: true })
    }
  }, [])

  const status = classStatus(new Date())
  const origin = 'calc(100% - 2.6rem) 2.25rem'
  const rise = (i: number) => ({
    initial: reduce ? false : { y: '105%' },
    animate: { y: '0%' },
    transition: { duration: 0.8, delay: 0.22 + i * 0.055, ease: EASE },
  })
  const fade = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: d, ease: EASE },
  })

  return createPortal(
    <motion.div
      role="dialog" aria-modal="true" aria-label="Menu"
      className="fixed inset-0 z-[70] flex flex-col bg-bg text-ink lg:hidden"
      initial={reduce ? { opacity: 0 } : { clipPath: `circle(0% at ${origin})` }}
      animate={reduce ? { opacity: 1 } : { clipPath: `circle(150% at ${origin})` }}
      exit={reduce ? { opacity: 0 } : { clipPath: `circle(0% at ${origin})`, transition: { duration: 0.5, ease: IN_OUT } }}
      transition={{ duration: 0.7, ease: IN_OUT }}
    >
      {/* Header row: the same height and positions as the site header, so the close button sits where "menu" was. */}
      <div className="shrink-0 pt-[env(safe-area-inset-top)]">
        <div className="flex h-[4.5rem] items-center justify-between px-5 sm:px-8">
          <Link to="/" onClick={onClose} aria-label="RPC home"><Logo /></Link>
          <div className="flex items-center gap-1.5">
            {themeToggle}
            <button
              ref={closeRef} onClick={onClose} aria-label="Close menu"
              className="group relative grid size-11 place-items-center rounded-full ring-1 ring-line transition-[transform,background-color] duration-300 hover:bg-ink hover:text-bg active:scale-90"
            >
              <motion.span
                aria-hidden className="relative block size-4"
                initial={reduce ? false : { rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
              >
                <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rotate-45 rounded-full bg-current" />
                <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 -rotate-45 rounded-full bg-current" />
              </motion.span>
            </button>
          </div>
        </div>
        <motion.div
          aria-hidden className="mx-5 h-px origin-left bg-line sm:mx-8"
          initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: EASE }}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] sm:px-8">
        <nav aria-label="Pages" className="flex flex-1 flex-col justify-center py-6">
          <motion.p {...fade(0.3)} className="mb-5 flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
            <span aria-hidden className="relative grid size-2 place-items-center">
              {status.open && !reduce && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />}
              <span className={cn('relative size-2 rounded-full', status.open ? 'bg-emerald-500' : 'bg-muted/60')} />
            </span>
            {status.text}
          </motion.p>
          <ul>
            {nav.map((n, i) => {
              const row = 'group flex items-baseline justify-between gap-4 py-[0.55rem] outline-none focus-visible:[&_.lbl]:underline'
              const inner = ({ isActive }: { isActive: boolean }) => (
                    <>
                      <span className="block overflow-hidden pb-[0.12em]">
                        <motion.span {...rise(i)} className="flex items-center gap-3">
                          <span
                            aria-hidden
                            className={cn('size-2 shrink-0 rounded-full bg-accent transition-[transform,opacity] duration-500', isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0')}
                          />
                          <span
                            className={cn(
                              'lbl font-display text-[clamp(2.4rem,11vw,3.4rem)] font-medium leading-[1] tracking-[-0.035em] transition-[transform,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-active:translate-x-1.5',
                              isActive ? 'text-ink' : 'text-ink/[0.42] group-hover:text-ink group-active:text-ink',
                            )}
                          >
                            {n.label}
                            {n.external && <ArrowUpRight className="ml-1 inline size-[0.5em] align-middle opacity-60" aria-hidden />}
                            {n.to === '/courses' && (
                              <sup className="ml-1.5 align-super font-mono text-[0.75rem] font-normal tracking-normal text-accent-text">{COURSES.length}</sup>
                            )}
                          </span>
                        </motion.span>
                      </span>
                      <motion.span
                        {...fade(0.4 + i * 0.05)}
                        aria-hidden
                        className={cn('font-mono text-[0.7rem] tabular-nums tracking-[0.08em]', isActive ? 'text-accent-text' : 'text-muted')}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </motion.span>
                      {isActive && <span className="sr-only">(current page)</span>}
                    </>
                  )
              return (
                <li key={n.to}>
                  {n.external ? (
                    <a href={n.to} target="_blank" rel="noopener" onClick={onClose} className={row}>
                      {inner({ isActive: false })}
                      <span className="sr-only"> (Google, opens in a new tab)</span>
                    </a>
                  ) : (
                    <NavLink to={n.to} end={n.to === '/'} onClick={onClose} className={row}>{inner}</NavLink>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        <motion.div {...fade(0.62)} className="shrink-0">
          <div className="grid grid-cols-2 border-t border-line">
            <a href={telLink()} className="group flex min-h-[4.5rem] flex-col justify-center border-r border-line pr-4">
              <span className="flex items-center gap-1 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted">Call <ArrowUpRight aria-hidden className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
              <span className="mt-1 text-[0.95rem] font-semibold tabular-nums">{SITE.phone}</span>
            </a>
            <a href={waLink()} target="_blank" rel="noopener" className="group flex min-h-[4.5rem] flex-col justify-center pl-4">
              <span className="flex items-center gap-1 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted">WhatsApp <ArrowUpRight aria-hidden className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
              <span className="mt-1 text-[0.95rem] font-semibold">Ask about a course</span>
            </a>
          </div>
          <div className="flex items-end justify-between gap-4 border-t border-line pt-4 text-[0.8rem] leading-relaxed text-muted">
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`} target="_blank" rel="noopener" className="hover:text-ink">
              {SITE.addressShort}<br />{SITE.timings.map((t) => t.time).join(' · ')}
            </a>
            <span className="shrink-0 font-mono text-[0.7rem] tracking-[0.08em]">Est. {SITE.since}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>,
    document.body,
  )
}
