'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const milestones = [
  {
    period: 'Now',
    title: 'Founder & Tech Lead · EVOID',
    description: 'Building bespoke AI/CV and robotics products for startups + industry teams.',
  },
  {
    period: '2025',
    title: 'Full Time Applied AI and CV Engineer',
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

export default function Experience() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section
      id="experience"
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-12"
    >
      <div className="max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-sm uppercase tracking-[0.4em] text-dark-text2"
        >
          Journey & Milestones
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-semibold mb-12 text-center"
        >
          Professional <span className="text-gradient">Experience</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
          
          <div className="space-y-12">
            {milestones.map((item, index) => {
              const isLeft = index % 2 === 0
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="relative grid grid-cols-2 gap-8 items-center"
                >
                  {isLeft ? (
                    <>
                      {/* Content on left */}
                      <div className="pr-8 text-right">
                        <p className="text-xs uppercase tracking-wide text-dark-text2 mb-1">{item.period}</p>
                        <h3 className="text-lg font-semibold text-dark-text mb-2">{item.title}</h3>
                        <p className="text-sm text-dark-text2 leading-relaxed">{item.description}</p>
                      </div>
                      {/* Dot in center */}
                      <div className="absolute left-1/2 top-2 -translate-x-1/2">
                        <span className="block h-4 w-4 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 ring-4 ring-dark-bg" />
                      </div>
                      {/* Empty space on right */}
                      <div />
                    </>
                  ) : (
                    <>
                      {/* Empty space on left */}
                      <div />
                      {/* Dot in center */}
                      <div className="absolute left-1/2 top-2 -translate-x-1/2">
                        <span className="block h-4 w-4 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 ring-4 ring-dark-bg" />
                      </div>
                      {/* Content on right */}
                      <div className="pl-8 text-left">
                        <p className="text-xs uppercase tracking-wide text-dark-text2 mb-1">{item.period}</p>
                        <h3 className="text-lg font-semibold text-dark-text mb-2">{item.title}</h3>
                        <p className="text-sm text-dark-text2 leading-relaxed">{item.description}</p>
                      </div>
                    </>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
