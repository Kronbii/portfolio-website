'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FiZap, FiTarget, FiTrendingUp, FiHeart } from 'react-icons/fi'

interface StandoutFeature {
  icon: React.ReactNode
  title: string
  description: string
}

const standoutFeatures: StandoutFeature[] = [
  {
    icon: <FiZap size={32} />,
    title: 'Realtime-grade engineering',
    description:
      'Hardware, firmware, ML, and perception stitched together so robots can react within milliseconds — not minutes.',
  },
  {
    icon: <FiTarget size={32} />,
    title: 'One partner, many hats',
    description:
      'Engineer, strategist, and PM. I translate executive language into technical sprint plans and keep every stakeholder looped in.',
  },
  {
    icon: <FiTrendingUp size={32} />,
    title: 'Adaptive problem solving',
    description:
      'I lean into experimentation while safeguarding scope. When constraints shift, the roadmap adapts — without losing sight of ROI.',
  },
  {
    icon: <FiHeart size={32} />,
    title: 'Impact over deliverables',
    description:
      'Every sprint points to business value: faster pilots, safer robots, better insights. Vanity metrics aren’t part of the vocabulary.',
  },
]

export default function Standout() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      id="standout"
      ref={ref}
      className="py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-semibold mb-4 text-center"
        >
          Why clients keep me on speed dial
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-dark-text2 mb-12 text-lg max-w-2xl mx-auto"
        >
          Every partnership combines experimentation, sharp storytelling, and ruthless execution. Here’s what that feels like.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {standoutFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-dark-surface2/80 p-8"
              whileHover={{ y: -6 }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary-500/10 to-secondary-500/10" />
              <div className="relative">
                <div className="text-primary-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-dark-text">
                  {feature.title}
                </h3>
                <p className="text-dark-text2 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-semibold uppercase tracking-widest text-dark-text hover:border-primary-500/60"
          >
            Build something bold with me
          </a>
        </motion.div>
      </div>
    </section>
  )
}
