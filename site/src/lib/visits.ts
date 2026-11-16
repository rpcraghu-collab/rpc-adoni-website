// Website visitor counter (client request, 16 Nov 2026: "visit numbers start with 5001").
// Firestore doc stats/visits { count }. Each browser session adds 1 (atomic increment via the
// REST commit API, no SDK in the public bundle); later pages in the same session only read it.
// Shown number = START + count, so the very first visit reads 5001.
// Rules (firestore.rules) allow only +1 steps and reading this one doc.
import { useEffect, useState } from 'react'
import { firebaseConfig } from './firebase-config'

export const VISITS_START = 5000
const SESSION_KEY = 'rpc-visit-counted'

const host = import.meta.env.DEV && import.meta.env.VITE_EMULATOR === '1' ? 'http://127.0.0.1:8085' : 'https://firestore.googleapis.com'
const base = `${host}/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`
const docName = `projects/${firebaseConfig.projectId}/databases/(default)/documents/stats/visits`

let pending: Promise<number | null> | null = null

function counted(): boolean {
  try { return sessionStorage.getItem(SESSION_KEY) === '1' } catch { return false }
}
function markCounted() {
  try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* storage blocked: may count again next page */ }
}

async function increment(): Promise<number | null> {
  markCounted() // before the request: a quick reload must not count the same visit twice
  const r = await fetch(`${base}:commit?key=${firebaseConfig.apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      writes: [{ transform: { document: docName, fieldTransforms: [{ fieldPath: 'count', increment: { integerValue: '1' } }] } }],
    }),
  })
  if (!r.ok) return null
  const j = await r.json()
  const v = j?.writeResults?.[0]?.transformResults?.[0]?.integerValue
  return v === undefined ? null : Number(v)
}

async function read(): Promise<number | null> {
  const r = await fetch(`${base}/stats/visits?key=${firebaseConfig.apiKey}`)
  if (!r.ok) return null
  const j = await r.json()
  const v = j?.fields?.count?.integerValue
  return v === undefined ? null : Number(v)
}

function load(): Promise<number | null> {
  if (!pending) pending = (counted() ? read() : increment()).catch(() => null)
  return pending
}

/** Total visits to show (START + count), or null until known / when offline. */
export function useVisits(): number | null {
  const [n, setN] = useState<number | null>(null)
  useEffect(() => {
    let alive = true
    load().then((c) => { if (alive && c !== null) setN(VISITS_START + c) })
    return () => { alive = false }
  }, [])
  return n
}
