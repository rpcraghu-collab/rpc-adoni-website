// Seeds the LOCAL emulator for the 10 Nov 2026 course + gallery-folder test (never the live project).
// The saved course list has no coursesRev and still lists PGDCA Advanced, like the live doc: it must be ignored.
import { initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { doc, setDoc } from 'firebase/firestore'

const env = await initializeTestEnvironment({ projectId: 'rpc-adoni-4953b', firestore: { host: '127.0.0.1', port: 8085 } })
await env.clearFirestore()
await env.withSecurityRulesDisabled(async (c) => {
  const db = c.firestore()
  await setDoc(doc(db, 'content', 'site'), {
    json: JSON.stringify({
      courses: [
        { slug: 'pgdca-advanced', code: 'PGDCA Advanced', name: 'Old PGDCA Advanced', group: 'diploma', tagline: '', forWho: '', duration: [], modules: [], tools: [] },
        { slug: 'python', code: 'Python', name: 'Old Python', group: 'programming', tagline: '', forWho: '', duration: [], modules: [{ items: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11'] }], tools: [] },
      ],
      gallery: [{ id: 'g1', url: 'https://res.cloudinary.com/q2nhyak9/image/upload/v1/test/general.jpg', caption: 'hiii' }],
    }),
    updatedAt: new Date(), updatedBy: 'rpcraghu@gmail.com',
  })
})
await env.cleanup()
console.log('seeded')
