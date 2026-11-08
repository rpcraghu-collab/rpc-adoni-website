import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Award, CalendarDays, Check, Clock, IndianRupee, Users } from 'lucide-react'
import { COURSES, GROUPS, SITE, waLink } from '../content/site'
import { JsonLd, Magnetic, Reveal, Seo, WhatsAppIcon } from '../components/ui'
import PageHero from '../components/PageHero'
import NotFound from './NotFound'

export default function CourseDetail() {
  const { slug } = useParams()
  const c = COURSES.find((x) => x.slug === slug && !x.hidden)
  if (!c) return <NotFound />
  const related = COURSES.filter((x) => x.group === c.group && x.slug !== c.slug && !x.hidden).slice(0, 3)
  const msg = `Hello RPC, I want details about the ${c.code} course (fees and next batch).`
  const facts = [
    { icon: Users, label: 'Who it is for', value: c.forWho },
    { icon: Clock, label: 'Duration', value: c.duration.length ? c.duration.map((d, i) => <span key={d} className="block">{i > 0 && 'or '}{d}</span>) : 'Ask us' },
    { icon: CalendarDays, label: 'Batches', value: SITE.timings.map((t) => <span key={t.label} className="block">{t.time}</span>) },
    { icon: IndianRupee, label: 'Fees', value: c.fee || 'Ask for the current fee' },
  ]
  return (
    <>
      <Seo path={`/courses/${c.slug}`} title={`${c.code} course in Adoni`} description={`${c.name} at RPC Adoni. ${c.tagline} ${c.forWho}.`} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Course', name: c.name, description: c.tagline, provider: { '@type': 'EducationalOrganization', name: SITE.name, sameAs: SITE.url } }} />
      <PageHero eyebrow={GROUPS.find((g) => g.id === c.group)?.label ?? 'Course'} title={<>{c.code}{c.name !== c.code && <span className="mt-3 block text-[0.42em] font-bold leading-tight text-ink-soft">{c.name}</span>}</>} text={c.tagline}>
        <Link to="/courses" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-ink"><ArrowLeft className="size-4" /> All courses</Link>
      </PageHero>

      <section className="container-x grid gap-10 pb-24 lg:grid-cols-[1fr_22rem]">
        <div>
          <dl className="grid gap-3 sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f.label} className="card flex gap-4 p-5">
                <f.icon className="mt-0.5 size-5 shrink-0 text-accent-text" />
                <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{f.label}</dt><dd className="mt-1 font-semibold text-ink">{f.value}</dd></div>
              </div>
            ))}
          </dl>

          {c.modules.length > 0 && (
            <>
              <h2 className="mt-14 text-3xl font-bold">What you will learn</h2>
              <div className={`mt-6 grid gap-4 ${c.modules.length > 1 ? 'md:grid-cols-2' : ''}`}>
                {c.modules.map((m, i) => (
                  <Reveal key={i} delay={i * 0.08}>
                    <div className="card h-full p-6">
                      {m.title && <p className="font-display text-lg font-bold text-ink">{m.title}</p>}
                      <ul className="mt-3 space-y-2.5">
                        {m.items.map((it) => <li key={it} className="flex gap-3 text-ink-soft"><Check className="mt-0.5 size-5 shrink-0 text-[#14803f]" />{it}</li>)}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            </>
          )}

          <div className="mt-10 flex items-start gap-4 rounded-2xl border border-line bg-surface p-6">
            <Award className="mt-0.5 size-6 shrink-0 text-gold-text" />
            <p className="text-ink-soft"><b className="text-ink">Certificate on completion</b> from RPC, an ISO 9001:2015 certified institute with permission from the Directorate of Employment & Training, AP Govt.</p>
          </div>

          {related.length > 0 && (
            <>
              <h2 className="mt-14 text-2xl font-bold">Related courses</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {related.map((r) => (
                  <Link key={r.slug} to={`/courses/${r.slug}`} className="card group p-5 transition-colors hover:border-ink/25">
                    <p className="font-display text-xl font-extrabold text-ink">{r.code}</p>
                    <p className="mt-1 text-sm text-muted">{r.duration[0] ?? r.forWho}</p>
                    <ArrowRight className="mt-4 size-4 text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent-text" />
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[1.6rem] bg-brand p-7 text-white">
            <img src={GROUPS.find((g) => g.id === c.group)!.art} alt="" width={176} height={176} loading="lazy" decoding="async" className="float mx-auto mb-4 h-36 w-auto object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.35)]" />
            <p className="font-display text-2xl font-bold leading-tight">Join {c.code}</p>
            <p className="mt-2 text-sm text-white/75">Ask for the fee and the next batch date. We reply on WhatsApp.</p>
            <Magnetic className="mt-6 w-full"><a href={waLink(msg)} target="_blank" rel="noopener" className="btn h-14 w-full bg-white text-brand hover:bg-white/90"><WhatsAppIcon className="text-[#14803f]" /> Ask on WhatsApp</a></Magnetic>
            <Link to={`/contact?course=${c.slug}`} className="btn mt-3 h-12 w-full border border-white/30 text-white hover:bg-white/10">Enquiry form</Link>
          </div>
        </aside>
      </section>
    </>
  )
}
