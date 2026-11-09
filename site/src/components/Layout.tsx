import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'motion/react'
import { ArrowRight, ArrowUpRight, ChevronDown, Clock, Mail, MapPin, Menu, Moon, Phone, Sun } from "lucide-react"
import { GROUPS, SITE, listed, telLink, waLink } from '../content/site'
import { LIVE } from '../lib/content'
import { useTheme } from '../lib/theme'
import { cn } from '../lib/cn'
import { Logo, WhatsAppIcon } from './ui'
import { MobileMenu } from './MobileMenu'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About RPC' },
  { to: '/courses', label: 'Courses' },
  { to: '/awards', label: 'Awards' },
  { to: '/gallery', label: 'Gallery' },
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
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); setMega(false) } }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  const overHero = loc.pathname === '/' && !scrolled
  const showMega = () => { window.clearTimeout(timer.current); setMega(true) }
  const hideMega = () => { timer.current = window.setTimeout(() => setMega(false), 120) }

  return (
    <header className="sticky top-0 z-40 pt-[env(safe-area-inset-top)]">
      {/* Home: the header sits on the dark hero until the page scrolls, so it uses the dark tokens there. */}
      <div className={cn('transition-[background-color,box-shadow,border-color] duration-300', overHero && 'dark', scrolled ? 'border-b border-line bg-glass shadow-[0_8px_30px_-20px_rgb(11_30_74/0.4)] backdrop-blur-xl backdrop-saturate-150' : 'border-b border-transparent')}>
        <nav className="container-x flex h-[4.5rem] items-center justify-between gap-4" aria-label="Main">
          <Link to="/" className="flex items-center gap-3">
            <Logo />
            <span className="hidden text-[0.8rem] font-bold leading-tight text-ink-soft sm:block lg:hidden xl:block">Real Point<br />Computer Education</span>
            <span className="sr-only"> (home)</span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) =>
              n.to === '/courses' ? (
                <li key={n.to} className="relative flex items-center" onMouseEnter={showMega} onMouseLeave={hideMega}>
                  <NavLink to={n.to} className={({ isActive }) => cn('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2.5 text-[0.95rem] font-semibold xl:px-4 transition-colors hover:bg-surface-2', isActive ? 'text-accent-text' : 'text-ink')}>
                    {n.label}
                  </NavLink>
                  <button aria-label="Show all courses" aria-expanded={mega} onClick={() => setMega((m) => !m)} className="-ml-2 inline-grid size-8 place-items-center rounded-full text-ink hover:bg-surface-2">
                    <ChevronDown className={cn('size-4 transition-transform', mega && 'rotate-180')} />
                  </button>
                  <AnimatePresence>{mega && <MegaMenu onClose={() => setMega(false)} />}</AnimatePresence>
                </li>
              ) : (
                <li key={n.to}>
                  <NavLink to={n.to} end className={({ isActive }) => cn('whitespace-nowrap rounded-full px-3 py-2.5 text-[0.95rem] font-semibold transition-colors xl:px-4 hover:bg-surface-2', isActive ? 'text-accent-text' : 'text-ink')}>
                    {n.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <a href={telLink()} className="hidden items-center gap-2 whitespace-nowrap rounded-full px-3 py-2.5 text-[0.95rem] font-bold text-ink hover:bg-surface-2 2xl:inline-flex">
              <Phone className="size-4" /> {SITE.phone}
            </a>
            <Link to="/contact" className="btn-primary hidden min-h-11 whitespace-nowrap px-5 lg:inline-flex">Enquire now</Link>
            <button onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} aria-haspopup="dialog" className="grid size-11 place-items-center rounded-full text-ink hover:bg-surface-2 lg:hidden">
              <Menu className="size-6" />
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && <MobileMenu nav={NAV} onClose={() => setOpen(false)} themeToggle={<ThemeToggle />} />}
      </AnimatePresence>
    </header>
  )
}

