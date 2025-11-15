'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FiCode, FiCpu, FiEye, FiUsers, FiCheck } from 'react-icons/fi'

interface Service {
  icon: React.ReactNode
  title: string
  punchline: string
  timeline: string
  highlights: string[]
}

const services: Service[] = [
  {
    icon: <FiCpu size={28} />,
    title: 'AI Sprint Lead',
    punchline: 'Scope, prototype, and validate AI ideas without a full in-house team.',
    timeline: '4-8 weeks',
    highlights: ['Roadmap + KPIs', 'Hands-on build', 'Weekly reviews'],
  },
  {
    icon: <FiEye size={28} />,
    title: 'Computer Vision Systems',
    punchline: 'Perception stacks tuned for robotics, inspection, and edge deployments.',
    timeline: '3-6 weeks',
    highlights: ['Dataset plan', 'Model + optimization', 'Deployment ready'],
  },
  {
    icon: <FiCode size={28} />,
    title: 'ML Advisory',
    punchline: 'Audits, hiring support, and tighter ML processes for growing teams.',
    timeline: '2-4 weeks',
    highlights: ['Architecture audit', 'Team enablement', 'Hiring support'],
  },
  {
    icon: <FiUsers size={28} />,
    title: 'Robotics & Autonomy',
    punchline: 'Sensor fusion, control, and system design with PM rigor.',
    timeline: '4-10 weeks',
    highlights: ['Firmware + CV', 'Sim + field tests', 'Documentation'],
  },
]

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      id="services"
      ref={ref}
      className="py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-sm uppercase tracking-[0.4em] text-dark-text2"
          >
            Signature engagements
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-semibold tracking-tight"
          >
            Services with <span className="text-gradient">clear outcomes</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg text-dark-text2"
          >
            Choose the level of partnership you need — from hands-on delivery to executive advisory. Every engagement ships with documentation, reporting, and a measurable ROI target.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-primary-400">
                  {service.icon}
                  <span className="text-xs uppercase tracking-wide text-dark-text2">{service.timeline}</span>
                </div>
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-dark-text">
                {service.title}
              </h3>
              <p className="mt-2 text-dark-text2 text-sm leading-relaxed">
                {service.punchline}
              </p>
              <div className="mt-4 space-y-2">
                {service.highlights.map((item) => (
                  <div key={item} className="flex items-center space-x-2 text-sm text-dark-text">
                    <span className="text-primary-400">
                      <FiCheck />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
