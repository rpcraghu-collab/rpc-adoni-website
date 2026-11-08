import { lazy, Suspense, useEffect, useSyncExternalStore } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { Toaster } from 'sonner'
import Layout from './components/Layout'
import Home from './pages/Home'
import { getVersion, subscribe } from './lib/content'

const AdminApp = lazy(() => import('./admin/AdminApp'))

const About = lazy(() => import('./pages/About'))
const Courses = lazy(() => import('./pages/Courses'))
const CourseDetail = lazy(() => import('./pages/CourseDetail'))
const Awards = lazy(() => import('./pages/Awards'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

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
