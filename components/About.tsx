'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FiBook, FiBriefcase, FiUsers, FiAward, FiCode, FiCpu, FiPower } from 'react-icons/fi'

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
    label: 'Nasa Space Apps, Astronomyclub',
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

const skills = [
  { icon: FiCode, label: 'Full-Stack Development' },
  { icon: FiCpu, label: 'AI/ML Engineering' },
  { icon: FiPower, label: 'Firmware & Hardware' },
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      id="about"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-12 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary-500/5 blur-[120px]"
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [0.9, 1.1, 0.9],
            x: [0, 50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent-500/5 blur-[120px]"
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.1, 0.95],
            x: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 pb-24 md:pb-32">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-3 rounded-full border border-light-border/50 dark:border-white/10 bg-light-surface2/50 dark:bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-light-text2 dark:text-dark-text2 mb-6"
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
            className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6"
          >
            About <span className="text-gradient">Rami Kronbi</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-light-text2 dark:text-dark-text2 leading-relaxed max-w-3xl mx-auto"
          >
            Mechatronics engineer turned AI/CV builder. I stay hands-on across strategy, firmware, and ML so you work with <span className="text-primary-500 font-medium">one partner instead of five</span>.
          </motion.p>
        </div>

        {/* Skills Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={skill.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-light-border/50 dark:border-white/10 bg-light-surface dark:bg-white/5 backdrop-blur-sm hover:border-primary-500/50 hover:bg-primary-500/5 transition-all duration-300"
            >
              <skill.icon className="text-primary-500" size={18} />
              <span className="text-sm font-medium text-light-text dark:text-dark-text">{skill.label}</span>
            </motion.div>
          ))}
        </motion.div>

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
                  <p className="text-sm text-light-text2 dark:text-dark-text2 leading-relaxed">
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
            className="text-lg md:text-xl text-light-text2 dark:text-dark-text2"
            whileHover={{ scale: 1.02 }}
          >
            Ready to build something amazing together?
          </motion.p>
          <motion.a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-primary-500/50 bg-primary-500/10 hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 font-medium transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Let&apos;s Connect
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </motion.a>
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
        <span className="text-[10px] uppercase tracking-[0.25em] ml-[0.25em] text-light-text2/70 dark:text-dark-text2/70 group-hover:text-primary-500 transition-colors">
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
            className="text-light-text2/50 dark:text-dark-text2/50 group-hover:text-primary-500 transition-colors"
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
