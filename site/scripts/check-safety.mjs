// Build guard (9 Nov 2026) against two bugs that blanked the live site on phones:
// 1. An effect written as `useEffect(() => someCall())` returns whatever someCall returns. If that is not a
//    function (in-app browsers patch window.scrollTo to return a value), React calls it as a cleanup on the next
//    page change: "_ is not a function" and a white screen. Effects must use a block body { ... }.
// 2. Browser features missing on older phones (iOS < 15.4, old Android WebViews) crash the whole app on load.
import ts from 'typescript'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const MISSING_ON_OLD_PHONES = /\b(structuredClone|requestIdleCallback|Object\.hasOwn|\.findLast\(|\.toSorted\(|\.toReversed\(|Promise\.withResolvers)\b/
const files = []
;(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (/\.tsx?$/.test(f)) files.push(p) } })('src')

const problems = []
for (const file of files) {
  const text = readFileSync(file, 'utf8')
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const at = (n) => `${file}:${sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1}`
  const visit = (n) => {
    if (ts.isCallExpression(n) && /(^|\.)use(Layout|Insertion)?Effect$/.test(n.expression.getText(sf))) {
      const cb = n.arguments[0]
      if (cb && (ts.isArrowFunction(cb) || ts.isFunctionExpression(cb)) && !ts.isBlock(cb.body)) {
        problems.push(`${at(cb)}  effect without { } returns a value; write useEffect(() => { ... }, deps)`)
      }
    }
    ts.forEachChild(n, visit)
  }
  visit(sf)
  // Split on \r?\n: with git autocrlf the files are CRLF, and a trailing \r stopped the comment strip below.
  text.split(/\r?\n/).forEach((line, i) => {
    const code = line.replace(/\/\/.*$/, '')
    const m = code.match(MISSING_ON_OLD_PHONES)
    if (m) problems.push(`${file}:${i + 1}  ${m[0]} is missing on older phones; use a safe alternative`)
  })
}
if (problems.length) { console.error('check-safety failed:\n  ' + problems.join('\n  ')); process.exit(1) }
console.log(`check-safety: ${files.length} files OK`)
