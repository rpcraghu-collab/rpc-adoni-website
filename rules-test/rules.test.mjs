// Firestore rules tests. Run: npm test (starts the emulator via firebase emulators:exec).
import { readFileSync } from 'node:fs'
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { deleteDoc, doc, getDoc, getDocs, collection, serverTimestamp, setDoc, updateDoc, addDoc } from 'firebase/firestore'

const env = await initializeTestEnvironment({
  projectId: 'rpc-adoni-4953b',
  firestore: { rules: readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8'), host: '127.0.0.1', port: 8085 },
})
const anon = env.unauthenticatedContext().firestore()
const owner = env.authenticatedContext('o', { email: 'rpcraghu@gmail.com', email_verified: true }).firestore()
const staff = env.authenticatedContext('s', { email: 'staff@gmail.com', email_verified: true }).firestore()
const stranger = env.authenticatedContext('x', { email: 'x@gmail.com', email_verified: true }).firestore()
const unverified = env.authenticatedContext('u', { email: 'rpcraghu@gmail.com', email_verified: false }).firestore()

const good = () => ({ name: 'Ravi', phone: '9876543210', course: 'DCA', batch: 'Morning', status: 'new', source: 'website', createdAt: serverTimestamp() })
let pass = 0, fail = 0
async function t(name, p) {
  try { await p; pass++; console.log('  ok  ', name) } catch (e) { fail++; console.log('  FAIL', name, '-', e.message?.split('\n')[0]) }
}

await env.clearFirestore()
await env.withSecurityRulesDisabled(async (c) => {
  await setDoc(doc(c.firestore(), 'admins', 'staff@gmail.com'), { addedAt: new Date(), addedBy: 'rpcraghu@gmail.com' })
  await setDoc(doc(c.firestore(), 'enquiries', 'e1'), { ...good(), createdAt: new Date() })
})

console.log('enquiries')
await t('public can create a valid enquiry', assertSucceeds(addDoc(collection(anon, 'enquiries'), good())))
await t('public cannot set status other than new', assertFails(addDoc(collection(anon, 'enquiries'), { ...good(), status: 'joined' })))
await t('public cannot add extra fields', assertFails(addDoc(collection(anon, 'enquiries'), { ...good(), note: 'x' })))
await t('public cannot send a bad phone', assertFails(addDoc(collection(anon, 'enquiries'), { ...good(), phone: '12345' })))
await t('public cannot send a client time', assertFails(addDoc(collection(anon, 'enquiries'), { ...good(), createdAt: new Date() })))
await t('public cannot send a huge name', assertFails(addDoc(collection(anon, 'enquiries'), { ...good(), name: 'a'.repeat(81) })))
await t('public cannot read enquiries', assertFails(getDocs(collection(anon, 'enquiries'))))
await t('stranger cannot read enquiries', assertFails(getDocs(collection(stranger, 'enquiries'))))
await t('unverified owner email cannot read', assertFails(getDocs(collection(unverified, 'enquiries'))))
await t('owner can read enquiries', assertSucceeds(getDocs(collection(owner, 'enquiries'))))
await t('staff admin can read enquiries', assertSucceeds(getDocs(collection(staff, 'enquiries'))))
await t('admin can change status + note', assertSucceeds(updateDoc(doc(staff, 'enquiries', 'e1'), { status: 'called', note: 'call again', updatedAt: serverTimestamp() })))
await t('admin cannot change the phone', assertFails(updateDoc(doc(staff, 'enquiries', 'e1'), { phone: '9999999999', updatedAt: serverTimestamp() })))
await t('admin cannot set an unknown status', assertFails(updateDoc(doc(staff, 'enquiries', 'e1'), { status: 'paid', updatedAt: serverTimestamp() })))
await t('public cannot delete', assertFails(deleteDoc(doc(anon, 'enquiries', 'e1'))))
await t('admin can delete', assertSucceeds(deleteDoc(doc(staff, 'enquiries', 'e1'))))

console.log('content')
const content = (db, email) => setDoc(doc(db, 'content', 'site'), { json: '{"announcement":"hi"}', updatedAt: serverTimestamp(), updatedBy: email })
await t('public can read content/site', assertSucceeds(getDoc(doc(anon, 'content', 'site'))))
await t('public cannot read other content docs', assertFails(getDoc(doc(anon, 'content', 'secret'))))
await t('public cannot write content', assertFails(content(anon, 'x@gmail.com')))
await t('stranger cannot write content', assertFails(content(stranger, 'x@gmail.com')))
await t('owner can write content', assertSucceeds(content(owner, 'rpcraghu@gmail.com')))
await t('staff can write content', assertSucceeds(content(staff, 'staff@gmail.com')))
await t('staff cannot fake updatedBy', assertFails(content(staff, 'rpcraghu@gmail.com')))
await t('content cannot hold extra fields', assertFails(setDoc(doc(owner, 'content', 'site'), { json: '{}', updatedAt: serverTimestamp(), updatedBy: 'rpcraghu@gmail.com', admin: true })))

console.log('admins')
const addAdmin = (db, by) => setDoc(doc(db, 'admins', 'new@gmail.com'), { addedAt: serverTimestamp(), addedBy: by })
await t('staff cannot add an admin', assertFails(addAdmin(staff, 'staff@gmail.com')))
await t('stranger cannot add themselves', assertFails(setDoc(doc(stranger, 'admins', 'x@gmail.com'), { addedAt: serverTimestamp(), addedBy: 'x@gmail.com' })))
await t('owner can add an admin', assertSucceeds(addAdmin(owner, 'rpcraghu@gmail.com')))
await t('owner cannot add an upper-case id', assertFails(setDoc(doc(owner, 'admins', 'Big@gmail.com'), { addedAt: serverTimestamp(), addedBy: 'rpcraghu@gmail.com' })))
await t('staff can list admins', assertSucceeds(getDocs(collection(staff, 'admins'))))
await t('public cannot list admins', assertFails(getDocs(collection(anon, 'admins'))))
await t('staff cannot remove an admin', assertFails(deleteDoc(doc(staff, 'admins', 'new@gmail.com'))))
await t('owner can remove an admin', assertSucceeds(deleteDoc(doc(owner, 'admins', 'new@gmail.com'))))

await env.cleanup()
console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
