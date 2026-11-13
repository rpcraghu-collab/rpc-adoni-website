// Default site content. Every fact comes from CLIENT.md (old rpcadoni.com + RPC poster).
// Firestore (admin panel) overrides these at runtime; never add invented numbers or reviews.

export const SITE = {
  name: 'Real Point Computer Education',
  short: 'RPC',
  since: 2000,
  founder: 'Mr. A.G. Raghavendra',
  phone: '+91 99596 63984',
  phoneRaw: '919959663984',
  email: 'support@rpcadoni.com',
  /** Second domain email (RPC, 13 Nov 2026). */
  email2: 'rpcraghu@rpcadoni.com',
  /** Google Maps listing, opened on its reviews tab (the menu's Reviews link). */
  reviews: 'https://www.google.com/maps/place/REAL+POINT+COMPUTER+EDUCATION/@15.6234107,77.2699322,17z/data=!4m8!3m7!1s0x3bb64dc3855eaae3:0xf36a161e79d29ec1!8m2!3d15.6234055!4d77.2725071!9m1!1b1!16s%2Fg%2F1hf9324nn',
  deputy: 'Smt. S. Nagaveni',
  address: 'Babu Plaza, 2nd Floor, Adoni, Andhra Pradesh',
  addressShort: 'Babu Plaza, Adoni',
  mapsQuery: 'Real Point Computer Education, Babu Plaza, Adoni',
  facebook: 'https://www.facebook.com/rpcadoni',
  timings: [
    { label: 'Morning batch', time: '9:00 am – 1:30 pm' },
    { label: 'Evening batch', time: '4:00 pm – 8:00 pm' },
  ],
  url: 'https://rpcadoni.com',
}

export const CREDENTIALS = [
  { title: 'ISO 9001:2015', text: 'Certified institute' },
  { title: '5× Award', text: 'Education Excellence' },
]

export type CourseGroup = 'diploma' | 'office' | 'programming'

export type Course = {
  slug: string
  code: string
  name: string
  group: CourseGroup
  tagline: string
  forWho: string
  duration: string[] // e.g. ['1½ hrs daily · 4 months', '3 hrs daily · 2 months']
  modules: { title?: string; items: string[] }[]
  tools: string[]
  featured?: boolean
  hidden?: boolean // set in the admin panel: removed from lists and the enquiry form
  fee?: string // set in the admin panel, e.g. 'Rs 6,000 (2 instalments)'
}

export const GROUPS: { id: CourseGroup; label: string; blurb: string; art: string }[] = [
  { id: 'diploma', label: 'Diplomas', blurb: 'PGDCA, DCA, DCP: complete computer diplomas', art: '/img/art/diplomas.webp' },
  { id: 'office', label: 'Office & Tally', blurb: 'CCA, OAM, Advanced Excel, Tally Prime with GST, Power BI', art: '/img/art/office.webp' },
  { id: 'programming', label: 'Programming', blurb: 'C, C++, Java, Oracle, Python, SQL for Degree & B.Tech', art: '/img/art/programming.webp' },
]

// A topic written 'Parent: sub-items' shows as a bullet with its sub-items under it (RPC, 13 Nov 2026).
// Topics come only from RPC's course sheet (WebsiteDreamTeam.pdf, Nov 2026). RPC can edit them in /admin → Courses.
const BASE = ['Computer Fundamentals (Typing)', 'Microsoft Office: Word, Advanced Excel, PPT', 'Operating System', 'Internet with AI Tools']
const BASE_TOOLS = ['Typing', 'Word', 'Excel', 'PowerPoint', 'AI Tools']

/** Bump when the default course list changes, so an older list saved in the admin panel is not shown. */
export const COURSES_REV = 3

