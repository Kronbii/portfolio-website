'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Briefcase, GraduationCap, Award, Users } from 'lucide-react'

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const infoCards = [
    {
      icon: <Briefcase className="w-6 h-6 text-primary-400" />,
      title: 'Experience',
      description:
        'Mechatronics Engineer, AI Developer, and Founder at EVOID with hands-on leadership in technical and creative projects.',
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-primary-400" />,
      title: 'Education',
      description:
        'B.E. in Mechatronics Engineering, complemented by Google Project Management certification.',
    },
    {
      icon: <Award className="w-6 h-6 text-primary-400" />,
      title: 'Certified',
      description:
        'Google Project Management Certified, with specialized expertise in AI, ML, and Computer Vision.',
    },
    {
      icon: <Users className="w-6 h-6 text-primary-400" />,
      title: 'Community',
      description:
        'Leader of multiple university and community clubs — Astronomy, Engineering, AI, and Scouts.',
    },
  ]

  return (
    <section
      id="about"
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-12 bg-dark-surface text-dark-text"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12 items-start">
        {/* Left: About text */}
        <div className="lg:col-span-2">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-8"
          >
            About <span className="text-primary-500">Me</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 text-lg leading-relaxed text-dark-text2"
          >
            <p>
              I&apos;m a Mechatronics Engineer who found my true passion in Artificial
              Intelligence and Computer Vision through hands-on experience and
              self-driven learning. Over the years, I&apos;ve built a strong foundation in
              applying AI and ML to real-world challenges—especially in robotics and
              embedded systems—where technology meets practical problem-solving.
            </p>

            <p>
              Beyond engineering, I&apos;ve developed a deep interest in project
              management and leadership. I hold a Google Project Management
              certification and apply those principles in every aspect of my work—from
              leading technical teams and managing freelance projects to running my
              own startup, <strong>EVOID</strong>. My leadership journey began early,
              heading university clubs like the Astronomy, Engineering, and AI Clubs,
              and continues today through my role in the Scouts, where I sharpen my
              ability to guide and empower others.
            </p>

            <p>
              My long-term vision is to build a global tech company that uses AI to
              tackle meaningful problems and improve lives. Outside of work, I&apos;m
              passionate about hiking, paragliding, photography, museums, and gaming—
              experiences that constantly inspire creativity and balance in my journey
              as both an engineer and a leader.
            </p>
          </motion.div>
        </div>

        {/* Right: Info cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid sm:grid-cols-2 gap-6"
        >
          {infoCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-dark-elevated border border-dark-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                {card.icon}
                <h3 className="font-semibold text-xl">{card.title}</h3>
              </div>
              <p className="text-dark-text2 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
