import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Clock, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react'
import { COURSES, SITE, telLink, waLink } from '../content/site'
import { Seo, WhatsAppIcon } from '../components/ui'
import PageHero from '../components/PageHero'
import { firebaseReady, saveEnquiry } from '../lib/firebase'
import { cn } from '../lib/cn'

const field = 'mt-2 h-14 w-full rounded-xl border border-line bg-surface px-4 text-base text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus:border-ink focus:ring-4 focus:ring-ink/10'

export default function Contact() {
  const [params] = useSearchParams()
  const initial = COURSES.find((c) => c.slug === params.get('course'))?.code ?? ''
  const [form, setForm] = useState({ name: '', phone: '', course: initial, batch: 'Morning' })
  const [err, setErr] = useState<Partial<Record<keyof typeof form, string>>>({})
  const [busy, setBusy] = useState(false)
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e: FormEvent) {
    e.preventDefault()
    const phone = form.phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
    const next: typeof err = {}
    if (form.name.trim().length < 2) next.name = 'Please enter your name.'
    if (!/^[6-9]\d{9}$/.test(phone)) next.phone = 'Enter a 10-digit mobile number.'
    if (!form.course) next.course = 'Choose a course.'
    setErr(next)
    if (Object.keys(next).length) return
    setBusy(true)
    const text = `Hello RPC, I want to join a course.\nName: ${form.name.trim()}\nMobile: ${phone}\nCourse: ${form.course}\nBatch: ${form.batch}`
    try {
      if (firebaseReady) await saveEnquiry({ name: form.name.trim(), phone, course: form.course, batch: form.batch })
      toast.success('Enquiry ready. Opening WhatsApp to send it.')
    } catch {
      toast.message('Opening WhatsApp to send your enquiry.')
    }
    setBusy(false)
    // After an await some phones block pop-ups, so fall back to the same tab.
    if (!window.open(waLink(text), '_blank', 'noopener')) window.location.href = waLink(text)
  }

  const info = [
    { icon: Phone, label: 'Call', value: SITE.phone, href: telLink },
    { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: MapPin, label: 'Visit', value: SITE.address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}` },
  ]

  return (
    <>
      <Seo path="/contact" title="Admissions open: contact RPC Adoni" description={`Join a computer course at RPC, ${SITE.address}. Call ${SITE.phone}. Morning 8 am – 1 pm and evening 4 – 8 pm batches.`} />
      <PageHero eyebrow="Admissions open" title={<>Book your seat. <span className="text-muted">We call you back.</span></>} text="Fill four details and send them on WhatsApp, or call us directly. Fees and the next batch date are shared on reply." />
      <section className="container-x grid gap-8 pb-24 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={submit} noValidate className="card p-6 sm:p-8">
          <h2 className="text-2xl font-bold">Enquiry form</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-bold text-ink">Your name
              <input value={form.name} onChange={set('name')} autoComplete="name" className={cn(field, err.name && 'border-accent')} placeholder="Full name" aria-invalid={!!err.name} aria-describedby={err.name ? 'e-name' : undefined} />
              {err.name && <span id="e-name" className="mt-1.5 block text-sm font-semibold text-accent-text">{err.name}</span>}
            </label>
            <label className="block text-sm font-bold text-ink">Mobile number
              <input value={form.phone} onChange={set('phone')} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={14} className={cn(field, err.phone && 'border-accent')} placeholder="10-digit mobile" aria-invalid={!!err.phone} aria-describedby={err.phone ? 'e-phone' : undefined} />
              {err.phone && <span id="e-phone" className="mt-1.5 block text-sm font-semibold text-accent-text">{err.phone}</span>}
            </label>
            <label className="block text-sm font-bold text-ink sm:col-span-2">Course
              <select value={form.course} onChange={set('course')} className={cn(field, 'appearance-none', err.course && 'border-accent')} aria-invalid={!!err.course} aria-describedby={err.course ? 'e-course' : undefined}>
                <option value="">Choose a course</option>
                {COURSES.map((c) => <option key={c.slug} value={c.code}>{c.code}{c.name !== c.code ? ` · ${c.name}` : ''}</option>)}
                <option value="Not sure, please guide me">Not sure, please guide me</option>
              </select>
              {err.course && <span id="e-course" className="mt-1.5 block text-sm font-semibold text-accent-text">{err.course}</span>}
            </label>
            <fieldset className="sm:col-span-2">
              <legend className="text-sm font-bold text-ink">Batch</legend>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {SITE.timings.map((t) => {
                  const v = t.label.split(' ')[0]
                  return (
                    <label key={v} className={cn('cursor-pointer rounded-xl border p-4 transition-colors', form.batch === v ? 'border-ink bg-ink text-bg' : 'border-line bg-surface hover:border-ink/40')}>
                      <input type="radio" name="batch" value={v} checked={form.batch === v} onChange={set('batch')} className="sr-only" />
                      <span className="block font-bold">{v}</span>
                      <span className={cn('text-sm', form.batch === v ? 'opacity-80' : 'text-muted')}>{t.time}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          </div>
          <button type="submit" disabled={busy} className="btn-primary mt-8 h-14 w-full text-base">
            {busy ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />} Send enquiry on WhatsApp
          </button>
          <p className="mt-3 text-center text-xs text-muted">We use your number only to reply about admissions.</p>
        </form>

        <div className="space-y-4">
          <a href={waLink()} target="_blank" rel="noopener" className="flex items-center gap-4 rounded-[1.4rem] bg-[#178a48] p-6 text-white transition-transform hover:-translate-y-0.5">
            <WhatsAppIcon className="size-8" />
            <span><b className="block font-display text-xl">Chat on WhatsApp</b><span className="text-sm text-white/85">Fastest reply for fees and batches</span></span>
          </a>
          {info.map((i) => (
            <a key={i.label} href={i.href} target={i.label === 'Visit' ? '_blank' : undefined} rel="noopener" className="card flex items-start gap-4 p-5 transition-colors hover:border-ink/25">
              <i.icon className="mt-0.5 size-5 shrink-0 text-accent-text" />
              <span><span className="block text-xs font-bold uppercase tracking-[0.12em] text-muted">{i.label}</span><span className="mt-1 block font-semibold text-ink [overflow-wrap:anywhere]">{i.value}</span></span>
            </a>
          ))}
          <div className="card flex items-start gap-4 p-5">
            <Clock className="mt-0.5 size-5 shrink-0 text-accent-text" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Class timings</p>
              {SITE.timings.map((t) => <p key={t.label} className="mt-1 font-semibold text-ink">{t.label}: {t.time}</p>)}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
