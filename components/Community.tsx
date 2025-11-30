'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FiMic, FiUsers, FiBookOpen } from 'react-icons/fi'

interface CommunityItem {
  title: string
  organization: string
  year: string
  description: string
  highlights: string[]
  tags: string[]
  icon: React.ReactNode
}

const communityItems: CommunityItem[] = [
  {
    title: 'NASA Space Apps Lebanon',
    organization: 'Organizer & Speaker',
    year: '2022–2024',
    description:
      'Organized and delivered multiple technical talks and workshops for hundreds of participants across Lebanon.',
    highlights: [
      'Led technical sessions on AI & computer vision applications',
      'Supported teams during 48-hour hackathon',
      'Mentored participants and evaluated projects',
    ],
    tags: ['Organizer', 'Speaker', 'AI'],
    icon: <FiMic className="w-5 h-5" />,
  },
  {
    title: 'Cosmic Dome Foundation',
    organization: 'Speaker (LAU & National Events)',
    year: '2021–2023',
    description:
      'Delivered physics and space-related educational sessions across multiple universities and national events.',
    highlights: [
      'Lectured at Lebanese American University',
      'Participated in national outreach programs',
      'Shared knowledge with students of all ages',
    ],
    tags: ['Speaker', 'Education', 'Physics'],
    icon: <FiBookOpen className="w-5 h-5" />,
  },
  {
    title: 'National Physics Day',
    organization: 'Organizer & Lecturer',
    year: '2022',
    description:
      'Organized a national educational event encouraging interest in physics and delivered a technical lecture to a large audience.',
    highlights: [
      'Main session lecturer for national event',
      'Helped organize speakers and schedules',
      'Engaged students from all over Lebanon',
    ],
    tags: ['Organizer', 'Lecturer', 'Physics'],
    icon: <FiUsers className="w-5 h-5" />,
  },
]

function CommunityCard({ item, index }: { item: CommunityItem; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="glass-card p-6 h-full transition-all duration-300 hover:shadow-glow hover:border-gemini-500/30">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gemini-gradient flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
            {item.icon}
          </div>
          <span className="text-xs font-medium text-gemini-500 bg-gemini-500/10 px-3 py-1 rounded-full">
            {item.year}
          </span>
        </div>

        {/* Title & Org */}
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
          {item.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{item.organization}</p>

        {/* Description */}
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
          {item.description}
        </p>

        {/* Highlights */}
        <ul className="space-y-2 mb-4">
          {item.highlights.map((highlight, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-gemini-500 mt-2 flex-shrink-0" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 text-xs font-medium rounded-full glass text-slate-500 dark:text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Community() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section
      id="community"
      ref={ref}
      className="py-24 sm:py-32 relative"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface/30 via-transparent to-surface/30 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-gemini-500 font-medium mb-4">
            Community
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Talks & <span className="text-gradient">Contributions</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Talks, workshops, and community contributions across Lebanon & beyond.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {communityItems.map((item, index) => (
            <CommunityCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

