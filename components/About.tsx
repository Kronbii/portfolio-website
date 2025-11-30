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
      className="py-20 px-4 sm:px-6 lg:px-12 bg-dark-surface/70"
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
            className="text-base md:text-lg text-dark-text2 leading-relaxed"
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
              className="rounded-2xl border border-white/10 bg-dark-surface2/80 p-6 text-center backdrop-blur hover:border-primary-500/50 transition-all duration-300"
            >
              <p className="text-2xl font-semibold text-gradient">{card.value}</p>
              <p className="mt-2 text-sm text-dark-text2">{card.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
