import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Award, CalendarDays, Clock, IndianRupee, Users, type LucideIcon } from 'lucide-react'
import { COURSES, FACILITIES, SITE, listed, waLink } from '../content/site'
import { JsonLd, Reveal, Seo, WhatsAppIcon } from '../components/ui'
import PageHero from '../components/PageHero'
import { FAC_ICONS, MiniCourseCard, TINT, groupOf } from '../components/course'
import NotFound from './NotFound'

// Facilities that describe how a class runs (indexes into FACILITIES).
const HOW = [2, 1, 3, 4]

function Fact({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3.5 py-3.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent-text"><Icon className="size-[1.1rem]" /></span>
      <div className="min-w-0">
        <dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{label}</dt>
        <dd className="mt-0.5 font-semibold leading-snug text-ink">{children}</dd>
      </div>
    </div>
  )
}

export default function CourseDetail() {
  const { slug } = useParams()
  const c = COURSES.find((x) => x.slug === slug && !x.hidden)
  if (!c) return <NotFound />
  const group = groupOf(c.group)
  const related = listed().filter((x) => x.group === c.group && x.slug !== c.slug).slice(0, 4)
  const msg = `Hello RPC, I want details about the ${c.code} course (fees and next batch).`
  const paces = c.duration.map((d) => { const [pace, length = ''] = d.split(' · '); return { pace: pace.replace(' daily', ' a day'), length } })
  const topics = c.modules.reduce((n, m) => n + m.items.length, 0)
  let n = 0

  return (
    <>
      <Seo path={`/courses/${c.slug}`} title={`${c.code} course in Adoni`} description={`${c.name} at RPC Adoni. ${c.tagline} For ${c.forWho}.`} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Course', name: c.name, description: c.tagline, provider: { '@type': 'EducationalOrganization', name: SITE.name, sameAs: SITE.url } }} />
      <PageHero
        crumbs={[{ to: '/courses', label: 'Courses' }, { to: `/courses?group=${c.group}`, label: group.label }]}
        title={<>{c.code}{c.name !== c.code && <span className="mt-2.5 block font-sans text-[0.4em] font-bold leading-snug tracking-normal text-ink-soft">{c.name}</span>}</>}
        text={c.tagline}
        art={group.art}
        artTint={TINT[c.group]}
      >
        <ul className="mt-6 flex flex-wrap gap-2 text-sm font-semibold text-ink-soft">
          <li className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 ring-1 ring-line"><Users className="size-4 text-muted" />{c.forWho}</li>
          {paces.length > 0 && <li className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 ring-1 ring-line"><Clock className="size-4 text-muted" />{paces.map((p) => p.length).join(' or ')}</li>}
          <li className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 ring-1 ring-line"><Award className="size-4 text-muted" />Certificate</li>
        </ul>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href={waLink(msg)} target="_blank" rel="noopener" className="btn-primary h-14 px-7 text-base max-sm:w-full"><WhatsAppIcon /> Ask fee & next batch</a>
          <Link to={`/contact?course=${c.slug}`} className="btn-ghost h-14 px-7 text-base max-sm:w-full">Enquiry form</Link>
        </div>
      </PageHero>

      <section className="container-x grid gap-12 pb-20 lg:grid-cols-[1fr_21rem] lg:gap-14 lg:pb-28">
        <aside className="lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1 lg:self-start" aria-labelledby="glance-h">
          <div className="rounded-[1.5rem] bg-surface p-5 ring-1 ring-line sm:p-6">
            <h2 id="glance-h" className="font-display text-xl font-bold">{c.code} at a glance</h2>
            <dl className="mt-2 divide-y divide-line">
              <Fact icon={Users} label="Who it is for">{c.forWho}</Fact>
              <Fact icon={Clock} label="Duration">
                {paces.length ? paces.map((p) => <span key={p.pace} className="block">{p.pace}: <b className="font-extrabold">{p.length}</b></span>) : 'Shared on enquiry'}
              </Fact>
              <Fact icon={CalendarDays} label="Class timings">{SITE.timings.map((t) => <span key={t.label} className="block">{t.time}</span>)}</Fact>
              <Fact icon={IndianRupee} label="Fees">{c.fee || 'Shared on enquiry'}</Fact>
              <Fact icon={Award} label="Certificate">On completion, from an ISO 9001:2015 certified institute</Fact>
            </dl>
            <div className="mt-4 hidden space-y-2.5 lg:block">
              <a href={waLink(msg)} target="_blank" rel="noopener" className="btn-primary w-full"><WhatsAppIcon /> Ask on WhatsApp</a>
              <Link to={`/contact?course=${c.slug}`} className="btn-ghost w-full">Enquiry form</Link>
            </div>
          </div>
        </aside>

        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <Reveal>
            <h2 className="text-[clamp(1.7rem,3.2vw,2.4rem)] font-bold leading-tight">What you will learn</h2>
            {topics > 0 && <p className="mt-2 font-semibold text-muted">{topics} topics{c.modules.length > 1 ? ` in ${c.modules.length} semesters` : ''}</p>}
          </Reveal>
          {topics > 0 ? (
            <div className={`mt-6 grid gap-4 ${c.modules.length > 1 ? 'md:grid-cols-2' : ''}`}>
              {c.modules.map((m, i) => (
                <Reveal key={i} delay={i * 0.06} className="h-full">
                  <div className="h-full rounded-[1.5rem] bg-surface p-5 ring-1 ring-line sm:p-6">
                    {m.title && <p className="mb-2 inline-flex rounded-full bg-ink px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-bg">{m.title}</p>}
                    <ol className={c.modules.length === 1 ? 'sm:columns-2 sm:gap-8' : ''}>
                      {m.items.map((it) => {
                        n += 1
                        return (
                          <li key={it} className="flex break-inside-avoid items-start gap-3 border-b border-line py-3 last:border-0">
                            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-surface-2 text-xs font-extrabold tabular-nums text-ink-soft">{n}</span>
                            <span className="pt-0.5 font-semibold text-ink">{it}</span>
                          </li>
                        )
                      })}
                    </ol>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal className="mt-6">
              <div className="rounded-[1.5rem] bg-surface p-5 ring-1 ring-line sm:p-6">
                <p className="text-[1.05rem] leading-relaxed text-ink-soft">{c.tagline}</p>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">The full {c.code} syllabus, duration and fee are shared when you enquire, along with the next batch date.</p>
                <a href={waLink(`Hello RPC, please share the ${c.code} syllabus, duration and fee.`)} target="_blank" rel="noopener" className="mt-4 inline-flex min-h-11 items-center gap-2 font-bold text-ink hover:text-accent-text">
                  <WhatsAppIcon className="size-4 text-[#14803f]" /> Ask for the {c.code} syllabus <ArrowRight className="size-4" />
                </a>
              </div>
            </Reveal>
          )}

          <Reveal className="mt-14">
            <h2 className="text-[clamp(1.5rem,2.6vw,1.9rem)] font-bold leading-tight">How classes run</h2>
          </Reveal>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {HOW.map((i, k) => {
              const f = FACILITIES[i]
              const Icon = FAC_ICONS[i]
              if (!f) return null
              return (
                <Reveal key={f.title} delay={k * 0.04} className="h-full">
                  <li className="flex h-full gap-4 rounded-[1.3rem] bg-surface p-4 ring-1 ring-line sm:p-5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent-text"><Icon className="size-5" /></span>
                    <span>
                      <span className="block font-display text-[1.05rem] font-bold text-ink">{f.title}</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-muted">{f.text}</span>
                    </span>
                  </li>
                </Reveal>
              )
            })}
          </ul>

          {related.length > 0 && (
            <>
              <div className="mt-14 flex items-end justify-between gap-4">
                <h2 className="text-[clamp(1.5rem,2.6vw,1.9rem)] font-bold leading-tight">More in {group.label}</h2>
                <Link to="/courses" className="hidden min-h-11 items-center gap-1.5 font-bold text-ink hover:text-accent-text sm:inline-flex">All courses <ArrowRight className="size-4" /></Link>
              </div>
              <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {related.map((r) => <li key={r.slug}><MiniCourseCard c={r} /></li>)}
              </ul>
              <Link to="/courses" className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-bold text-ink hover:text-accent-text sm:hidden">All {listed().length} courses <ArrowRight className="size-4" /></Link>
            </>
          )}
        </div>
      </section>
    </>
  )
}
