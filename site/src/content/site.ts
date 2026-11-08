// Default site content. Every fact comes from CLIENT.md (old rpcadoni.com + RPC poster).
// Firestore (admin panel) overrides these at runtime; never add invented numbers or reviews.

export const SITE = {
  name: 'Real Point Computer Education',
  short: 'RPC',
  since: 2000,
  founder: 'Mr. A.G. Raghavendra',
  phone: '+91 99596 63984',
  phoneRaw: '919959663984',
  email: 'rpcraghu@gmail.com',
  address: 'Babu Plaza, 2nd Floor, Adoni, Andhra Pradesh',
  addressShort: 'Babu Plaza, Adoni',
  mapsQuery: 'Real Point Computer Education, Babu Plaza, Adoni',
  facebook: 'https://www.facebook.com/rpcadoni',
  timings: [
    { label: 'Morning batch', time: '8:00 am – 1:00 pm' },
    { label: 'Evening batch', time: '4:00 pm – 8:00 pm' },
  ],
  url: 'https://rpcadoni.com',
}

export const CREDENTIALS = [
  { title: 'ISO 9001:2015', text: 'Certified institute' },
  { title: 'AP Govt DET', text: 'Permission since 2006' },
  { title: 'MSME', text: 'Registered' },
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
}

export const GROUPS: { id: CourseGroup; label: string; blurb: string; art: string }[] = [
  { id: 'diploma', label: 'Diplomas', blurb: 'PGDCA, DCA, DCP: complete computer diplomas', art: '/img/art/diplomas.webp' },
  { id: 'office', label: 'Office & Tally', blurb: 'MS Office, Advanced Excel, Tally Prime with GST', art: '/img/art/office.webp' },
  { id: 'programming', label: 'Programming', blurb: 'C, C++, Java, Oracle, Python for Degree & B.Tech', art: '/img/art/programming.webp' },
]

export const COURSES: Course[] = [
  {
    slug: 'pgdca',
    code: 'PGDCA',
    name: 'Post Graduate Diploma in Computer Applications',
    group: 'diploma',
    tagline: 'The complete one-year diploma: office skills, programming, databases and accounts.',
    forWho: 'Degree & B.Tech students',
    duration: ['1½ hrs daily · 1 year', '3 hrs daily · 6 months'],
    modules: [
      { title: 'Semester I', items: ['Computer Fundamentals', 'MS Office: Word, Advanced Excel, PowerPoint', 'Operating System with Internet', 'C Language', 'C++'] },
      { title: 'Semester II', items: ['Java', 'Oracle: SQL & PL/SQL', 'Tally ERP with GST', 'Project Work', 'Basics in Testing', 'Exam Guidance'] },
    ],
    tools: ['Word', 'Excel', 'PowerPoint', 'C', 'C++', 'Java', 'Oracle', 'Tally'],
    featured: true,
  },
  {
    slug: 'pgdca-advanced',
    code: 'PGDCA Advanced',
    name: 'PGDCA Advanced',
    group: 'diploma',
    tagline: 'PGDCA with a stronger programming and database track.',
    forWho: 'Degree & B.Tech students',
    duration: ['1½ hrs daily · 1 year', '3 hrs daily · 6 months'],
    modules: [
      { title: 'Semester I', items: ['Computer Fundamentals', 'MS Office: Word, Advanced Excel, PowerPoint', 'Operating System with Internet', 'C Language', 'C++'] },
      { title: 'Semester II', items: ['Java', 'Oracle: SQL & PL/SQL', 'Tally ERP with GST', 'Project Work', 'Basics in Testing'] },
    ],
    tools: ['Excel', 'C', 'C++', 'Java', 'Oracle', 'Tally'],
  },
  {
    slug: 'dca',
    code: 'DCA',
    name: 'Diploma in Computer Applications',
    group: 'diploma',
    tagline: 'Office skills plus your first programming language.',
    forWho: 'Inter students',
    duration: ['1½ hrs daily · 5 months', '3 hrs daily · 2½ months'],
    modules: [{ items: ['Computer Fundamentals', 'MS Office: Word, Advanced Excel, PowerPoint', 'Operating System with Internet', 'C Language'] }],
    tools: ['Word', 'Excel', 'PowerPoint', 'C'],
  },
  {
    slug: 'dcp',
    code: 'DCP',
    name: 'Diploma in Computer Programming',
    group: 'diploma',
    tagline: 'DCA plus C++: a strong start for future engineers.',
    forWho: 'Inter students',
    duration: ['1½ hrs daily · 6 months', '3 hrs daily · 3 months'],
    modules: [{ items: ['Computer Fundamentals', 'MS Office: Word, Advanced Excel, PowerPoint', 'Operating System with Internet', 'C Language', 'C++'] }],
    tools: ['Excel', 'C', 'C++'],
  },
  {
    slug: 'oam',
    code: 'OAM',
    name: 'Office Automation Master',
    group: 'office',
    tagline: 'Word, Excel, PowerPoint, Internet and Tally Prime with GST: office-ready in months.',
    forWho: 'Students, job seekers, homemakers, business people',
    duration: ['1½ hrs daily · 4 months', '3 hrs daily · 2 months'],
    modules: [{ items: ['Computer Fundamentals', 'Operating System', 'MS Word', 'Advanced Excel', 'PowerPoint', 'Internet & E-mail', 'Tally Prime with GST'] }],
    tools: ['Word', 'Excel', 'PowerPoint', 'Internet', 'E-mail', 'Tally'],
    featured: true,
  },
  {
    slug: 'oam-advanced',
    code: 'OAM Advanced',
    name: 'Office Automation Master – Advanced',
    group: 'office',
    tagline: 'Everything in OAM plus SQL and Power BI for data-driven office work.',
    forWho: 'Graduates, accounts & office staff',
    duration: ['1½ hrs daily · 5 months', '3 hrs daily · 2½ months'],
    modules: [{ items: ['Computer Fundamentals', 'Operating System', 'MS Word', 'Advanced Excel', 'PowerPoint', 'Internet Concepts', 'Tally Prime with GST', 'SQL', 'Power BI', 'Productivity Tools'] }],
    tools: ['Advanced Excel', 'Tally', 'SQL', 'Power BI'],
    featured: true,
  },
  {
    slug: 'oam-pro',
    code: 'OAM PRO',
    name: 'Office Automation Master – PRO',
    group: 'office',
    tagline: 'Professional & advanced computer skills for modern workplaces.',
    forWho: 'Graduates & working professionals',
    duration: [],
    modules: [{ items: ['Data Analytics', 'Business Applications', 'Cloud Tools', 'Project Skills', 'Career Skills'] }],
    tools: ['Data Analytics', 'Cloud Tools'],
    featured: true,
  },
  {
    slug: 'cca',
    code: 'CCA',
    name: 'Certificate in Computer Applications',
    group: 'office',
    tagline: 'A friendly first course in computers, office tools and the internet.',
    forWho: 'Anyone above 11 years',
    duration: ['1½ hrs daily · 75 days', '3 hrs daily · 40 days'],
    modules: [{ items: ['Computer Fundamentals', 'Operating System', 'MS Word', 'Advanced Excel', 'PowerPoint', 'Internet Concepts'] }],
    tools: ['Word', 'Excel', 'PowerPoint', 'Internet'],
  },
  ...(['C', 'C++', 'Java', 'Oracle', 'Python'] as const).map((lang) => ({
    slug: lang.toLowerCase().replace('++', 'pp'),
    code: lang,
    name: lang === 'C' ? 'C Programming' : lang === 'Oracle' ? 'Oracle Database (SQL & PL/SQL)' : `${lang} Programming`,
    group: 'programming' as const,
    tagline: {
      C: 'The foundation of programming: logic, problem solving and hands-on coding projects.',
      'C++': 'Object-oriented programming to design and build complex programs.',
      Java: 'Build robust, scalable and efficient applications with Java.',
      Oracle: 'Manage databases with Oracle SQL and PL/SQL.',
      Python: 'Software, data analysis, automation and web apps with Python.',
    }[lang],
    forWho: 'Degree & B.Tech students',
    duration: [],
    modules: [],
    tools: [lang],
  })),
]

