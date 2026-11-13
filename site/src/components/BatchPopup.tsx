import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { LIVE } from '../lib/content'
import { cldUrl } from '../lib/cloudinary'
import { waLink } from '../content/site'
import { WhatsAppIcon, useReduce } from './ui'

const SEEN = 'rpc-popup-seen'
const seen = () => { try { return sessionStorage.getItem(SEEN) } catch { return null } }
const markSeen = (id: string) => { try { sessionStorage.setItem(SEEN, id) } catch { /* private mode */ } }

/**
 * The batch poster the admin uploads (Admin → Batches). It opens once per visit, after the splash,
 * only when the picture has loaded; the visitor closes it (X, Esc, outside click) to continue.
 */
export default function BatchPopup() {
  const reduce = useReduce()
  const pop = LIVE.popup
  const [open, setOpen] = useState(false)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  // Wait for the picture and the splash, then open (once per visit, per poster).
  useEffect(() => {
    if (!pop || seen() === pop.id) { return }
    let alive = true
    const start = Date.now()
    const img = new Image()
    img.onload = () => {
      const wait = Math.max(0, (reduce ? 300 : 1900) - (Date.now() - start))
      window.setTimeout(() => { if (alive && seen() !== pop.id) { setOpen(true) } }, wait)
    }
    img.src = cldUrl(pop.url, 1200)
    return () => { alive = false }
  }, [pop, reduce])

  function close() {
    if (pop) { markSeen(pop.id) }
    setOpen(false)
  }

  // While open: lock the page scroll, focus the close button, Esc closes, Tab stays inside.
  useEffect(() => {
    if (!open) { return }
    const before = document.activeElement as HTMLElement | null
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { close(); return }
      if (e.key !== 'Tab' || !panel.current) { return }
      const items = [...panel.current.querySelectorAll<HTMLElement>('a[href],button')]
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus() }
    }
    addEventListener('keydown', onKey)
    return () => {
      removeEventListener('keydown', onKey)
      html.style.overflow = prev
      before?.focus?.()
    }
    // close is stable enough for this listener's lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <AnimatePresence>
      {open && pop && (
        <motion.div
          key="batch-popup"
          className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-[#06122e]/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.25 }}
          onClick={(e) => { if (e.target === e.currentTarget) { close() } }}
        >
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="New batch details"
            className="relative w-fit max-w-full"
            initial={reduce ? false : { opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <img
              src={cldUrl(pop.url, 1200)}
              srcSet={`${cldUrl(pop.url, 800)} 800w, ${cldUrl(pop.url, 1200)} 1200w, ${cldUrl(pop.url, 1600)} 1600w`}
              sizes="(min-width: 640px) 560px, 92vw"
              alt="New batch details from RPC"
              className="block max-h-[calc(100svh-9rem)] w-auto max-w-full rounded-2xl bg-white object-contain shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)] sm:max-w-[min(36rem,90vw)]"
            />
            <button
              ref={closeBtn}
              onClick={close}
              aria-label="Close"
              className="absolute -right-2 -top-2 grid size-11 place-items-center rounded-full bg-white text-[#0b1e4a] shadow-lg ring-1 ring-black/10 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95 sm:-right-4 sm:-top-4"
            >
              <X className="size-5" aria-hidden />
            </button>
            <div className="mt-4 flex items-center justify-center gap-3">
              <a href={waLink('Hello RPC, I saw the new batch details on your website. Please share more.')} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#1a8a3d] px-5 font-bold text-white shadow-lg hover:bg-[#157433]">
                <WhatsAppIcon className="size-5" /> Join this batch
              </a>
              <button onClick={close} className="min-h-12 rounded-full px-5 font-bold text-white/90 ring-1 ring-white/40 hover:bg-white/10">
                Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
