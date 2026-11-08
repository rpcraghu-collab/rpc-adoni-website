import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Seo } from '../components/ui'

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[60vh] place-items-center py-24 text-center">
      <Seo title="Page not found" description="This page does not exist on the RPC Adoni website." />
      <meta name="robots" content="noindex" />
      <div>
        <p className="font-display text-[clamp(5rem,18vw,10rem)] font-extrabold leading-none text-ink/10">404</p>
        <h1 className="mt-2 text-3xl font-bold">This page does not exist.</h1>
        <p className="mt-3 text-muted">The link may be old. Our courses are one tap away.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/courses" className="btn-primary h-14 px-7">See courses <ArrowRight className="size-4" /></Link>
          <Link to="/" className="btn-ghost h-14 px-7">Home</Link>
        </div>
      </div>
    </section>
  )
}
