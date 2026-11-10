import { useSyncExternalStore } from 'react'
import { SITE } from '../content/site'

// Years of teaching = this year - SITE.since (2000), so it goes up by itself every January.
// Prerendered HTML uses the build year; the hook swaps in the visitor's year after hydration,
// so a page built last year never causes a hydration mismatch (React #418).
const never = () => () => {}
const thisYear = () => new Date().getFullYear()
const builtYear = () => __BUILD_YEAR__

/** The current calendar year, hydration-safe. */
export const useYear = () => useSyncExternalStore(never, thisYear, builtYear)
/** Years RPC has been teaching (26 in 2026), hydration-safe. */
export const useYears = () => useYear() - SITE.since
