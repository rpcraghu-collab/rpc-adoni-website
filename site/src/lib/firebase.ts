// Firebase loads only when needed (form submit, admin), so it never slows the first page load.
// Keys come from .env (VITE_FIREBASE_*), never from git.
const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseReady = Boolean(cfg.apiKey && cfg.projectId)

export async function getDb() {
  const [{ initializeApp, getApps }, { getFirestore }] = await Promise.all([import('firebase/app'), import('firebase/firestore')])
  const app = getApps()[0] ?? initializeApp(cfg)
  return getFirestore(app)
}

export type Enquiry = { name: string; phone: string; course: string; batch: string; message?: string }

export async function saveEnquiry(e: Enquiry) {
  if (!firebaseReady) return false
  const db = await getDb()
  const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
  await addDoc(collection(db, 'enquiries'), { ...e, status: 'new', source: 'website', createdAt: serverTimestamp() })
  return true
}
