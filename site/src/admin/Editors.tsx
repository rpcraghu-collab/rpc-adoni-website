import { useEffect, useRef, useState, type ReactNode } from 'react'
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { toast } from 'sonner'
import { ArrowDown, ArrowUp, CalendarDays, ChevronDown, Eye, EyeOff, Image as ImageIcon, Loader2, Plus, RotateCcw, Save, Trash2, Upload, Users } from 'lucide-react'
import { GROUPS, type Course, type CourseGroup } from '../content/site'
import { DEFAULT_COURSES, DEFAULT_SITE, type Batch, type GalleryItem, type Timing } from '../lib/content'
import { cldUrl, uploadImage } from '../lib/cloudinary'
import { cn } from '../lib/cn'
import { area, Empty, Field, iconBtn, input, move, OWNER_EMAIL, Panel, smallBtn, uid, type AdminCtx } from './shared'

/* ---------- shared save bar ---------- */

function SaveBar({ dirty, busy, onSave, onUndo }: { dirty: boolean; busy: boolean; onSave: () => void; onUndo: () => void }) {
  if (!dirty) return null
  return (
    <div className="sticky bottom-3 z-20 mt-6 flex items-center gap-3 rounded-full border border-line bg-surface/95 p-2 pl-5 shadow-lg backdrop-blur">
      <span className="text-sm font-semibold text-ink-soft">You have unsaved changes</span>
      <button onClick={onUndo} disabled={busy} className={cn(smallBtn, 'ml-auto')}><RotateCcw className="size-4" /> Undo</button>
      <button onClick={onSave} disabled={busy} className="btn btn-primary min-h-10 px-5 text-sm">
        {busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Save
      </button>
    </div>
  )
}

function useDraft<T>(initial: T) {
  const [base, setBase] = useState(initial)
  const [draft, setDraft] = useState(initial)
  const [busy, setBusy] = useState(false)
  const dirty = JSON.stringify(base) !== JSON.stringify(draft)
  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    addEventListener('beforeunload', warn)
    return () => removeEventListener('beforeunload', warn)
  }, [dirty])
  async function commit(fn: (v: T) => Promise<void>) {
    setBusy(true)
    try { await fn(draft); setBase(draft) } catch { /* toast shown by save */ } finally { setBusy(false) }
  }
  return { draft, setDraft, dirty, busy, commit, undo: () => setDraft(base) }
}

/* ---------- Courses ---------- */

const modulesToText = (m: Course['modules']) => m.map((g) => [g.title ? `${g.title}:` : '', ...g.items].filter(Boolean).join('\n')).join('\n\n')
function textToModules(t: string): Course['modules'] {
  const out: Course['modules'] = []
  let cur: Course['modules'][number] | null = null
  for (const raw of t.split('\n')) {
    const line = raw.trim()
    if (!line) continue
    if (line.endsWith(':')) { cur = { title: line.slice(0, -1).trim(), items: [] }; out.push(cur); continue }
    if (!cur) { cur = { items: [] }; out.push(cur) }
    cur.items.push(line.replace(/^[-•*]\s*/, ''))
  }
  return out.filter((g) => g.items.length)
}
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `course-${uid()}`

