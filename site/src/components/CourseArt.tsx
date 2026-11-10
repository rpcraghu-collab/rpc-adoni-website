import { useId, type ReactNode } from 'react'
import { cn } from '../lib/cn'

/**
 * One distinct, code-drawn cover per course (no stock or AI photos, nothing presented as RPC's rooms).
 * Every course gets its own palette and a picture of its subject. Fills its box (slice), paints its own background.
 */
type Pal = { bg: string; deep: string; fg: string; accent: string; soft: string }

const PAL: Record<string, Pal> = {
  pgdca: { bg: '#13285f', deep: '#0a1638', fg: '#f4f1ea', accent: '#ef4a3c', soft: '#8fa6e6' },
  dca: { bg: '#0d4a4b', deep: '#062628', fg: '#eafaf5', accent: '#7be0c3', soft: '#5fa9a2' },
  dcp: { bg: '#2a1d6e', deep: '#140d3d', fg: '#f1edff', accent: '#b8a6ff', soft: '#6f5fc4' },
  oam: { bg: '#f3e7cf', deep: '#e3d1ad', fg: '#1f2a44', accent: '#1d7a46', soft: '#b99d6b' },
  'oam-advanced': { bg: '#0f4430', deep: '#062217', fg: '#effbe8', accent: '#c4f06a', soft: '#4f9a73' },
  'oam-pro': { bg: '#202029', deep: '#0e0e13', fg: '#f6f2ea', accent: '#ffb648', soft: '#6c6c80' },
  cca: { bg: '#ffe9cc', deep: '#ffd39b', fg: '#24324f', accent: '#ff6b2c', soft: '#4c7bd9' },
  c: { bg: '#121a2b', deep: '#070b14', fg: '#e6f1ff', accent: '#38bdf8', soft: '#3b4b6b' },
  cpp: { bg: '#0d2a52', deep: '#06142b', fg: '#eaf2ff', accent: '#ff6fa5', soft: '#4a6fa8' },
  java: { bg: '#3a2316', deep: '#1c0f08', fg: '#fbf0e6', accent: '#ff8a3d', soft: '#a2715a' },
  oracle: { bg: '#4a0f12', deep: '#240608', fg: '#ffeeea', accent: '#ff5a4e', soft: '#b65a5a' },
  python: { bg: '#0f3157', deep: '#07182c', fg: '#eef5ff', accent: '#ffd43b', soft: '#4f86c6' },
  sql: { bg: '#1b2440', deep: '#0c1122', fg: '#e9eeff', accent: '#7cf29a', soft: '#4b5a8a' },
  'advanced-excel': { bg: '#e4f3e8', deep: '#c4e3cd', fg: '#14361f', accent: '#1f9d55', soft: '#7fbf95' },
  tally: { bg: '#2b1a4a', deep: '#150c27', fg: '#f5efff', accent: '#4fd1c5', soft: '#8a76c0' },
  'power-bi': { bg: '#3d2a05', deep: '#1c1302', fg: '#fff6e0', accent: '#f2c811', soft: '#a88a3c' },
}
const FALLBACK = PAL.pgdca

