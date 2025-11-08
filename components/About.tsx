'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section
      id="about"
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-surface"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-8 text-center"
        >
          About <span className="text-primary-500">Me</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert max-w-none"
        >
          <p className="text-lg text-dark-text2 leading-relaxed mb-6">
            [Placeholder: Write a compelling introduction about yourself here. 
            Talk about your passion for AI and Computer Vision, your journey, 
            and what drives you. Mention your interest in project management 
            and how it complements your technical skills.]
          </p>
          <p className="text-lg text-dark-text2 leading-relaxed mb-6">
            [Placeholder: Continue with more details about your background, 
            education, or what makes you unique. Share your vision and goals 
            for the future.]
          </p>
          <p className="text-lg text-dark-text2 leading-relaxed">
            [Placeholder: Add a personal touch - what you enjoy outside of work, 
            your values, or what you're looking for in your next opportunity.]
          </p>
        </motion.div>
      </div>
    </section>
  )
}