export const COURSES: Course[] = [
  {
    slug: 'pgdca',
    code: 'PGDCA',
    name: 'Post Graduate Diploma in Computer Applications',
    group: 'diploma',
    tagline: 'The complete diploma for Degree & PG students: office skills, programming, databases and accounts.',
    forWho: 'Degree & PG students',
    duration: ['1½ hrs daily · 1 year', '3 hrs daily · 6 months'],
    modules: [
      { title: 'Semester I', items: [...BASE, 'C Language', 'C++'] },
      { title: 'Semester II', items: ['Java or Power BI', 'Oracle: SQL, PL/SQL', 'Tally Prime with GST or Python', 'Project Work', 'Semester Exam Guidance'] },
    ],
    tools: ['Word', 'Excel', 'C', 'C++', 'Java', 'Power BI', 'Oracle', 'SQL', 'Tally', 'Python'],
    featured: true,
  },
  {
    slug: 'dca',
    code: 'DCA',
    name: 'Diploma in Computer Applications',
    group: 'diploma',
    tagline: 'Office skills plus your first programming language.',
    forWho: 'Inter students',
    duration: ['1½ hrs daily · 4 months', '3 hrs daily · 2 months'],
    modules: [{ items: [...BASE, 'C Language'] }],
    tools: [...BASE_TOOLS, 'C'],
  },
  {
    slug: 'dcp',
    code: 'DCP',
    name: 'Diploma in Computer Programming',
    group: 'diploma',
    tagline: 'DCA plus C++: a strong start for future engineers.',
    forWho: 'Inter students',
    duration: ['1½ hrs daily · 6 months', '3 hrs daily · 3 months'],
    modules: [{ items: [...BASE, 'C Language', 'C++'] }],
    tools: [...BASE_TOOLS, 'C', 'C++'],
  },
  {
    slug: 'cca',
    code: 'CCA',
    name: 'Certificate in Computer Applications',
    group: 'office',
    tagline: 'A friendly first course: typing, MS Office, the computer and the internet with AI tools.',
    forWho: 'Anyone above 11 years',
    duration: ['1½ hrs daily · 75 days', '3 hrs daily · 40 days'],
    modules: [{ items: BASE }],
    tools: BASE_TOOLS,
  },
  {
    slug: 'oam',
    code: 'OAM',
    name: 'Office Automation Master',
    group: 'office',
    tagline: 'Job-oriented: MS Office, internet with AI tools and Tally Prime with GST.',
    forWho: 'Students, job seekers, homemakers, business people',
    duration: ['1½ hrs daily · 4 months', '3 hrs daily · 2 months'],
    modules: [{ items: [...BASE, 'Tally Prime with GST'] }],
    tools: [...BASE_TOOLS, 'Tally'],
    featured: true,
  },
  {
    slug: 'oam-advanced',
    code: 'OAM Advanced',
    name: 'Office Automation Master – Advanced',
    group: 'office',
    tagline: 'Everything in OAM plus Power BI with a project.',
    forWho: 'Students, job seekers, office staff',
    duration: ['1½ hrs daily · 5 months', '3 hrs daily · 2½ months'],
    modules: [{ items: [...BASE, 'Tally Prime with GST', 'Power BI with Project'] }],
    tools: [...BASE_TOOLS, 'Tally', 'Power BI'],
    featured: true,
  },
  {
    slug: 'oam-pro',
    code: 'OAM Pro',
    name: 'Office Automation Master – Pro',
    group: 'office',
    tagline: 'Everything in OAM Advanced plus SQL: the most complete office course.',
    forWho: 'Graduates & working professionals',
    duration: ['1½ hrs daily · 6 months', '3 hrs daily · 3 months'],
    modules: [{ items: [...BASE, 'Tally Prime with GST', 'Power BI with Project', 'SQL'] }],
    tools: [...BASE_TOOLS, 'Tally', 'Power BI', 'SQL'],
    featured: true,
  },
  {
    slug: 'advanced-excel',
    code: 'Advanced Excel',
    name: 'Advanced Excel',
    group: 'office',
    tagline: 'Learn Advanced Excel on its own.',
    forWho: 'Students & working people',
    duration: ['25 days'],
    modules: [{ items: ['Excel: Core & Advanced'] }],
    tools: ['Excel'],
  },
  {
    slug: 'tally',
    code: 'Tally',
    name: 'Tally Prime with GST',
    group: 'office',
    tagline: 'Learn accounts in Tally Prime with GST on its own.',
    forWho: 'Students & working people',
    duration: ['50 days'],
    modules: [{ items: ['Tally Prime with GST'] }],
    tools: ['Tally', 'GST'],
  },
  {
    slug: 'power-bi',
    code: 'Power BI',
    name: 'Power BI with Project',
    group: 'office',
    tagline: 'Learn Power BI on its own, with a project.',
    forWho: 'Students & working people',
    duration: ['30 days'],
    modules: [{ items: ['Power BI', 'Project Work'] }],
    tools: ['Power BI'],
  },
  ...(['C', 'C++', 'Java', 'Oracle', 'Python', 'SQL'] as const).map((lang) => ({
    slug: lang.toLowerCase().replace('++', 'pp'),
    code: lang,
    name: lang === 'C' ? 'C Programming' : lang === 'Oracle' ? 'Oracle Database' : lang === 'SQL' ? 'SQL Database' : `${lang} Programming`,
    group: 'programming' as const,
    tagline: {
      C: 'The foundation of programming: logic, problem solving and hands-on coding.',
      'C++': 'Object-oriented programming to design and build bigger programs.',
      Java: 'Build applications with Java.',
      Oracle: 'Manage databases with Oracle SQL and PL/SQL.',
      Python: 'Write programs and automate work with Python.',
      SQL: 'Store, query and manage data with SQL.',
    }[lang],
    forWho: 'Degree & B.Tech students',
    // Days from RPC's course sheet (13 Nov 2026); SQL has no length on the sheet.
    duration: ({ C: ['35 days'], 'C++': ['30 days'], Java: ['45 days'], Oracle: ['45 days'], Python: ['45 days'], SQL: [] } as Record<string, string[]>)[lang],
    // Brief only (RPC, 10 Nov 2026): no detailed topic lists for single languages.
    modules: [{ items: [lang === 'Oracle' ? 'Oracle: SQL, PL/SQL' : `${lang === 'C' ? 'C Language' : lang}: Core & Advanced`] }],
    tools: [lang],
  })),
]

