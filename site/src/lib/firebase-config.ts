// Firebase web config for the client's project rpc-adoni-4953b.
// These values are PUBLIC by design (every visitor's browser downloads them); the
// Firestore security rules (../../firestore.rules) are what protect the data.
// VITE_FIREBASE_* env vars, when set, override them (e.g. for a staging project).
const env = import.meta.env
export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyCd6TDAXvAUaE4JQkIHYMxPqjne989FDyc',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'rpc-adoni-4953b.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'rpc-adoni-4953b',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'rpc-adoni-4953b.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '506335725115',
  appId: env.VITE_FIREBASE_APP_ID || '1:506335725115:web:83527e1fe69094505a7e1e',
}
