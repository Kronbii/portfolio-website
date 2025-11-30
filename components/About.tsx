'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const infoCards = [
  { value: 'Engineer', label: 'Bachelor of Mechatronics Engineering' },
  { value: 'Founder', label: 'EVOID Tech Solutions' },
  { value: 'Leader', label: 'Nasa Space Apps, Astronomyclub' },
  { value: 'Certified', label: 'Google Project Management' },
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section
      id="about"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-12 bg-light-surface/70 dark:bg-dark-surface/70"
    >
      <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-[1fr_1fr] items-start">
        {/* Left side - Text content */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-semibold mb-4"
          >
            About <span className="text-gradient">Rami Kronbi</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base md:text-lg text-light-text2 dark:text-dark-text2 leading-relaxed"
          >
            Mechatronics engineer turned AI/CV builder. I stay hands-on across strategy, firmware, and ML so you work with one partner instead of five.
          </motion.p>

        </div>

        {/* Right side - 4 info cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {infoCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="rounded-2xl border border-light-border/50 dark:border-white/10 bg-light-surface dark:bg-dark-surface2/80 p-6 text-center backdrop-blur hover:border-primary-500/50 transition-all duration-300 shadow-sm dark:shadow-none"
            >
              <p className="text-2xl font-semibold text-gradient">{card.value}</p>
              <p className="mt-2 text-sm text-light-text2 dark:text-dark-text2">{card.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll to explore indicator */}
      <motion.a
        href="#experience"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 cursor-pointer group"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] ml-[0.25em] text-light-text2/70 dark:text-dark-text2/70 group-hover:text-primary-500 transition-colors">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            width="20"
            height="28"
            viewBox="0 0 20 28"
            fill="none"
            className="text-light-text2/50 dark:text-dark-text2/50 group-hover:text-primary-500 transition-colors"
          >
            <rect x="1" y="1" width="18" height="26" rx="9" stroke="currentColor" strokeWidth="1.5" />
            <motion.circle
              cx="10"
              cy="8"
              r="2.5"
              fill="currentColor"
              animate={{ cy: [8, 14, 8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="fill-primary-500"
            />
          </svg>
        </motion.div>
      </motion.a>
    </section>
  )
}
