import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Expand } from 'lucide-react'
import { AWARDS, SITE } from '../../content/site'
import { AWARD_SHOTS } from '../../content/gallery'
import { Reveal } from '../ui'
import Lightbox from '../Lightbox'
import { cn } from '../../lib/cn'

// Display order (indexes into AWARDS): the Olympic champion leads the wall.
// The hero (0) and founder (3) photos already show above, so the wall shows the other three.
const ORDER = [1, 4, 2]
// Desktop bento: one large photo, two beside it, two wide ones below. Phones: one large, then two by two.
const SPAN = ['col-span-2 lg:col-span-4 lg:row-span-2', 'lg:col-span-2', 'lg:col-span-2']

/** The five real award photos as a wall. Each opens the full-screen viewer. */
export default function AwardsWall() {
  const [open, setOpen] = useState<number | null>(null)
  const order = ORDER.filter((i) => AWARDS[i] && AWARD_SHOTS[i])

  return (
    <section className="border-y border-line bg-surface py-20 lg:py-32" aria-labelledby="awards-h">
      <div className="container-x">
        <Reveal className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />Awards</p>
            <h2 id="awards-h" className="mt-3 text-balance font-display text-[clamp(2.2rem,6vw,4.2rem)] font-extrabold leading-[0.97] tracking-[-0.035em] text-ink">
              Five times honoured on <span className="text-accent-text">national stages.</span>
            </h2>
          </div>
          <p className="max-w-md text-pretty text-[1.05rem] leading-relaxed text-ink-soft lg:justify-self-end">
            {SITE.founder} receiving the Education Excellence Award for RPC, presented by figures from sport and public life. Tap a photo to see it full size.
          </p>
        </Reveal>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-14 lg:auto-rows-[15.5rem] lg:grid-cols-6 lg:gap-5">
          {order.map((idx, k) => {
            const w = AWARDS[idx]
            const shot = AWARD_SHOTS[idx]
            const big = k === 0
            return (
              <Reveal as="li" key={w.img} delay={0.05 * k} className={cn(SPAN[k], 'min-w-0')}>
                <button
                  type="button"
                  onClick={() => setOpen(idx)}
                  className="group relative block h-full w-full overflow-hidden rounded-[1.4rem] bg-surface-2 text-left ring-1 ring-line focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/60 lg:rounded-[1.8rem]"
                >
                  <span className="sr-only">View award photo: </span>
                  <img
                    src={shot.thumb}
                    srcSet={shot.srcSet}
                    sizes={big ? '(min-width:1024px) 60vw, 92vw' : '(min-width:1024px) 30vw, 46vw'}
                    width={shot.w}
                    height={shot.h}
                    loading="lazy"
                    decoding="async"
                    alt=""
                    className={cn('w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none lg:h-full', big ? 'aspect-[4/3] lg:aspect-auto' : 'aspect-square sm:aspect-[4/3] lg:aspect-auto')}
                  />
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#06102a]/95 via-[#06102a]/45 to-transparent" />
                  <span aria-hidden className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-[#0b1e4a] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 max-lg:hidden">
                    <Expand className="size-4" />
                  </span>
                  <span className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-5">
                    <span className={cn('block font-bold uppercase tracking-[0.14em] text-[#e6b95c]', big ? 'text-[0.7rem] sm:text-xs' : 'text-[0.68rem] max-sm:hidden')}>Award {k + 1} of {order.length}</span>
                    <span className={cn('mt-1 block font-display font-bold leading-[1.08]', big ? 'text-[1.35rem] sm:text-3xl' : 'text-[0.98rem] sm:text-xl')}>{w.from}</span>
                    <span className={cn('mt-1 block leading-snug text-white/80', big ? 'text-sm sm:text-base' : 'line-clamp-2 text-[0.72rem] sm:text-sm')}>{w.role}</span>
                  </span>
                </button>
              </Reveal>
            )
          })}
        </ul>

        <Reveal className="mt-8">
          <Link to="/awards" className="inline-flex min-h-12 items-center gap-2 font-bold text-ink transition-colors hover:text-accent-text">
            Read about every award <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Reveal>
      </div>

      <Lightbox label="Award photo" items={AWARD_SHOTS} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </section>
  )
}
