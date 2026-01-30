'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { FiBook, FiBriefcase, FiUsers, FiAward, FiCode, FiCpu, FiPower } from 'react-icons/fi'
import { CornerButton } from '@/components/ui/corner-button'
import { getSectionWidthStyle, getSectionHeaderStyle, getSectionSubtitleStyle, getSectionStyle } from '@/lib/utils'

const infoCards = [
  { 
    value: 'Engineer', 
    label: 'Bachelor of Mechatronics Engineering',
    icon: FiBook,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  { 
    value: 'Founder', 
    label: 'EVOID Tech Solutions',
    icon: FiBriefcase,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
  { 
    value: 'Leader', 
    label: 'Driving impact in communities',
    icon: FiUsers,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
  },
  { 
    value: 'Certified', 
    label: 'Google Project Management',
    icon: FiAward,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
  },
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      id="about"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-l border-r border-b mx-auto"
      style={{ 
        ...getSectionStyle(),
        ...getSectionWidthStyle() 
      }}
    >

      <div className="w-full relative z-10 pb-24 md:pb-32">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-3 rounded-full border border-light-border/50 dark:border-white/10 bg-light-surface2/50 dark:bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] mb-6"
            style={{ color: 'var(--color-secondary)' }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-75 animate-ping"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary-400"></span>
            </span>
            <span>About Me</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={getSectionHeaderStyle().className}
            style={getSectionHeaderStyle().style}
          >
            ABOUT <span className="text-gradient">RAMI</span>
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={getSectionSubtitleStyle().className}
            style={getSectionSubtitleStyle().style}
          >
            About Me
          </motion.h3>
        </div>

        {/* Info Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {infoCards.map((card, index) => {
            const IconComponent = card.icon
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.5 + index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="group relative rounded-2xl border border-light-border/50 dark:border-white/10 bg-light-surface dark:bg-white/[0.03] p-6 backdrop-blur-xl hover:border-primary-500/30 transition-all duration-300 shadow-sm dark:shadow-none overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${card.bgColor}`} />
                
                {/* Icon */}
                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-xl border border-light-border/30 dark:border-white/10 bg-light-surface2/50 dark:bg-white/5 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent 
                    className={`${card.color} transition-colors duration-300`} 
                    size={24} 
                  />
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <motion.p 
                    className="text-2xl font-semibold text-gradient mb-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    {card.value}
                  </motion.p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-secondary)' }}>
                    {card.label}
                  </p>
                </div>

                {/* Decorative corner element */}
                <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full ${card.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-16 md:mt-20 text-center space-y-6"
        >
          <motion.p
            className="text-lg md:text-xl"
            style={{ color: 'var(--color-secondary)' }}
            whileHover={{ scale: 1.02 }}
          >
            Ready to build something amazing together?
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <CornerButton href="#contact" className="inline-flex items-center gap-2">
              LET&apos;S CONNECT
            </CornerButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll to explore indicator */}
      <motion.a
        href="#experience"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 cursor-pointer group z-10"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] ml-[0.25em] group-hover:text-primary-500 transition-colors" style={{ color: 'rgba(37, 37, 37, 0.7)' }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            width="20"
            height="28"
            viewBox="0 0 20 28"
            fill="none"
            className="group-hover:text-primary-500 transition-colors" 
            style={{ color: 'rgba(37, 37, 37, 0.5)' }}
          >
            <rect x="1" y="1" width="18" height="26" rx="9" stroke="currentColor" strokeWidth="1.5" />
            <motion.circle
              cx="10"
              cy="8"
              r="2.5"
              fill="currentColor"
              animate={{ cy: [8, 14, 8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="fill-primary-500"
            />
          </svg>
        </motion.div>
      </motion.a>
    </section>
  )
}