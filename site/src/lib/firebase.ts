// Firebase loads only when needed (form submit, admin), so it never slows the first page load.
// The web config is public by design (see firebase-config.ts); Firestore rules protect the data.
import { firebaseConfig } from './firebase-config'

export const firebaseReady = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

export async function getFirebaseApp() {
  const { initializeApp, getApps } = await import('firebase/app')
  return getApps()[0] ?? initializeApp(firebaseConfig)
}

/** Dev only (VITE_EMULATOR=1): talk to the local emulators, never the live project. Stripped from production builds. */
export const EMU = import.meta.env.DEV && import.meta.env.VITE_EMULATOR === '1'
let emuDb = false

export async function getDb() {
  const [app, { getFirestore, connectFirestoreEmulator }] = await Promise.all([getFirebaseApp(), import('firebase/firestore')])
  const db = getFirestore(app)
  if (EMU && !emuDb) { connectFirestoreEmulator(db, '127.0.0.1', 8085); emuDb = true }
  return db
}

export type Enquiry = { name: string; phone: string; course: string; batch: string; message?: string }

export async function saveEnquiry(e: Enquiry) {
  if (!firebaseReady) return false
  const db = await getDb()
  const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
  await addDoc(collection(db, 'enquiries'), { ...e, status: 'new', source: 'website', createdAt: serverTimestamp() })
  return true
}
