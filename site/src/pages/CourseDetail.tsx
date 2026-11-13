import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Award, CalendarDays, Clock, IndianRupee, ListChecks, Users, type LucideIcon } from 'lucide-react'
import { COURSES, SITE, listed, splitTopic, waLink } from '../content/site'
import { JsonLd, Reveal, Seo, WhatsAppIcon } from '../components/ui'
import PageHero from '../components/PageHero'
import { CoverFan, CtaBand, FacilityList, MiniCourseCard, groupOf } from '../components/course'
import { CourseArt } from '../components/CourseArt'
import { cn } from '../lib/cn'
import NotFound from './NotFound'

// Facilities that describe how a class runs (indexes into FACILITIES).
const HOW = [2, 1, 3, 4]

function Fact({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <div className="relative min-w-0 py-3.5 pl-[3.125rem]">
      <dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted"><span aria-hidden className="absolute left-0 top-3.5 grid size-9 place-items-center rounded-xl bg-accent/10 text-accent-text"><Icon className="size-[1.1rem]" /></span>{label}</dt>
      <dd className="mt-0.5 font-semibold leading-snug text-ink">{children}</dd>
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

  return (
    <>
      <Seo path={`/courses/${c.slug}`} title={`${c.code} course in Adoni`} description={`${c.name} at RPC Adoni. ${c.tagline} For ${c.forWho}.`} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Course', name: c.name, description: c.tagline, provider: { '@type': 'EducationalOrganization', name: SITE.name, sameAs: SITE.url } }} />
      <PageHero
        crumbs={[{ to: '/courses', label: 'Courses' }, { to: `/courses?group=${c.group}`, label: group.label }]}
        title={<>{c.code}{c.name !== c.code && <span className="mt-2.5 block font-sans text-[0.4em] font-bold leading-snug tracking-normal text-ink-soft">{c.name}</span>}</>}
        text={c.tagline}
        artNode={<CourseArt slug={c.slug} className="size-full" />}
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
            {topics > 3 && <p className="mt-2 font-semibold text-muted">{topics} topics{c.modules.length > 1 ? ` in ${c.modules.length} ${c.modules.every((m) => m.title?.startsWith('Semester')) ? 'semesters' : 'parts'}` : ''}</p>}
          </Reveal>
          {topics > 0 ? (
            <div className={`mt-6 grid gap-4 ${c.modules.length > 1 ? 'md:grid-cols-2' : ''}`}>
              {c.modules.map((m, i) => (
                <Reveal key={i} delay={i * 0.06} className="h-full">
                  <div className="h-full rounded-[1.5rem] bg-surface p-5 ring-1 ring-line sm:p-6">
                    {m.title && <p className="mb-2 inline-flex rounded-full bg-ink px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-bg">{m.title}</p>}
                    <ul className={c.modules.length === 1 ? 'sm:columns-2 sm:gap-8' : ''}>
                      {m.items.map((it) => {
                        const t = splitTopic(it)
                        return (
                          <li key={it} className="flex break-inside-avoid items-start gap-3 border-b border-line py-3 last:border-0">
                            <span aria-hidden className="mt-[0.55rem] size-2 shrink-0 rounded-full bg-accent" />
                            <span className="min-w-0">
                              <span className="block font-semibold text-ink">{t.head}</span>
                              {t.sub && <span className="mt-1 flex items-start gap-2 text-[0.95rem] font-medium text-ink-soft"><span aria-hidden className="mt-[0.6rem] h-px w-3 shrink-0 bg-current opacity-60" />{t.sub}</span>}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal className="mt-6">
              <div className="rounded-[1.5rem] bg-surface p-5 ring-1 ring-line sm:p-6">
                <p className="text-[1.05rem] font-semibold leading-relaxed text-ink">Every {c.code} topic is shown on the projector first, then practised on the computer.</p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">Send one message and we share, for the {c.code} course:</p>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-3">
                  {[{ icon: ListChecks, t: 'Full syllabus' }, { icon: Clock, t: 'Duration' }, { icon: CalendarDays, t: 'Fee & next batch' }].map(({ icon: I, t }) => (
                    <li key={t} className="flex items-center gap-3 rounded-xl bg-surface-2 px-4 py-3 font-semibold text-ink"><I className="size-[1.1rem] shrink-0 text-accent-text" aria-hidden />{t}</li>
                  ))}
                </ul>
                <a href={waLink(`Hello RPC, please share the ${c.code} syllabus, duration and fee.`)} target="_blank" rel="noopener" className="btn-ghost mt-5 h-12 max-sm:w-full">
                  <WhatsAppIcon className="size-4 text-[#14803f]" /> Ask for the {c.code} syllabus <ArrowRight className="size-4" />
                </a>
              </div>
            </Reveal>
          )}

          <Reveal className="mt-14">
            <h2 className="text-[clamp(1.5rem,2.6vw,1.9rem)] font-bold leading-tight">How classes run</h2>
          </Reveal>
          <FacilityList pick={HOW} className="mt-5" />

          {related.length > 0 && (
            <>
              <div className="mt-14 flex items-end justify-between gap-4">
                <h2 className="text-[clamp(1.5rem,2.6vw,1.9rem)] font-bold leading-tight">More in {group.label}</h2>
                <Link to="/courses" className="hidden min-h-11 items-center gap-1.5 font-bold text-ink hover:text-accent-text sm:inline-flex">All courses <ArrowRight className="size-4" /></Link>
              </div>
              <ul className={cn('mt-5 grid grid-cols-2 gap-3 max-sm:[&>li:last-child:nth-child(odd)]:col-span-2', related.length >= 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3')}>
                {related.map((r) => <li key={r.slug}><MiniCourseCard c={r} /></li>)}
              </ul>
              <Link to="/courses" className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-bold text-ink hover:text-accent-text sm:hidden">All {listed().length} courses <ArrowRight className="size-4" /></Link>
            </>
          )}
        </div>
      </section>

      <CtaBand title={<>Ready to start<br />{c.code}?</>} text={`Ask on WhatsApp for the ${c.code} fee and the next batch date, or visit us at ${SITE.addressShort}.`} artNode={<CoverFan slugs={[c.slug, ...related.map((r) => r.slug)]} />} />
    </>
  )
}
