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
    title: '[Placeholder: What Makes You Stand Out 1]',
    description: '[Placeholder: Describe a unique quality, skill, or approach that sets you apart from others in the field. Be specific and compelling.]',
  },
  {
    icon: <FiTarget size={32} />,
    title: '[Placeholder: What Makes You Stand Out 2]',
    description: '[Placeholder: Describe another unique quality, skill, or approach that sets you apart from others in the field. Be specific and compelling.]',
  },
  {
    icon: <FiTrendingUp size={32} />,
    title: '[Placeholder: What Makes You Stand Out 3]',
    description: '[Placeholder: Describe another unique quality, skill, or approach that sets you apart from others in the field. Be specific and compelling.]',
  },
  {
    icon: <FiHeart size={32} />,
    title: '[Placeholder: What Makes You Stand Out 4]',
    description: '[Placeholder: Describe another unique quality, skill, or approach that sets you apart from others in the field. Be specific and compelling.]',
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
          [Placeholder: A brief introduction to this section. Why should someone choose you over others?]
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

