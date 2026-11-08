import type { ReactNode } from 'react'
import type { Firestore } from 'firebase/firestore'
import type { Overrides } from '../lib/content'
import { cn } from '../lib/cn'

export const OWNER_EMAIL = 'rpcraghu@gmail.com'

export type AdminCtx = {
  db: Firestore
  email: string
  isOwner: boolean
  content: Overrides
  /** Saves the whole content doc (merging `patch` into the latest content). */
  save: (patch: Partial<Overrides>) => Promise<void>
}

export const input = 'h-11 w-full rounded-xl border border-line bg-surface px-3 text-[0.95rem] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus:border-ink focus:ring-4 focus:ring-ink/10'
export const area = 'w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-[0.95rem] leading-relaxed text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus:border-ink focus:ring-4 focus:ring-ink/10'
export const smallBtn = 'inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-line bg-surface px-4 text-sm font-bold text-ink transition-colors hover:border-ink/30 disabled:opacity-50'
export const iconBtn = 'grid size-10 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-surface-2 hover:text-ink disabled:opacity-30'

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn('block', className)}>
      <span className="text-sm font-bold text-ink">{label}</span>
      {hint && <span className="ml-2 text-xs text-muted">{hint}</span>}
      <span className="mt-1.5 block">{children}</span>
    </label>
  )
}

export function Panel({ title, text, action, children }: { title: string; text?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
          {text && <p className="mt-1 max-w-2xl text-sm text-muted">{text}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

export function Empty({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="card grid place-items-center gap-2 px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-surface-2 text-ink-soft">{icon}</span>
      <p className="font-display text-lg font-bold text-ink">{title}</p>
      <p className="max-w-sm text-sm text-muted">{text}</p>
    </div>
  )
}

export const uid = () => Math.random().toString(36).slice(2, 10)

export function move<T>(list: T[], i: number, d: number) {
  const j = i + d
  if (j < 0 || j >= list.length) return list
  const next = list.slice()
  ;[next[i], next[j]] = [next[j], next[i]]
  return next
}
