'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FiCode, FiCpu, FiEye, FiUsers, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useInfiniteCarousel } from '@/hooks/useInfiniteCarousel'
import { getSectionWidthStyle, getSectionHeaderStyle } from '@/lib/utils'

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
    title: 'AI Solutions',
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

  const itemCount = services.length
  const {
    scrollContainerRef,
    cardsRef,
    currentIndex,
    actualIndex,
    extendedItems: extendedServices,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleScrollLeft,
    handleScrollRight,
    scrollToIndex,
  } = useInfiniteCarousel(services, { itemCount })

  return (
    <section
      id="services"
      ref={ref}
      className="min-h-screen flex flex-col justify-center py-24 px-4 sm:px-6 lg:px-8 bg-[#EAEAEA] border border-[#212121]/30 mx-auto"
      style={{ backgroundColor: '#EAEAEA', ...getSectionWidthStyle() }}
    >
      <div className="w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-sm uppercase tracking-[0.4em] text-[#252525]"
          >
            Signature engagements
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`${getSectionHeaderStyle().className} tracking-tight`}
            style={getSectionHeaderStyle().style}
          >
            Services with <span className="text-gradient">clear outcomes</span>
          </motion.h2>
        </div>

        {/* Scrollable Cards */}
        <div
          ref={scrollContainerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-x-scroll scrollbar-hide py-8 touch-pan-y"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-4 sm:gap-6 px-4 sm:px-6 lg:px-[calc((100vw-72rem)/2+1.5rem)] items-center w-max">
            {extendedServices.map((service, index) => {
              const isCentered = index === currentIndex
              return (
              <motion.div
                  key={`${service.title}-${index}`}
                ref={(el) => {
                  cardsRef.current[index] = el
                }}
                initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: isCentered ? -16 : 0, scale: isCentered ? 1.03 : 1 } : {}}
                  transition={{ duration: 0.15 }}
                  className={`group relative overflow-hidden rounded-3xl border border-light-border/50 dark:border-white/10 bg-light-surface dark:bg-white/[0.03] backdrop-blur flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[400px] transition-all duration-75 ${
                    isCentered 
                      ? 'shadow-xl dark:shadow-2xl shadow-primary-500/10 dark:shadow-primary-500/20 -translate-y-4 scale-[1.03] z-10' 
                      : 'shadow-sm dark:shadow-none'
                  }`}
                  whileHover={{ y: isCentered ? -20 : -4 }}
              >
                  <div className="p-5 sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-primary-400">
                    {service.icon}
                    <span className="text-xs uppercase tracking-wide text-[#252525]">{service.timeline}</span>
                  </div>
                </div>
                <h3 className="mt-4 text-2xl sm:text-3xl font-semibold text-[#252525]">
                  {service.title}
                </h3>
                <p className="mt-2 text-[#252525] text-sm sm:text-base leading-relaxed">
                  {service.punchline}
                </p>
                <div className="mt-4 space-y-2">
                  {service.highlights.map((item) => (
                    <div key={item} className="flex items-center space-x-2 text-sm sm:text-base text-[#252525]">
                      <span className="text-primary-400">
                        <FiCheck />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                    </div>
                </div>
              </motion.div>
              )
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handleScrollLeft}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-light-border/50 dark:border-white/15 bg-light-surface2/50 dark:bg-white/10 backdrop-blur-lg text-[#252525] hover:border-primary-500/60 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-light-surface dark:hover:bg-white/15 transition-colors"
            aria-label="Previous service"
          >
            <FiChevronLeft size={20} />
          </button>
          <div className="flex gap-1.5">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(itemCount + index)}
                className={`h-2 rounded-full transition-all ${
                  index === actualIndex
                    ? 'w-8 bg-primary-500'
                    : 'w-2 bg-light-border dark:bg-white/20 hover:bg-light-text2/30 dark:hover:bg-white/30'
                }`}
                aria-label={`Go to service ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={handleScrollRight}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-light-border/50 dark:border-white/15 bg-light-surface2/50 dark:bg-white/10 backdrop-blur-lg text-[#252525] hover:border-primary-500/60 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-light-surface dark:hover:bg-white/15 transition-colors"
            aria-label="Next service"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
