'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FiCode, FiCpu, FiEye, FiUsers, FiCheck } from 'react-icons/fi'

interface Service {
  icon: React.ReactNode
  title: string
  description: string
  timeline: string
  result: string
  deliverables: string[]
}

const services: Service[] = [
  {
    icon: <FiCpu size={32} />,
    title: 'AI Development',
    description:
      'Fractional AI lead who can scope, architect, and ship intelligent products that align with OKRs and budgets.',
    timeline: '4-10 weeks',
    result: 'Strategy + sprint plan + launch-ready AI stack',
    deliverables: [
      'Discovery workshop & success metrics',
      'Architecture, roadmap, and sprint ownership',
      'Model experimentation, QA, and documentation',
    ],
  },
  {
    icon: <FiEye size={32} />,
    title: 'Computer Vision Solutions',
    description:
      'Designing perception systems for industrial, defense, and autonomous products with a focus on latency and reliability.',
    timeline: '3-8 weeks',
    result: 'Realtime CV stack optimized for Jetson/TensorRT',
    deliverables: [
      'Dataset strategy + labeling workflow',
      'Model training, validation, and stress testing',
      'On-device optimization + monitoring hooks',
    ],
  },
  {
    icon: <FiCode size={32} />,
    title: 'Machine Learning Consulting',
    description:
      'Hands-on advisor for founders and teams who need technical diligence, hiring support, or ML workflow upgrades.',
    timeline: '2-4 weeks',
    result: 'Actionable audit + talent enablement plan',
    deliverables: [
      'Stack + process audit with risk map',
      'Team enablement, pairing, and playbooks',
      'Hiring support + interview frameworks',
    ],
  },
  {
    icon: <FiUsers size={32} />,
    title: 'Robotics Solutions',
    description:
      'Full-stack robotics partner blending control, sensor fusion, and autonomy with PM rigor.',
    timeline: '4-12 weeks',
    result: 'Integrated autonomy stack + field-ready testing',
    deliverables: [
      'Hardware abstraction + firmware pairing',
      'Sensor fusion + safety failsafes',
      'Simulation, tuning, and deployment support',
    ],
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
        <div className="text-center max-w-3xl mx-auto mb-16">
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
            Services built for <span className="text-gradient">leaders who need outcomes</span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-lg"
              whileHover={{ y: -6, scale: 1.01 }}
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none group-hover:opacity-100" />
              <div className="flex items-start justify-between">
                <div className="text-primary-400 bg-primary-500/10 border border-primary-500/20 rounded-2xl p-3">
                  {service.icon}
                </div>
                <span className="rounded-full border border-white/15 bg-dark-surface/60 px-4 py-1 text-xs uppercase tracking-wide text-dark-text2">
                  {service.timeline}
                </span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-dark-text">
                {service.title}
              </h3>
              <p className="mt-3 text-dark-text2 leading-relaxed">
                {service.description}
              </p>
              <div className="mt-6 space-y-3">
                {service.deliverables.map((item) => (
                  <div key={item} className="flex items-start space-x-3 text-sm text-dark-text2">
                    <span className="mt-0.5 text-primary-400">
                      <FiCheck />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-center justify-between text-sm text-dark-text2">
                <span>Outcome</span>
                <span className="text-dark-text font-semibold">{service.result}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
