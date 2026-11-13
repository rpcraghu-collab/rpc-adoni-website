import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { albumShots, albums, allShots } from '../../content/gallery'
import { MaskLines, Reveal } from '../ui'
import { cn } from '../../lib/cn'

const AWARD_PICK = ['award-1', 'award-2', 'award-3', 'award-4', 'poster'] // award-5 already shows in the 25-years block

/**
 * Home: five photos in a bento. Once RPC has added at least three event photos (functions, festivals, classes)
 * it shows those and opens the gallery; until then it shows the award days and opens the awards page,
 * because the gallery itself holds no award photos.
 */
export default function GalleryTeaser() {
  const all = allShots()
  const events = [...albums().flatMap((a) => albumShots(a)), ...all.filter((s) => s.kind === 'campus')]
  const useEvents = events.length >= 3
  const shots = useEvents
    ? [...events, ...all.filter((s) => s.kind === 'flyers')].slice(0, 5)
    : AWARD_PICK.map((id) => all.find((s) => s.id === id)).filter((s) => !!s)
  const to = useEvents ? '/gallery' : '/awards'
  const cell = ['col-span-2 row-span-2', 'col-span-2 md:col-span-1', '', '', 'col-span-2 md:col-span-1']
  return (
    <section className="container-x py-16 lg:py-24" aria-labelledby="gt-h">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />{useEvents ? 'Events' : 'Awards'}</p>
          <MaskLines id="gt-h" className="mt-3 text-[clamp(1.9rem,4.2vw,3.1rem)] font-bold leading-[1.04]" lines={useEvents ? ['Functions, festivals', <span className="text-muted">and moments at RPC.</span>] : ['Award days with', <span className="text-muted">national figures.</span>]} />
        </div>
        <Link to={to} className="btn-ghost">
          {useEvents ? 'See all events' : 'See the awards'}
          <span className="-mr-3 grid size-8 place-items-center rounded-full bg-ink text-surface"><ArrowRight className="size-4" aria-hidden /></span>
        </Link>
      </Reveal>
      <ul className="mt-8 grid auto-rows-[8.5rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] sm:gap-4 md:grid-cols-4 lg:auto-rows-[13rem]">
        {shots.map((s, i) => (
          <Reveal as="li" key={s.id} delay={0.05 * i} className={cn('min-h-0', cell[i])}>
            <Link to={to} className="group relative block size-full overflow-hidden rounded-[1.4rem] bg-surface-2 ring-1 ring-line">
              <img src={s.thumb} srcSet={s.srcSet} sizes={i === 0 ? '(min-width: 768px) 50vw, 92vw' : '(min-width: 768px) 25vw, 46vw'} width={s.w} height={s.h} alt={s.alt} loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] motion-reduce:transition-none" />
              {i === 0 && (
                <span className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgb(4_10_26/0.8))] p-4 pt-12 text-white sm:p-5 sm:pt-16">
                  <span className="block font-display text-lg font-bold leading-tight sm:text-xl">{s.title}</span>
                  {s.sub && <span className="text-sm text-white/80">{s.sub}</span>}
                </span>
              )}
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
