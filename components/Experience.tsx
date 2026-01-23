'use client'

import { motion, useScroll, useTransform, useSpring, useInView, type MotionValue } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
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
    period: '2024 - Now',
    year: '2024',
    title: 'Applied AI & CV Engineer',
    company: 'Oreyeon LDA',
    description: 'Improving runway safety through advanced computer vision solutions.',
    icon: 'oreyeon',
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
    period: '2021 - 2024',
    year: '2021',
    title: 'NASA Space Apps',
    company: 'Tech Lead & Volunteer',
    description: 'Took part in leading the largest global hackathon in Lebanon.',
    icon: 'nasa',
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
  // Make cards appear sooner by starting earlier in scroll progress
  const itemStart = (index * 0.6) / milestones.length
  const itemEnd = (index * 0.6 + 0.8) / milestones.length

  const opacity = useTransform(progress, [itemStart, itemEnd], [0, 1])
  const x = useTransform(progress, [itemStart, itemEnd], [index % 2 === 0 ? -50 : 50, 0])
  const scale = useTransform(progress, [itemStart, itemEnd], [0.9, 1])

  const dotScale = useTransform(progress, [itemStart, itemStart + 0.15], [0, 1])
  const dotOpacity = useTransform(progress, [itemStart, itemStart + 0.1], [0, 1])

  const IconComponent = typeof item.icon === 'string' ? null : item.icon
  const iconSrc = typeof item.icon === 'string' ? item.icon : null
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
            className="group relative border p-4 lg:p-8 transition-all duration-300 overflow-hidden experience-card-gradient"
            style={{
              borderRadius: 0, // Sharp corners
              borderColor: 'rgba(33, 33, 33, 0.3)', // 30% opacity
              position: 'relative',
            }}
          >

            {/* Icon */}
            <div className={`relative z-10 flex items-center gap-3 lg:gap-4 mb-3 lg:mb-4 ${isLeft ? 'lg:flex-row-reverse lg:justify-start' : ''}`}>
              <div
                className={`flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-xl border border-light-border/30 dark:border-white/10 bg-light-surface2/50 dark:bg-white/5 overflow-visible`}
              >
                {iconSrc ? (
                  <div className={`${item.color} transition-colors duration-300`}>
                    <Image
                      src={`/${iconSrc}.svg`}
                      alt={item.company}
                      width={40}
                      height={40}
                      className="w-8 h-8 lg:w-10 lg:h-10"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                ) : IconComponent ? (
                  <IconComponent className={`${item.color} transition-colors duration-300 w-6 h-6 lg:w-8 lg:h-8`} size={32} />
                ) : null}
              </div>
              <div className={`${isLeft ? 'lg:text-right' : ''}`}>
                <motion.p
                  className="text-[10px] lg:text-xs uppercase tracking-wider font-medium"
                  style={{ color: 'var(--color-secondary)', opacity: 0.6 }}
                >
                  {item.period}
                </motion.p>
                <p className="text-xs lg:text-sm font-semibold text-blue-500">{item.company}</p>
              </div>
            </div>

            {/* Content */}
            <div className={`relative z-10 ${isLeft ? 'lg:text-right' : ''}`}>
              <motion.h3
                className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3"
                style={{ color: 'var(--color-secondary)' }}
                whileHover={{ scale: 1.02 }}
              >
                {item.title}
              </motion.h3>
              <p
                className="text-xs lg:text-base leading-relaxed"
                style={{ color: 'var(--color-secondary)', opacity: 0.8 }}
              >
                {item.description}
              </p>
            </div>

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
    offset: ['start 0.9', 'end 0.3'],
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
      className="relative min-h-screen flex flex-col justify-center py-12 lg:py-20 px-4 sm:px-6 lg:px-8 border-l border-r border-b mx-auto overflow-hidden"
      style={{
        backgroundColor: 'transparent',
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
        <div className="text-center mb-6 lg:mb-16">
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
        <div ref={containerRef} className="relative mt-6 lg:mt-12">
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
          <div className="space-y-4 lg:space-y-12">
            {milestones.map((item, index) => (
              <TimelineCard key={item.title} item={item} index={index} progress={smoothProgress} isInView={isInView} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 lg:mt-20 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-light-border/50 dark:border-white/10 bg-light-surface2/50 dark:bg-white/5">
            <FiTrendingUp className="text-primary-500" size={18} />
            <span className="text-sm" style={{ color: 'var(--color-secondary)' }}>
              Continuously growing and learning
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
