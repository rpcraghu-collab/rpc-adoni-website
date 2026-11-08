import { lazy, Suspense, useEffect, useRef, useSyncExternalStore } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { Toaster } from 'sonner'
import Layout from './components/Layout'
import PageErrorBoundary from './components/PageErrorBoundary'
import Home from './pages/Home'
import About from './pages/About'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Awards from './pages/Awards'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import { getVersion, initContent, subscribe } from './lib/content'
import { setBooting } from './lib/boot'
import { checkVersion, isStale, loadNewBuild } from './lib/version'

// Public pages are bundled into the main file (about 18 KB gzip in total), so moving between
// pages never downloads anything and can't fail on weak mobile data or after a new deploy.
// Only the admin panel is split out.

// After a new deploy, a page opened earlier asks for old chunk files that no longer exist.
// Reload once to get the new build; if that also fails, the error boundary shows a retry box.
function load<T>(f: () => Promise<T>): () => Promise<T> {
  return () => f().then(
    (m) => { try { sessionStorage.removeItem('rpc-chunk-reload') } catch { /* ignore */ } return m },
    (e) => {
      let tried = false
      try { tried = sessionStorage.getItem('rpc-chunk-reload') === '1'; sessionStorage.setItem('rpc-chunk-reload', '1') } catch { /* ignore */ }
      if (!tried) { location.reload(); return new Promise<T>(() => {}) }
      throw e
    },
  )
}

const AdminApp = lazy(load(() => import('./admin/AdminApp')))

/**
 * Keeps visitors on the live build. Checks /version.json on start, when the tab comes back and every
 * 5 minutes. When a newer build is live, the next page change (or coming back to the tab, outside forms
 * and the admin) does a full load of that page, so nobody keeps clicking around an old copy.
 */
function VersionWatch() {
  const { pathname } = useLocation()
  const first = useRef(true)
  const path = useRef(pathname)
  path.current = pathname
  useEffect(() => {
    if (first.current) { first.current = false; return }
    if (isStale()) loadNewBuild()
    else void checkVersion()
  }, [pathname])
  useEffect(() => {
    const quiet = () => /^\/(admin|contact)/.test(path.current)
    const onShow = () => {
      if (document.visibilityState !== 'visible') return
      void checkVersion().then((stale) => { if (stale && !quiet()) loadNewBuild() })
    }
    void checkVersion()
    document.addEventListener('visibilitychange', onShow)
    const t = window.setInterval(() => void checkVersion(), 5 * 60_000)
    return () => { document.removeEventListener('visibilitychange', onShow); clearInterval(t) }
  }, [])
  return null
}

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo({ top: 0 }), [pathname])
  return null
}

export default function App() {
  // Re-render every page when the admin's live content arrives or changes.
  useSyncExternalStore(subscribe, getVersion, getVersion)
  const { pathname } = useLocation()
  // Once the app has attached to the ready-made page: animations on, then load the admin's latest content.
  useEffect(() => { setBooting(false); initContent() }, [])
  return (
    <MotionConfig reducedMotion="user">
      <ScrollTop />
      <VersionWatch />
      <Routes>
        <Route path="/admin/*" element={<PageErrorBoundary resetKey={pathname}><Suspense fallback={null}><AdminApp /></Suspense></PageErrorBoundary>} />
        <Route path="*" element={<Site pathname={pathname} />} />
      </Routes>
      <Toaster position="top-center" richColors closeButton />
    </MotionConfig>
  )
}

function Site({ pathname }: { pathname: string }) {
  return (
    <Layout>
      {/* Keyed by the path: a failure on one page never blanks the site, and the next tap clears it. */}
      <PageErrorBoundary resetKey={pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/awards" element={<Awards />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageErrorBoundary>
    </Layout>
  )
}