function BottomBar() {
  const { pathname } = useLocation()
  // On a course page, the bar asks about that course.
  const course = pathname.startsWith('/courses/') ? listed().find((c) => c.slug === pathname.split('/')[2]) : undefined
  const msg = course ? `Hello RPC, I want details about the ${course.code} course (fees and next batch).` : undefined
  return (
    <nav aria-label="Quick contact" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-glass pb-[env(safe-area-inset-bottom)] backdrop-blur-xl backdrop-saturate-150 lg:hidden">
      <div className="grid grid-cols-3 gap-2 px-3 py-2">
        <a href={telLink()} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl text-sm font-bold text-ink active:bg-surface-2"><Phone className="size-[1.1rem]" /> Call</a>
        <a href={waLink(msg)} target="_blank" rel="noopener" className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#14803f] text-sm font-bold text-white active:scale-[0.97]"><WhatsAppIcon className="size-[1.15rem]" /> WhatsApp</a>
        <Link to={course ? `/contact?course=${course.slug}` : '/contact'} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-accent text-sm font-bold text-white active:scale-[0.97]">Enquire</Link>
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
      <div className="container-x relative z-10 grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:gap-12 md:py-16">
        <div className="col-span-2 md:col-span-1">
          <Link to="/about" aria-label="About RPC" className="inline-block rounded-md"><Logo invert /></Link>
          <p className="mt-5 max-w-xs text-[0.95rem] leading-relaxed text-white/70">Real Point Computer Education. Job-oriented computer courses in Adoni since 2000. ISO 9001:2015 certified.</p>
          <p className="mt-5 font-display text-lg font-semibold text-white/90">Learn Today… Build a Better Tomorrow.</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">Explore</p>
          <ul className="mt-2 text-[0.95rem]">
            {NAV.map((n) => <li key={n.to}><Link to={n.to} className="inline-flex min-h-11 items-center text-white/80 hover:text-white">{n.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">Courses</p>
          <ul className="mt-2 text-[0.95rem]">
            {listed().slice(0, 6).map((c) => <li key={c.slug}><Link to={`/courses/${c.slug}`} className="inline-flex min-h-11 items-center text-white/80 hover:text-white">{c.code}</Link></li>)}
            <li><Link to="/courses" className="inline-flex min-h-11 items-center gap-1 font-bold text-white hover:underline">All courses <ArrowRight className="size-4" /></Link></li>
          </ul>
        </div>
        <div className="col-span-2 space-y-1 text-[0.95rem] md:col-span-1">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-white/60">Visit or call</p>
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`} target="_blank" rel="noopener" className="flex min-h-11 items-start gap-3 py-2.5 text-white/80 hover:text-white"><MapPin className="mt-0.5 size-4 shrink-0" />{SITE.address}</a>
          <a href={telLink()} className="flex min-h-11 items-start gap-3 py-2.5 text-white/80 hover:text-white"><Phone className="mt-0.5 size-4 shrink-0" />{SITE.phone}</a>
          <a href={`mailto:${SITE.email}`} className="flex min-h-11 items-start gap-3 py-2.5 text-white/80 hover:text-white"><Mail className="mt-0.5 size-4 shrink-0" />{SITE.email}</a>
          <p className="flex gap-3 py-2.5 text-white/80"><Clock className="mt-0.5 size-4 shrink-0" /><span>{SITE.timings.map((t) => <span key={t.label} className="block">{t.label}: {t.time}</span>)}</span></p>
          <a href={SITE.facebook} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-1 font-bold text-white hover:underline">Facebook: rpcadoni <ArrowUpRight className="size-4" /></a>
        </div>
      </div>
      <div className="relative z-10 border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 pb-28 text-sm text-white/60 lg:flex-row lg:items-center lg:justify-between lg:pb-6">
          <div className="space-y-1">
            <p>© {new Date().getFullYear()} Real Point Computer Education, Adoni.</p>
            <p>ISO 9001:2015 · AP Govt DET permission · MSME registered</p>
          </div>
          <p className="mt-2 lg:mt-0">
            Designed and developed by{' '}
            <a href="https://www.thedreamteamservices.com/" target="_blank" rel="noopener" className="inline-flex min-h-11 items-center whitespace-nowrap font-bold tracking-wide text-white/85 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white">
              DREAM TEAM SERVICES
            </a>
          </p>
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
