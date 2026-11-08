import { lazy, Suspense, useEffect, useSyncExternalStore } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { Toaster } from 'sonner'
import Layout from './components/Layout'
import Home from './pages/Home'
import { getVersion, subscribe } from './lib/content'

// After a new deploy, a page opened earlier asks for old chunk files that no longer exist.
// Reload once to get the new build instead of silently failing to open the page.
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

const pages = {
  About: load(() => import('./pages/About')),
  Courses: load(() => import('./pages/Courses')),
  CourseDetail: load(() => import('./pages/CourseDetail')),
  Awards: load(() => import('./pages/Awards')),
  Contact: load(() => import('./pages/Contact')),
  NotFound: load(() => import('./pages/NotFound')),
}
const AdminApp = lazy(load(() => import('./admin/AdminApp')))
const About = lazy(pages.About)
const Courses = lazy(pages.Courses)
const CourseDetail = lazy(pages.CourseDetail)
const Awards = lazy(pages.Awards)
const Contact = lazy(pages.Contact)
const NotFound = lazy(pages.NotFound)

// Fetch every public page in the background once the home page is idle, so taps open instantly on slow mobile data.
function usePreloadPages() {
  useEffect(() => {
    const run = () => Object.values(pages).forEach((f) => f().catch(() => {}))
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number }
    if (w.requestIdleCallback) w.requestIdleCallback(run)
    else setTimeout(run, 2000)
  }, [])
}

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo({ top: 0 }), [pathname])
  return null
}

function PageSkeleton() {
  return (
    <div className="container-x animate-pulse py-24" aria-busy="true" aria-label="Loading">
      <div className="h-4 w-32 rounded-full bg-surface-2" />
      <div className="mt-6 h-12 w-3/4 rounded-2xl bg-surface-2" />
      <div className="mt-4 h-12 w-1/2 rounded-2xl bg-surface-2" />
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => <div key={i} className="h-48 rounded-3xl bg-surface-2" />)}
      </div>
    </div>
  )
}

export default function App() {
  // Re-render every page when the admin's live content arrives or changes.
  useSyncExternalStore(subscribe, getVersion)
  usePreloadPages()
  return (
    <MotionConfig reducedMotion="user">
      <ScrollTop />
      <Routes>
        <Route path="/admin/*" element={<Suspense fallback={null}><AdminApp /></Suspense>} />
        <Route path="*" element={<Site />} />
      </Routes>
      <Toaster position="top-center" richColors closeButton />
    </MotionConfig>
  )
}

function Site() {
  return (
      <Layout>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:slug" element={<CourseDetail />} />
            <Route path="/awards" element={<Awards />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
  )
}
