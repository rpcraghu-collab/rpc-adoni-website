import { useRef, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'
import { ArrowRight, ArrowUpRight, CheckCircle2, ChevronDown, Clock, Loader2, Mail, MapPin, Phone, RotateCcw, Send } from 'lucide-react'
import { AWARDS, SITE, listed, telLink, waLink } from '../content/site'
import { Seo, WhatsAppIcon } from '../components/ui'
import PageHero from '../components/PageHero'
import { firebaseReady, saveEnquiry } from '../lib/firebase'
import { cn } from '../lib/cn'

const field = 'mt-2 h-14 w-full rounded-xl border border-line bg-surface px-4 text-base text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus:border-ink focus:ring-4 focus:ring-ink/10'
const errCls = 'border-accent focus:border-accent focus:ring-accent/15'
const firstBatch = SITE.timings[0]?.label.split(' ')[0] ?? 'Morning'

type Form = { name: string; phone: string; course: string; batch: string }
type Sent = { name: string; course: string; batch: string; phone: string; text: string; saved: boolean }

export default function Contact() {
  const [params] = useSearchParams()
  const initial = listed().find((c) => c.slug === params.get('course'))?.code ?? ''
  const [form, setForm] = useState<Form>({ name: '', phone: '', course: initial, batch: firstBatch })
  const [err, setErr] = useState<Partial<Record<keyof Form, string>>>({})
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState<Sent | null>(null)
  const card = useRef<HTMLDivElement>(null)
  // Honeypot: hidden from people, but form-filling bots type into it. A filled trap is never saved.
  const trap = useRef<HTMLInputElement>(null)
  const set = (k: keyof Form) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (err[k]) setErr((x) => ({ ...x, [k]: undefined }))
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    const phone = form.phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
    const next: typeof err = {}
    if (form.name.trim().length < 2) next.name = 'Please enter your name.'
    if (!/^[6-9]\d{9}$/.test(phone)) next.phone = 'Enter a 10-digit mobile number.'
    if (!form.course) next.course = 'Choose a course.'
    setErr(next)
    const bad = (Object.keys(next) as (keyof Form)[])[0]
    if (bad) { document.getElementById(`f-${bad}`)?.focus(); return }
    setBusy(true)
    const text = `Hello RPC, I want to join a course.\nName: ${form.name.trim()}\nMobile: ${phone}\nCourse: ${form.course}\nBatch: ${form.batch}`
    let saved = false
    try {
      // Never keep the student waiting on a slow network: after 5 s, go on to WhatsApp anyway.
      if (firebaseReady && !trap.current?.value) saved = (await Promise.race([saveEnquiry({ name: form.name.trim(), phone, course: form.course, batch: form.batch }), new Promise<false>((r) => setTimeout(() => r(false), 5000))])) !== false
    } catch {
      toast.message('Opening WhatsApp to send your enquiry.')
    }
    setBusy(false)
    setSent({ name: form.name.trim().split(/\s+/)[0], course: form.course, batch: form.batch, phone, text, saved })
    requestAnimationFrame(() => card.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }))
    // After an await some phones block pop-ups, so fall back to the same tab.
    if (!window.open(waLink(text), '_blank', 'noopener')) window.location.href = waLink(text)
  }

  function reset() {
    setSent(null)
    setForm({ name: '', phone: '', course: '', batch: firstBatch })
    requestAnimationFrame(() => document.getElementById('f-name')?.focus())
  }

  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`
  const info = [
    { icon: Phone, label: 'Call', value: SITE.phone, href: telLink() },
    { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: MapPin, label: 'Visit', value: SITE.address, href: maps, ext: true },
  ]

  return (
    <>
      <Seo path="/contact" title="Admissions open: contact RPC Adoni" description={`Join a computer course at RPC, ${SITE.address}. Call ${SITE.phone}. Morning 8 am – 1 pm and evening 4 – 8 pm batches.`} />
      <PageHero eyebrow="Admissions open" title={<>Book your seat. <span className="text-muted">We reply with the fee.</span></>} text="Four details, sent on WhatsApp. Fees and the next batch date come back in the reply. Prefer to talk? Call us." />

      <section className="container-x grid gap-6 pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div ref={card} className="scroll-mt-28 rounded-[1.5rem] bg-surface p-5 ring-1 ring-line sm:p-8">
          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} role="status" aria-live="polite">
                <span className="grid size-14 place-items-center rounded-2xl bg-[#14803f]/12 text-[#14803f] dark:text-[#4ade80]"><CheckCircle2 className="size-7" /></span>
                <h2 className="mt-5 text-[clamp(1.7rem,3.4vw,2.3rem)] font-bold leading-tight">Thanks, {sent.name}. One last tap.</h2>
                <p className="mt-3 max-w-lg text-[1.05rem] leading-relaxed text-ink-soft">
                  Your enquiry for <b className="text-ink">{sent.course}</b> ({sent.batch.toLowerCase()} batch) is typed out in WhatsApp. Press <b className="text-ink">Send</b> there and we reply with the fee and the next batch date.
                  {sent.saved && <> We also have your number, so we can call you back on {sent.phone}.</>}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href={waLink(sent.text)} target="_blank" rel="noopener" className="btn h-14 bg-[#14803f] px-7 text-base text-white hover:bg-[#106a34] max-sm:w-full"><WhatsAppIcon /> Open WhatsApp again</a>
                  <button type="button" onClick={reset} className="btn-ghost h-14 px-7 text-base max-sm:w-full"><RotateCcw className="size-4" /> Send another enquiry</button>
                </div>
                <p className="mt-6 text-sm text-muted">WhatsApp did not open? Call <a href={telLink()} className="font-bold text-ink underline underline-offset-4">{SITE.phone}</a>.</p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <h2 className="text-2xl font-bold">Enquiry form</h2>
                <p className="mt-1 text-sm text-muted">All four fields are needed.</p>
                <input ref={trap} name="company" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" defaultValue="" className="absolute -left-[9999px] size-px opacity-0" />
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <label className="block text-sm font-bold text-ink">Your name
                    <input id="f-name" value={form.name} onChange={set('name')} autoComplete="name" maxLength={80} enterKeyHint="next" className={cn(field, err.name && errCls)} placeholder="Full name" aria-invalid={!!err.name} aria-describedby={err.name ? 'e-name' : undefined} />
                    {err.name && <span id="e-name" className="mt-1.5 block text-sm font-semibold text-accent-text">{err.name}</span>}
                  </label>
                  <label className="block text-sm font-bold text-ink">Mobile number
                    <input id="f-phone" value={form.phone} onChange={set('phone')} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={14} enterKeyHint="next" className={cn(field, err.phone && errCls)} placeholder="10-digit mobile" aria-invalid={!!err.phone} aria-describedby={err.phone ? 'e-phone' : undefined} />
                    {err.phone && <span id="e-phone" className="mt-1.5 block text-sm font-semibold text-accent-text">{err.phone}</span>}
                  </label>
                  <label className="block text-sm font-bold text-ink sm:col-span-2">Course
                    <span className="relative block">
                      <select id="f-course" value={form.course} onChange={set('course')} className={cn(field, 'appearance-none pr-12', !form.course && 'text-muted', err.course && errCls)} aria-invalid={!!err.course} aria-describedby={err.course ? 'e-course' : undefined}>
                        <option value="">Choose a course</option>
                        {listed().map((c) => <option key={c.slug} value={c.code}>{c.code}{c.name !== c.code ? ` · ${c.name}` : ''}</option>)}
                        <option value="Not sure, please guide me">Not sure, please guide me</option>
                      </select>
                      <ChevronDown aria-hidden className="pointer-events-none absolute right-4 top-[calc(50%+0.25rem)] size-5 -translate-y-1/2 text-muted" />
                    </span>
                    {err.course && <span id="e-course" className="mt-1.5 block text-sm font-semibold text-accent-text">{err.course}</span>}
                  </label>
                  <fieldset className="sm:col-span-2">
                    <legend className="text-sm font-bold text-ink">Batch</legend>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      {SITE.timings.map((t) => {
                        const v = t.label.split(' ')[0]
                        const on = form.batch === v
                        return (
                          <label key={v} className={cn('relative flex min-h-[4.5rem] cursor-pointer flex-col justify-center rounded-xl border p-4 transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/35', on ? 'border-ink bg-ink text-bg' : 'border-line bg-surface hover:border-ink/40')}>
                            <input type="radio" name="batch" value={v} checked={on} onChange={set('batch')} className="sr-only" />
                            <span className="flex items-center gap-2 font-bold">
                              <span aria-hidden className={cn('grid size-4 place-items-center rounded-full border-2', on ? 'border-bg' : 'border-muted')}>{on && <span className="size-1.5 rounded-full bg-bg" />}</span>
                              {v}
                            </span>
                            <span className={cn('mt-0.5 text-sm', on ? 'opacity-80' : 'text-muted')}>{t.time}</span>
                          </label>
                        )
                      })}
                    </div>
                  </fieldset>
                </div>
                <button type="submit" disabled={busy} className="btn-primary mt-8 h-14 w-full text-base disabled:opacity-70">
                  {busy ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />} {busy ? 'Sending…' : 'Send enquiry on WhatsApp'}
                </button>
                <p className="mt-3 text-center text-xs text-muted">We use your number only to reply about admissions.</p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <a href={waLink()} target="_blank" rel="noopener" className="flex items-center gap-4 rounded-[1.5rem] bg-[#14803f] p-5 text-white transition-transform hover:-translate-y-0.5 sm:p-6">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/15"><WhatsAppIcon className="size-7" /></span>
            <span className="min-w-0 flex-1"><b className="block font-display text-xl">Chat on WhatsApp</b><span className="text-sm text-white">Fastest reply for fees and batches</span></span>
            <ArrowUpRight className="size-5 shrink-0 opacity-80" />
          </a>
          <div className="rounded-[1.5rem] bg-surface px-5 ring-1 ring-line sm:px-6">
            <ul className="divide-y divide-line">
              {info.map((i) => (
                <li key={i.label}>
                  <a href={i.href} target={i.ext ? '_blank' : undefined} rel="noopener" className="group flex min-h-16 items-start gap-4 py-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent-text"><i.icon className="size-[1.1rem]" /></span>
                    <span className="min-w-0 flex-1"><span className="block text-xs font-bold uppercase tracking-[0.12em] text-muted">{i.label}</span><span className="mt-0.5 block font-semibold text-ink [overflow-wrap:anywhere] group-hover:text-accent-text">{i.value}</span>{i.ext && <span className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-accent-text underline underline-offset-4">Get directions <ArrowUpRight className="size-3.5" aria-hidden /></span>}</span>
                  </a>
                </li>
              ))}
              <li className="flex items-start gap-4 py-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent-text"><Clock className="size-[1.1rem]" /></span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[0.12em] text-muted">Class timings</span>
                  {SITE.timings.map((t) => <span key={t.label} className="mt-0.5 block font-semibold text-ink">{t.label}: {t.time}</span>)}
                </span>
              </li>
            </ul>
          </div>
          <Link to="/awards" className="group flex items-center gap-4 rounded-[1.5rem] bg-surface p-5 ring-1 ring-line transition-colors hover:ring-ink/25 sm:p-6">
            <ul className="flex shrink-0 -space-x-3" aria-hidden>
              {AWARDS.slice(0, 3).map((a, i) => <li key={a.n} className={i === 2 ? 'max-sm:hidden' : undefined}><img src={`/img/${a.img}-sm.webp`} alt="" width={48} height={48} loading="lazy" decoding="async" className="size-12 rounded-xl object-cover ring-4 ring-surface" /></li>)}
            </ul>
            <span className="min-w-0 flex-1">
              <b className="block font-display text-lg leading-tight text-ink">5× Education Excellence Award</b>
              <span className="mt-0.5 block text-sm text-muted">ISO 9001:2015 certified · AP Govt DET permission since 2006</span>
            </span>
            <ArrowRight className="size-5 shrink-0 text-ink transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </>
  )
}