const MOTIF: Record<string, (p: Pal) => ReactNode> = {
  // Graduation cap over two semester bars.
  pgdca: (p) => (
    <g>
      <rect x="128" y="196" width="144" height="14" rx="7" fill={p.soft} opacity=".55" />
      <rect x="146" y="218" width="108" height="14" rx="7" fill={p.soft} opacity=".3" />
      <path d="M200 70 292 112 200 154 108 112Z" fill={p.fg} />
      <path d="M146 130v34c0 14 24 26 54 26s54-12 54-26v-34l-54 24Z" fill={p.fg} opacity=".82" />
      <path d="M200 112 268 128v46" stroke={p.accent} strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="268" cy="182" r="9" fill={p.accent} />
    </g>
  ),
  // A grid of app tiles, one lit.
  dca: (p) => (
    <g>
      {[0, 1, 2].map((col) =>
        [0, 1].map((row) => (
          <rect key={`${col}${row}`} x={114 + col * 62} y={86 + row * 66} width="50" height="54" rx="12"
            fill={col === 1 && row === 0 ? p.accent : p.fg} opacity={col === 1 && row === 0 ? 1 : 0.16 + (col + row) * 0.12} />
        )),
      )}
      <path d="M222 180 252 208l-14 2 9 18-8 4-9-18-10 9Z" fill={p.fg} />
    </g>
  ),
  // A terminal window with code lines and a cursor.
  dcp: (p) => (
    <g>
      <rect x="92" y="70" width="216" height="160" rx="16" fill={p.deep} stroke={p.soft} strokeWidth="2" />
      <circle cx="114" cy="92" r="5" fill={p.accent} /><circle cx="132" cy="92" r="5" fill={p.soft} /><circle cx="150" cy="92" r="5" fill={p.soft} opacity=".5" />
      <path d="m116 128 18 14-18 14" stroke={p.accent} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="146" y="136" width="96" height="10" rx="5" fill={p.fg} opacity=".85" />
      <rect x="116" y="170" width="60" height="10" rx="5" fill={p.soft} />
      <rect x="184" y="170" width="74" height="10" rx="5" fill={p.fg} opacity=".4" />
      <rect x="116" y="194" width="16" height="16" rx="2" fill={p.accent} />
    </g>
  ),
  // Envelope, document and a spreadsheet: everyday office work.
  oam: (p) => (
    <g>
      <rect x="166" y="62" width="128" height="160" rx="10" fill="#fff" stroke={p.soft} strokeWidth="2" transform="rotate(8 230 142)" />
      <g transform="rotate(8 230 142)">
        {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => (
          <rect key={`${r}${c}`} x={182 + c * 34} y={86 + r * 30} width="28" height="22" rx="3" fill={r === 1 && c === 2 ? p.accent : p.deep} opacity={r === 1 && c === 2 ? 1 : 0.7} />
        )))}
      </g>
      <rect x="96" y="128" width="130" height="90" rx="10" fill={p.fg} />
      <path d="m96 138 65 44 65-44" stroke={p.bg} strokeWidth="5" fill="none" strokeLinejoin="round" />
    </g>
  ),
  // Rising bars with a trend line: reports and dashboards.
  'oam-advanced': (p) => (
    <g>
      {[54, 84, 70, 112, 140].map((h, i) => (
        <rect key={i} x={110 + i * 40} y={232 - h} width="26" height={h} rx="6" fill={i === 4 ? p.accent : p.fg} opacity={i === 4 ? 1 : 0.22 + i * 0.12} />
      ))}
      <path d="M118 150 162 120l38 18 42-46 50-26" stroke={p.accent} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="292" cy="66" r="9" fill={p.accent} />
      <rect x="100" y="236" width="210" height="4" rx="2" fill={p.fg} opacity=".5" />
    </g>
  ),
  // A report window (donut + bars) sitting on a database: Power BI with SQL.
  'oam-pro': (p) => (
    <g>
      <path d="M128 214v18c0 8 32 14 72 14s72-6 72-14v-18" fill={p.soft} opacity=".55" />
      <ellipse cx="200" cy="214" rx="72" ry="13" fill={p.soft} />
      <rect x="112" y="62" width="176" height="128" rx="14" fill={p.fg} />
      <rect x="112" y="62" width="176" height="22" rx="11" fill={p.soft} opacity=".55" />
      <circle cx="126" cy="73" r="4" fill={p.accent} /><circle cx="140" cy="73" r="4" fill={p.bg} opacity=".4" />
      <circle cx="160" cy="136" r="30" stroke={p.bg} strokeOpacity=".22" strokeWidth="12" fill="none" />
      <circle cx="160" cy="136" r="30" stroke={p.accent} strokeWidth="12" fill="none" strokeDasharray="120 200" strokeLinecap="round" transform="rotate(-90 160 136)" />
      {[26, 44, 34, 58].map((h, i) => <rect key={i} x={210 + i * 18} y={170 - h} width="11" height={h} rx="3" fill={i === 3 ? p.accent : p.bg} opacity={i === 3 ? 1 : 0.35} />)}
    </g>
  ),
  // A friendly keyboard and mouse for first-timers.
  cca: (p) => (
    <g>
      <rect x="84" y="118" width="190" height="96" rx="16" fill="#fff" />
      {[0, 1, 2].map((r) => Array.from({ length: 6 - (r === 2 ? 2 : 0) }, (_, c) => (
        <rect key={`${r}${c}`} x={98 + c * 28 + (r === 2 ? 28 : 0)} y={132 + r * 24} width="22" height="18" rx="5"
          fill={(r === 0 && c === 1) || (r === 1 && c === 4) ? p.accent : r === 2 && c === 1 ? p.soft : p.fg} opacity={(r === 0 && c === 1) || (r === 1 && c === 4) || (r === 2 && c === 1) ? 1 : 0.18} />
      )))}
      <rect x="292" y="132" width="40" height="64" rx="20" fill="#fff" />
      <path d="M312 134v22" stroke={p.fg} strokeWidth="3" opacity=".35" />
      <path d="M312 118c0-16 12-22 22-22" stroke={p.fg} strokeWidth="3" fill="none" opacity=".35" strokeLinecap="round" />
      <circle cx="120" cy="82" r="10" fill={p.accent} /><circle cx="148" cy="72" r="6" fill={p.soft} />
    </g>
  ),
  // Curly braces and a block cursor.
  c: (p) => (
    <g>
      <path d="M150 72c-24 0-24 12-24 30v18c0 14-8 22-22 22 14 0 22 8 22 22v18c0 18 0 30 24 30" stroke={p.fg} strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M250 72c24 0 24 12 24 30v18c0 14 8 22 22 22-14 0-22 8-22 22v18c0 18 0 30-24 30" stroke={p.fg} strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="182" y="124" width="36" height="44" rx="4" fill={p.accent} />
    </g>
  ),
  // Linked class boxes with two plus signs: objects.
  cpp: (p) => (
    <g>
      <rect x="92" y="78" width="96" height="70" rx="12" fill={p.fg} />
      <rect x="92" y="78" width="96" height="22" rx="12" fill={p.accent} />
      <rect x="104" y="112" width="60" height="8" rx="4" fill={p.bg} opacity=".5" /><rect x="104" y="128" width="44" height="8" rx="4" fill={p.bg} opacity=".3" />
      <rect x="92" y="186" width="96" height="44" rx="12" fill={p.fg} opacity=".25" />
      <path d="M140 148v38" stroke={p.fg} strokeWidth="4" opacity=".6" />
      <path d="M240 112h56M268 84v56M240 196h56M268 168v56" stroke={p.accent} strokeWidth="14" strokeLinecap="round" />
    </g>
  ),
  // Three stacked isometric blocks: objects that build an application.
  java: (p) => {
    const cube = (x: number, y: number, o: number, top = p.fg) => (
      <g opacity={o}>
        <path d={`M${x} ${y}l40 -22 40 22 -40 22Z`} fill={top} />
        <path d={`M${x} ${y}v44l40 22v-44Z`} fill={p.soft} />
        <path d={`M${x + 80} ${y}v44l-40 22v-44Z`} fill={p.deep} />
      </g>
    )
    return (
      <g>
        {cube(110, 168, 0.9)}
        {cube(210, 168, 0.9)}
        {cube(160, 110, 1, p.accent)}
        <path d="M188 60c-6-10 6-14 0-26M206 60c-6-10 6-14 0-26" stroke={p.accent} strokeWidth="4" fill="none" strokeLinecap="round" opacity=".7" />
      </g>
    )
  },
  // Database cylinders beside table rows.
  oracle: (p) => (
    <g>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <path d={`M110 ${96 + i * 44}v30c0 9 22 16 50 16s50-7 50-16v-30`} fill={i === 0 ? p.accent : p.fg} opacity={i === 0 ? 1 : 0.85 - i * 0.2} />
          <ellipse cx="160" cy={96 + i * 44} rx="50" ry="16" fill={i === 0 ? p.fg : p.soft} />
        </g>
      ))}
      {[0, 1, 2, 3, 4].map((r) => (
        <g key={r}>
          <rect x="234" y={92 + r * 28} width="30" height="16" rx="4" fill={r === 0 ? p.accent : p.fg} opacity={r === 0 ? 1 : 0.35} />
          <rect x="270" y={92 + r * 28} width="44" height="16" rx="4" fill={p.fg} opacity={r === 0 ? 0.9 : 0.2} />
        </g>
      ))}
    </g>
  ),
  // A coiling line through data points: scripts and data analysis.
  python: (p) => (
    <g>
      {Array.from({ length: 7 }, (_, r) => Array.from({ length: 10 }, (_, c) => (
        <circle key={`${r}${c}`} cx={92 + c * 24} cy={78 + r * 24} r="2.6" fill={p.fg} opacity=".18" />
      )))}
      <path d="M96 210c40 0 40-60 80-60s40 60 80 60 30-90 54-100" stroke={p.accent} strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M96 210c40 0 40-60 80-60s40 60 80 60 30-90 54-100" stroke={p.deep} strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="2 14" />
      <circle cx="310" cy="110" r="14" fill={p.accent} />
      <circle cx="314" cy="106" r="3" fill={p.deep} />
      {[[176, 150], [256, 210]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="8" fill={p.fg} />)}
    </g>
  ),
  // A query window above a result table, one row picked out.
  sql: (p) => (
    <g>
      <rect x="96" y="60" width="208" height="64" rx="12" fill={p.deep} stroke={p.soft} strokeWidth="2" />
      <path d="m112 82 10 8-10 8" stroke={p.accent} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="132" y="84" width="60" height="9" rx="4.5" fill={p.accent} /><rect x="198" y="84" width="38" height="9" rx="4.5" fill={p.fg} opacity=".55" />
      <rect x="132" y="102" width="88" height="9" rx="4.5" fill={p.fg} opacity=".3" />
      <rect x="96" y="140" width="208" height="104" rx="12" fill={p.fg} opacity=".1" />
      {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => (
        <rect key={`${r}${c}`} x={108 + c * 66} y={150 + r * 23} width={c === 0 ? 40 : 56} height="14" rx="4"
          fill={r === 2 ? p.accent : p.fg} opacity={r === 0 ? 0.75 : r === 2 ? 1 : 0.25} />
      )))}
    </g>
  ),
  // A spreadsheet with column letters, a formula bar and one selected cell.
  'advanced-excel': (p) => (
    <g>
      <rect x="92" y="58" width="216" height="186" rx="14" fill="#fff" stroke={p.soft} strokeWidth="2" />
      <rect x="104" y="70" width="28" height="18" rx="4" fill={p.accent} />
      <text x="118" y="84" textAnchor="middle" fontSize="12" fontWeight="700" fontStyle="italic" fill="#fff" fontFamily="Georgia, serif">fx</text>
      <rect x="140" y="70" width="156" height="18" rx="4" fill={p.deep} opacity=".6" />
      {[0, 1, 2, 3].map((c) => <rect key={c} x={128 + c * 44} y="98" width="38" height="12" rx="3" fill={p.soft} opacity=".6" />)}
      {[0, 1, 2, 3, 4, 5].map((r) => (
        <g key={r}>
          <rect x="104" y={116 + r * 20} width="18" height="14" rx="3" fill={p.soft} opacity=".6" />
          {[0, 1, 2, 3].map((c) => (
            <rect key={c} x={128 + c * 44} y={116 + r * 20} width="38" height="14" rx="3"
              fill={r === 2 && c === 2 ? p.accent : p.fg} opacity={r === 2 && c === 2 ? 1 : r === 5 ? 0.3 : 0.1} />
          ))}
        </g>
      ))}
      <rect x="211" y="153" width="44" height="20" rx="4" fill="none" stroke={p.accent} strokeWidth="3" />
    </g>
  ),
  // A bill with a rupee mark and a GST percent tag.
  tally: (p) => (
    <g>
      <path d="M130 56h120v178l-12-8-12 8-12-8-12 8-12-8-12 8-12-8-12 8-12-8-12 8Z" fill={p.fg} />
      <circle cx="190" cy="94" r="20" fill={p.accent} />
      <path d="M181 86h18M181 93h18M186 86c10 0 10 14 0 14h-4l14 12" stroke={p.bg} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {[0, 1, 2, 3].map((r) => (
        <g key={r}>
          <rect x="146" y={130 + r * 20} width="52" height="8" rx="4" fill={p.bg} opacity=".3" />
          <rect x="206" y={130 + r * 20} width="28" height="8" rx="4" fill={p.bg} opacity={r === 3 ? 0.85 : 0.45} />
        </g>
      ))}
      <rect x="244" y="150" width="70" height="44" rx="22" fill={p.accent} transform="rotate(-12 279 172)" />
      <text x="279" y="180" textAnchor="middle" fontSize="20" fontWeight="800" fill={p.deep} fontFamily="system-ui, sans-serif" transform="rotate(-12 279 172)">GST</text>
    </g>
  ),
  // Four report tiles: a number, a donut, bars and a trend.
  'power-bi': (p) => (
    <g>
      <rect x="96" y="62" width="100" height="84" rx="14" fill={p.fg} opacity=".14" />
      <rect x="110" y="80" width="40" height="10" rx="5" fill={p.fg} opacity=".5" />
      <rect x="110" y="100" width="64" height="26" rx="6" fill={p.accent} />
      <rect x="204" y="62" width="100" height="84" rx="14" fill={p.fg} opacity=".14" />
      <circle cx="254" cy="104" r="24" stroke={p.soft} strokeWidth="11" fill="none" />
      <circle cx="254" cy="104" r="24" stroke={p.accent} strokeWidth="11" fill="none" strokeDasharray="100 160" transform="rotate(-90 254 104)" />
      <rect x="96" y="154" width="100" height="84" rx="14" fill={p.fg} opacity=".14" />
      {[30, 46, 38, 58].map((h, i) => <rect key={i} x={112 + i * 20} y={226 - h} width="12" height={h} rx="3" fill={i === 3 ? p.accent : p.fg} opacity={i === 3 ? 1 : 0.45} />)}
      <rect x="204" y="154" width="100" height="84" rx="14" fill={p.fg} opacity=".14" />
      <path d="m216 220 20-18 18 10 34-36" stroke={p.accent} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="288" cy="176" r="6" fill={p.accent} />
    </g>
  ),
}

export const courseAccent = (slug: string) => (PAL[slug] ?? FALLBACK).accent
export const courseBg = (slug: string) => (PAL[slug] ?? FALLBACK).bg

export function CourseArt({ slug, className }: { slug: string; className?: string }) {
  const id = useId().replace(/:/g, '')
  const p = PAL[slug] ?? FALLBACK
  const motif = MOTIF[slug] ?? MOTIF.pgdca
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden className={cn('block', className)}>
      <defs>
        <radialGradient id={`g${id}`} cx="72%" cy="22%" r="85%">
          <stop offset="0" stopColor={p.bg} />
          <stop offset="1" stopColor={p.deep} />
        </radialGradient>
        <radialGradient id={`h${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={p.accent} stopOpacity=".28" />
          <stop offset="1" stopColor={p.accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#g${id})`} />
      <circle cx="300" cy="70" r="150" fill={`url(#h${id})`} />
      <circle cx="200" cy="150" r="128" fill="none" stroke={p.fg} strokeOpacity=".08" strokeWidth="1.5" />
      <circle cx="200" cy="150" r="96" fill="none" stroke={p.fg} strokeOpacity=".06" strokeWidth="1.5" />
      {motif(p)}
    </svg>
  )
}
