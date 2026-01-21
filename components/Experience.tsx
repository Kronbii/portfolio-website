'use client'

import { motion, useScroll, useTransform, useSpring, useInView, type MotionValue } from 'framer-motion'
import { useRef } from 'react'
import { FiSend, FiCrosshair, FiAward, FiGlobe, FiZap, FiTrendingUp } from 'react-icons/fi'
import { getSectionWidthStyle, getSectionHeaderStyle, getSectionSubtitleStyle } from '@/lib/utils'

const milestones = [
  {
    period: 'Now',
    year: '2026',
    title: 'Founder & Tech Lead',
    company: 'EVOID',
    description: 'Building bespoke AI/CV and robotics products for startups + industry teams.',
    icon: FiSend,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    highlight: true,
  },
  {
    period: '2025',
    year: '2025',
    title: 'Applied AI & CV Engineer',
    company: 'Oreyeon LDA',
    description: 'Improving runway safety through advanced computer vision solutions.',
    icon: FiCrosshair,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    highlight: false,
  },
  {
    period: '2023',
    year: '2023',
    title: 'WRO Future Engineers',
    company: 'Champion',
    description: 'Led an autonomous race-car build from concept to podium in 20 days.',
    icon: FiAward,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    highlight: false,
  },
  {
    period: '2022',
    year: '2022',
    title: 'NASA Space Apps',
    company: 'Tech Lead & Volunteer',
    description: 'Took part in leading the largest global hackathon in Lebanon.',
    icon: FiGlobe,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    highlight: false,
  },
]

