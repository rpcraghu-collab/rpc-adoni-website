import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'motion/react'
import { ArrowRight, ArrowUpRight, ChevronDown, Clock, Mail, MapPin, Menu, Moon, Phone, Sun, X } from 'lucide-react'
import { GROUPS, SITE, listed, telLink, waLink } from '../content/site'
import { LIVE } from '../lib/content'
import { useTheme } from '../lib/theme'
import { cn } from '../lib/cn'
import { Logo, WhatsAppIcon } from './ui'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About RPC' },
  { to: '/courses', label: 'Courses' },
  { to: '/awards', label: 'Awards' },
  { to: '/contact', label: 'Admissions' },
]

function ThemeToggle({ className }: { className?: string }) {
  const { dark, toggle } = useTheme()
  return (
    <button onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} className={cn('grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-surface-2', className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={dark ? 'm' : 's'} initial={{ rotate: -90, opacity: 0, scale: 0.6 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.6 }} transition={{ duration: 0.22 }}>
          {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

function MegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-1/2 top-full z-50 mt-3 w-[min(880px,calc(100vw-3rem))] origin-top -translate-x-1/2 overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_30px_80px_-30px_rgb(11_30_74/0.45)]"
    >
      <div className="grid grid-cols-[1fr_1fr_1fr_15rem]">
        {GROUPS.map((g) => (
          <div key={g.id} className="border-r border-line p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{g.label}</p>
            <ul className="mt-3 space-y-0.5">
              {listed().filter((c) => c.group === g.id).map((c) => (
                <li key={c.slug}>
                  <Link onClick={onClose} to={`/courses/${c.slug}`} className="group flex items-center justify-between rounded-xl px-2.5 py-2 text-[0.95rem] font-semibold text-ink hover:bg-surface-2">
                    {c.code}
                    <ArrowRight className="size-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="flex flex-col justify-between bg-brand p-5 text-brand-ink">
          <div>
            <p className="font-display text-xl font-bold leading-tight">Not sure which course fits you?</p>
            <p className="mt-2 text-sm text-white/75">Tell us your qualification on WhatsApp. We will suggest the right course and batch.</p>
          </div>
          <a href={waLink('Hello RPC, please suggest the right computer course for me.')} target="_blank" rel="noopener" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white">
            <WhatsAppIcon className="size-4" /> Ask on WhatsApp <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mega, setMega] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()
  const loc = useLocation()
  const timer = useRef<number | undefined>(undefined)
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 12))
  useEffect(() => { setOpen(false); setMega(false) }, [loc.pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); setMega(false) } }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  const showMega = () => { window.clearTimeout(timer.current); setMega(true) }
  const hideMega = () => { timer.current = window.setTimeout(() => setMega(false), 120) }

  return (
    <header className="sticky top-0 z-40 pt-[env(safe-area-inset-top)]">
      <div className={cn('transition-[background-color,box-shadow,border-color] duration-300', scrolled ? 'border-b border-line bg-glass shadow-[0_8px_30px_-20px_rgb(11_30_74/0.4)] backdrop-blur-xl backdrop-saturate-150' : 'border-b border-transparent')}>
        <nav className="container-x flex h-[4.5rem] items-center justify-between gap-4" aria-label="Main">
          <Link to="/" className="flex items-center gap-3" aria-label="RPC since 2000, home">
            <Logo />
            <span className="hidden text-[0.8rem] font-bold leading-tight text-ink-soft sm:block">Real Point<br />Computer Education</span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) =>
              n.to === '/courses' ? (
                <li key={n.to} className="relative flex items-center" onMouseEnter={showMega} onMouseLeave={hideMega}>
                  <NavLink to={n.to} className={({ isActive }) => cn('inline-flex items-center gap-1 rounded-full px-4 py-2.5 text-[0.95rem] font-semibold transition-colors hover:bg-surface-2', isActive ? 'text-accent-text' : 'text-ink')}>
                    {n.label}
                  </NavLink>
                  <button aria-label="Show all courses" aria-expanded={mega} onClick={() => setMega((m) => !m)} className="-ml-2 inline-grid size-8 place-items-center rounded-full text-ink hover:bg-surface-2">
                    <ChevronDown className={cn('size-4 transition-transform', mega && 'rotate-180')} />
                  </button>
                  <AnimatePresence>{mega && <MegaMenu onClose={() => setMega(false)} />}</AnimatePresence>
                </li>
              ) : (
                <li key={n.to}>
                  <NavLink to={n.to} end className={({ isActive }) => cn('rounded-full px-4 py-2.5 text-[0.95rem] font-semibold transition-colors hover:bg-surface-2', isActive ? 'text-accent-text' : 'text-ink')}>
                    {n.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <a href={telLink()} className="hidden items-center gap-2 rounded-full px-3 py-2.5 text-[0.95rem] font-bold text-ink hover:bg-surface-2 xl:inline-flex">
              <Phone className="size-4" /> {SITE.phone}
            </a>
            <Link to="/contact" className="btn-primary hidden min-h-11 px-5 lg:inline-flex">Enquire now</Link>
            <button onClick={() => setOpen(true)} aria-label="Open menu" className="grid size-11 place-items-center rounded-full text-ink hover:bg-surface-2 lg:hidden">
              <Menu className="size-6" />
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-[#050b1c]/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              role="dialog" aria-modal="true" aria-label="Menu"
              initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              className="relative max-h-[100dvh] overflow-y-auto rounded-b-[2rem] bg-bg px-5 pb-8 pt-[calc(env(safe-area-inset-top)+0.75rem)]"
            >
              <div className="flex h-14 items-center justify-between">
                <Logo />
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="grid size-11 place-items-center rounded-full bg-surface-2 text-ink"><X className="size-5" /></button>
              </div>
              <ul className="mt-4">
                {NAV.map((n, i) => (
                  <motion.li key={n.to} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 + i * 0.04 }}>
                    <NavLink to={n.to} end onClick={() => setOpen(false)} className={({ isActive }) => cn('flex items-center justify-between border-b border-line py-4 font-display text-[1.7rem] font-bold', isActive ? 'text-accent-text' : 'text-ink')}>
                      {n.label} <ArrowRight className="size-5 text-muted" />
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-muted">Popular courses</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {listed().filter((c) => c.featured).map((c) => (
                  <Link key={c.slug} to={`/courses/${c.slug}`} onClick={() => setOpen(false)} className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-bold text-ink">{c.code}</Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function BottomBar() {
  return (
    <nav aria-label="Quick contact" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-glass pb-[env(safe-area-inset-bottom)] backdrop-blur-xl backdrop-saturate-150 lg:hidden">
      <div className="grid grid-cols-3 gap-2 px-3 py-2">
        <a href={telLink()} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl text-sm font-bold text-ink active:bg-surface-2"><Phone className="size-[1.1rem]" /> Call</a>
        <a href={waLink()} target="_blank" rel="noopener" className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#14803f] text-sm font-bold text-white active:scale-[0.97]"><WhatsAppIcon className="size-[1.15rem]" /> WhatsApp</a>
        <Link to="/contact" className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-accent text-sm font-bold text-white active:scale-[0.97]">Enquire</Link>
      </div>
    </nav>
  )
}

function WhatsAppFab() {
  return (
    <a href={waLink()} target="_blank" rel="noopener" aria-label="Chat with RPC on WhatsApp" className="group fixed bottom-6 right-6 z-40 hidden items-center gap-2 rounded-full bg-[#14803f] p-4 text-white shadow-[0_18px_40px_-12px_rgb(23_138_72/0.7)] transition-transform hover:scale-105 lg:flex">
      <WhatsAppIcon className="size-6" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold transition-[max-width] duration-300 group-hover:max-w-40">Chat with us</span>
    </a>
  )
}

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#071330] text-white">
      <div className="container-x relative z-10 grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo invert />
          <p className="mt-5 max-w-xs text-[0.95rem] leading-relaxed text-white/70">Real Point Computer Education. Job-oriented computer courses in Adoni since 2000. ISO 9001:2015 certified.</p>
          <p className="mt-5 font-display text-lg font-semibold text-white/90">Learn Today… Build a Better Tomorrow.</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">Explore</p>
          <ul className="mt-4 space-y-2.5 text-[0.95rem]">
            {NAV.map((n) => <li key={n.to}><Link to={n.to} className="text-white/80 hover:text-white">{n.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">Courses</p>
          <ul className="mt-4 space-y-2.5 text-[0.95rem]">
            {listed().slice(0, 6).map((c) => <li key={c.slug}><Link to={`/courses/${c.slug}`} className="text-white/80 hover:text-white">{c.code}</Link></li>)}
          </ul>
        </div>
        <div className="space-y-4 text-[0.95rem]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">Visit or call</p>
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`} target="_blank" rel="noopener" className="flex gap-3 text-white/80 hover:text-white"><MapPin className="mt-0.5 size-4 shrink-0" />{SITE.address}</a>
          <a href={telLink()} className="flex gap-3 text-white/80 hover:text-white"><Phone className="mt-0.5 size-4 shrink-0" />{SITE.phone}</a>
          <a href={`mailto:${SITE.email}`} className="flex gap-3 text-white/80 hover:text-white"><Mail className="mt-0.5 size-4 shrink-0" />{SITE.email}</a>
          <p className="flex gap-3 text-white/80"><Clock className="mt-0.5 size-4 shrink-0" /><span>{SITE.timings.map((t) => <span key={t.label} className="block">{t.label}: {t.time}</span>)}</span></p>
          <a href={SITE.facebook} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-bold text-white hover:underline">Facebook: rpcadoni <ArrowUpRight className="size-4" /></a>
        </div>
      </div>
      <div className="relative z-10 border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 pb-28 text-sm text-white/60 sm:flex-row sm:justify-between lg:pb-6">
          <p>© {new Date().getFullYear()} Real Point Computer Education, Adoni.</p>
          <p>ISO 9001:2015 · AP Govt DET permission · MSME registered</p>
        </div>
      </div>
      <p aria-hidden className="pointer-events-none absolute -bottom-[0.18em] left-1/2 -translate-x-1/2 select-none font-display text-[30vw] font-extrabold leading-none text-white/[0.035]">RPC</p>
    </footer>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only z-50 rounded-full bg-accent px-4 py-2 font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      {LIVE.announcement && (
        <Link to="/contact" className="block bg-brand px-4 py-2.5 text-center text-sm font-bold text-white hover:underline">
          {LIVE.announcement} <ArrowRight className="inline size-4 align-[-0.2em]" />
        </Link>
      )}
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <BottomBar />
      <WhatsAppFab />
    </>
  )
}
