import { useEffect, useState } from 'react'

export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', dark ? '#070F24' : '#F6F4EF'))
  }, [dark])
  const toggle = () => {
    setDark((d) => {
      try { localStorage.setItem('rpc-theme', d ? 'light' : 'dark') } catch { /* private mode */ }
      return !d
    })
  }
  return { dark, toggle }
}