/** The individual (single-subject) courses, in RPC's order. */
export const INDIVIDUAL = ['advanced-excel', 'tally', 'power-bi', 'sql', 'c', 'cpp', 'java', 'oracle', 'python']

export const FINDER = [
  { id: 'school', label: 'School student', note: 'Above 11 years', slugs: ['cca'] },
  { id: 'inter', label: 'Inter student', note: 'Diplomas & office courses', slugs: ['dca', 'dcp', 'oam', 'oam-advanced', 'oam-pro'] },
  { id: 'degree', label: 'Degree / B.Tech', note: 'PGDCA + every language', slugs: ['pgdca', 'c', 'cpp', 'java', 'oracle', 'python', 'sql'] },
  { id: 'work', label: 'Working / homemaker', note: 'Office & accounts skills', slugs: ['cca', 'oam', 'oam-advanced', 'oam-pro'] },
]

export const FACILITIES = [
  { title: 'AC classrooms & labs', text: 'Comfortable, air-conditioned rooms and computer labs.' },
  { title: 'LED projectors', text: 'Every concept shown on the big screen, then practised.' },
  { title: '100% practical training', text: 'You learn on the computer, not just from the board.' },
  { title: 'Online exams', text: 'Regular online tests so you know where you stand.' },
  { title: '100% study material', text: 'Complete printed material for every course.' },
  { title: 'Certificate on completion', text: 'From an ISO 9001:2015 certified institute.' },
  { title: 'Experienced faculty', text: 'Taught by faculty with over two decades of experience.' },
  { title: 'Lift & generator', text: 'Easy access and no class lost to power cuts.' },
]

export const AWARDS = [
  { n: 1, from: 'Sri V.V.S. Laxman', role: 'Former Indian Cricketer', img: 'award-1' },
  { n: 2, from: 'Sri Abhinav Bindra', role: 'Olympic gold medallist, Indian Shooter', img: 'award-2' },
  { n: 3, from: 'Sri Vijender Garg', role: 'MLA, Govt of New Delhi', img: 'award-3' },
  { n: 4, from: 'Dr. V.B. Soni', role: 'Former Diplomat, Rtd. Foreign Exchange', img: 'award-4' },
  { n: 5, from: 'Sri Chetan Chauhan', role: 'Former Indian Cricketer, Ex Cabinet Minister of UP', img: 'award-5' },
]

export const TOOLS = ['MS Word', 'Advanced Excel', 'PowerPoint', 'Tally Prime', 'GST', 'SQL', 'Power BI', 'C', 'C++', 'Java', 'Python', 'Oracle PL/SQL', 'Internet', 'AI Tools', 'Typing']

export const FAQS = [
  { q: 'What are the course fees?', a: 'Fees depend on the course and the batch you choose. Send us a WhatsApp message or call, and we will share the exact fee and any current offers.' },
  { q: 'What are the class timings?', get a() { return `Classes run in two slots every day: ${SITE.timings.map((t) => t.time).join(' and ')}. Most courses can be done at 1½ hours a day or faster at 3 hours a day.` } },
  { q: 'Will I get a certificate?', a: 'Yes. Every course ends with a certificate from RPC, an ISO 9001:2015 certified institute in Adoni.' },
  { q: 'I have never used a computer. Can I join?', a: 'Yes. CCA and OAM start from computer fundamentals. Anyone above 11 years can join CCA.' },
  { q: 'Which course is best for B.Tech or Degree students?', a: 'PGDCA covers office tools, C, C++, Java or Power BI, Oracle (SQL, PL/SQL) and Tally or Python in one diploma. You can also take a single language like Java, Python or SQL on its own.' },
  { q: 'Where is RPC?', a: 'Babu Plaza, 2nd Floor, Adoni, Andhra Pradesh. The building has a lift and generator backup.' },
]

export const waLink = (text = 'Hello RPC, I want details about your computer courses.') =>
  `https://wa.me/${SITE.phoneRaw}?text=${encodeURIComponent(text)}`
export const telLink = () => `tel:${SITE.phone.replace(/\s/g, '')}`
/** Courses shown in lists, menus and the enquiry form (hidden ones are left out). */
export const listed = () => COURSES.filter((c) => !c.hidden)
/** 'Microsoft Office: Word, Advanced Excel, PPT' → { head: 'Microsoft Office', sub: 'Word, Advanced Excel, PPT' }. */
export const splitTopic = (t: string) => {
  const m = /^([^:]{1,40}):\s+(.+)$/.exec(t)
  return m ? { head: m[1].trim(), sub: m[2].trim() } : { head: t, sub: '' }
}
