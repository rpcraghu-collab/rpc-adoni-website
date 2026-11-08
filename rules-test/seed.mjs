// Seeds the LOCAL emulator with sample data for screenshots (never the live project).
import { initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { doc, setDoc } from 'firebase/firestore'

const env = await initializeTestEnvironment({ projectId: 'rpc-adoni-4953b', firestore: { host: '127.0.0.1', port: 8085 } })
await env.clearFirestore()
const in3 = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10)
const in10 = new Date(Date.now() + 10 * 864e5).toISOString().slice(0, 10)
await env.withSecurityRulesDisabled(async (c) => {
  const db = c.firestore()
  const rows = [
    ['Test Student A', '9876500001', 'DCA', 'Morning', 'new'],
    ['Test Student B', '9876500002', 'Tally Prime', 'Evening', 'called'],
    ['Test Student C', '9876500003', 'PGDCA', 'Morning', 'joined'],
    ['Test Student D', '9876500004', 'Not sure, please guide me', 'Evening', 'new'],
  ]
  for (const [i, [name, phone, course, batch, status]] of rows.entries())
    await setDoc(doc(db, 'enquiries', `e${i}`), { name, phone, course, batch, status, source: 'website', createdAt: new Date(Date.now() - i * 36e5) })
  await setDoc(doc(db, 'content', 'site'), {
    json: JSON.stringify({
      announcement: 'Sample announcement: new batch starts soon',
      batches: [
        { id: 'b1', course: 'DCA', starts: in3, time: 'Morning (8 am – 1 pm)', note: 'Sample note' },
        { id: 'b2', course: 'PGDCA', starts: in10, time: 'Evening (4 pm – 8 pm)' },
      ],
      gallery: [
        { id: 'g1', url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg', caption: 'Sample photo' },
        { id: 'g2', url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/kitchen-bar.jpg', caption: '' },
      ],
    }),
    updatedAt: new Date(), updatedBy: 'rpcraghu@gmail.com',
  })
})
await env.cleanup()
console.log('seeded')
