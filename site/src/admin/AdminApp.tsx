import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'
import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { BookOpen, CalendarDays, ExternalLink, Image, Inbox, LogOut, Settings, ShieldCheck, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '../components/ui'
import { cn } from '../lib/cn'
import { EMU, getFirebaseApp, getDb } from '../lib/firebase'
import { setLocalContent, type Overrides } from '../lib/content'
import { OWNER_EMAIL, smallBtn, type AdminCtx } from './shared'

const Enquiries = lazy(() => import('./Enquiries'))
const CoursesEditor = lazy(() => import('./Editors').then((m) => ({ default: m.CoursesEditor })))
const BatchesEditor = lazy(() => import('./Editors').then((m) => ({ default: m.BatchesEditor })))
const GalleryEditor = lazy(() => import('./Editors').then((m) => ({ default: m.GalleryEditor })))
const SettingsEditor = lazy(() => import('./Editors').then((m) => ({ default: m.SettingsEditor })))
const AdminsEditor = lazy(() => import('./Editors').then((m) => ({ default: m.AdminsEditor })))

type State =
  | { s: 'loading' }
  | { s: 'signed-out' }
  | { s: 'denied'; email: string }
  | { s: 'ready'; user: User; db: Firestore; isOwner: boolean; content: Overrides }

const TABS = [
  { to: 'enquiries', label: 'Enquiries', icon: Inbox },
  { to: 'courses', label: 'Courses', icon: BookOpen },
  { to: 'batches', label: 'Batches', icon: CalendarDays },
  { to: 'gallery', label: 'Gallery', icon: Image },
  { to: 'settings', label: 'Settings', icon: Settings },
  { to: 'admins', label: 'Admins', icon: Users, owner: true },
]

let emuAuth = false
async function loadAuth() {
  const [app, mod] = await Promise.all([getFirebaseApp(), import('firebase/auth')])
  const auth = mod.getAuth(app)
  if (EMU && !emuAuth) {
    emuAuth = true
    mod.connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
    // Test hook for screenshots: sign in as any Google account inside the emulator.
    Object.assign(window, { __emuSignIn: (email: string) => mod.signInWithCredential(auth, mod.GoogleAuthProvider.credential(JSON.stringify({ sub: email, email, email_verified: true }))) })
  }
  return { auth, mod }
}

export default function AdminApp() {
  const [st, setSt] = useState<State>({ s: 'loading' })

  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    document.title = 'Admin · RPC Adoni'
    return () => { meta.remove() }
  }, [])

  useEffect(() => {
    let off = () => {}
    loadAuth().then(({ auth, mod }) => {
      off = mod.onAuthStateChanged(auth, async (user) => {
        if (!user) return setSt({ s: 'signed-out' })
        const email = (user.email ?? '').toLowerCase()
        if (!user.emailVerified) return setSt({ s: 'denied', email })
        try {
          const db = await getDb()
          const fs = await import('firebase/firestore')
          const isOwner = email === OWNER_EMAIL
          if (!isOwner) {
            const me = await fs.getDoc(fs.doc(db, 'admins', email))
            if (!me.exists()) return setSt({ s: 'denied', email })
          }
          const snap = await fs.getDoc(fs.doc(db, 'content', 'site'))
          let content: Overrides = {}
          try { content = snap.exists() ? JSON.parse(snap.data().json ?? '{}') : {} } catch { content = {} }
          setSt({ s: 'ready', user, db, isOwner, content })
        } catch {
          setSt({ s: 'denied', email })
        }
      })
    }).catch(() => toast.error('Could not load sign-in. Check your internet.'))
    return () => off()
  }, [])

  const signIn = async () => {
    try {
      const { auth, mod } = await loadAuth()
      const provider = new mod.GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      await mod.signInWithPopup(auth, provider)
    } catch (e) {
      const code = (e as { code?: string }).code ?? ''
      if (!code.includes('popup-closed') && !code.includes('cancelled')) toast.error('Sign-in failed. Please try again.')
    }
  }
  const signOut = async () => {
    const { auth, mod } = await loadAuth()
    await mod.signOut(auth)
  }

  const save = useCallback(async (patch: Partial<Overrides>) => {
    if (st.s !== 'ready') return
    const fs = await import('firebase/firestore')
    const next: Overrides = { ...st.content, ...patch }
    const json = JSON.stringify(next)
    if (json.length > 190_000) { toast.error('Too much content to save. Remove some items first.'); throw new Error('too big') }
    try {
      await fs.setDoc(fs.doc(st.db, 'content', 'site'), { json, updatedAt: fs.serverTimestamp(), updatedBy: st.user.email })
    } catch (e) {
      toast.error('Not saved. Check your internet and try again.')
      throw e
    }
    setSt({ ...st, content: next })
    setLocalContent(next)
    toast.success('Saved. The website is updated.')
  }, [st])

  if (st.s === 'loading') return <Shell><div className="grid min-h-[60vh] place-items-center"><span className="size-8 animate-spin rounded-full border-2 border-line border-t-ink" aria-label="Loading" /></div></Shell>

  if (st.s === 'signed-out' || st.s === 'denied') {
    return (
      <Shell>
        <div className="mx-auto grid min-h-[80vh] max-w-md place-items-center px-4">
          <div className="card w-full p-7 text-center sm:p-9">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-ink text-bg"><ShieldCheck className="size-6" /></span>
            <h1 className="mt-5 text-2xl font-extrabold">RPC admin panel</h1>
            {st.s === 'denied' ? (
              <p className="mt-2 text-sm text-muted"><b className="text-ink">{st.email}</b> is not an admin. Ask the owner to add this Gmail in Admins, or sign in with another account.</p>
            ) : (
              <p className="mt-2 text-sm text-muted">See enquiries and change courses, batches, photos and contact details.</p>
            )}
            <button onClick={st.s === 'denied' ? async () => { await signOut(); signIn() } : signIn} className="btn btn-primary mt-6 w-full">
              <GoogleG /> {st.s === 'denied' ? 'Use another Google account' : 'Sign in with Google'}
            </button>
            <Link to="/" className="mt-4 inline-block text-sm font-semibold text-ink-soft underline-offset-4 hover:underline">Back to the website</Link>
          </div>
        </div>
      </Shell>
    )
  }

  const ctx: AdminCtx = { db: st.db, email: st.user.email ?? '', isOwner: st.isOwner, content: st.content, save }
  const tabs = TABS.filter((t) => !t.owner || st.isOwner)

  return (
    <Shell>
      <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
        <div className="container-x flex h-16 items-center gap-3">
          <Link to="/admin" aria-label="Admin home"><Logo className="h-9" /></Link>
          <span className="hidden rounded-full bg-surface-2 px-2.5 py-1 text-xs font-bold text-ink-soft sm:inline">Admin</span>
          <a href="/" target="_blank" rel="noopener" className={cn(smallBtn, 'ml-auto')}><ExternalLink className="size-4" /> <span className="hidden sm:inline">View website</span></a>
          <button onClick={signOut} className={smallBtn} aria-label="Sign out"><LogOut className="size-4" /> <span className="hidden sm:inline">Sign out</span></button>
        </div>
        <nav className="container-x no-scrollbar flex gap-1 overflow-x-auto pb-2" aria-label="Admin sections">
          {tabs.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => cn('inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-bold transition-colors', isActive ? 'bg-ink text-bg' : 'text-ink-soft hover:bg-surface-2 hover:text-ink')}>
              <Icon className="size-4" /> {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="container-x py-6 sm:py-8">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-[1.4rem] bg-surface-2" />}>
          <Routes>
            <Route index element={<Navigate to="enquiries" replace />} />
            <Route path="enquiries" element={<Enquiries ctx={ctx} />} />
            <Route path="courses" element={<CoursesEditor ctx={ctx} />} />
            <Route path="batches" element={<BatchesEditor ctx={ctx} />} />
            <Route path="gallery" element={<GalleryEditor ctx={ctx} />} />
            <Route path="settings" element={<SettingsEditor ctx={ctx} />} />
            {st.isOwner && <Route path="admins" element={<AdminsEditor ctx={ctx} />} />}
            <Route path="*" element={<Navigate to="enquiries" replace />} />
          </Routes>
        </Suspense>
      </main>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-bg text-ink">{children}</div>
}

function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.2-2.1 3.5-5.2 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
    </svg>
  )
}