export function CoursesEditor({ ctx }: { ctx: AdminCtx }) {
  const d = useDraft<Course[]>(structuredClone(ctx.content.courses?.length ? ctx.content.courses : DEFAULT_COURSES))
  const [open, setOpen] = useState<string | null>(null)
  const list = d.draft
  const set = (i: number, patch: Partial<Course>) => d.setDraft(list.map((c, j) => (j === i ? { ...c, ...patch } : c)))

  function add() {
    const code = `NEW${list.length + 1}`
    let slug = slugify(code)
    while (list.some((c) => c.slug === slug)) slug += '-1'
    const c: Course = { slug, code, name: 'New course', group: 'office', tagline: '', forWho: '', duration: [], modules: [], tools: [] }
    d.setDraft([...list, c])
    setOpen(slug)
  }

  function save() {
    const bad = list.find((c) => !c.name.trim() || !c.code.trim())
    if (bad) return toast.error('Every course needs a name and a short code.')
    d.commit((v) => ctx.save({ courses: v }))
  }

  return (
    <Panel title="Courses" text="Change course details, add a fee, hide a course you don't run now, or add a new one." action={<button onClick={add} className={smallBtn}><Plus className="size-4" /> Add course</button>}>
      <ul className="space-y-2">
        {list.map((c, i) => {
          const isOpen = open === c.slug
          return (
            <li key={c.slug} className={cn('card overflow-hidden', c.hidden && 'opacity-70')}>
              <div className="flex items-center gap-2 p-3 sm:p-4">
                <button onClick={() => setOpen(isOpen ? null : c.slug)} aria-expanded={isOpen} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <span className="grid h-10 min-w-14 shrink-0 place-items-center rounded-xl bg-surface-2 px-2 text-xs font-extrabold text-ink">{c.code}</span>
                  <span className="min-w-0">
                    <span className="block truncate font-bold text-ink">{c.name}</span>
                    <span className="block truncate text-xs text-muted">{GROUPS.find((g) => g.id === c.group)?.label}{c.fee ? ` · ${c.fee}` : ''}{c.hidden ? ' · Hidden' : ''}</span>
                  </span>
                  <ChevronDown className={cn('ml-auto size-4 shrink-0 text-muted transition-transform', isOpen && 'rotate-180')} />
                </button>
                <button onClick={() => set(i, { hidden: !c.hidden })} className={iconBtn} aria-label={c.hidden ? `Show ${c.code} on the website` : `Hide ${c.code} from the website`} title={c.hidden ? 'Hidden: click to show' : 'Shown: click to hide'}>
                  {c.hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
                <button onClick={() => d.setDraft(move(list, i, -1))} disabled={i === 0} className={cn(iconBtn, 'hidden sm:grid')} aria-label={`Move ${c.code} up`}><ArrowUp className="size-4" /></button>
                <button onClick={() => d.setDraft(move(list, i, 1))} disabled={i === list.length - 1} className={cn(iconBtn, 'hidden sm:grid')} aria-label={`Move ${c.code} down`}><ArrowDown className="size-4" /></button>
              </div>
              {isOpen && (
                <div className="grid gap-4 border-t border-line p-4 sm:grid-cols-2 sm:p-5">
                  <Field label="Course name"><input className={input} value={c.name} maxLength={120} onChange={(e) => set(i, { name: e.target.value })} /></Field>
                  <Field label="Short code" hint="e.g. DCA"><input className={input} value={c.code} maxLength={20} onChange={(e) => set(i, { code: e.target.value.toUpperCase() })} /></Field>
                  <Field label="Type">
                    <select className={input} value={c.group} onChange={(e) => set(i, { group: e.target.value as CourseGroup })}>
                      {GROUPS.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Fee" hint="leave empty to show 'Ask for the current fee'"><input className={input} value={c.fee ?? ''} maxLength={80} placeholder="e.g. Rs 6,000 (2 instalments)" onChange={(e) => set(i, { fee: e.target.value || undefined })} /></Field>
                  <Field label="One-line description" className="sm:col-span-2"><input className={input} value={c.tagline} maxLength={200} onChange={(e) => set(i, { tagline: e.target.value })} /></Field>
                  <Field label="Who it is for"><input className={input} value={c.forWho} maxLength={120} onChange={(e) => set(i, { forWho: e.target.value })} /></Field>
                  <Field label="Duration" hint="one option per line"><textarea className={area} rows={2} value={c.duration.join('\n')} onChange={(e) => set(i, { duration: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })} /></Field>
                  <Field label="Syllabus" hint="a line ending with ':' starts a new part" className="sm:col-span-2">
                    <ModulesBox value={c.modules} onChange={(modules) => set(i, { modules })} />
                  </Field>
                  <Field label="Software taught" hint="separate with commas" className="sm:col-span-2"><input className={input} defaultValue={c.tools.join(', ')} onBlur={(e) => set(i, { tools: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} /></Field>
                  <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                    <label className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold"><input type="checkbox" className="size-4 accent-current" checked={!!c.featured} onChange={(e) => set(i, { featured: e.target.checked || undefined })} /> Show in the menu's "popular" list</label>
                    <label className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold"><input type="checkbox" className="size-4 accent-current" checked={!!c.hidden} onChange={(e) => set(i, { hidden: e.target.checked || undefined })} /> Hide from the website</label>
                    <button onClick={() => { if (confirm(`Delete ${c.code} completely? Hiding is usually better.`)) d.setDraft(list.filter((_, j) => j !== i)) }} className={cn(smallBtn, 'ml-auto text-red-600 dark:text-red-400')}><Trash2 className="size-4" /> Delete</button>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
      <button onClick={() => { if (confirm('Put all courses back to the original website text? Your fees and changes will be removed after you press Save.')) d.setDraft(structuredClone(DEFAULT_COURSES)) }} className="mt-4 text-sm font-semibold text-muted underline-offset-4 hover:text-ink hover:underline">Reset courses to the original text</button>
      <SaveBar dirty={d.dirty} busy={d.busy} onSave={save} onUndo={d.undo} />
    </Panel>
  )
}

function ModulesBox({ value, onChange }: { value: Course['modules']; onChange: (m: Course['modules']) => void }) {
  const [text, setText] = useState(() => modulesToText(value))
  return <textarea className={cn(area, 'font-mono text-sm')} rows={8} value={text} onChange={(e) => setText(e.target.value)} onBlur={() => onChange(textToModules(text))} />
}

/* ---------- Batches ---------- */

const today = () => new Date().toISOString().slice(0, 10)

export function BatchesEditor({ ctx }: { ctx: AdminCtx }) {
  const d = useDraft<Batch[]>(structuredClone(ctx.content.batches ?? []))
  const courses = (ctx.content.courses?.length ? ctx.content.courses : DEFAULT_COURSES).filter((c) => !c.hidden)
  const list = d.draft
  const set = (i: number, patch: Partial<Batch>) => d.setDraft(list.map((b, j) => (j === i ? { ...b, ...patch } : b)))
  const add = () => d.setDraft([...list, { id: uid(), course: courses[0]?.code ?? '', starts: today(), time: 'Morning (8 am – 1 pm)' }])

  function save() {
    if (list.some((b) => !b.course || !b.starts || !b.time.trim())) return toast.error('Every batch needs a course, a start date and a time.')
    d.commit((v) => ctx.save({ batches: [...v].sort((a, b) => a.starts.localeCompare(b.starts)) }))
  }

  return (
    <Panel title="New batches" text="Upcoming batches show on the home page. A batch hides by itself after its start date." action={<button onClick={add} className={smallBtn}><Plus className="size-4" /> Add batch</button>}>
      {!list.length ? (
        <Empty icon={<CalendarDays className="size-5" />} title="No upcoming batches" text="Add a batch to show its start date on the home page." />
      ) : (
        <ul className="space-y-3">
          {list.map((b, i) => (
            <li key={b.id} className={cn('card grid gap-3 p-4 sm:grid-cols-[1fr_11rem_1fr_auto] sm:items-end', b.starts < today() && 'opacity-60')}>
              <Field label="Course">
                <select className={input} value={b.course} onChange={(e) => set(i, { course: e.target.value })}>
                  {courses.map((c) => <option key={c.slug} value={c.code}>{c.code} · {c.name}</option>)}
                </select>
              </Field>
              <Field label="Starts on"><input type="date" className={input} value={b.starts} onChange={(e) => set(i, { starts: e.target.value })} /></Field>
              <Field label="Time"><input className={input} value={b.time} maxLength={60} onChange={(e) => set(i, { time: e.target.value })} /></Field>
              <button onClick={() => d.setDraft(list.filter((_, j) => j !== i))} className={cn(iconBtn, 'justify-self-end')} aria-label="Delete batch"><Trash2 className="size-4" /></button>
              <Field label="Note" hint="optional" className="sm:col-span-4"><input className={input} value={b.note ?? ''} maxLength={120} placeholder="e.g. Only 15 seats" onChange={(e) => set(i, { note: e.target.value || undefined })} /></Field>
              {b.starts < today() && <p className="text-xs font-semibold text-muted sm:col-span-4">This date has passed, so the batch is no longer shown on the website.</p>}
            </li>
          ))}
        </ul>
      )}
      <SaveBar dirty={d.dirty} busy={d.busy} onSave={save} onUndo={d.undo} />
    </Panel>
  )
}

/* ---------- Gallery ---------- */

export function GalleryEditor({ ctx }: { ctx: AdminCtx }) {
  const d = useDraft<GalleryItem[]>(structuredClone(ctx.content.gallery ?? []))
  const [uploading, setUploading] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)
  const list = d.draft
  const set = (i: number, patch: Partial<GalleryItem>) => d.setDraft(list.map((g, j) => (j === i ? { ...g, ...patch } : g)))

  async function onFiles(files: FileList | null) {
    if (!files?.length) return
    const ok = [...files].filter((f) => {
      if (!f.type.startsWith('image/')) { toast.error(`${f.name} is not a photo.`); return false }
      if (f.size > 10 * 1024 * 1024) { toast.error(`${f.name} is bigger than 10 MB.`); return false }
      return true
    })
    setUploading((n) => n + ok.length)
    const added: GalleryItem[] = []
    for (const f of ok) {
      try { added.push({ id: uid(), url: await uploadImage(f), caption: '' }) } catch { toast.error(`${f.name} did not upload.`) } finally { setUploading((n) => n - 1) }
    }
    if (fileRef.current) fileRef.current.value = ''
    if (added.length) {
      d.setDraft((cur) => [...added, ...cur])
      toast.success(`${added.length} photo${added.length > 1 ? 's' : ''} uploaded. Add captions, then press Save.`)
    }
  }

  return (
    <Panel title="Photo gallery" text="Photos of classes, events and award days. They show on the Awards page." action={
      <>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
        <button onClick={() => fileRef.current?.click()} disabled={uploading > 0} className="btn btn-primary min-h-10 px-5 text-sm">
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} {uploading ? `Uploading ${uploading}…` : 'Upload photos'}
        </button>
      </>
    }>
      {!list.length ? (
        <Empty icon={<ImageIcon className="size-5" />} title="No photos yet" text="Upload photos from your phone or computer (up to 10 MB each)." />
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((g, i) => (
            <li key={g.id} className="card overflow-hidden p-0">
              <img src={cldUrl(g.url, 480)} alt={g.caption || 'Gallery photo'} loading="lazy" className="aspect-[4/3] w-full bg-surface-2 object-cover" />
              <div className="space-y-2 p-2.5">
                <input className={cn(input, 'h-10 text-sm')} value={g.caption} maxLength={120} placeholder="Caption" aria-label="Caption" onChange={(e) => set(i, { caption: e.target.value })} />
                <div className="flex items-center justify-between">
                  <span className="flex">
                    <button onClick={() => d.setDraft(move(list, i, -1))} disabled={i === 0} className={iconBtn} aria-label="Move earlier"><ArrowUp className="size-4 -rotate-90" /></button>
                    <button onClick={() => d.setDraft(move(list, i, 1))} disabled={i === list.length - 1} className={iconBtn} aria-label="Move later"><ArrowDown className="size-4 -rotate-90" /></button>
                  </span>
                  <button onClick={() => d.setDraft(list.filter((_, j) => j !== i))} className={iconBtn} aria-label="Remove photo"><Trash2 className="size-4" /></button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <SaveBar dirty={d.dirty} busy={d.busy} onSave={() => d.commit((v) => ctx.save({ gallery: v }))} onUndo={d.undo} />
    </Panel>
  )
}

/* ---------- Settings ---------- */

type SettingsDraft = { phone: string; email: string; address: string; facebook: string; timings: Timing[]; announcement: string }

export function SettingsEditor({ ctx }: { ctx: AdminCtx }) {
  const s = { ...DEFAULT_SITE, ...ctx.content.site }
  const d = useDraft<SettingsDraft>(structuredClone({ phone: s.phone, email: s.email, address: s.address, facebook: s.facebook, timings: s.timings?.length ? s.timings : DEFAULT_SITE.timings, announcement: ctx.content.announcement ?? '' }))
  const v = d.draft
  const set = (patch: Partial<SettingsDraft>) => d.setDraft({ ...v, ...patch })
  const setT = (i: number, patch: Partial<Timing>) => set({ timings: v.timings.map((t, j) => (j === i ? { ...t, ...patch } : t)) })

  function save() {
    if (v.phone.replace(/\D/g, '').length < 10) return toast.error('Enter a full mobile number.')
    if (v.email && !/^\S+@\S+\.\S+$/.test(v.email)) return toast.error('Check the email address.')
    if (v.facebook && !v.facebook.startsWith('https://')) return toast.error('The Facebook link must start with https://')
    d.commit(({ announcement, ...site }) => ctx.save({ site: { ...site, timings: site.timings.filter((t) => t.label.trim() && t.time.trim()) }, announcement: announcement.trim() }))
  }

  return (
    <Panel title="Settings" text="Contact details and timings show on every page. The phone number is also used for the WhatsApp buttons.">
      <div className="grid gap-5 lg:grid-cols-2">
        <Box title="Top announcement bar">
          <Field label="Message" hint="leave empty to hide the bar">
            <input className={input} value={v.announcement} maxLength={160} placeholder="e.g. New Tally Prime batch starts 15 December" onChange={(e) => set({ announcement: e.target.value })} />
          </Field>
        </Box>
        <Box title="Contact">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Mobile / WhatsApp"><input className={input} inputMode="tel" value={v.phone} maxLength={20} onChange={(e) => set({ phone: e.target.value })} /></Field>
            <Field label="Email"><input className={input} type="email" value={v.email} maxLength={120} onChange={(e) => set({ email: e.target.value })} /></Field>
            <Field label="Address" className="sm:col-span-2"><input className={input} value={v.address} maxLength={200} onChange={(e) => set({ address: e.target.value })} /></Field>
            <Field label="Facebook page link" className="sm:col-span-2"><input className={input} value={v.facebook} maxLength={200} onChange={(e) => set({ facebook: e.target.value })} /></Field>
          </div>
        </Box>
        <Box title="Timings" className="lg:col-span-2">
          <ul className="space-y-2">
            {v.timings.map((t, i) => (
              <li key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <input className={input} value={t.label} maxLength={40} placeholder="Morning batch" aria-label="Timing name" onChange={(e) => setT(i, { label: e.target.value })} />
                <input className={input} value={t.time} maxLength={40} placeholder="8:00 am – 1:00 pm" aria-label="Time" onChange={(e) => setT(i, { time: e.target.value })} />
                <button onClick={() => set({ timings: v.timings.filter((_, j) => j !== i) })} disabled={v.timings.length < 2} className={iconBtn} aria-label="Remove timing"><Trash2 className="size-4" /></button>
              </li>
            ))}
          </ul>
          {v.timings.length < 6 && <button onClick={() => set({ timings: [...v.timings, { label: '', time: '' }] })} className={cn(smallBtn, 'mt-3')}><Plus className="size-4" /> Add timing</button>}
        </Box>
      </div>
      <SaveBar dirty={d.dirty} busy={d.busy} onSave={save} onUndo={d.undo} />
    </Panel>
  )
}

function Box({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn('card p-5', className)}>
      <h2 className="mb-4 font-display text-lg font-bold">{title}</h2>
      {children}
    </section>
  )
}

/* ---------- Admins (owner only) ---------- */

export function AdminsEditor({ ctx }: { ctx: AdminCtx }) {
  const [rows, setRows] = useState<{ email: string; addedBy?: string }[] | null>(null)
  const [email, setEmail] = useState('')

  useEffect(() => onSnapshot(collection(ctx.db, 'admins'), (s) => setRows(s.docs.map((x) => ({ email: x.id, addedBy: x.data().addedBy }))), () => setRows([])), [ctx.db])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    const m = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)) return toast.error('Enter a valid Gmail address.')
    if (m === OWNER_EMAIL) return toast.message('The owner is always an admin.')
    try {
      await setDoc(doc(ctx.db, 'admins', m), { addedAt: serverTimestamp(), addedBy: ctx.email })
      setEmail('')
      toast.success(`${m} can now sign in to the admin panel.`)
    } catch { toast.error('Not added. Check your internet.') }
  }
  async function remove(m: string) {
    if (!confirm(`Remove ${m}? They will no longer open the admin panel.`)) return
    try { await deleteDoc(doc(ctx.db, 'admins', m)) } catch { toast.error('Not removed.') }
  }

  return (
    <Panel title="Admins" text="People who can sign in here with their Google account. Only you (the owner) can add or remove them.">
      <form onSubmit={add} className="card mb-4 flex flex-col gap-2 p-4 sm:flex-row">
        <label className="flex-1"><span className="sr-only">Gmail address</span><input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="staff.name@gmail.com" /></label>
        <button className="btn btn-primary min-h-11 px-5 text-sm"><Plus className="size-4" /> Add admin</button>
      </form>
      <ul className="card divide-y divide-line p-0">
        <li className="flex items-center gap-3 p-4"><span className="min-w-0 flex-1 truncate font-semibold">{OWNER_EMAIL}</span><span className="rounded-full bg-ink px-2.5 py-0.5 text-xs font-bold text-bg">Owner</span></li>
        {rows === null ? <li className="p-4 text-sm text-muted">Loading…</li> : rows.map((r) => (
          <li key={r.email} className="flex items-center gap-3 p-4">
            <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{r.email}</span>{r.addedBy && <span className="text-xs text-muted">Added by {r.addedBy}</span>}</span>
            <button onClick={() => remove(r.email)} className={iconBtn} aria-label={`Remove ${r.email}`}><Trash2 className="size-4" /></button>
          </li>
        ))}
        {rows?.length === 0 && <li className="flex items-center gap-2 p-4 text-sm text-muted"><Users className="size-4" /> No other admins yet.</li>}
      </ul>
    </Panel>
  )
}
