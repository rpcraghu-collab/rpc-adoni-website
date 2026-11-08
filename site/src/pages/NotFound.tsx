import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Seo } from '../components/ui'
import { listed } from '../content/site'

const POPULAR = ['pgdca', 'dca', 'oam', 'python']

export default function NotFound() {
  const popular = POPULAR.map((s) => listed().find((c) => c.slug === s)).filter((c) => !!c)
  return (
    <section className="container-x grid min-h-[70vh] items-center gap-10 py-14 lg:grid-cols-[1.2fr_1fr] lg:py-24">
      <Seo title="Page not found" description="This page does not exist on the RPC Adoni website." />
      <meta name="robots" content="noindex" />
      <div>
        <p className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />Error 404</p>
        <h1 className="mt-4 text-[clamp(2.15rem,4.6vw,3.9rem)] font-extrabold leading-[1] [text-wrap:balance]">This page <span className="text-muted">does not exist.</span></h1>
        <p className="mt-5 max-w-lg text-[1.06rem] leading-relaxed text-ink-soft">The link may be old or mistyped. Here is where most people are going:</p>
        {popular.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {popular.map((c) => (
              <li key={c!.slug}><Link to={`/courses/${c!.slug}`} className="inline-flex min-h-11 items-center rounded-xl bg-surface px-4 font-bold text-ink ring-1 ring-line transition-colors hover:bg-accent hover:text-white hover:ring-accent">{c!.code}</Link></li>
            ))}
          </ul>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/courses" className="btn-primary h-14 px-7 text-base max-sm:w-full">See all courses <ArrowRight className="size-4" /></Link>
          <Link to="/" className="btn-ghost h-14 px-7 text-base max-sm:w-full">Back to home</Link>
        </div>
      </div>
      <div aria-hidden className="relative hidden aspect-[5/4] place-items-center rounded-[2rem] bg-[#e4ebf8] sm:grid dark:bg-[#1b2b55]">
        <span className="absolute left-6 top-4 font-display text-[clamp(5rem,12vw,8rem)] font-extrabold leading-none text-ink/10">404</span>
        <img src="/img/art/programming.webp" alt="" width={800} height={772} decoding="async" className="float mt-16 w-[52%] object-contain drop-shadow-[0_24px_30px_rgb(11_30_74/0.22)]" />
      </div>
    </section>
  )
}
