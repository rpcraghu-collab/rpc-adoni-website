import { useId } from 'react'
import { cn } from '../../lib/cn'

/** A gold seal: "5×" in the middle, a slowly turning ring of text around it. Decorative; the awards are listed in text below. */
export default function AwardSeal({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <div aria-hidden className={cn('pointer-events-none z-20 grid place-items-center rounded-full bg-[#0b1e4a] text-white shadow-[0_20px_40px_-14px_rgb(11_30_74/0.7)] ring-[6px] ring-bg', className)}>
      <svg viewBox="0 0 120 120" className="absolute inset-0 size-full animate-[spin_28s_linear_infinite] motion-reduce:animate-none">
        <defs>
          <path id={`seal-${id}`} d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
        </defs>
        <text className="fill-[#e6b95c] font-sans text-[10.4px] font-bold uppercase" letterSpacing="2.6">
          <textPath href={`#seal-${id}`}>Education Excellence Award · Five times ·</textPath>
        </text>
      </svg>
      <span className="relative text-center font-display leading-none">
        <span className="block text-[2.1em] font-extrabold tracking-[-0.04em] text-white">5×</span>
      </span>
    </div>
  )
}
