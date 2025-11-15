'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Briefcase, GraduationCap, Award, Users } from 'lucide-react'

const quickStats = [
  { value: '6+', label: 'Years shipping AI/CV products' },
  { value: '12', label: 'Awards & podiums' },
  { value: 'Founder', label: 'EVOID Studio' },
]

const focusAreas = ['Autonomous mobility', 'Industrial inspection', 'Immersive education', 'Robotics research']

const milestones = [
  {
    period: 'Now',
    title: 'Founder & AI Lead · EVOID',
    description: 'Building bespoke AI/CV and robotics products for startups + industry teams.',
  },
  {
    period: '2023',
    title: 'WRO Future Engineers Champion',
    description: 'Led an autonomous race-car build from concept to podium in 20 days.',
  },
  {
    period: '2022',
    title: 'Google Project Management Certified',
    description: 'Blending PMI-style delivery with hands-on engineering.',
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
            Mechatronics engineer turned AI & Computer Vision specialist. I bridge strategy, hardware, and ML so founders don&apos;t have to juggle five vendors. My work spans robotics, education, and defense — always with a bias toward shippable prototypes and clean handoffs.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base md:text-lg text-dark-text2 leading-relaxed"
          >
            I founded <strong>EVOID</strong> to partner with teams who need momentum fast. Expect clear scopes, weekly reporting, and a single point of accountability from kickoff to deployment.
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
          className="rounded-3xl border border-white/10 bg-dark-surface2/80 p-6 backdrop-blur"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-dark-text2">Focus verticals</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {focusAreas.map((area) => (
              <span
                key={area}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-dark-text"
              >
                {area}
              </span>
            ))}
          </div>

          <div className="mt-6 border-t border-white/10 pt-6 space-y-4">
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

          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            {infoCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-start space-x-3"
              >
                <div className="text-primary-400">{card.icon}</div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-dark-text2">{card.title}</p>
                  <p className="text-sm text-dark-text leading-relaxed">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
