import { useRef, useState, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Camera, ChevronDown, ChevronLeft, ChevronRight, Expand, FolderOpen } from 'lucide-react'
import { SITE } from '../content/site'
import { useYears } from '../lib/years'
import { KINDS, albumShots, albums, allShots, campusShots, type Shot, type ShotKind } from '../content/gallery'
import { Reveal, Seo } from '../components/ui'
import PageHero from '../components/PageHero'
import Lightbox from '../components/Lightbox'
import { CoverFan, CtaBand } from '../components/course'
import { cn } from '../lib/cn'

type Open = { items: Shot[]; i: number } | null

/** Caption that sits on the photo, over a dark fade so it stays readable on any picture. */
function Caption({ s, n, big, tight }: { s: Shot; n?: number; big?: boolean; tight?: boolean }) {
  return (
    <span className={cn('absolute inset-x-0 bottom-0 flex bg-[linear-gradient(180deg,transparent,rgb(4_10_26/0.82))] text-left text-white', tight ? 'flex-col items-start gap-0.5 p-3.5 pt-12 sm:p-4 sm:pt-14' : 'items-end gap-3 p-4 pt-14 sm:p-5 sm:pt-16')}>
      {n !== undefined && <span className={cn('font-display font-extrabold tabular-nums text-[#f3c766]', tight ? 'text-lg' : 'text-2xl sm:text-3xl')}>0{n}</span>}
      <span className="min-w-0">
        <span className={cn('block font-display font-bold leading-tight', big ? 'text-lg sm:text-2xl' : 'text-[0.95rem] sm:text-base')}>{s.kind === 'awards' ? s.title.replace('Education Excellence Award · ', '') : s.title}</span>
        {s.sub && !tight && <span className={cn('mt-0.5 line-clamp-1 text-white/80', big ? 'text-sm' : 'hidden text-xs sm:block')}>{s.sub}</span>}
      </span>
    </span>
  )
}

const ViewChip = () => (
  <span aria-hidden className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"><Expand className="size-4" /></span>
)

