// Helpers for the Courses page. Everything is computed from the course data (content/site.ts or the
// admin's saved copy), so a changed syllabus changes the cards, the compare tables and the counts.
import type { Course, CourseGroup } from '../../content/site'

/** Number of syllabus topics (all module items). */
export const topicCount = (c: Course) => c.modules.reduce((n, m) => n + m.items.length, 0)

/** The 3D scene behind each group's chapter banner (public/img/hero/<name>{,-md,-sm}.webp). */
export const GROUP_SCENE: Record<CourseGroup, string> = { diploma: 'hero-achieve', office: 'hero-office', programming: 'hero-code' }
export const sceneSrc = (n: string) => `/img/hero/${n}.webp`
export const sceneSet = (n: string) => `/img/hero/${n}-sm.webp 768w, /img/hero/${n}-md.webp 1280w, /img/hero/${n}.webp 1672w`
export const SCENE_SIZE = { width: 1672, height: 941 }

/** Subjects for the compare tables. A course "has" a subject when any syllabus item or tool matches. */
type Subject = { label: string; test: (s: string) => boolean }
const re = (r: RegExp) => (s: string) => r.test(s)
export const SUBJECTS: Subject[] = [
  { label: 'Computer fundamentals & typing', test: re(/fundamental|typing/i) },
  { label: 'Operating system', test: re(/operating system/i) },
  { label: 'MS Word', test: re(/\bword\b/i) },
  { label: 'Excel / Advanced Excel', test: re(/excel/i) },
  { label: 'PowerPoint', test: re(/powerpoint|\bppt\b/i) },
  { label: 'Internet with AI tools', test: re(/internet|ai tools|e-?mail/i) },
  { label: 'Tally Prime with GST', test: re(/tally/i) },
  { label: 'C language', test: (s) => /^c$/i.test(s.trim()) || /\bc language\b/i.test(s) },
  { label: 'C++', test: re(/c\+\+/i) },
  { label: 'Java', test: re(/\bjava\b/i) },
  { label: 'Oracle SQL & PL/SQL', test: re(/oracle/i) },
  { label: 'SQL', test: (s) => /\bsql\b/i.test(s) && !/oracle|pl\/sql/i.test(s) },
  { label: 'Power BI', test: re(/power ?bi/i) },
  { label: 'Python', test: re(/python/i) },
  { label: 'Data analytics', test: re(/analytics/i) },
  { label: 'Business applications', test: re(/business app/i) },
  { label: 'Cloud tools', test: re(/cloud/i) },
  { label: 'Productivity tools', test: re(/productivity/i) },
  { label: 'Testing basics', test: re(/testing/i) },
  { label: 'Projects', test: re(/project/i) },
  { label: 'Career skills', test: re(/career skill/i) },
  { label: 'Exam guidance', test: re(/exam guidance/i) },
]

export const hasSubject = (c: Course, s: Subject) => [...c.modules.flatMap((m) => m.items), ...c.tools].some(s.test)

/** Rows for a compare table: only subjects at least one of the courses teaches. */
export const compareRows = (cs: Course[]) => SUBJECTS.filter((s) => cs.some((c) => hasSubject(c, s))).map((s) => ({ label: s.label, has: cs.map((c) => hasSubject(c, s)) }))

/** A tiny real program per language for the code band (decoration, not course facts). */
export const SNIPPETS: Record<string, { file: string; lang: string; code: string[] }> = {
  c: { file: 'main.c', lang: 'C', code: ['#include <stdio.h>', '', 'int main(void) {', '  printf("Hello, Adoni!\\n");', '  return 0;', '}'] },
  cpp: { file: 'main.cpp', lang: 'C++', code: ['#include <iostream>', '', 'int main() {', '  std::cout << "Hello, Adoni!";', '  return 0;', '}'] },
  java: { file: 'Main.java', lang: 'Java', code: ['class Main {', '  public static void main(String[] a) {', '    System.out.println("Hello, Adoni!");', '  }', '}'] },
  oracle: { file: 'query.sql', lang: 'SQL', code: ['SELECT name, course', '  FROM students', ' WHERE batch = \'MORNING\'', ' ORDER BY name;'] },
  sql: { file: 'report.sql', lang: 'SQL', code: ['SELECT course, COUNT(*) AS students', '  FROM admissions', ' GROUP BY course', ' ORDER BY students DESC;'] },
  python: { file: 'hello.py', lang: 'Python', code: ['name = "Adoni"', '', 'for n in range(3):', '    print(f"Hello, {name}!")'] },
}

export type Tok = { t: string; k?: 'kw' | 'str' | 'fn' | 'num' | 'pre' | 'type' }
const KW = new Set(['int', 'void', 'return', 'class', 'public', 'static', 'for', 'in', 'if', 'else', 'while', 'def', 'import', 'SELECT', 'FROM', 'WHERE', 'ORDER', 'BY', 'AND', 'OR', 'INSERT', 'INTO', 'VALUES', 'GROUP', 'COUNT', 'AS', 'DESC'])
const TYPES = new Set(['String', 'System', 'std', 'cout', 'Main'])
const TOKEN = /("(?:[^"\\]|\\.)*"|'[^']*'|#\w+|<[\w.]+>|\b\d+\b|\b[A-Za-z_]\w*\b)/g

/** Very small syntax colouring: keywords, strings, numbers, function calls, includes. */
export function highlight(line: string): Tok[] {
  const out: Tok[] = []
  let last = 0
  for (const m of line.matchAll(TOKEN)) {
    const i = m.index ?? 0
    if (i > last) out.push({ t: line.slice(last, i) })
    const w = m[0]
    const next = line.slice(i + w.length).trimStart()
    const k: Tok['k'] =
      w.startsWith('"') || w.startsWith("'") ? 'str'
      : w.startsWith('#') || w.startsWith('<') ? 'pre'
      : /^\d/.test(w) ? 'num'
      : KW.has(w) ? 'kw'
      : TYPES.has(w) ? 'type'
      : next.startsWith('(') ? 'fn'
      : undefined
    out.push({ t: w, k })
    last = i + w.length
  }
  if (last < line.length) out.push({ t: line.slice(last) })
  return out
}
