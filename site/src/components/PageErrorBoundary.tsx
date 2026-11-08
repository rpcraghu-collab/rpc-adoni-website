import { Component, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import { SITE, telLink } from '../content/site'

type Props = { children: ReactNode; resetKey: string }
type State = { failed: boolean; key: string }

// Catches anything that breaks while a page opens, so the visitor sees a retry box with the
// header, footer and menu still working, never a white screen that even Back can't fix.
export default class PageErrorBoundary extends Component<Props, State> {
  state: State = { failed: false, key: this.props.resetKey }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  // A new path (menu tap, Back) clears the error and tries the page again.
  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    return props.resetKey !== state.key ? { failed: false, key: props.resetKey } : null
  }

  componentDidCatch(error: unknown) {
    console.error('Page failed to open:', error)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <section className="container-x py-24" role="alert">
        <div className="mx-auto max-w-xl rounded-3xl border border-line bg-surface p-8 text-center">
          <h1 className="text-2xl font-bold text-ink">This page didn't open</h1>
          <p className="mt-3 text-muted">The connection may have dropped for a moment. Please try again.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => location.reload()} className="btn-primary">
              <RotateCcw className="size-4" aria-hidden /> Try again
            </button>
            <Link to="/" className="btn-ghost">Go to home</Link>
          </div>
          <p className="mt-6 text-sm text-muted">
            Or call us: <a href={telLink()} className="font-semibold text-ink underline underline-offset-4">{SITE.phone}</a>
          </p>
        </div>
      </section>
    )
  }
}
