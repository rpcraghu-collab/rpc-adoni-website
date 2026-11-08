import { useEffect, useMemo, useState } from 'react'
import { collection, deleteDoc, doc, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc, type Timestamp } from 'firebase/firestore'
import { toast } from 'sonner'
import { Download, Inbox, Phone, Search, Trash2 } from 'lucide-react'
import { WhatsAppIcon } from '../components/ui'
import { cn } from '../lib/cn'
import { area, Empty, iconBtn, input, Panel, smallBtn, type AdminCtx } from './shared'

type Status = 'new' | 'called' | 'joined' | 'not-interested'
type Row = { id: string; name: string; phone: string; course: string; batch: string; message?: string; status: Status; note?: string; createdAt?: Timestamp }

const STATUS: { id: Status; label: string; cls: string }[] = [
  { id: 'new', label: 'New', cls: 'bg-accent/12 text-accent-text' },
  { id: 'called', label: 'Called', cls: 'bg-gold/15 text-gold-text' },
  { id: 'joined', label: 'Joined', cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' },
  { id: 'not-interested', label: 'Not interested', cls: 'bg-surface-2 text-muted' },
]

const when = (t?: Timestamp) => (t ? t.toDate().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : 'just now')

export default function Enquiries({ ctx }: { ctx: AdminCtx }) {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [filter, setFilter] = useState<Status | 'all'>('all')
  const [q, setQ] = useState('')

  useEffect(() => {
    const qy = query(collection(ctx.db, 'enquiries'), orderBy('createdAt', 'desc'), limit(1000))
    return onSnapshot(qy, (snap) => setRows(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Row, 'id'>) }))), () => {
      toast.error('Could not load enquiries.')
      setRows([])
    })
  }, [ctx.db])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows?.length ?? 0 }
    rows?.forEach((r) => { c[r.status] = (c[r.status] ?? 0) + 1 })
    return c
  }, [rows])

  const shown = (rows ?? []).filter((r) => (filter === 'all' || r.status === filter) && (!q || `${r.name} ${r.phone} ${r.course}`.toLowerCase().includes(q.toLowerCase())))

  async function setStatus(r: Row, status: Status) {
    try { await updateDoc(doc(ctx.db, 'enquiries', r.id), { status, updatedAt: serverTimestamp() }) } catch { toast.error('Not saved. Check your internet.') }
  }
  async function setNote(r: Row, note: string) {
    if ((r.note ?? '') === note) return
    try {
      await updateDoc(doc(ctx.db, 'enquiries', r.id), { note: note.slice(0, 1000), updatedAt: serverTimestamp() })
      toast.success('Note saved')
    } catch { toast.error('Note not saved.') }
  }
  async function remove(r: Row) {
    if (!confirm(`Delete the enquiry from ${r.name}? This cannot be undone.`)) return
    try { await deleteDoc(doc(ctx.db, 'enquiries', r.id)); toast.success('Deleted') } catch { toast.error('Not deleted.') }
  }

  function exportCsv() {
    // A leading ' stops Excel running visitor-typed text (e.g. =HYPERLINK(...)) as a formula.
    const esc = (v: unknown) => { const s = String(v ?? ''); return `"${(/^[=+\-@\t\r]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"` }
    const lines = [['Date', 'Name', 'Mobile', 'Course', 'Batch', 'Status', 'Note'].join(',')]
    shown.forEach((r) => lines.push([when(r.createdAt), r.name, r.phone, r.course, r.batch, STATUS.find((s) => s.id === r.status)?.label ?? r.status, r.note].map(esc).join(',')))
    const url = URL.createObjectURL(new Blob(['﻿' + lines.join('\n')], { type: 'text/csv' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: `rpc-enquiries-${new Date().toISOString().slice(0, 10)}.csv` })
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Panel title="Enquiries" text="Every enquiry from the website form. Call or WhatsApp the student, then mark what happened." action={<button onClick={exportCsv} disabled={!shown.length} className={smallBtn}><Download className="size-4" /> Export Excel (CSV)</button>}>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0" role="tablist" aria-label="Filter by status">
          {[{ id: 'all' as const, label: 'All' }, ...STATUS].map((s) => (
            <button key={s.id} role="tab" aria-selected={filter === s.id} onClick={() => setFilter(s.id)} className={cn('min-h-10 shrink-0 rounded-full border px-4 text-sm font-bold transition-colors', filter === s.id ? 'border-ink bg-ink text-bg' : 'border-line bg-surface text-ink-soft hover:text-ink')}>
              {s.label} <span className="ml-1 opacity-70">{counts[s.id] ?? 0}</span>
            </button>
          ))}
        </div>
        <label className="relative lg:ml-auto lg:w-72">
          <span className="sr-only">Search enquiries</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, mobile, course" className={cn(input, 'pl-9')} />
        </label>
      </div>

      {rows === null ? (
        <div className="space-y-3" aria-busy="true">{[0, 1, 2].map((i) => <div key={i} className="h-28 animate-pulse rounded-[1.4rem] bg-surface-2" />)}</div>
      ) : !shown.length ? (
        <Empty icon={<Inbox className="size-5" />} title={rows.length ? 'Nothing matches' : 'No enquiries yet'} text={rows.length ? 'Try another filter or search.' : 'When a student fills the form on the Contact page, it appears here.'} />
      ) : (
        <ul className="space-y-3">
          {shown.map((r) => {
            const st = STATUS.find((s) => s.id === r.status) ?? STATUS[0]
            return (
              <li key={r.id} className="card p-4 sm:p-5">
                <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
                  <div className="min-w-0 flex-[1_1_16rem]">
                    <p className="flex flex-wrap items-center gap-2">
                      <b className="font-display text-lg text-ink">{r.name}</b>
                      <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold', st.cls)}>{st.label}</span>
                    </p>
                    <p className="mt-1 text-sm text-ink-soft"><span className="font-semibold">{r.course}</span> · {r.batch} batch · <span className="text-muted">{when(r.createdAt)}</span></p>
                    <p className="mt-0.5 text-sm font-semibold tabular-nums text-ink">{r.phone}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a href={`tel:+91${r.phone}`} className={smallBtn} aria-label={`Call ${r.name}`}><Phone className="size-4" /> Call</a>
                    <a href={`https://wa.me/91${r.phone}?text=${encodeURIComponent(`Hello ${r.name}, this is RPC Computer Education, Adoni. Thank you for your enquiry about ${r.course}.`)}`} target="_blank" rel="noopener" className={smallBtn} aria-label={`WhatsApp ${r.name}`}><WhatsAppIcon className="size-4" /> WhatsApp</a>
                    <button onClick={() => remove(r)} className={iconBtn} aria-label={`Delete enquiry from ${r.name}`}><Trash2 className="size-4" /></button>
                  </div>
                </div>
                {r.message && <p className="mt-3 rounded-xl bg-surface-2 px-3 py-2 text-sm text-ink-soft">{r.message}</p>}
                <div className="mt-3 grid gap-2 sm:grid-cols-[14rem_1fr]">
                  <select value={r.status} onChange={(e) => setStatus(r, e.target.value as Status)} className={input} aria-label={`Status for ${r.name}`}>
                    {STATUS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                  <textarea defaultValue={r.note ?? ''} onBlur={(e) => setNote(r, e.target.value)} rows={1} maxLength={1000} placeholder="Add a note (saved when you click outside)" className={cn(area, 'min-h-11 resize-y')} aria-label={`Note for ${r.name}`} />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Panel>
  )
}
