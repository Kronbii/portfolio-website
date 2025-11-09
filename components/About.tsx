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
            I &apos;m a Mechatronics Engineer who found my true passion in Artificial Intelligence and Computer Vision through hands-on experience and self-driven learning. Over the years, I&apos;ve built a strong foundation in applying AI and ML to real-world challenges—especially in robotics and embedded systems—where technology meets practical problem-solving.
          </p>
          <p className="text-lg text-dark-text2 leading-relaxed mb-6">
            Beyond engineering, I &apos;ve developed a deep interest in project management and leadership. I hold a Google Project Management certification and apply those principles in every aspect of my work—from leading technical teams and managing freelance projects to running my own startup, <strong>EVOID</strong>. My leadership journey began early, heading university clubs like the Astronomy, Engineering, and AI Clubs, and continues today through my role in the Scouts, where I sharpen my ability to guide and empower others
          </p>
          <p className="text-lg text-dark-text2 leading-relaxed">
            My long-term vision is to build a global tech company that uses AI to tackle meaningful problems and improve lives. Outside of work, I &apos;m passionate about hiking, paragliding, photography, museums, and gaming—experiences that constantly inspire creativity and balance in my journey as both an engineer and a leader.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

