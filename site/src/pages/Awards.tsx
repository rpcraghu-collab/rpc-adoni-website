import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Expand, Images } from 'lucide-react'
import { AWARDS, SITE } from '../content/site'
import { AWARD_SHOTS } from '../content/gallery'
import { LIVE } from '../lib/content'
import { Reveal, Seo } from '../components/ui'
import PageHero from '../components/PageHero'
import Lightbox from '../components/Lightbox'
import { CtaBand } from '../components/course'
import { cn } from '../lib/cn'

export default function Awards() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <>
      <Seo path="/awards" title="Education Excellence Awards: RPC Adoni" description={`${SITE.founder} and RPC received five Education Excellence Awards, presented by V.V.S. Laxman, Abhinav Bindra, Vijender Garg, Dr. V.B. Soni and Chetan Chauhan.`} />
      <PageHero backdrop="/img/hero/hero-achieve-sm.webp" eyebrow="Awards & recognition" title={<>Five times honoured for <span className="text-accent-text">excellence in education.</span></>} text={`${SITE.founder} receiving the Education Excellence Award for RPC, presented by national figures from sport and public life.`} />

      <section className="container-x pb-20 lg:pb-24" aria-label="The five awards">
        <ul className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {AWARDS.map((w, i) => {
            const shot = AWARD_SHOTS[i]
            return (
              <Reveal as="li" key={w.n} delay={(i % 2) * 0.06} className={i === 0 ? 'md:col-span-2' : undefined}>
                <button type="button" onClick={() => setOpen(i)} className="group block w-full overflow-hidden rounded-[1.5rem] bg-surface text-left ring-1 ring-line transition-shadow hover:shadow-[0_24px_50px_-30px_rgb(11_30_74/0.45)]">
                  <span className="sr-only">View award photo: </span>
                  <span className="relative block overflow-hidden bg-surface-2">
                    <img src={shot.thumb} srcSet={shot.srcSet} sizes={i === 0 ? '(min-width:768px) 90vw, 92vw' : '(min-width:768px) 45vw, 92vw'} loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : undefined} decoding="async" width={shot.w} height={shot.h} alt="" className={cn('w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none', i === 0 ? 'aspect-[4/3] sm:aspect-[16/8]' : 'aspect-[4/3]')} />
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

      <section className="container-x pb-20 lg:pb-24" aria-label="Photo gallery">
        <Reveal>
          <Link to="/gallery" className="group flex flex-wrap items-center gap-5 rounded-[1.6rem] bg-brand p-6 text-white transition-transform duration-300 hover:-translate-y-0.5 sm:p-8">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/10"><Images className="size-7" aria-hidden /></span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-2xl font-bold leading-tight sm:text-3xl">See the photo gallery</span>
              <span className="mt-1 block text-white/75">{LIVE.gallery.length || LIVE.albums.some((a) => a.photos.length) ? 'Functions, festivals, classes and our flyers.' : 'Functions, festivals and celebrations at RPC.'}</span>
            </span>
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-[#0b1e4a] transition-transform group-hover:translate-x-1"><ArrowRight className="size-5" aria-hidden /></span>
          </Link>
        </Reveal>
      </section>

      <CtaBand title={<>Learn where the<br />award winners teach.</>} art="/img/art/career.webp" />

      <Lightbox label="Award photo" items={AWARD_SHOTS} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </>
  )
}