function TimelineCard({
  item,
  index,
  progress,
  isInView,
}: {
  item: typeof milestones[0]
  index: number
  progress: MotionValue<number>
  isInView: boolean
}) {
  const itemStart = index / milestones.length
  const itemEnd = (index + 0.7) / milestones.length

  const opacity = useTransform(progress, [itemStart, itemEnd], [0, 1])
  const x = useTransform(progress, [itemStart, itemEnd], [index % 2 === 0 ? -50 : 50, 0])
  const scale = useTransform(progress, [itemStart, itemEnd], [0.9, 1])

  const dotScale = useTransform(progress, [itemStart, itemStart + 0.1], [0, 1])
  const dotOpacity = useTransform(progress, [itemStart, itemStart + 0.05], [0, 1])

  const IconComponent = item.icon
  const isLeft = index % 2 === 0

  return (
    <div className="relative">
      {/* Timeline connector line for this item */}
      <div
        className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 hidden lg:block"
        style={{ backgroundColor: 'rgba(33, 33, 33, 0.15)' }}
      />

      <div className={`flex items-center gap-4 lg:gap-8 ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
        {/* Card */}
        <motion.div
          style={{ opacity, x, scale }}
          className={`flex-1 ${isLeft ? 'lg:text-right' : 'lg:text-left'}`}
        >
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: 0.3 + index * 0.15,
              type: 'spring',
              stiffness: 100,
            }}
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { duration: 0.2 },
            }}
            className={`group relative rounded-2xl border border-light-border/50 dark:border-white/10 bg-light-surface dark:bg-white/[0.03] p-6 lg:p-8 backdrop-blur-xl hover:border-primary-500/30 transition-all duration-300 shadow-sm dark:shadow-none overflow-hidden ${item.highlight ? 'ring-2 ring-purple-500/20' : ''
              }`}
          >
            {/* Gradient overlay on hover */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${item.bgColor}`}
            />

            {/* Highlight badge for current position */}
            {item.highlight && (
              <div className="absolute top-4 right-4 z-20">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium bg-purple-500/20 text-purple-600 dark:text-purple-400"
                >
                  <FiZap size={10} />
                  Current
                </motion.span>
              </div>
            )}

            {/* Icon */}
            <div className={`relative z-10 flex items-center gap-4 mb-4 ${isLeft ? 'lg:flex-row-reverse lg:justify-start' : ''}`}>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`flex items-center justify-center w-12 h-12 rounded-xl border border-light-border/30 dark:border-white/10 bg-light-surface2/50 dark:bg-white/5 group-hover:scale-110 transition-transform duration-300`}
              >
                <IconComponent className={`${item.color} transition-colors duration-300`} size={24} />
              </motion.div>
              <div className={`${isLeft ? 'lg:text-right' : ''}`}>
                <motion.p
                  className="text-xs uppercase tracking-wider font-medium"
                  style={{ color: 'var(--color-secondary)', opacity: 0.6 }}
                >
                  {item.period}
                </motion.p>
                <p className={`text-sm font-semibold ${item.color}`}>{item.company}</p>
              </div>
            </div>

            {/* Content */}
            <div className={`relative z-10 ${isLeft ? 'lg:text-right' : ''}`}>
              <motion.h3
                className="text-xl lg:text-2xl font-semibold text-gradient mb-3"
                whileHover={{ scale: 1.02 }}
              >
                {item.title}
              </motion.h3>
              <p
                className="text-sm lg:text-base leading-relaxed"
                style={{ color: 'var(--color-secondary)', opacity: 0.8 }}
              >
                {item.description}
              </p>
            </div>

            {/* Decorative corner element */}
            <div
              className={`absolute top-0 ${isLeft ? 'left-0 rounded-br-full' : 'right-0 rounded-bl-full'} w-24 h-24 ${item.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />

            {/* Bottom accent line */}
            <motion.div
              className={`absolute bottom-0 left-0 right-0 h-1 ${item.bgColor}`}
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
              style={{ transformOrigin: isLeft ? 'right' : 'left' }}
            />
          </motion.article>
        </motion.div>

        {/* Center dot */}
        <motion.div
          style={{ scale: dotScale, opacity: dotOpacity }}
          className="hidden lg:flex relative z-10 flex-shrink-0"
        >
          <div className="relative">
            {/* Outer ring with pulse */}
            <motion.div
              className={`absolute inset-0 rounded-full ${item.bgColor}`}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 24, height: 24, marginLeft: -4, marginTop: -4 }}
            />
            {/* Inner dot */}
            <div
              className={`w-4 h-4 rounded-full border-2 border-light-surface dark:border-dark-bg ${item.bgColor.replace('/10', '/80')}`}
              style={{ boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}
            />
          </div>
        </motion.div>

        {/* Spacer for the other side on desktop */}
        <div className="hidden lg:block flex-1" />
      </div>
    </div>
  )
}

export default function Experience() {
  const containerRef = useRef(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.5'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const lineHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%'])

  return (
    <section
      id="experience"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 border-l border-r border-b mx-auto overflow-hidden"
      style={{
        backgroundColor: 'var(--color-primary)',
        borderColor: 'rgba(33, 33, 33, 0.3)',
        ...getSectionWidthStyle(),
      }}
    >
      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/figma-assets/grid.svg)',
          backgroundPosition: 'center',
          backgroundSize: '50px 50px',
          backgroundRepeat: 'repeat',
          opacity: 0.03,
          zIndex: 0,
        }}
      />

      <div className="w-full relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8 lg:mb-16">
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
            <span>Journey</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`${getSectionHeaderStyle().className} text-center`}
            style={getSectionHeaderStyle().style}
          >
            Professional <span className="text-gradient">Experience</span>
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${getSectionSubtitleStyle().className} text-center`}
            style={getSectionSubtitleStyle().style}
          >
            Milestones & Achievements
          </motion.h3>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center gap-8 lg:gap-16 mt-8"
          >
            {[
              { value: '4+', label: 'Years Experience' },
              { value: '10+', label: 'Projects Delivered' },
              { value: '5+', label: 'Awards Won' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="text-center"
              >
                <motion.p
                  className="text-2xl lg:text-3xl font-bold text-gradient"
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.value}
                </motion.p>
                <p
                  className="text-xs uppercase tracking-wider mt-1"
                  style={{ color: 'var(--color-secondary)', opacity: 0.6 }}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Timeline */}
        <div ref={containerRef} className="relative mt-8 lg:mt-12">
          {/* Main vertical timeline line - desktop only */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden lg:block"
            style={{ backgroundColor: 'rgba(33, 33, 33, 0.15)' }}
          />

          {/* Animated growing line - desktop only */}
          <motion.div
            style={{
              height: lineHeight,
              background: 'linear-gradient(to bottom, var(--color-secondary), transparent)',
            }}
            className="absolute left-1/2 top-0 w-0.5 -translate-x-1/2 origin-top hidden lg:block"
          />

          {/* Timeline items */}
          <div className="space-y-6 lg:space-y-12">
            {milestones.map((item, index) => (
              <TimelineCard key={item.title} item={item} index={index} progress={smoothProgress} isInView={isInView} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 lg:mt-20 text-center"
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-light-border/50 dark:border-white/10 bg-light-surface2/50 dark:bg-white/5"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <FiTrendingUp className="text-primary-500" size={18} />
            <span className="text-sm" style={{ color: 'var(--color-secondary)' }}>
              Continuously growing and learning
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll to explore indicator */}
      <motion.a
        href="#services"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 cursor-pointer group z-10"
      >
        <span
          className="text-[10px] uppercase tracking-[0.25em] ml-[0.25em] group-hover:text-primary-500 transition-colors"
          style={{ color: 'rgba(37, 37, 37, 0.7)' }}
        >
          Scroll
        </span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
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
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="fill-primary-500"
            />
          </svg>
        </motion.div>
      </motion.a>
    </section>
  )
}
