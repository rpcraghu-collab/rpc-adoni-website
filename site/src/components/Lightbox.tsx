import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Shot } from '../content/gallery'
import { cn } from '../lib/cn'

/**
 * Full-screen photo viewer shared by the Gallery and Awards pages.
 * Keyboard: ← → to move, Esc to close, Tab stays inside. Phones: swipe. Focus returns to the photo that opened it.
 */
export default function Lightbox({ items, index, onIndex, onClose, label = 'Photo' }: {
  items: Shot[]
  index: number | null
  onIndex: (i: number) => void
  onClose: () => void
  label?: string
}) {
  const [dir, setDir] = useState(1)
  const dialog = useRef<HTMLDivElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const isOpen = index !== null && items.length > 0
  const n = items.length
  const go = (d: number) => { if (index === null) return; setDir(d); onIndex((index + d + n) % n) }

  // Keep the latest handlers for the key listener without re-binding it on every photo.
  const keys = useRef({ go, onClose })
  keys.current = { go, onClose }

  useEffect(() => {
    if (!isOpen) return
    opener.current = document.activeElement as HTMLElement | null
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') keys.current.onClose()
      else if (e.key === 'ArrowRight') keys.current.go(1)
      else if (e.key === 'ArrowLeft') keys.current.go(-1)
      else if (e.key === 'Tab' && dialog.current) {
        const f = [...dialog.current.querySelectorAll<HTMLElement>('button:not([disabled])')].filter((b) => b.offsetParent !== null)
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      opener.current?.focus({ preventScroll: true })
    }
  }, [isOpen])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1)
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1)
  }

  const s = isOpen ? items[index] : null
  return (
    <AnimatePresence>
      {s && index !== null && (
        <motion.div
          ref={dialog} role="dialog" aria-modal="true" aria-label={`${label} ${index + 1} of ${n}: ${s.title}`}
          className="fixed inset-0 z-[80] flex flex-col bg-[#040a1a]/[0.97] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] text-white"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
            <p className="font-display text-sm font-bold tabular-nums text-white/80" aria-live="polite">{index + 1} / {n}</p>
            <button ref={closeBtn} type="button" onClick={onClose} className="grid size-12 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Close"><X /></button>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center gap-3 overflow-hidden py-3" onClick={(e) => e.stopPropagation()}>
            {n > 1 && <button type="button" onClick={() => go(-1)} className="hidden size-12 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:grid" aria-label="Previous photo"><ChevronLeft /></button>}
            <div className="relative flex h-full min-w-0 flex-1 items-center justify-center">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.img
                  key={s.id}
                  src={s.full}
                  alt={s.alt}
                  initial={{ opacity: 0, x: dir * 40, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  drag={n > 1 ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.5}
                  onDragEnd={onDragEnd}
                  draggable={false}
                  className="max-h-full max-w-full cursor-grab touch-pan-y select-none rounded-xl object-contain active:cursor-grabbing"
                />
              </AnimatePresence>
            </div>
            {n > 1 && <button type="button" onClick={() => go(1)} className="hidden size-12 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:grid" aria-label="Next photo"><ChevronRight /></button>}
          </div>
          <div className="mx-auto w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-4">
              {n > 1 && <button type="button" onClick={() => go(-1)} className="grid size-12 shrink-0 place-items-center rounded-full bg-white/10 sm:hidden" aria-label="Previous photo"><ChevronLeft /></button>}
              <p className="min-w-0 flex-1 text-center"><b className="block font-display text-[1.05rem] leading-tight">{s.title}</b>{s.sub && <span className="text-sm text-white/75">{s.sub}</span>}</p>
              {n > 1 && <button type="button" onClick={() => go(1)} className="grid size-12 shrink-0 place-items-center rounded-full bg-white/10 sm:hidden" aria-label="Next photo"><ChevronRight /></button>}
            </div>
            {n > 1 && (
              <div className="no-scrollbar mt-4 flex justify-start gap-2 overflow-x-auto pb-1 sm:justify-center">
                {items.map((t, i) => (
                  <button key={t.id} type="button" onClick={() => { setDir(i > index ? 1 : -1); onIndex(i) }} aria-label={`Photo ${i + 1}: ${t.title}`} aria-current={i === index || undefined} className={cn('shrink-0 overflow-hidden rounded-lg ring-2 transition-[opacity,box-shadow]', i === index ? 'opacity-100 ring-white' : 'opacity-50 ring-transparent hover:opacity-80')}>
                    <img src={t.thumb} alt="" width={64} height={44} loading="lazy" className="h-11 w-14 object-cover sm:w-16" />
                  </button>
                ))}
              </div>
            )}
            <p className="mt-3 text-center text-xs text-white/60 sm:hidden">Swipe for the next photo</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
