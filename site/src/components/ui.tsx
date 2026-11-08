import { useEffect, useRef, useState, type ReactNode, type PointerEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, useInView } from 'motion/react'
import { cn } from '../lib/cn'
import { enter } from '../lib/boot'

export function Logo({ className, invert }: { className?: string; invert?: boolean }) {
  return (
    <span className={cn('inline-flex flex-col items-stretch leading-none', className)} aria-label="RPC, since 2000">
      <span className={cn('font-display text-[1.7rem] font-extrabold tracking-[0.08em]', invert ? 'text-white' : 'text-ink')}>RPC</span>
      <span className="mt-[3px] rounded-[3px] bg-accent px-1 py-[2px] text-center text-[0.5rem] font-extrabold tracking-[0.16em] text-white">SINCE 2000</span>
    </span>
  )
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('size-5', className)} fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.9 2.3 1 2.5c.1.2 1.7 2.6 4.1 3.6 1.5.7 2.1.7 2.9.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.3-.1Z" />
    </svg>
  )
}

/**
 * Fades content in when it reaches the screen. Never relies only on IntersectionObserver:
 * some in-app / older phone browsers never fire it after a client-side page change, which left
 * whole pages blank. A plain rect check (on mount, scroll, resize) and a 1.2 s fail-safe also reveal it.
 */
export function Reveal({ children, delay = 0, className, y = 22, as = 'div' }: { children: ReactNode; delay?: number; className?: string; y?: number; as?: 'div' | 'li' }) {
  const M = as === 'li' ? motion.li : motion.div
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.05 })
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (shown) return
    const check = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight * 0.98 && r.bottom > 0) setShown(true)
    }
    const raf = requestAnimationFrame(check)
    const safety = window.setTimeout(() => setShown(true), 1200 + delay * 1000)
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(safety)
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [shown, delay])
  const visible = shown || inView
  return (
    <M
      ref={ref as never}
      className={className}
      initial={enter({ opacity: 0, y })}
      animate={visible ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  )
}

/** Pulls toward the pointer a little. Only on fine pointers; does nothing on touch or reduced motion. */
export function Magnetic({ children, className, strength = 0.28 }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 })
  const move = (e: PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const leave = () => { x.set(0); y.set(0) }
  return (
    <motion.div ref={ref} style={{ x, y }} onPointerMove={move} onPointerLeave={leave} className={cn('inline-flex', className)}>
      {children}
    </motion.div>
  )
}

/** Gentle 3D tilt that follows the mouse. Flat on touch and reduced motion. */
export function Tilt({ children, className, max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 180, damping: 20 })
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 180, damping: 20 })
  const glare = useTransform([px, py], ([a, b]: number[]) => `radial-gradient(420px circle at ${a * 100}% ${b * 100}%, rgb(255 255 255 / 0.14), transparent 45%)`)
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const leave = () => { px.set(0.5); py.set(0.5) }
  return (
    <motion.div onPointerMove={move} onPointerLeave={leave} style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }} className={cn('relative will-change-transform', className)}>
      {children}
      <motion.span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: glare }} />
    </motion.div>
  )
}

export function SectionHead({ eyebrow, title, text, className, align = 'left' }: { eyebrow?: string; title: ReactNode; text?: ReactNode; className?: string; align?: 'left' | 'center' }) {
  return (
    <Reveal className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <p className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />{eyebrow}</p>}
      <h2 className="mt-3 text-[clamp(1.9rem,4.2vw,3.1rem)] font-bold leading-[1.04]">{title}</h2>
      {text && <p className="mt-4 text-[1.05rem] leading-relaxed text-muted">{text}</p>}
    </Reveal>
  )
}

export function Seo({ title, description, path = '/' }: { title: string; description: string; path?: string }) {
  const full = `${title} | RPC Adoni`
  const url = `https://rpcadoni.com${path}`
  return (
    <>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://rpcadoni.com/img/award-1.webp" />
    </>
  )
}

/** Structured data. Escapes "<" so content can never close the script tag. */
export function JsonLd({ data }: { data: object }) {
  const html = JSON.stringify(data).split('<').join('\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: html }} />
}
