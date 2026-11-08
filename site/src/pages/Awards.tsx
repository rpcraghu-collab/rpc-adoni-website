import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import { AWARDS, SITE } from '../content/site'
import { LIVE } from '../lib/content'
import { cldUrl } from '../lib/cloudinary'
import { Reveal, Seo } from '../components/ui'
import PageHero from '../components/PageHero'

const full = (img: string) => (img === 'award-3' ? '/img/award-3-sm.webp' : `/img/${img}.webp`)

export default function Awards() {
  const [open, setOpen] = useState<number | null>(null)
  const a = open === null ? null : AWARDS[open]
  const go = (d: number) => setOpen((i) => (i === null ? i : (i + d + AWARDS.length) % AWARDS.length))

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <Seo path="/awards" title="Education Excellence Awards: RPC Adoni" description={`${SITE.founder} and RPC received five Education Excellence Awards, presented by V.V.S. Laxman, Abhinav Bindra, Vijender Garg, Dr. V.B. Soni and Chetan Chauhan.`} />
      <PageHero eyebrow="Awards & recognition" title={<>Five times honoured for <span className="text-accent-text">excellence in education.</span></>} text={`${SITE.founder} receiving the Education Excellence Award for RPC on national stages.`} />
      <section className="container-x pb-24">
        <ul className="grid gap-5 md:grid-cols-2">
          {AWARDS.map((w, i) => (
            <Reveal key={w.n} delay={(i % 2) * 0.08} className={i === 0 ? 'md:col-span-2' : ''}>
              <li>
                <button onClick={() => setOpen(i)} className="card group block w-full overflow-hidden text-left" aria-label={`View award ${w.n}, presented by ${w.from}`}>
                  <div className="relative overflow-hidden">
                    <img src={`/img/${w.img}-sm.webp`} srcSet={w.img === 'award-3' ? undefined : `/img/${w.img}-sm.webp 640w, /img/${w.img}.webp 1280w`} sizes={i === 0 ? '(min-width:768px) 90vw, 92vw' : '(min-width:768px) 45vw, 92vw'} loading={i === 0 ? 'eager' : 'lazy'} width={1280} height={872} alt={`${SITE.founder} receiving the Education Excellence Award from ${w.from}`} className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] ${i === 0 ? 'aspect-[16/8]' : 'aspect-[4/3]'}`} />
                    <span className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"><Expand className="size-5" /></span>
                  </div>
                  <div className="flex items-baseline gap-4 p-6">
                    <span className="font-display text-4xl font-extrabold text-gold-text">0{w.n}</span>
                    <span><span className="block font-display text-xl font-bold text-ink">{w.from}</span><span className="text-sm text-muted">{w.role}</span></span>
                  </div>
                </button>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {LIVE.gallery.length > 0 && (
        <section className="container-x pb-24" aria-labelledby="gallery-h">
          <h2 id="gallery-h" className="text-3xl font-extrabold sm:text-4xl">Life at RPC</h2>
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

      <AnimatePresence>
        {a && (
          <motion.div role="dialog" aria-modal="true" aria-label={`Award from ${a.from}`} className="fixed inset-0 z-[80] flex flex-col bg-[#040a1a]/95 p-4 text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <div className="flex justify-end"><button autoFocus onClick={() => setOpen(null)} className="grid size-12 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Close"><X /></button></div>
            <div className="flex min-h-0 flex-1 items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => go(-1)} className="hidden size-12 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:grid" aria-label="Previous award"><ChevronLeft /></button>
              <motion.img key={a.img} src={full(a.img)} alt={`Award from ${a.from}`} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="max-h-full min-h-0 max-w-full rounded-xl object-contain" />
              <button onClick={() => go(1)} className="hidden size-12 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:grid" aria-label="Next award"><ChevronRight /></button>
            </div>
            <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-4 py-4" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => go(-1)} className="grid size-12 place-items-center rounded-full bg-white/10 sm:hidden" aria-label="Previous award"><ChevronLeft /></button>
              <p className="text-center"><b className="block font-display text-lg">{a.from}</b><span className="text-sm text-white/70">{a.role}</span></p>
              <button onClick={() => go(1)} className="grid size-12 place-items-center rounded-full bg-white/10 sm:hidden" aria-label="Next award"><ChevronRight /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
