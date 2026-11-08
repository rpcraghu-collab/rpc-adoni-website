import { useSyncExternalStore } from 'react'

// The theme lives on <html class="dark"> (set before first paint by the script in index.html).
// The ready-made HTML is always built light; React reads the real theme right after it attaches.
const listeners = new Set<() => void>()
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l) } }
const isDark = () => document.documentElement.classList.contains('dark')

export function useTheme() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false)
  const toggle = () => {
    const next = !isDark()
    document.documentElement.classList.toggle('dark', next)
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', next ? '#070F24' : '#F6F4EF'))
    try { localStorage.setItem('rpc-theme', next ? 'dark' : 'light') } catch { /* private mode */ }
    listeners.forEach((l) => l())
  }
  return { dark, toggle }
}
