'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FiCode, FiCpu, FiEye, FiUsers, FiCheck } from 'react-icons/fi'
import { useInfiniteCarousel } from '@/hooks/useInfiniteCarousel'
import { useCardCarousel } from '@/hooks/useCardCarousel'
import { getSectionWidthStyle, getSectionHeaderStyle, getSectionSubtitleStyle, getSectionStyle, CARD_CAROUSEL_OPACITY } from '@/lib/utils'
import { ExploreNavigation } from '@/components/ui/explore-navigation'

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
    getActualIndex,
  } = useInfiniteCarousel(services, { itemCount })

  const {
    sectionRef,
    cardWidth,
    cardHeight,
    visibleCards,
  } = useCardCarousel({
    itemCount,
    scrollContainerRef,
    cardsRef,
    extendedItemsLength: extendedServices.length,
  })

  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section
      id="services"
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center py-24 px-4 sm:px-6 lg:px-8 border-l border-r border-b mx-auto"
      style={{ 
        ...getSectionStyle(),
        ...getSectionWidthStyle() 
      }}
    >
      <div className="w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={getSectionHeaderStyle().className}
            style={getSectionHeaderStyle().style}
          >
            Services with <span className="text-gradient">clear outcomes</span>
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={getSectionSubtitleStyle().className}
            style={getSectionSubtitleStyle().style}
          >
            Signature engagements
          </motion.h3>
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
          <div className="flex gap-6 px-4 sm:px-6 lg:px-[calc((100vw-72rem)/2+1.5rem)] items-center w-max">
            {extendedServices.map((service, index) => {
              const isCentered = index === currentIndex
              const isVisible = visibleCards.has(index)
              return (
                <div
                  key={`${service.title}-${index}`}
                  data-card-index={index}
                ref={(el) => {
                  cardsRef.current[index] = el
                }}
                  style={{
                    filter: isVisible ? 'blur(0px)' : 'blur(2px)',
                    opacity: isVisible ? CARD_CAROUSEL_OPACITY.visible : CARD_CAROUSEL_OPACITY.hidden,
                    transition: 'filter 0.5s ease, opacity 0.5s ease',
                  }}
                >
                  <motion.div
                initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: isCentered ? -16 : 0, scale: isCentered ? 1.03 : 1 } : {}}
                  transition={{ duration: 0.15 }}
                    className={`group relative overflow-hidden border bg-transparent flex-shrink-0 transition-all duration-75 flex flex-col cursor-pointer clickable-card ${
                    isCentered 
                        ? '-translate-y-4 scale-[1.03] z-10' 
                        : ''
                    }`}
                    style={{
                      width: `${cardWidth}px`,
                      height: `${cardHeight}px`,
                      cursor: 'pointer',
                      boxShadow: isCentered 
                        ? '0 20px 25px -5px rgba(37, 37, 37, 0.1), 0 10px 10px -5px rgba(37, 37, 37, 0.04)' 
                        : '0 1px 2px 0 rgba(37, 37, 37, 0.05)',
                      ...getSectionStyle(),
                    }}
                  whileHover={{ y: isCentered ? -20 : -4 }}
              >
                  <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-primary-400">
                    {service.icon}
                    <span className="text-xs uppercase tracking-wide" style={{ color: 'var(--color-secondary)' }}>{service.timeline}</span>
                  </div>
                </div>
                <h3 className="mt-4 text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--color-secondary)' }}>
                  {service.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base leading-relaxed" style={{ color: 'var(--color-secondary)' }}>
                  {service.punchline}
                </p>
                <div className="mt-4 space-y-2">
                  {service.highlights.map((item) => (
                    <div key={item} className="flex items-center space-x-2 text-sm sm:text-base" style={{ color: 'var(--color-secondary)' }}>
                      <span className="text-primary-400">
                        <FiCheck />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                    </div>
                </div>
              </motion.div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <ExploreNavigation
          onPrevious={handleScrollLeft}
          onNext={handleScrollRight}
          previousLabel="Previous service"
          nextLabel="Next service"
          label="EXPLORE"
        />
      </div>
    </section>
  )
}
