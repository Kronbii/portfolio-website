'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Briefcase, GraduationCap, Award, Users } from 'lucide-react'

const quickStats = [
  { value: 'Engineer', label: 'Bachelor of Mechatronics Engineering' },
  { value: 'Founder', label: 'EVOID Tech Solutions' },
  { value: 'Leader', label: 'Nasa Space Apps, Astronomyclub' },

]

const milestones = [
  {
    period: 'Now',
    title: 'Founder & Tech Lead · EVOID',
    description: 'Building bespoke AI/CV and robotics products for startups + industry teams.',
  },
  {
    period: '2025',
    title: 'Full Time Applied AI and CV Enginner',
    description: 'Improving runway safety at Oreyeon LDA.',
  },
  {
    period: '2023',
    title: 'WRO Future Engineers Champion',
    description: 'Led an autonomous race-car build from concept to podium in 20 days.',
  },
  {
    period: '2022',
    title: 'Nasa Space Apps Tech Lead and Volunteer',
    description: 'Took part in leading the largest global hackathon in Lebanon.',
  },
]

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
      className="py-20 px-4 sm:px-6 lg:px-12 bg-dark-surface/70"
    >
      <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-[1fr_0.9fr] items-start">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {quickStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-dark-surface2/80 p-5 text-center">
                <p className="text-2xl font-semibold text-gradient">{stat.value}</p>
                <p className="mt-1 text-sm text-dark-text2">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-3xl border border-white/10 bg-dark-surface2/80 p-6 backdrop-blur">

          <div className="mt-6 border-t border-none pt-none space-y-8">
            {milestones.map((item, index) => (
              <div key={item.title} className="relative pl-6">
                <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500" />
                {index < milestones.length - 1 && (
                  <span className="absolute left-1.5 top-4 bottom-[-1rem] w-px bg-white/10" />
                )}
                <p className="text-xs uppercase tracking-wide text-dark-text2">{item.period}</p>
                <h3 className="text-lg font-semibold text-dark-text">{item.title}</h3>
                <p className="text-sm text-dark-text2 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
