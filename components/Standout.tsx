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
    title: 'Real-Time Innovation',
    description:
      'I build AI and robotics systems that don’t just work — they react. My focus is on creating intelligent, real-time solutions that blend machine learning, perception, and control into one seamless experience.',
  },
  {
    icon: <FiTarget size={32} />,
    title: 'Creator with a Project Manager’s Mindset',
    description:
      'I approach every idea like a creator and every execution like a project manager — balancing vision with structure. I design systems with creativity, plan them with precision, and deliver them with purpose.',
  },
  {
    icon: <FiTrendingUp size={32} />,
    title: 'Relentless Learner and Adapter',
    description:
      'I learn fast, adapt faster, and thrive under change. Whether it’s new tech, tools, or environments, I shift gears instantly — turning challenges into opportunities for growth and reinvention.',
  },
  {
    icon: <FiHeart size={32} />,
    title: 'Driven by Impact, Not Routine',
    description:
      'I’m motivated by creating things that matter — tools, systems, and ideas that push boundaries. My goal isn’t just to build products; it’s to leave a mark, break barriers, and inspire innovation wherever I go.',
  },
]

export default function Standout() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      id="standout"
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-center"
        >
          What Makes Me <span className="text-primary-500">Stand Out</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-dark-text2 mb-12 text-lg max-w-2xl mx-auto"
        >
          I blend deep technical skill with a project manager’s mindset to turn complex ideas into real, impactful systems. I move fast, adapt faster, and focus on creating results that truly matter.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {standoutFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-dark-surface2 rounded-lg p-8 border border-dark-surface2 hover:border-primary-500/50 transition-all duration-300 group"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="text-primary-500 mb-4 group-hover:text-primary-400 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-dark-text">
                {feature.title}
              </h3>
              <p className="text-dark-text2 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

