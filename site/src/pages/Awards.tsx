import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'motion/react'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import { AWARDS, SITE } from '../content/site'
import { LIVE } from '../lib/content'
import { cldUrl } from '../lib/cloudinary'
import { Reveal, Seo } from '../components/ui'
import PageHero from '../components/PageHero'
import { CtaBand } from '../components/course'
import { cn } from '../lib/cn'

// award-3's large file is smaller than its -sm copy, so the -sm copy is the "full" view.
const full = (img: string) => (img === 'award-3' ? '/img/award-3-sm.webp' : `/img/${img}.webp`)
const SIZE: Record<string, [number, number]> = { 'award-1': [1280, 854], 'award-2': [1024, 680], 'award-3': [640, 444], 'award-4': [1024, 752], 'award-5': [1280, 872] }

export default function Awards() {
  const [open, setOpen] = useState<number | null>(null)
  const [dir, setDir] = useState(1)
  const opener = useRef<HTMLElement | null>(null)
  const dialog = useRef<HTMLDivElement>(null)
  const a = open === null ? null : AWARDS[open]
  const go = (d: number) => { setDir(d); setOpen((i) => (i === null ? i : (i + d + AWARDS.length) % AWARDS.length)) }
  const show = (i: number, el: HTMLElement) => { opener.current = el; setDir(1); setOpen(i) }
  const close = () => setOpen(null)
  const isOpen = open !== null

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'Tab' && dialog.current) {
        // Keep focus inside the dialog.
        const f = [...dialog.current.querySelectorAll<HTMLElement>('button:not([disabled])')].filter((b) => b.offsetParent !== null)
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      opener.current?.focus()
    }
  }, [isOpen])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1)
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1)
  }

  return (
    <>
      <Seo path="/awards" title="Education Excellence Awards: RPC Adoni" description={`${SITE.founder} and RPC received five Education Excellence Awards, presented by V.V.S. Laxman, Abhinav Bindra, Vijender Garg, Dr. V.B. Soni and Chetan Chauhan.`} />
      <PageHero eyebrow="Awards & recognition" title={<>Five times honoured for <span className="text-accent-text">excellence in education.</span></>} text={`${SITE.founder} receiving the Education Excellence Award for RPC, presented by national figures from sport and public life.`} />

      <section className="container-x pb-20 lg:pb-24" aria-label="The five awards">
        <ul className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {AWARDS.map((w, i) => {
            const [wd, ht] = SIZE[w.img] ?? [1280, 872]
            return (
              <Reveal as="li" key={w.n} delay={(i % 2) * 0.06} className={i === 0 ? 'md:col-span-2' : undefined}>
                <button type="button" onClick={(e) => show(i, e.currentTarget)} className="group block w-full overflow-hidden rounded-[1.5rem] bg-surface text-left ring-1 ring-line transition-shadow hover:shadow-[0_24px_50px_-30px_rgb(11_30_74/0.45)]">
                  <span className="sr-only">View award photo: </span>
                  <span className="relative block overflow-hidden bg-surface-2">
                    <img src={`/img/${w.img}-sm.webp`} srcSet={w.img === 'award-3' ? undefined : `/img/${w.img}-sm.webp 640w, /img/${w.img}.webp ${wd}w`} sizes={i === 0 ? '(min-width:768px) 90vw, 92vw' : '(min-width:768px) 45vw, 92vw'} loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : undefined} decoding="async" width={wd} height={ht} alt="" className={cn('w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none', i === 0 ? 'aspect-[4/3] sm:aspect-[16/8]' : 'aspect-[4/3]')} />
                    <span aria-hidden className="absolute right-3 top-3 inline-flex min-h-10 items-center gap-1.5 rounded-full bg-black/55 px-3 text-sm font-bold text-white backdrop-blur"><Expand className="size-4" /> View</span>
                  </span>
                  <span className="flex items-center gap-4 p-5 sm:p-6">
                    <span className="font-display text-3xl font-extrabold tabular-nums text-gold-text sm:text-4xl">0{w.n}</span>
                    <span className="min-w-0"><span className="block font-display text-lg font-bold leading-tight text-ink sm:text-xl">{w.from}</span><span className="text-sm text-muted">{w.role}</span></span>
                  </span>
                </button>
              </Reveal>
            )
          })}
        </ul>
      </section>

      {LIVE.gallery.length > 0 && (
        <section className="container-x pb-20 lg:pb-24" aria-labelledby="gallery-h">
          <h2 id="gallery-h" className="text-[clamp(1.9rem,4.2vw,3.1rem)] font-bold leading-[1.04]">Life at RPC</h2>
          <ul className="mt-8 columns-2 gap-4 md:columns-3 [&>li]:mb-4">
            {LIVE.gallery.map((g) => (
              <li key={g.id} className="break-inside-avoid overflow-hidden rounded-[1.2rem] bg-surface-2">
                <figure>
                  <img src={cldUrl(g.url, 640)} srcSet={`${cldUrl(g.url, 480)} 480w, ${cldUrl(g.url, 960)} 960w`} sizes="(min-width:768px) 30vw, 46vw" loading="lazy" alt={g.caption || 'Students and events at RPC Adoni'} className="w-full" />
                  {g.caption && <figcaption className="px-3 py-2.5 text-sm font-semibold text-ink-soft">{g.caption}</figcaption>}
                </figure>
              </li>
            ))}
          </ul>
        </section>
      )}

      <CtaBand title={<>Learn where the<br />award winners teach.</>} art="/img/art/career.webp" />

      <AnimatePresence>
        {a && open !== null && (
          <motion.div ref={dialog} role="dialog" aria-modal="true" aria-label={`Award ${a.n} of ${AWARDS.length}, from ${a.from}`} className="fixed inset-0 z-[80] flex flex-col bg-[#040a1a] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={close}>
            <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
              <p className="font-display text-sm font-bold tabular-nums text-white/75" aria-live="polite">{a.n} / {AWARDS.length}</p>
              <button type="button" autoFocus onClick={close} className="grid size-12 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Close"><X /></button>
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center gap-3 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={() => go(-1)} className="hidden size-12 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:grid" aria-label="Previous award"><ChevronLeft /></button>
              <div className="relative flex h-full min-w-0 flex-1 items-center justify-center">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.img
                    key={a.img}
                    src={full(a.img)}
                    alt={`${SITE.founder} receiving the award from ${a.from}`}
                    initial={{ opacity: 0, x: dir * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.5}
                    onDragEnd={onDragEnd}
                    draggable={false}
                    className="max-h-full max-w-full cursor-grab touch-pan-y select-none rounded-xl object-contain active:cursor-grabbing"
                  />
                </AnimatePresence>
              </div>
              <button type="button" onClick={() => go(1)} className="hidden size-12 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:grid" aria-label="Next award"><ChevronRight /></button>
            </div>
            <div className="mx-auto w-full max-w-xl pt-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between gap-4">
                <button type="button" onClick={() => go(-1)} className="grid size-12 shrink-0 place-items-center rounded-full bg-white/10 sm:hidden" aria-label="Previous award"><ChevronLeft /></button>
                <p className="min-w-0 text-center"><b className="block font-display text-lg leading-tight">{a.from}</b><span className="text-sm text-white/75">{a.role}</span></p>
                <button type="button" onClick={() => go(1)} className="grid size-12 shrink-0 place-items-center rounded-full bg-white/10 sm:hidden" aria-label="Next award"><ChevronRight /></button>
              </div>
              <div className="mt-4 flex justify-center gap-2">
                {AWARDS.map((w, i) => (
                  <button key={w.n} type="button" onClick={() => { setDir(i > open ? 1 : -1); setOpen(i) }} aria-label={`Award ${w.n}: ${w.from}`} aria-current={i === open} className={cn('overflow-hidden rounded-lg ring-2 transition-[opacity,box-shadow]', i === open ? 'opacity-100 ring-white' : 'opacity-50 ring-transparent hover:opacity-80')}>
                    <img src={`/img/${w.img}-sm.webp`} alt="" width={64} height={44} loading="lazy" className="h-11 w-14 object-cover sm:w-16" />
                  </button>
                ))}
              </div>
              <p className="mt-3 text-center text-xs text-white/60 sm:hidden">Swipe to see the next award</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