export const FINDER = [
  { id: 'school', label: 'School student', note: 'Above 11 years', slugs: ['cca'] },
  { id: 'inter', label: 'Inter student', note: 'Start your tech journey', slugs: ['dca', 'dcp', 'oam'] },
  { id: 'degree', label: 'Degree / B.Tech', note: 'Diplomas + programming', slugs: ['pgdca', 'pgdca-advanced', 'java', 'python'] },
  { id: 'work', label: 'Working / homemaker', note: 'Office & accounts skills', slugs: ['oam', 'oam-advanced', 'oam-pro'] },
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

export const TOOLS = ['MS Word', 'Advanced Excel', 'PowerPoint', 'Tally Prime', 'GST', 'SQL', 'Power BI', 'C', 'C++', 'Java', 'Python', 'Oracle PL/SQL', 'Internet & E-mail', 'Data Analytics', 'Cloud Tools']

export const FAQS = [
  { q: 'What are the course fees?', a: 'Fees depend on the course and the batch you choose. Send us a WhatsApp message or call, and we will share the exact fee and any current offers.' },
  { q: 'What are the class timings?', a: 'Classes run in two slots every day: 8:00 am – 1:00 pm and 4:00 pm – 8:00 pm. Most courses can be done at 1½ hours a day or faster at 3 hours a day.' },
  { q: 'Will I get a certificate?', a: 'Yes. Every course ends with a certificate from RPC, an ISO 9001:2015 certified institute with permission from the Directorate of Employment & Training, AP Govt.' },
  { q: 'I have never used a computer. Can I join?', a: 'Yes. CCA and OAM start from computer fundamentals. Anyone above 11 years can join CCA.' },
  { q: 'Which course is best for B.Tech or Degree students?', a: 'PGDCA covers office tools, C, C++, Java, Oracle and Tally in one diploma. You can also take a single language like Java or Python on its own.' },
  { q: 'Where is RPC?', a: 'Babu Plaza, 2nd Floor, Adoni, Andhra Pradesh. The building has a lift and generator backup.' },
]

export const waLink = (text = 'Hello RPC, I want details about your computer courses.') =>
  `https://wa.me/${SITE.phoneRaw}?text=${encodeURIComponent(text)}`
export const telLink = `tel:${SITE.phone.replace(/\s/g, '')}`
