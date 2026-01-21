'use client'

import { motion, useScroll, useTransform, useSpring, useInView, type MotionValue } from 'framer-motion'
import { useRef } from 'react'
import { getSectionWidthStyle, getSectionHeaderStyle, getSectionSubtitleStyle } from '@/lib/utils'

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

function TimelineItem({ 
  item, 
  index, 
  progress 
}: { 
  item: typeof milestones[0]
  index: number
  progress: MotionValue<number>
}) {
  const isLeft = index % 2 === 0
  const itemRef = useRef(null)
  
  // Each item has its own trigger range based on its position
  const itemStart = index / milestones.length
  const itemEnd = (index + 0.7) / milestones.length
  
  // Transform progress to item-specific opacity and position
  const opacity = useTransform(progress, [itemStart, itemEnd], [0, 1])
  const x = useTransform(progress, [itemStart, itemEnd], [isLeft ? -40 : 40, 0])
  const scale = useTransform(progress, [itemStart, itemEnd], [0.8, 1])
  
  // Smooth spring for the dot
  const dotScale = useTransform(progress, [itemStart, itemStart + 0.1], [0, 1])
  const dotOpacity = useTransform(progress, [itemStart, itemStart + 0.05], [0, 1])

  return (
    <motion.div
      ref={itemRef}
      style={{ opacity, x, scale }}
      className="relative grid grid-cols-2 gap-8 items-center"
    >
      {isLeft ? (
        <>
          {/* Content on left */}
          <div className="pr-8 text-right">
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--color-secondary)' }}>{item.period}</p>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-secondary)' }}>{item.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-secondary)' }}>{item.description}</p>
          </div>
          {/* Dot in center */}
          <div className="absolute left-1/2 top-2 -translate-x-1/2">
            <motion.span 
              style={{ scale: dotScale, opacity: dotOpacity }}
              className="block h-4 w-4 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 ring-4 ring-light-bg dark:ring-dark-bg" 
            />
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
            <motion.span 
              style={{ scale: dotScale, opacity: dotOpacity }}
              className="block h-4 w-4 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 ring-4 ring-light-bg dark:ring-dark-bg" 
            />
          </div>
          {/* Content on right */}
          <div className="pl-8 text-left">
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--color-secondary)' }}>{item.period}</p>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-secondary)' }}>{item.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-secondary)' }}>{item.description}</p>
          </div>
        </>
      )}
    </motion.div>
  )
}

export default function Experience() {
  const containerRef = useRef(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  
  // Track scroll progress through the timeline section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.5"]
  })
  
  // Smooth the scroll progress for fluid animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  // Transform for the growing line
  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"])

  return (
    <section
      id="experience"
      ref={ref}
      className="min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 border-l border-r border-b mx-auto"
      style={{ 
        backgroundColor: 'transparent', 
        borderColor: 'rgba(33, 33, 33, 0.3)',
        ...getSectionWidthStyle() 
      }}
    >
      <div className="w-full">
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
          Journey & Milestones
        </motion.h3>

        <div ref={containerRef} className="relative">
          {/* Background line (subtle) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-light-border/30 dark:bg-white/5 -translate-x-1/2" />
          
          {/* Animated growing line */}
          <motion.div 
            style={{ height: lineHeight }}
            className="absolute left-1/2 top-0 w-px bg-gradient-to-b from-primary-500 via-secondary-500 to-primary-500 -translate-x-1/2 origin-top"
          />
          
          {/* Glowing effect on the line tip */}
          <motion.div 
            style={{ top: lineHeight }}
            className="absolute left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500 blur-sm opacity-80"
          />
          
          <div className="space-y-12">
            {milestones.map((item, index) => (
              <TimelineItem
                key={item.title}
                item={item}
                index={index}
                progress={smoothProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
