'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FiChevronDown, FiBriefcase, FiAward, FiUsers } from 'react-icons/fi'

interface ExperienceItem {
  id: string
  period: string
  role: string
  organization: string
  summary: string
  details: string[]
  icon: React.ReactNode
  type: 'work' | 'achievement' | 'leadership'
}

const experiences: ExperienceItem[] = [
  {
    id: '1',
    period: 'Present',
    role: 'Founder & Tech Lead',
    organization: 'EVOID Tech Solutions',
    summary: 'Building bespoke AI/CV and robotics products for startups + industry teams.',
    details: [
      'Architecting end-to-end AI solutions from ideation to deployment',
      'Leading technical strategy and client delivery for computer vision projects',
      'Managing cross-functional teams across firmware, ML, and product',
      'Establishing standardized workflows for ML experimentation and production',
    ],
    icon: <FiBriefcase className="w-5 h-5" />,
    type: 'work',
  },
  {
    id: '2',
    period: '2025',
    role: 'Full Time AI & CV Engineer',
    organization: 'Oreyeon LDA',
    summary: 'Improving runway safety through advanced computer vision systems.',
    details: [
      'Developing real-time object detection for runway debris identification',
      'Optimizing inference pipelines for edge deployment on embedded systems',
      'Collaborating with aviation safety teams on compliance requirements',
      'Implementing thermal imaging super-resolution for enhanced detection',
    ],
    icon: <FiBriefcase className="w-5 h-5" />,
    type: 'work',
  },
  {
    id: '3',
    period: '2023',
    role: 'WRO Future Engineers Champion',
    organization: 'World Robot Olympiad',
    summary: 'Led an autonomous race-car build from concept to podium in 20 days.',
    details: [
      'Designed and implemented Jetson-based computer vision system',
      'Developed Arduino PID control with IMU and sensor fusion',
      'Created dual-MCU architecture for modular expandability',
      'Achieved national championship against 50+ competing teams',
    ],
    icon: <FiAward className="w-5 h-5" />,
    type: 'achievement',
  },
  {
    id: '4',
    period: '2022',
    role: 'Tech Lead & Volunteer',
    organization: 'NASA Space Apps Lebanon',
    summary: 'Took part in leading the largest global hackathon in Lebanon.',
    details: [
      'Organized technical workshops and mentorship sessions',
      'Evaluated projects and provided feedback to participants',
      'Led sessions on AI and computer vision applications in space',
      'Supported hundreds of participants during 48-hour hackathon',
    ],
    icon: <FiUsers className="w-5 h-5" />,
    type: 'leadership',
  },
]

function TimelineItem({ item, isLast }: { item: ExperienceItem; isLast: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const typeColors = {
    work: 'from-gemini-500 to-gemini-600',
    achievement: 'from-amber-500 to-orange-500',
    leadership: 'from-purple-500 to-pink-500',
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="relative pl-8 md:pl-12"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] md:left-[19px] top-10 bottom-0 w-[2px] bg-gradient-to-b from-border to-transparent" />
      )}
      
      {/* Timeline dot */}
      <div className={`absolute left-0 md:left-2 top-1 w-6 h-6 rounded-full bg-gradient-to-br ${typeColors[item.type]} flex items-center justify-center text-white shadow-glow`}>
        {item.icon}
      </div>

      {/* Content card */}
      <motion.div
        className="glass-card p-6 cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <span className="text-xs uppercase tracking-widest text-gemini-500 font-medium">
              {item.period}
            </span>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-1">
              {item.role}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{item.organization}</p>
          </div>
          <motion.button
            className="p-2 rounded-full hover:bg-white/5 transition-colors"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiChevronDown className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </motion.button>
        </div>

        {/* Summary */}
        <p className="text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">{item.summary}</p>

        {/* Expandable details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <ul className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 space-y-2">
                {item.details.map((detail, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gemini-500 mt-2 flex-shrink-0" />
                    <span>{detail}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default function Experience() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section
      id="experience"
      ref={ref}
      className="py-24 sm:py-32 relative"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/30 dark:from-slate-900/30 via-transparent to-slate-50/30 dark:to-slate-900/30 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-gemini-500 font-medium mb-4">
            Experience
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
            Journey & <span className="text-gradient">Milestones</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-8">
          {experiences.map((item, index) => (
            <TimelineItem
              key={item.id}
              item={item}
              isLast={index === experiences.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

