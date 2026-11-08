import type { ReactNode } from 'react'
import { motion } from 'motion/react'

export default function PageHero({ eyebrow, title, text, children }: { eyebrow: string; title: ReactNode; text?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="grain absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
      <div className="container-x relative pb-12 pt-10 lg:pb-16 lg:pt-16">
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="eyebrow"><span className="h-px w-6 bg-current" aria-hidden />{eyebrow}</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }} className="mt-4 max-w-4xl text-[clamp(2.4rem,6.5vw,4.6rem)] font-extrabold leading-[0.98]">
          {title}
        </motion.h1>
        {text && <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 max-w-2xl text-[1.1rem] leading-relaxed text-ink-soft">{text}</motion.p>}
        {children}
      </div>
    </section>
  )
}