/** Layout 2: a sideways strip you can drag with the mouse, swipe on a phone, or move with the arrow buttons. */
function Strip({ items, onOpen }: { items: Shot[]; onOpen: (items: Shot[], i: number) => void }) {
  const track = useRef<HTMLUListElement>(null)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)
  const by = (d: number) => track.current?.scrollBy({ left: d * track.current.clientWidth * 0.8, behavior: 'smooth' })
  const down = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== 'mouse' || !track.current) return
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false }
  }
  const move = (e: PointerEvent<HTMLUListElement>) => {
    const d = drag.current
    if (!d || !track.current) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 4) d.moved = true
    track.current.scrollLeft = d.left - dx
  }
  const up = () => { setTimeout(() => { drag.current = null }, 0) }
  if (!items.length) return null
  return (
    <section className="relative overflow-hidden border-y border-line bg-surface py-16 lg:py-24" aria-labelledby="strip-h">
      <div className="container-x flex flex-wrap items-end justify-between gap-4">
        <Reveal>
          <p className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />From the notice board</p>
          <h2 id="strip-h" className="mt-3 text-[clamp(1.7rem,3.6vw,2.6rem)] font-bold leading-[1.05]">Flyers{campusShots().length ? ', classes and events' : ' and admissions'}.</h2>
        </Reveal>
        <div className="flex gap-2">
          <button type="button" onClick={() => by(-1)} aria-label="Scroll back" className="grid size-12 place-items-center rounded-full bg-surface-2 text-ink hover:bg-line active:scale-95"><ChevronLeft className="size-5" /></button>
          <button type="button" onClick={() => by(1)} aria-label="Scroll forward" className="grid size-12 place-items-center rounded-full bg-ink text-surface hover:bg-accent hover:text-white active:scale-95"><ChevronRight className="size-5" /></button>
        </div>
      </div>
      <ul
        ref={track}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}
        onClickCapture={(e) => { if (drag.current?.moved) { e.preventDefault(); e.stopPropagation() } }}
        className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:scroll-px-6 sm:px-6 lg:scroll-px-[max(2rem,calc((100vw-1240px)/2+2rem))] lg:px-[max(2rem,calc((100vw-1240px)/2+2rem))] [&:active]:cursor-grabbing cursor-grab"
        aria-label="Flyers and photos"
      >
        {items.map((s, i) => (
          <li key={s.id} className="shrink-0 snap-start">
            <button type="button" onClick={() => onOpen(items, i)} draggable={false} className="group relative block h-[15rem] overflow-hidden rounded-[1.5rem] bg-surface-2 ring-1 ring-line sm:h-[19rem] lg:h-[22rem]" style={{ aspectRatio: `${s.w} / ${s.h}` }}>
              <span className="sr-only">Open photo: </span>
              <img src={s.thumb} srcSet={s.srcSet} sizes="(min-width: 1024px) 34rem, 85vw" width={s.w} height={s.h} alt={s.alt} loading="lazy" decoding="async" draggable={false} className="size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none" />
              <Caption s={s} />
              <ViewChip />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Layout 3: the photos not already shown above (admin uploads), in a masonry wall filtered by the chips. Hidden when there are none. */
function Masonry({ all, onOpen }: { all: Shot[]; onOpen: (items: Shot[], i: number) => void }) {
  const [kind, setKind] = useState<ShotKind | 'all'>('all')
  if (!all.length) return null
  const kinds = KINDS.filter((k) => k.id === 'all' || all.some((s) => s.kind === k.id))
  const items = kind === 'all' ? all : all.filter((s) => s.kind === kind)
  return (
    <section className="container-x py-16 lg:py-24" aria-labelledby="all-h">
      <Reveal>
        <p className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />More photos</p>
        <h2 id="all-h" className="mt-3 text-[clamp(1.7rem,3.6vw,2.6rem)] font-bold leading-[1.05]">More from the institute.</h2>
      </Reveal>
      <div className="no-scrollbar edge-fade -mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0 sm:[mask-image:none]">
        <ul className="flex w-max gap-2" aria-label="Show photos of">
          {kinds.map((k) => {
            const count = k.id === 'all' ? all.length : all.filter((s) => s.kind === k.id).length
            const on = kind === k.id
            return (
              <li key={k.id}>
                <button type="button" aria-pressed={on} onClick={() => setKind(k.id)} className={cn('inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[0.92rem] font-bold ring-1 transition-colors', on ? 'bg-ink text-surface ring-ink' : 'bg-surface text-ink ring-line hover:ring-ink/30')}>
                  {k.label}<span className={cn('rounded-full px-1.5 text-[0.75rem] tabular-nums', on ? 'bg-surface/15' : 'bg-surface-2 text-muted')}>{count}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      <p className="sr-only" aria-live="polite">{`${items.length} photos shown`}</p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul key={kind} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="mt-8 columns-2 gap-3 sm:gap-4 lg:columns-3 [&>li]:mb-3 sm:[&>li]:mb-4">
          {items.map((s, i) => (
            <li key={s.id} className="break-inside-avoid">
              <button type="button" onClick={() => onOpen(items, i)} className="group relative block w-full overflow-hidden rounded-[1.3rem] bg-surface-2 ring-1 ring-line">
                <span className="sr-only">Open photo: </span>
                <img src={s.thumb} srcSet={s.srcSet} sizes="(min-width: 1024px) 26rem, 46vw" width={s.w} height={s.h} alt={s.alt} loading="lazy" decoding="async" className="block h-auto w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none" />
                <Caption s={s} />
                <ViewChip />
              </button>
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </section>
  )
}

/** Layout 4: one section per admin folder (Independence Day, Republic Day, festivals...). Hidden when there are none. */
function Albums({ onOpen }: { onOpen: (items: Shot[], i: number) => void }) {
  const [more, setMore] = useState<Record<string, boolean>>({})
  const list = albums()
  if (!list.length) return null
  const FIRST = 8
  return (
    <section className="border-t border-line py-16 lg:py-24" aria-labelledby="events-h">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />Events</p>
          <h2 id="events-h" className="mt-3 text-[clamp(1.7rem,3.6vw,2.6rem)] font-bold leading-[1.05]">Celebrations and events at RPC.</h2>
        </Reveal>
        {list.length > 1 && (
          <nav aria-label="Jump to an event" className="no-scrollbar edge-fade -mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0 sm:[mask-image:none]">
            <ul className="flex w-max gap-2">
              {list.map((a) => (
                <li key={a.id}>
                  <a href={`#${a.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-surface px-4 text-[0.92rem] font-bold text-ink ring-1 ring-line transition-colors hover:ring-ink/30">
                    <FolderOpen className="size-4 text-accent-text" aria-hidden />{a.name}
                    <span className="rounded-full bg-surface-2 px-1.5 text-[0.75rem] tabular-nums text-muted">{a.photos.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {list.map((a) => {
          const shots = albumShots(a)
          const all = more[a.id] || shots.length <= FIRST
          const shown = all ? shots : shots.slice(0, FIRST)
          return (
            <section key={a.id} id={a.id} className="mt-12 scroll-mt-24 first-of-type:mt-10" aria-labelledby={`${a.id}-h`}>
              <Reveal className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line pb-3">
                <h3 id={`${a.id}-h`} className="font-display text-[clamp(1.3rem,2.6vw,1.8rem)] font-bold leading-tight">{a.name}</h3>
                <span className="text-sm font-semibold tabular-nums text-muted">{shots.length} photo{shots.length > 1 ? 's' : ''}</span>
              </Reveal>
              <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {shown.map((s, i) => (
                  <li key={s.id}>
                    <button type="button" onClick={() => onOpen(shots, i)} className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[1.2rem] bg-surface-2 ring-1 ring-line">
                      <span className="sr-only">Open photo: </span>
                      <img src={s.thumb} srcSet={s.srcSet} sizes="(min-width: 1024px) 18rem, (min-width: 768px) 30vw, 46vw" width={s.w} height={s.h} alt={s.alt} loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none" />
                      {s.title !== a.name && <Caption s={{ ...s, sub: undefined }} tight />}
                      <ViewChip />
                    </button>
                  </li>
                ))}
              </ul>
              {!all && (
                <button type="button" onClick={() => setMore((m) => ({ ...m, [a.id]: true }))} className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-surface-2 px-5 font-bold text-ink hover:bg-line">
                  Show all {shots.length} photos <ChevronDown className="size-4" aria-hidden />
                </button>
              )}
            </section>
          )
        })}
      </div>
    </section>
  )
}

/** Shown until RPC adds event photos in the admin panel. */
function ComingSoon() {
  return (
    <section className="container-x pb-16 lg:pb-24" aria-labelledby="soon-h">
      <Reveal className="flex flex-col items-start gap-5 rounded-[1.6rem] bg-surface p-6 ring-1 ring-line sm:flex-row sm:items-center sm:p-8">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-surface-2 text-accent-text"><Camera className="size-7" aria-hidden /></span>
        <span className="min-w-0 flex-1">
          <h2 id="soon-h" className="font-display text-[clamp(1.3rem,2.6vw,1.8rem)] font-bold leading-tight">Event photos are on the way.</h2>
          <span className="mt-1 block text-muted">Photos from our functions, festivals and celebrations will appear here soon. The award photos have their own page.</span>
        </span>
        <Link to="/awards" className="btn-ghost shrink-0">See the awards <ArrowRight className="size-4" aria-hidden /></Link>
      </Reveal>
    </section>
  )
}

export default function Gallery() {
  const years = useYears()
  const [open, setOpen] = useState<Open>(null)
  const onOpen = (items: Shot[], i: number) => setOpen({ items, i })
  // Awards live on /awards only; the gallery is events, functions, festivals, classes and RPC's flyers.
  const noAwards = allShots().filter((s) => s.kind !== 'awards')
  const stripItems = [...campusShots(), ...noAwards.filter((s) => s.kind === 'flyers')]
  const shown = new Set(stripItems.map((s) => s.id))
  const extraShots = noAwards.filter((s) => !shown.has(s.id))
  const hasEvents = albums().length > 0 || campusShots().length > 0
  return (
    <>
      <Seo path="/gallery" title="Events: RPC Computer Education, Adoni" description={`Photos from functions, festivals, celebrations and classes at ${SITE.name}, Babu Plaza, Adoni.`} />
      <PageHero
        eyebrow="Events"
        title={<>Moments from <span className="text-accent-text">{years} years</span> of RPC.</>}
        text="Functions, festivals, celebrations and everyday classes at RPC. Tap any photo to see it full size."
        backdrop="/img/hero/hero-career-sm.webp"
      />
      {!hasEvents && <ComingSoon />}
      <Albums onOpen={onOpen} />
      <Strip items={stripItems} onOpen={onOpen} />
      <Masonry all={extraShots} onOpen={onOpen} />
      <CtaBand title={<>Come and see<br />the institute.</>} artNode={<CoverFan slugs={['python', 'oam-advanced', 'java']} />} />
      <Lightbox items={open?.items ?? []} index={open?.i ?? null} onIndex={(i) => setOpen((o) => (o ? { ...o, i } : o))} onClose={() => setOpen(null)} />
    </>
  )
}
