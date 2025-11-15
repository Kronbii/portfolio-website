'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Briefcase, GraduationCap, Award, Users } from 'lucide-react'

const quickStats = [
  {
    value: '6+',
    label: 'Years crafting intelligent hardware & AI products',
    detail: 'Research, competitions, and commercial delivery since 2018.',
  },
  {
    value: '12',
    label: 'Awards & podium finishes',
    detail: 'Including World Robot Olympiad Future Engineers Champion.',
  },
  {
    value: '4',
    label: 'Communities led',
    detail: 'Astronomy, Engineering, AI clubs, and Scouts leadership.',
  },
  {
    value: '1',
    label: 'Founder, EVOID',
    detail: 'Applied AI studio delivering bespoke vision + robotics work.',
  },
]

const focusAreas = ['Autonomous mobility', 'Industrial inspection', 'Immersive education', 'Robotics research']

const milestones = [
  {
    period: 'Present',
    title: 'Founder & AI Lead, EVOID',
    description:
      'Partnering with startups and enterprises to ship perception systems, robotics platforms, and ML playbooks as a fractional product lead.',
  },
  {
    period: '2023',
    title: 'WRO Future Engineers Champion',
    description:
      'Built an autonomous race car in 20 days, leading hardware, software, and CV workstreams while coordinating a multidisciplinary team.',
  },
  {
    period: '2022',
    title: 'Google Project Management Certified',
    description:
      'Integrated PMI-aligned delivery rigor into every engagement — from requirement mapping to risk mitigation and reporting.',
  },
  {
    period: '2019 - 2021',
    title: 'Community Builder',
    description:
      'Led university clubs, mentored peers, and scaled local tech initiatives focused on astronomy, engineering, AI, and scouting.',
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
      className="py-24 px-4 sm:px-6 lg:px-12 bg-dark-surface/70"
    >
      <div className="max-w-6xl mx-auto grid gap-16 lg:grid-cols-[1.1fr_0.9fr] items-start">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-semibold mb-6"
          >
            About <span className="text-gradient">Rami Kronbi</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-dark-text2 leading-relaxed"
          >
            Mechatronics engineer turned AI & Computer Vision specialist. I bridge hardware, software, and delivery rigor to turn abstract ideas into measurable products. Whether it's leading embedded autonomy, crafting perception stacks, or coaching teams, my lens is always product-first and outcome-driven.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg text-dark-text2 leading-relaxed"
          >
            I&apos;ve founded <strong>EVOID</strong>, guided student clubs, and led multi-disciplinary teams across robotics, aerospace, and edtech. Certifications like Google Project Management inform how I structure engagements: clear scopes, weekly reporting, and accountability at every step.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {quickStats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-dark-surface2/80 p-6">
                <p className="text-3xl font-semibold text-gradient">{stat.value}</p>
                <p className="mt-2 font-semibold text-dark-text">{stat.label}</p>
                <p className="text-sm text-dark-text2 mt-1">{stat.detail}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-3xl border border-white/10 bg-dark-surface2/80 p-8 backdrop-blur"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-dark-text2">Focus verticals</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {focusAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-dark-text"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-8 space-y-6">
            {milestones.map((item, index) => (
              <div key={item.title} className="relative pl-8">
                <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500" />
                {index < milestones.length - 1 && (
                  <span className="absolute left-1.5 top-4 bottom-[-1.5rem] w-px bg-white/10" />
                )}
                <p className="text-xs uppercase tracking-wide text-dark-text2">{item.period}</p>
                <h3 className="text-xl font-semibold text-dark-text">{item.title}</h3>
                <p className="text-sm text-dark-text2 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {infoCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-start space-x-3"
              >
                <div className="text-primary-400">{card.icon}</div>
                <div>
                  <p className="text-sm uppercase tracking-wide text-dark-text2">{card.title}</p>
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
